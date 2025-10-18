package services

import (
	"errors"

	"github.com/google/uuid"
	"github.com/mA4rK0/OneTap-Go-version/models"
	"github.com/mA4rK0/OneTap-Go-version/repositories"
	"gorm.io/gorm"
)

type SocialLinkService interface{
	CreateSocialLinks (profilePublicID uuid.UUID, req models.SocialLinksRequest) error
	GetSocialLinks(profilePublicID uuid.UUID, position string) ([]models.SocialLink, error)
}

type socialLinkService struct {
	socialLinkRepo repositories.SocialLinkRepository
	profileRepo repositories.ProfileRepository
}

func NewSocialLinkService(
	socialLinkRepo repositories.SocialLinkRepository,
	profileRepo repositories.ProfileRepository,
	) SocialLinkService {
	return &socialLinkService{socialLinkRepo, profileRepo}
}

func (s *socialLinkService) CreateSocialLinks (profilePublicID uuid.UUID, req models.SocialLinksRequest) error {
	profile, err := s.profileRepo.FindByPublicID(profilePublicID.String())
	if err != nil {
		return errors.New("profile not found")
	}

	var socialLinks []models.SocialLink
	for _, linkReq := range req.SocialLinks {
		socialLinks = append(socialLinks, models.SocialLink{
			ProfileID:       profile.InternalID,
			ProfilePublicID: profilePublicID,
			Position:        req.Position,
			Icon:            linkReq.Icon,
			Url:             linkReq.Url,
			Active:          linkReq.Active,
			Order:           linkReq.Order,
		})
	}

	err = s.socialLinkRepo.Create(profilePublicID, req.Position, socialLinks)
	if errors.Is(err, gorm.ErrDuplicatedKey) {
		return errors.New("social links already exist for this profile and position")
	}
	return err
}

func (s *socialLinkService) GetSocialLinks(profilePublicID uuid.UUID, position string) ([]models.SocialLink, error) {
	if position != "" {
		return s.socialLinkRepo.GetByProfileIDAndPosition(profilePublicID, position)
	}
	return s.socialLinkRepo.GetByProfileID(profilePublicID)
}