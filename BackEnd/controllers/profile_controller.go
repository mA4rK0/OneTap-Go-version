package controllers

import (
	"github.com/gofiber/fiber/v2"
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
	profile := new(models.Profile)

	if err := ctx.BodyParser(profile); err != nil {
		return utils.BadRequest(ctx, "Failed read request", err.Error())
	}
	if err := c.service.Create(profile); err != nil {
		return utils.BadRequest(ctx, "Failed save data", err.Error())
	}
	return utils.Success(ctx, "Profile successfully created", profile)
}