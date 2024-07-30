package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func NewDB() (*sql.DB, error) {

	// Carrega as variáveis de ambiente do arquivo .env
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Erro ao carregar arquivo .env: %v", err)
	}

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

// Função para começar um banco de dados de teste
func NewTestDB() (*sql.DB, error) {

	db, err := sql.Open("postgres", "postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable")
	if err != nil {
		return nil, fmt.Errorf("erro ao conectar ao banco de dados: %v", err)
	}

	_, err = db.Exec("CREATE TABLE users (user_id SERIAL PRIMARY KEY, username VARCHAR(50) NOT NULL UNIQUE, email VARCHAR(100) NOT NULL UNIQUE, password VARCHAR(100) NOT NULL, full_name VARCHAR(100) NOT NULL, user_ip VARCHAR(100) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);")

	if err != nil {
		return nil, fmt.Errorf("erro ao criar banco de dados de teste: %v", err)
	}

	_, err = db.Exec("CREATE TABLE tasks (task_id SERIAL PRIMARY KEY,user_id INT REFERENCES users(user_id),task_title VARCHAR(100) NOT NULLtask_description TEXT,task_status VARCHAR(50) DEFAULT 'pending', due_date TIMESTAMP,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);")

	if err != nil {
		return nil, fmt.Errorf("erro ao criar banco de dados de teste: %v", err)
	}

	db.Close()

	db, err = sql.Open("postgres", "postgres://postgres:postgres@localhost:5432/test_db?sslmode=disable")
	if err != nil {
		return nil, fmt.Errorf("erro ao conectar ao banco de dados de teste: %v", err)
	}

	log.Println("Banco de dados de teste criado com sucesso!")

	return db, nil

}
