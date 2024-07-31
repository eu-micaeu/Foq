package database

import (
	"database/sql"
	"fmt"
	"log"
	
	_ "github.com/lib/pq"
)

func NewDB() (*sql.DB, error) {

	dbUser := "foq_user"
	dbPassword := "cRl8AAcdzP9KMhQ0chpD5udxFpMkUpk2"
	dbHost := "dpg-cqkpnvd6l47c73esq230-a.oregon-postgres.render.com"
	dbPort := "5432"
	dbName := "foq"

	if dbUser == "" || dbPassword == "" || dbHost == "" || dbPort == "" || dbName == "" {
		return nil, fmt.Errorf("uma ou mais variáveis de ambiente não estão definidas")
	}

	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=require", dbUser, dbPassword, dbHost, dbPort, dbName)

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
