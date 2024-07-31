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

	r.LoadHTMLGlob("./views/*.html")

	r.GET("/", func(c *gin.Context) {

		c.HTML(http.StatusOK, "index.html", nil)

	})

	r.Static("./static", "./static")

	routes.UserRoutes(r, db)

	routes.TaskRoutes(r, db)

	r.Run()
}
