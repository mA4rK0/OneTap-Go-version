package services

import (
	"errors"

	"github.com/google/uuid"
	"github.com/mA4rK0/OneTap-Go-version/models"
	"github.com/mA4rK0/OneTap-Go-version/repositories"
)

type BioService interface{
	CreateBio(bio *models.Bio) error
	UpdateBio(bio *models.Bio) error
	GetByPublicID (publicID string) (*models.Bio, error)
}

type bioService struct {
	bioRepo repositories.BioRepository
	profileRepo repositories.ProfileRepository
}

func NewBioService(
	bioRepo repositories.BioRepository,
	profileRepo repositories.ProfileRepository,
) BioService {
	return &bioService{bioRepo, profileRepo}
}

func (s *bioService) CreateBio(bio *models.Bio) error {
	profile, err := s.profileRepo.FindByPublicID(bio.ProfilePublicID.String())
	if err != nil {
		return errors.New("profile not found")
	}

	bio.PublicID = uuid.New()
	bio.ProfileID = profile.InternalID
	return s.bioRepo.Create(bio)
}

func (s *bioService) UpdateBio(bio *models.Bio) error {
	return s.bioRepo.Update(bio)
}

func (s *bioService) GetByPublicID (publicID string) (*models.Bio, error) {
	return s.bioRepo.FindByPublicID(publicID)
}