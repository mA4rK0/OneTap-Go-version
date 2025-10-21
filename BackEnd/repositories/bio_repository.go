package repositories

import (
	"github.com/mA4rK0/OneTap-Go-version/config"
	"github.com/mA4rK0/OneTap-Go-version/models"
)

type BioRepository interface{
	Create(bio *models.Bio) error
	FindByPublicID (publicID string) (*models.Bio, error)
}

type bioRepository struct{}

func NewBioRepository() BioRepository {
	return &bioRepository{}
}

func (r *bioRepository) Create(bio *models.Bio) error {
	return config.DB.Create(bio).Error
}

func (r *bioRepository) FindByPublicID (publicID string) (*models.Bio, error) {
	var bio models.Bio
	err := config.DB.Where("public_id = ?", publicID).First(&bio).Error
	return &bio, err
}