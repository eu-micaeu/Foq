package main

import (

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

	routes.UserRoutes(r, db)

	routes.TaskRoutes(r, db)

	r.Run()
	
}