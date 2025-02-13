package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"foq/handlers"
)

func TaskRoutes(r *gin.Engine, db *sql.DB) {
	
	taskHandler := handlers.Task{}

	r.POST("/task", taskHandler.Criar(db))

	r.GET("/tasks/:id", taskHandler.Listar(db))

	r.DELETE("/task/:id", taskHandler.Deletar(db))

	r.PUT("/task/:id", taskHandler.Atualizar(db))

}
