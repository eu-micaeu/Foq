package handlers

import (

	"time"
	"github.com/gin-gonic/gin"
	"database/sql"
)

type Task struct {
	task_ID   int       `json:"task_id"`
	title  string    	`json:"titleTask"`
	description string  `json:" descriptionTask"`
	UserIP    string    `json:"user_ip"`
	CreatedAt time.Time `json:"created_at"`
}


// Função com finalidade de registrar um task de um usuário no sistema.
func (u *Task) RegistrarTask(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		var newTask Task

		if err := c.BindJSON(&newTask); err != nil {

			c.JSON(400, gin.H{"message": "Erro ao criar task"})

			return

		}

		_, err := db.Exec("INSERT INTO task (titleTask, descriptionTask, user_ip, created_at) VALUES ($1, $2, $3, $4,)", newTask.titleTask, newTask.descriptionTask, c.ClientIP(), time.Now())

		if err != nil {

			c.JSON(500, gin.H{"message": "Erro ao criar task"})

			return

		}

		c.JSON(200, gin.H{"message": "Task criada com sucesso!"})

	}

}


// Função com finalidade de excluir um task de um usuário no sistema.
func (u *Task) ExcluirTask(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		var task Task

		if err := c.BindJSON(&task); err != nil {

			c.JSON(400, gin.H{"message": "Erro ao criar task"})

			return

		}

		_, err := db.Exec("DELETE FROM task WHERE id = $1 ",task.task_ID)

		if err != nil {

			c.JSON(500, gin.H{"message": "Erro ao excluir task"})

			return

		}

		c.JSON(200, gin.H{"message": "Task criada com sucesso!"})

	}

}