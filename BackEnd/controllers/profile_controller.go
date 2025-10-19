package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
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

	var profileResp models.ProfileResponse
	if err := copier.Copy(&profileResp, profile); err != nil {
		return utils.InternalServerError(ctx, "Error processing data", err.Error())
	}
	return utils.Success(ctx, "Profile successfully created", profileResp)
}

func (c *ProfileController) UpdateProfile (ctx *fiber.Ctx) error {
	publicID := ctx.Params("id")
	profile := new(models.Profile)

	if err := ctx.BodyParser(profile); err != nil {
		return utils.BadRequest(ctx, "Failed parsing data", err.Error())
	}
	if _, err := uuid.Parse(publicID); err != nil {
		return utils.BadRequest(ctx, "ID not valid", err.Error())
	}
	
	existingProfile, err := c.service.GetByPublicID(publicID)
	if err != nil {
		return utils.NotFound(ctx, "Profile not found", err.Error())
	}
	profile.InternalID = existingProfile.InternalID
	profile.PublicID = existingProfile.PublicID
	profile.UserID = existingProfile.UserID
	profile.UserPublicID = existingProfile.UserPublicID
	profile.CreatedAt = existingProfile.CreatedAt

	if err := c.service.Update(profile); err != nil {
		return utils.BadRequest(ctx, "Failed update profile", err.Error())
	}

	var profileResp models.ProfileResponse
	if err := copier.Copy(&profileResp, profile); err != nil {
		return utils.InternalServerError(ctx, "Error processing data", err.Error())
	} 
	return utils.Success(ctx, "Successfully update profile", profileResp)
}

func (c *ProfileController) GetProfile (ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	profile, err := c.service.GetByPublicID(id)
	if err != nil {
		return utils.NotFound(ctx, "Data Not Found", err.Error())
	}

	var useResp models.ProfileResponse
	err = copier.Copy(&useResp, &profile)
	if err != nil {
		return utils.BadRequest(ctx, "Internal Server Error", err.Error())
	}
	return utils.Success(ctx, "Successfully Get Data", useResp)
}