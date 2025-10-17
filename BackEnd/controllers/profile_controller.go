package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"github.com/mA4rK0/OneTap-Go-version/models"
	"github.com/mA4rK0/OneTap-Go-version/services"
	"github.com/mA4rK0/OneTap-Go-version/utils"
)

type ProfileController struct {
	service services.ProfileService
}

func NewProfileController(s services.ProfileService) *ProfileController {
	return &ProfileController{service: s}
}

func (c *ProfileController) CreateProfile (ctx *fiber.Ctx) error {
	var userID uuid.UUID
	var err error

	profile := new(models.Profile)
	user := ctx.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)

	if err := ctx.BodyParser(profile); err != nil {
		return utils.BadRequest(ctx, "Failed read request", err.Error())
	}

	userID, err = uuid.Parse(claims["pub_id"].(string))
	if err != nil {
		return utils.BadRequest(ctx, "Failed read request", err.Error())
	}
	profile.UserPublicID = userID
	
	if err := c.service.Create(profile); err != nil {
		return utils.BadRequest(ctx, "Failed save data", err.Error())
	}
	return utils.Success(ctx, "Profile successfully created", profile)
}