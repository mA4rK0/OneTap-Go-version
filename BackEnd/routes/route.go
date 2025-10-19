package routes

import (
	"log"

	"github.com/gofiber/fiber/v2"
	jwtware "github.com/gofiber/jwt/v3"
	"github.com/joho/godotenv"
	"github.com/mA4rK0/OneTap-Go-version/config"
	"github.com/mA4rK0/OneTap-Go-version/controllers"
	"github.com/mA4rK0/OneTap-Go-version/utils"
)

func Setup(app *fiber.App, 
	uc *controllers.UserController,
	pc *controllers.ProfileController,
	sc *controllers.SocialLinkController,
	) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	app.Post("/v1/auth/register", uc.Register)
	app.Post("/v1/auth/login", uc.Login)

	api := app.Group("/api/v1", jwtware.New(jwtware.Config{
		SigningKey: []byte(config.AppConfig.JWTSecret),
		ContextKey: "user",
		ErrorHandler: func (c *fiber.Ctx, err error) error {
			return utils.Unauthorized(c, "Error unauthorized", err.Error())
		},
	}))

	userGroup := api.Group("/users")
	// userGroup.Get("/page", uc.GetUserPagination)
	userGroup.Get("/:id", uc.GetUser)
	userGroup.Put("/:id", uc.UpdateUser)
	userGroup.Delete("/:id", uc.DeleteUser)

	profileGroup := api.Group("/profiles")
	profileGroup.Post("/", pc.CreateProfile)
	profileGroup.Put("/:id", pc.UpdateProfile)
	profileGroup.Get("/:id", pc.GetProfile)
	profileGroup.Post("/:profileId/social-links", sc.CreateSocialLinks)
	profileGroup.Get("/:profileId/social-links", sc.GetSocialLinks)
	// boardGroup.Post("/", bc.CreateBoard)
	// boardGroup.Put("/:id", bc.UpdateBoard)
	// boardGroup.Post("/:id/members", bc.AddBoardMembers)
	// boardGroup.Delete("/:id/members", bc.RemoveBoardMembers)
}