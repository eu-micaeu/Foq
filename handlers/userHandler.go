package handlers

import (

	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

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

// Função com finalidade de login do usuário.
func (u *User) Entrar(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		var user User

		if err := c.BindJSON(&user); err != nil {

			c.JSON(400, gin.H{"message": "Erro ao fazer login"})

			return

		}

		row := db.QueryRow("SELECT user_id, username, password FROM users WHERE username = $1 AND password = $2", user.Username, user.Password)

		err := row.Scan(&user.User_ID, &user.Username, &user.Password)

		if err != nil {

			c.JSON(404, gin.H{"message": "Usuário ou senha incorretos"})

			return

		}

		// Gere o token genérico
        token, err := GerarOToken(user)

        if err != nil {
            c.JSON(500, gin.H{"message": "Erro ao gerar token"})
            return
        }

		cookie := &http.Cookie{

			Name: "token",

			Value: token,

			Expires:  time.Now().Add(72 * time.Hour),

			HttpOnly: false,

			Secure: false,

			SameSite: http.SameSiteStrictMode,

			Path: "/",
		}

		http.SetCookie(c.Writer, cookie)

		c.JSON(200, gin.H{"message": "Login efetuado com sucesso!", "token": token})

	}

}

// Função com finalidade de registrar um usuário no sistema.
func (u *User) Registrar(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		var newUser User

		if err := c.BindJSON(&newUser); err != nil {

			c.JSON(400, gin.H{"message": "Erro ao criar usuario"})

			return

		}

		_, err := db.Exec("INSERT INTO users (username, email, password, full_name, user_ip, created_at) VALUES ($1, $2, $3, $4, $5, $6)", newUser.Username, newUser.Email, newUser.Password, newUser.FullName, c.ClientIP(), time.Now())

		if err != nil {

			c.JSON(500, gin.H{"message": "Erro ao criar usuário"})

			return

		}

		c.JSON(200, gin.H{"message": "Usuário criado com sucesso!"})

	}

}

// Função com finalidade de login do usuário.
func (u *User) Sair(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		// Lendo o atual token

		token := c.Request.Header.Get("token")

		// Verificando se o token é válido

		_, err := u.ValidarOToken(token)

		if err != nil {

			c.JSON(401, gin.H{"message": "Token inválido"})

			return

		}

		cookie := &http.Cookie{

			Name: "token",

			Value: "",

			Expires: time.Unix(0, 0),

			HttpOnly: true,

			Secure: true,

			SameSite: http.SameSiteStrictMode,

			Path: "/",
		}

		http.SetCookie(c.Writer, cookie)

		c.JSON(200, gin.H{"message": "Saiu com sucesso!"})

	}

}

// Função para verificar se o usuário está logado.
func (u *User) Logado(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		// Lendo o atual token

		token := c.Request.Header.Get("token")

		// Verificando se o token é válido

		userID, err := u.ValidarOToken(token)

		if err != nil {

			c.JSON(401, gin.H{"message": "Token inválido"})

			return

		}

		row := db.QueryRow("SELECT user_id, username, email, full_name, user_ip, created_at FROM users WHERE user_id = $1", userID)

		var user User

		err = row.Scan(&user.User_ID, &user.Username, &user.Email, &user.FullName, &user.UserIP, &user.CreatedAt)

		if err != nil {

			c.JSON(404, gin.H{"message": "Usuário não encontrado"})

			return

		}

		c.JSON(200, gin.H{"message": "Usuário logado", "user": user})

	}

}