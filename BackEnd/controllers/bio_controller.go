package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
	"github.com/mA4rK0/OneTap-Go-version/models"
	"github.com/mA4rK0/OneTap-Go-version/services"
	"github.com/mA4rK0/OneTap-Go-version/utils"
)

type BioController struct {
	service services.BioService
}

func NewBioController(s services.BioService) *BioController {
	return &BioController{service: s}
}

func (c *BioController) CreateBio(ctx *fiber.Ctx) error {
	profileID := ctx.Params("profileId")
	profilePublicID, err := uuid.Parse(profileID)

	if err != nil {
		return utils.BadRequest(ctx, "Invalid profile ID", err.Error())
	}

	bio := new(models.Bio)
	if err := ctx.BodyParser(bio); err != nil {
		return utils.BadRequest(ctx, "Failed to parse request", err.Error())
	}
	bio.ProfilePublicID = profilePublicID

	if err := c.service.CreateBio(bio); err != nil {
		return utils.BadRequest(ctx, "Failed to create bio", err.Error())
	}

	var bioResp models.BioResponse
	if err := copier.Copy(&bioResp, bio); err != nil {
		return utils.InternalServerError(ctx, "Error processing data", err.Error())
	}
	return utils.Success(ctx, "Bio successfully created", bioResp)
}

func (c *BioController) UpdateBio(ctx *fiber.Ctx) error {
	publicID := ctx.Params("id")
	bio := new(models.Bio)

	if err := ctx.BodyParser(bio); err != nil {
		return utils.BadRequest(ctx, "Failed parsing data", err.Error())
	}
	if _, err := uuid.Parse(publicID); err != nil {
		return utils.BadRequest(ctx, "ID not valid", err.Error())
	}

	existingBio, err := c.service.GetByPublicID(publicID)
	if err != nil {
		return utils.NotFound(ctx, "Profile not found", err.Error())
	}
	bio.InternalID = existingBio.InternalID
	bio.PublicID = existingBio.PublicID
	bio.ProfileID = existingBio.ProfileID
	bio.ProfilePublicID = existingBio.ProfilePublicID

	if err := c.service.UpdateBio(bio); err != nil {
		return utils.BadRequest(ctx, "Failed update profile", err.Error())
	}

	var bioResp models.BioResponse
	if err := copier.Copy(&bioResp, bio); err != nil {
		return utils.InternalServerError(ctx, "Error processing data", err.Error())
	} 
	return utils.Success(ctx, "Successfully update profile", bioResp)
}

func (c *BioController) GetBio (ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	bio, err := c.service.GetByPublicID(id)
	if err != nil {
		return utils.NotFound(ctx, "Data Not Found", err.Error())
	}

	var useResp models.BioResponse
	err = copier.Copy(&useResp, &bio)
	if err != nil {
		return utils.BadRequest(ctx, "Internal Server Error", err.Error())
	}
	return utils.Success(ctx, "Successfully Get Data", useResp)
}