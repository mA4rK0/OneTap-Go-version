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

	socialLinkRepo := repositories.NewSocialLinkRepository()
	socialLinkService := services.NewSocialLinkService(socialLinkRepo, profileRepo)
	socialLinkController := controllers.NewSocialLinkController(socialLinkService)

	bioRepo := repositories.NewBioRepository()
	bioService := services.NewBioService(bioRepo, profileRepo)
	bioController := controllers.NewBioController(bioService)

	customLinkRepo := repositories.NewCustomLinkRepository()
	customLinkService := services.NewCustomLinkService(customLinkRepo, profileRepo)
	customLinkController := controllers.NewCustomLinkController(customLinkService)

	routes.Setup(app, userController, profileController, socialLinkController, bioController, customLinkController)

	port := config.AppConfig.AppPort
	log.Println("Server running on port :", port)
	log.Fatal(app.Listen(":" + port))
}