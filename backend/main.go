package main

import (
	"github.com/gin-gonic/gin"
	"foq/database"
	"foq/middlewares"
	"foq/routes"
)

func main() {
	r := gin.Default()
	r.Use(middlewares.CorsMiddleware())
	db, err := database.NewDB()
	if err != nil {
		panic(err)
	}
	routes.UserRoutes(r, db)
	routes.TaskRoutes(r, db)
	r.Run()
}