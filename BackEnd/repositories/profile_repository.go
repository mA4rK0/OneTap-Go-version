package repositories

import (
	"github.com/mA4rK0/OneTap-Go-version/config"
	"github.com/mA4rK0/OneTap-Go-version/models"
)

type ProfileRepository interface{
	Create(profile *models.Profile) error
}

type profileRepository struct{}

func NewProfileRepository() ProfileRepository {
	return &profileRepository{}
}

func (r *profileRepository) Create(profile *models.Profile) error {
	return config.DB.Create(profile).Error
}