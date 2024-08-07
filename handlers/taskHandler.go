package handlers

import (
	"database/sql"
	"time"

	"github.com/gin-gonic/gin"
)

type Task struct {
	Task_ID     int       `json:"task_id"`
	User_ID     int       `json:"user_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
}

type ErrorResponse struct {
    Message string `json:"message"`
}

// Listar godoc
// @Summary List tasks
// @Description get tasks by user ID
// @Tags Tasks
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Success 200 {array} Task
// @Failure 500 {object} ErrorResponse
// @Router /tasks/{id} [get]
func (t *Task) Listar(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var tasks []Task
		rows, err := db.Query("SELECT task_id, user_id, title, description, status, created_at FROM tasks WHERE user_id = $1 ORDER BY created_at ASC", id)
		if err != nil {
			c.JSON(500, gin.H{"message": "Erro ao buscar tarefas"})
			return
		}
		for rows.Next() {
			var task Task
			rows.Scan(&task.Task_ID, &task.User_ID, &task.Title, &task.Description, &task.Status, &task.CreatedAt)
			tasks = append(tasks, task)
		}
		c.JSON(200, gin.H{"tasks": tasks})
	}
}

// Criar godoc
// @Summary Create a task
// @Description Create a new task
// @Tags Tasks
// @Accept json
// @Produce json
// @Param task body Task true "Task data"
// @Success 200 {object} Task
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /task [post]
func (t *Task) Criar(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var newTask Task
		if err := c.BindJSON(&newTask); err != nil {
			c.JSON(400, gin.H{"message": "Erro ao criar task"})
			return
		}
		_, err := db.Exec("INSERT INTO tasks (user_id, title, description, status, created_at) VALUES ($1, $2, $3, $4, $5)", newTask.User_ID, newTask.Title, newTask.Description, newTask.Status, time.Now())
		if err != nil {
			c.JSON(500, gin.H{"message": "Erro ao criar task"})
			return
		}
		c.JSON(200, newTask)
	}
}

// Deletar godoc
// @Summary Delete a task
// @Description delete a task by task ID
// @Tags Tasks
// @Accept json
// @Produce json
// @Param id path int true "Task ID"
// @Success 200 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /task/{id} [delete]
func (t *Task) Deletar(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		_, err := db.Exec("DELETE FROM tasks WHERE task_id = $1", id)
		if err != nil {
			c.JSON(500, gin.H{"message": "Erro ao apagar task"})
			return
		}
		c.JSON(200, gin.H{"message": "Task apagada com sucesso!"})
	}
}

// Atualizar godoc
// @Summary Update a task
// @Description update a task by task ID
// @Tags Tasks
// @Accept json
// @Produce json
// @Param id path int true "Task ID"
// @Param task body Task true "Updated Task"
// @Success 200 {object} ErrorResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /task/{id} [put]
func (t *Task) Atualizar(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var task Task
		if err := c.BindJSON(&task); err != nil {
			c.JSON(400, gin.H{"message": "Erro ao atualizar task"})
			return
		}
		if task.Title == "" || task.Description == "" {
			c.JSON(400, gin.H{"message": "Erro ao atualizar task"})
			return
		}
		_, err := db.Exec("UPDATE tasks SET title = $1, description = $2, status = $3 WHERE task_id = $4", task.Title, task.Description, task.Status, id)
		if err != nil {
			c.JSON(500, gin.H{"message": "Erro ao atualizar task"})
			return
		}
		c.JSON(200, gin.H{"message": "Task atualizada com sucesso!"})
	}
}
