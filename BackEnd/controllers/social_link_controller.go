package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
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

func socialLinkResponse(socialLinks []models.SocialLink) []models.SocialLinkResponse {
	var response []models.SocialLinkResponse
	for _, link := range socialLinks {
		response = append(response, models.SocialLinkResponse{
			PublicID:        link.PublicID,
			ProfilePublicID: link.ProfilePublicID,
			Position:        link.Position,
			Icon:            link.Icon,
			Url:             link.Url,
			Active:          link.Active,
			Order:           link.Order,
			CreatedAt:       link.CreatedAt,
		})
	}
	return response
}

func (c *SocialLinkController) CreateSocialLinks (ctx *fiber.Ctx) error {
	profileID := ctx.Params("profileId")
	profilePublicID, err := uuid.Parse(profileID)

	if err != nil {
		return utils.BadRequest(ctx, "Invalid profile ID", err.Error())
	}
	var req models.SocialLinksRequest
	if err := ctx.BodyParser(&req); err != nil {
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

	socialLinksResponse := socialLinkResponse(socialLinks)

	return utils.Success(ctx, "Social links successfully created", models.SocialLinksResponse{
		ProfilePublicID: profilePublicID,
		SocialLinks:     socialLinksResponse,
	})
}