package repositories

import (
	"time"

	"github.com/google/uuid"
	"github.com/mA4rK0/OneTap-Go-version/config"
	"github.com/mA4rK0/OneTap-Go-version/models"
)

type CustomLinkRepository interface{
	Create(customLinks []models.CustomLink) error
	GetByProfileID(profilePublicID uuid.UUID) ([]models.CustomLink, error)
}

type customLinkRepository struct{}

func NewCustomLinkRepository() CustomLinkRepository {
	return &customLinkRepository{}
}

func (r *customLinkRepository) Create(customLinks []models.CustomLink) error {
	for i := range customLinks {
		if customLinks[i].PublicID == uuid.Nil {
			customLinks[i].PublicID = uuid.New()
		}
		customLinks[i].CreatedAt = time.Now()
	}

	return config.DB.Create(customLinks).Error
}

func (r *customLinkRepository) GetByProfileID(profilePublicID uuid.UUID) ([]models.CustomLink, error) {
	var customLinks []models.CustomLink
	err := config.DB.Where("profile_public_id = ?", profilePublicID).
		Order("\"order\"").
		Find(&customLinks).Error
	return customLinks, err
}