package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	
	_ "github.com/lib/pq"
)

func NewDB() (*sql.DB, error) {

	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	if dbUser == "" || dbPassword == "" || dbHost == "" || dbPort == "" || dbName == "" {
		return nil, fmt.Errorf("uma ou mais variáveis de ambiente não estão definidas")
	}

	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", dbUser, dbPassword, dbHost, dbPort, dbName)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("erro ao conectar ao banco de dados: %v", err)
	}

	err = db.Ping()
	if err != nil {
		return nil, fmt.Errorf("não foi possível alcançar o banco de dados: %v", err)
	}

	log.Println("Conectado ao banco de dados com sucesso!")

	return db, nil

}
