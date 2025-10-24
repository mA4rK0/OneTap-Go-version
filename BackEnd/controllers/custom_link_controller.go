package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
	"github.com/mA4rK0/OneTap-Go-version/models"
	"github.com/mA4rK0/OneTap-Go-version/services"
	"github.com/mA4rK0/OneTap-Go-version/utils"
)

type CustomLinkController struct {
	service services.CustomLinkService
}

func NewCustomLinkController(s services.CustomLinkService) *CustomLinkController {
	return &CustomLinkController{service: s}
}

func (c *CustomLinkController) CreateCustomLinks (ctx *fiber.Ctx) error {
	profileID := ctx.Params("profileId")
	profilePublicID, err := uuid.Parse(profileID)

	if err != nil {
		return utils.BadRequest(ctx, "Invalid profile ID", err.Error())
	}

	customLink := new(models.CustomLinksRequest)
	if err := ctx.BodyParser(customLink); err != nil {
		return utils.BadRequest(ctx, "Failed to parse request", err.Error())
	}
	if len(customLink.Links) == 0 {
		return utils.BadRequest(ctx, "Custom links cannot be empty", "links array is required")
	}

	if err := c.service.CreateCustomLinks(profilePublicID, customLink); err != nil {
		return utils.BadRequest(ctx, "Failed to create custom links", err.Error())
	}
	customLinks, err := c.service.GetCustomLinks(profilePublicID)
	if err != nil {
		return utils.InternalServerError(ctx, "Failed to retrieve custom links", err.Error())
	}

	var customLinksResponse []models.CustomLinkResponse
	if err := copier.Copy(&customLinksResponse, &customLinks); err != nil {
		return utils.InternalServerError(ctx, "Error processing data", err.Error())
	}

	return utils.Success(ctx, "Custom links successfully created", models.CustomLinksResponse{
		ProfilePublicID: profilePublicID,
		Links: customLinksResponse,
	})
}