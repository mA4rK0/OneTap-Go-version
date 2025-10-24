package services

import (
	"errors"

	"github.com/google/uuid"
	"github.com/mA4rK0/OneTap-Go-version/models"
	"github.com/mA4rK0/OneTap-Go-version/repositories"
)

type CustomLinkService interface{
	CreateCustomLinks(profilePublicID uuid.UUID, req *models.CustomLinksRequest) error
	UpdateCustomLinks(profilePublicID uuid.UUID, req *models.CustomLinksRequest) error
	GetCustomLinks(profilePublicID uuid.UUID) ([]models.CustomLink, error)
}

type customLinkService struct {
	customLinkRepo repositories.CustomLinkRepository
	profileRepo repositories.ProfileRepository
}

func NewCustomLinkService(
	customLinkRepo repositories.CustomLinkRepository,
	profileRepo repositories.ProfileRepository,
) CustomLinkService {
	return &customLinkService{customLinkRepo, profileRepo}
}

func (s *customLinkService) CreateCustomLinks(profilePublicID uuid.UUID, req *models.CustomLinksRequest) error {
	profile, err := s.profileRepo.FindByPublicID(profilePublicID.String())
	if err != nil {
		return errors.New("profile not found")
	}

	var customLinks []models.CustomLink
	for _, customLinkReq := range req.Links {
		customLinks = append(customLinks, models.CustomLink{
			ProfileID: profile.InternalID,
			ProfilePublicID: profilePublicID,
			Url: customLinkReq.Url,
			TagLine: customLinkReq.TagLine,
			Active: customLinkReq.Active,
			Order: customLinkReq.Order,
		})
	}

	return s.customLinkRepo.Create(profilePublicID, customLinks)
}

func (s *customLinkService) UpdateCustomLinks(profilePublicID uuid.UUID, req *models.CustomLinksRequest) error {
	profile, err := s.profileRepo.FindByPublicID(profilePublicID.String())
	if err != nil {
		return errors.New("profile not found")
	}

	exists, err := s.customLinkRepo.CheckExists(profilePublicID)
	if err != nil {
		return err
	}
	if !exists {
		return errors.New("social links not found for this profile")
	}

	var customLinks []models.CustomLink
	for _, link := range req.Links {
		customLinks = append(customLinks, models.CustomLink{
			ProfileID: profile.InternalID,
			ProfilePublicID: profilePublicID,
			Url: link.Url,
			TagLine: link.TagLine,
			Active: link.Active,
			Order: link.Order,
		})
	}
	return s.customLinkRepo.Update(profilePublicID, customLinks)
}

func (s *customLinkService) GetCustomLinks(profilePublicID uuid.UUID) ([]models.CustomLink, error) {
	return s.customLinkRepo.GetByProfileID(profilePublicID)
}