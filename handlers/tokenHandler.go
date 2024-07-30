package handlers

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/joho/godotenv"
)

type Claims struct {
	User_ID int `json:"id_usuario"`
	jwt.StandardClaims
}

var jwtKey []byte

func init() {

	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Erro ao carregar arquivo .env: %v", err)
	}

	// Carrega a chave secreta de uma variável de ambiente
	jwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))

	if len(jwtKey) == 0 {
		log.Fatalf("Erro: JWT_SECRET_KEY não está definido")
	}

}

// Função com finalidade de validação do token para as funções do usuário.
func (u *User) ValidarOToken(tokenString string) (int, error) {

	claims := &Claims{}

	tkn, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil {
		fmt.Printf("Erro ao analisar o token: %v\n", err)
		return 0, err
	}

	if !tkn.Valid {
		fmt.Println("Token inválido")
		return 0, fmt.Errorf("token inválido")
	}

	return claims.User_ID, nil
	
}

// Função com finalidade de geração do token para as funções do usuário.
func GerarOToken(user User) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)

	claims := &Claims{
		User_ID: user.User_ID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
