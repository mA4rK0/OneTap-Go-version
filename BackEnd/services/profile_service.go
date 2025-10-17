package services

import (
	"errors"

	"github.com/google/uuid"
	"github.com/mA4rK0/OneTap-Go-version/models"
	"github.com/mA4rK0/OneTap-Go-version/repositories"
)

type ProfileService interface{
	Create (profile *models.Profile) error
}

type profileService struct {
	profileRepo repositories.ProfileRepository
	userRepo repositories.UserRepository
}

func NewProfileService(
	profileRepo repositories.ProfileRepository, 
	userRepo repositories.UserRepository,
	) ProfileService {
	return &profileService{profileRepo, userRepo}
}

func (s *profileService) Create (profile *models.Profile) error {
	user, err := s.userRepo.FindByPublicID(profile.UserPublicID.String())
	if err != nil {
		return errors.New("user not found")
	}

	profile.PublicID = uuid.New()
	profile.UserID = user.InternalID
	return s.profileRepo.Create(profile)
}