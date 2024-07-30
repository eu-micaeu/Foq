package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/eu-micaeu/Foq/database"
	"github.com/eu-micaeu/Foq/middlewares"
	"github.com/eu-micaeu/Foq/routes"
)

func main() {
	r := gin.Default()

	r.Use(middlewares.CorsMiddleware())

	db, err := database.NewDB()
	if err != nil {
		panic(err)
	}

	// Cria um banco de dados com a rota /database

	r.GET("/database", func(c *gin.Context) {

		db, err := database.NewTestDB()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "banco de dados de teste criado com sucesso!"})

		defer db.Close()
		
	})

	r.LoadHTMLGlob("./views/*.html")

	r.GET("/", func(c *gin.Context) {

		c.HTML(http.StatusOK, "index.html", nil)

	})

	r.Static("./static", "./static")

	routes.UserRoutes(r, db)

	routes.TaskRoutes(r, db)

	r.Run()
}
