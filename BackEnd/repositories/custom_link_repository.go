package repositories

import (
	"time"

	"github.com/google/uuid"
	"github.com/mA4rK0/OneTap-Go-version/config"
	"github.com/mA4rK0/OneTap-Go-version/models"
	"gorm.io/gorm"
)

type CustomLinkRepository interface{
	Create(profilePublicID uuid.UUID, customLinks []models.CustomLink) error
	Update(profilePublicID uuid.UUID, customLinks []models.CustomLink) error
	DeleteByProfileID(profilePublicID uuid.UUID) error
	CheckExists(profilePublicID uuid.UUID) (bool, error)
	GetByProfileID(profilePublicID uuid.UUID) ([]models.CustomLink, error)
}

type customLinkRepository struct{}

func NewCustomLinkRepository() CustomLinkRepository {
	return &customLinkRepository{}
}

func (r *customLinkRepository) Create(profilePublicID uuid.UUID, customLinks []models.CustomLink) error {
	exists, err := r.CheckExists(profilePublicID)
	if err != nil {
		return err
	}
	if exists {
		return gorm.ErrDuplicatedKey
	}

	for i := range customLinks {
		if customLinks[i].PublicID == uuid.Nil {
			customLinks[i].PublicID = uuid.New()
		}
		customLinks[i].CreatedAt = time.Now()
	}

	return config.DB.Create(&customLinks).Error
}

func (r *customLinkRepository) CheckExists(profilePublicID uuid.UUID) (bool, error) {
	var count int64
	err := config.DB.Model(&models.CustomLink{}).
		Where("profile_public_id = ?", profilePublicID).
		Count(&count).Error
	return count > 0, err
}

func (r *customLinkRepository) Update(profilePublicID uuid.UUID, customLinks []models.CustomLink) error {
	tx := config.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()
	if err := tx.Where("profile_public_id = ?", profilePublicID).
		Delete(&models.CustomLink{}).Error; err != nil {
		tx.Rollback()
		return err
	}

	for i := range customLinks {
		if customLinks[i].PublicID == uuid.Nil {
			customLinks[i].PublicID = uuid.New()
		}
		customLinks[i].CreatedAt = time.Now()
	}

	if err := tx.Create(&customLinks).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

func (r *customLinkRepository) GetByProfileID(profilePublicID uuid.UUID) ([]models.CustomLink, error) {
	var customLinks []models.CustomLink
	err := config.DB.Where("profile_public_id = ?", profilePublicID).
		Order("\"order\"").
		Find(&customLinks).Error
	return customLinks, err
}

func (r *customLinkRepository) DeleteByProfileID(profilePublicID uuid.UUID) error {
	return config.DB.Where("profile_public_id = ?", profilePublicID).
		Delete(&models.CustomLink{}).Error
}