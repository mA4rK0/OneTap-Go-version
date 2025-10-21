package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
	"github.com/mA4rK0/OneTap-Go-version/models"
	"github.com/mA4rK0/OneTap-Go-version/services"
	"github.com/mA4rK0/OneTap-Go-version/utils"
)

type SocialLinkController struct {
	service services.SocialLinkService
}

func NewSocialLinkController(s services.SocialLinkService) *SocialLinkController {
	return &SocialLinkController{service: s}
}

func (c *SocialLinkController) CreateSocialLinks (ctx *fiber.Ctx) error {
	profileID := ctx.Params("profileId")
	profilePublicID, err := uuid.Parse(profileID)

	if err != nil {
		return utils.BadRequest(ctx, "Invalid profile ID", err.Error())
	}

	req := new(models.SocialLinksRequest)
	if err := ctx.BodyParser(req); err != nil {
		return utils.BadRequest(ctx, "Failed to parse request", err.Error())
	}
	if len(req.SocialLinks) == 0 {
		return utils.BadRequest(ctx, "Social links cannot be empty", "social_links array is required")
	}

	if err := c.service.CreateSocialLinks(profilePublicID, req); err != nil {
		return utils.BadRequest(ctx, "Failed to create social links", err.Error())
	}
	socialLinks, err := c.service.GetSocialLinks(profilePublicID, req.Position)
	if err != nil {
		return utils.InternalServerError(ctx, "Failed to retrieve social links", err.Error())
	}

	var socialLinksResponse []models.SocialLinkResponse
	if err := copier.Copy(&socialLinksResponse, &socialLinks); err != nil {
		return utils.InternalServerError(ctx, "Error processing data", err.Error())
	}

	return utils.Success(ctx, "Social links successfully created", models.SocialLinksResponse{
		ProfilePublicID: profilePublicID,
		SocialLinks:     socialLinksResponse,
	})
}

func (c *SocialLinkController) GetSocialLinks(ctx *fiber.Ctx) error {
	profileID := ctx.Params("profileId")
	profilePublicID, err := uuid.Parse(profileID)
	if err != nil {
		return utils.BadRequest(ctx, "Invalid profile ID", err.Error())
	}

	position := ctx.Query("position", "")
	socialLinks, err := c.service.GetSocialLinks(profilePublicID, position)
	if err != nil {
		return utils.InternalServerError(ctx, "Failed to get social links", err.Error())
	}

	var socialLinksResponse []models.SocialLinkResponse
	if err := copier.Copy(&socialLinksResponse, &socialLinks); err != nil {
		return utils.InternalServerError(ctx, "Error processing data", err.Error())
	}

	return utils.Success(ctx, "Social links retrieved successfully", models.SocialLinksResponse{
		ProfilePublicID: profilePublicID,
		SocialLinks:     socialLinksResponse,
	})
}

func (c *SocialLinkController) UpdateSocialLinks(ctx *fiber.Ctx) error {
	profileID := ctx.Params("profileId")
	profilePublicID, err := uuid.Parse(profileID)
	if err != nil {
		return utils.BadRequest(ctx, "Invalid profile ID", err.Error())
	}

	req := new(models.SocialLinksRequest)
	if err := ctx.BodyParser(req); err != nil {
		return utils.BadRequest(ctx, "Failed to parse request", err.Error())
	}

	if len(req.SocialLinks) == 0 {
		return utils.BadRequest(ctx, "Social links cannot be empty", "social_links array is required")
	}

	if err := c.service.UpdateSocialLinks(profilePublicID, req); err != nil {
		return utils.BadRequest(ctx, "Failed to update social links", err.Error())
	}

	socialLinks, err := c.service.GetSocialLinks(profilePublicID, req.Position)
	if err != nil {
		return utils.InternalServerError(ctx, "Failed to retrieve social links", err.Error())
	}

	var socialLinksResponse []models.SocialLinkResponse
	if err := copier.Copy(&socialLinksResponse, &socialLinks); err != nil {
		return utils.InternalServerError(ctx, "Error processing data", err.Error())
	}

	return utils.Success(ctx, "Social links successfully updated", models.SocialLinksResponse{
		ProfilePublicID: profilePublicID,
		SocialLinks:     socialLinksResponse,
	})
}

func (c *SocialLinkController) DeleteSocialLinks(ctx *fiber.Ctx) error {
	profileID := ctx.Params("profileId")
	profilePublicID, err := uuid.Parse(profileID)
	if err != nil {
		return utils.BadRequest(ctx, "Invalid profile ID", err.Error())
	}

	position := ctx.Query("position", "")

	if err := c.service.DeleteSocialLinks(profilePublicID, position); err != nil {
		return utils.BadRequest(ctx, "Failed to delete social links", err.Error())
	}

	return utils.Success(ctx, "Social links successfully deleted", nil)
}