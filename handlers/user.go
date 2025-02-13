package handlers

import (
	"database/sql"
	"errors"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	User_ID   int       `json:"user_id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	FullName  string    `json:"full_name"`
	UserIP    string    `json:"user_ip"`
	CreatedAt time.Time `json:"created_at"`
}

// Chave secreta para assinar o token (em produção, use uma chave segura e armazenada de forma segura)
var jwtKey = []byte("sua_chave_secreta_muito_segura")

// Claims representa a estrutura do token JWT
type Claims struct {
	UserID int `json:"user_id"`
	jwt.RegisteredClaims
}

// GerarOToken gera um token JWT para o usuário
func GerarOToken(user User) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour) // Token expira em 24 horas

	claims := &Claims{
		UserID: user.User_ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   user.Username,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// ValidarOToken valida o token JWT e retorna o ID do usuário
func (u *User) ValidarOToken(tokenString string) (int, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil {
		return 0, err
	}

	if !token.Valid {
		return 0, errors.New("token inválido")
	}

	return claims.UserID, nil
}

// HashSenha criptografa a senha usando bcrypt
func HashSenha(senha string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(senha), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

// VerificarSenha compara a senha fornecida com o hash armazenado
func VerificarSenha(senhaFornecida string, hashArmazenado string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashArmazenado), []byte(senhaFornecida))
}

func (u *User) Entrar(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var user User
		if err := c.BindJSON(&user); err != nil {
			c.JSON(400, gin.H{"message": "Erro ao fazer login"})
			return
		}

		// Busca o usuário no banco de dados pelo nome de usuário
		row := db.QueryRow("SELECT user_id, username, password FROM users WHERE username = $1", user.Username)
		var dbUser User
		err := row.Scan(&dbUser.User_ID, &dbUser.Username, &dbUser.Password)
		if err != nil {
			if err == sql.ErrNoRows {
				c.JSON(404, gin.H{"message": "Usuário não encontrado"})
			} else {
				c.JSON(500, gin.H{"message": "Erro ao buscar usuário"})
			}
			return
		}
		err = VerificarSenha(user.Password, dbUser.Password)
		if err != nil {
			c.JSON(401, gin.H{"message": "Senha incorreta"})
			return
		}
		token, err := GerarOToken(dbUser)
		if err != nil {
			c.JSON(500, gin.H{"message": "Erro ao gerar token"})
			return
		}
		c.JSON(200, gin.H{"message": "Login efetuado com sucesso!", "token": token})
	}
}

// Registrar cria um novo usuário
func (u *User) Registrar(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var newUser User
		if err := c.BindJSON(&newUser); err != nil {
			c.JSON(400, gin.H{"message": "Erro ao criar usuário"})
			return
		}

		var existingUser User
		err := db.QueryRow("SELECT user_id FROM users WHERE username = $1 OR email = $2", newUser.Username, newUser.Email).Scan(&existingUser.User_ID)
		if err != nil && err != sql.ErrNoRows {
			c.JSON(500, gin.H{"message": "Erro ao verificar usuário existente"})
			return
		}
		if existingUser.User_ID != 0 {
			c.JSON(400, gin.H{"message": "Username ou email já existe"})
			return
		}

		senhaHash, err := HashSenha(newUser.Password)
		if err != nil {
			c.JSON(500, gin.H{"message": "Erro ao criptografar senha"})
			return
		}
		_, err = db.Exec("INSERT INTO users (username, email, password, full_name, user_ip, created_at) VALUES ($1, $2, $3, $4, $5, $6)",
			newUser.Username, newUser.Email, senhaHash, newUser.FullName, c.ClientIP(), time.Now())
		if err != nil {
			c.JSON(500, gin.H{"message": "Erro ao criar usuário"})
			return
		}

		c.JSON(200, gin.H{"message": "Usuário criado com sucesso!"})
	}
}

func (u *User) Deletar(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Request.Header.Get("token")
		userID, err := u.ValidarOToken(token)
		if err != nil {
			c.JSON(401, gin.H{"message": "Token inválido"})
			return
		}
		_, err = db.Exec("DELETE FROM users WHERE user_id = $1", userID)
		if err != nil {
			c.JSON(404, gin.H{"message": "Usuário não encontrado"})
			return
		}
		c.JSON(200, gin.H{"message": "Usuário deletado com sucesso!"})
	}
}