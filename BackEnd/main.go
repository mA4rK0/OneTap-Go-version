package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/mA4rK0/OneTap-Go-version/config"
	"github.com/mA4rK0/OneTap-Go-version/controllers"
	"github.com/mA4rK0/OneTap-Go-version/repositories"
	"github.com/mA4rK0/OneTap-Go-version/routes"
	"github.com/mA4rK0/OneTap-Go-version/services"
)

func main() {
	config.LoadEnv()
	config.ConnectDB()

	app := fiber.New()

	userRepo := repositories.NewUserRepository()
	userService := services.NewUserService(userRepo)
	userController := controllers.NewUserController(userService)

	profileRepo := repositories.NewProfileRepository()
	profileService := services.NewProfileService(profileRepo, userRepo)
	profileController := controllers.NewProfileController(profileService)

	// boardRepo := repositories.NewBoardRepository()
	// boardMemberRepo := repositories.NewBoardMemberRepository()
	// boardService := services.NewBoardService(boardRepo, userRepo, boardMemberRepo)
	// boardController := controllers.NewBoardController(boardService)

	// routes.Setup(app, userController, boardController)
	routes.Setup(app, userController, profileController)

	port := config.AppConfig.AppPort
	log.Println("Server running on port :", port)
	log.Fatal(app.Listen(":" + port))
}