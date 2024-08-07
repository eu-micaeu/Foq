// main.go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/swaggo/files"
	"github.com/swaggo/gin-swagger"

	_ "github.com/eu-micaeu/Foq/docs"
	"github.com/eu-micaeu/Foq/database"
	"github.com/eu-micaeu/Foq/middlewares"
	"github.com/eu-micaeu/Foq/routes"
)

// @title Foq
// @version 1.0
// @termsOfService http://swagger.io/terms/
// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @host localhost:8080
// @BasePath /
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

	r.Static("/static", "./static")

	routes.UserRoutes(r, db)

	routes.TaskRoutes(r, db)

	// Corrigindo a URL do Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	r.Run()
}
