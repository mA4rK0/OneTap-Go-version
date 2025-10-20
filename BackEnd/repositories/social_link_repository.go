package repositories

import (
	"time"

	"github.com/google/uuid"
	"github.com/mA4rK0/OneTap-Go-version/config"
	"github.com/mA4rK0/OneTap-Go-version/models"
	"gorm.io/gorm"
)

type SocialLinkRepository interface{
	Create(profilePublicID uuid.UUID, position string, socialLinks []models.SocialLink) error
	Update(profilePublicID uuid.UUID, position string, socialLinks []models.SocialLink) error
	CheckExists(profilePublicID uuid.UUID, position string) (bool, error)
	GetByProfileID(profilePublicID uuid.UUID) ([]models.SocialLink, error)
	GetByProfileIDAndPosition(profilePublicID uuid.UUID, position string) ([]models.SocialLink, error)
}

type socialLinkRepository struct{}

func NewSocialLinkRepository() SocialLinkRepository {
	return &socialLinkRepository{}
}

func (r *socialLinkRepository) Create(profilePublicID uuid.UUID, position string, socialLinks []models.SocialLink) error {
	exists, err := r.CheckExists(profilePublicID, position)
	if err != nil {
		return err
	}
	if exists {
		return gorm.ErrDuplicatedKey
	}

	for i := range socialLinks {
		if socialLinks[i].PublicID == uuid.Nil {
			socialLinks[i].PublicID = uuid.New()
		}
		socialLinks[i].CreatedAt = time.Now()
	}

	return config.DB.Create(&socialLinks).Error
}

func (r *socialLinkRepository) CheckExists(profilePublicID uuid.UUID, position string) (bool, error) {
	var count int64
	err := config.DB.Model(&models.SocialLink{}).
		Where("profile_public_id = ? AND position = ?", profilePublicID, position).
		Count(&count).Error
	return count > 0, err
}

func (r *socialLinkRepository) GetByProfileID(profilePublicID uuid.UUID) ([]models.SocialLink, error) {
	var socialLinks []models.SocialLink
	err := config.DB.Where("profile_public_id = ?", profilePublicID).
		Order("position, \"order\"").
		Find(&socialLinks).Error
	return socialLinks, err
}

func (r *socialLinkRepository) GetByProfileIDAndPosition(profilePublicID uuid.UUID, position string) ([]models.SocialLink, error) {
	var socialLinks []models.SocialLink
	err := config.DB.Where("profile_public_id = ? AND position = ?", profilePublicID, position).
		Order("\"order\"").
		Find(&socialLinks).Error
	return socialLinks, err
}

func (r *socialLinkRepository) Update(profilePublicID uuid.UUID, position string, socialLinks []models.SocialLink) error {
	tx := config.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()
	if err := tx.Where("profile_public_id = ? AND position = ?", profilePublicID, position).
		Delete(&models.SocialLink{}).Error; err != nil {
		tx.Rollback()
		return err
	}

	for i := range socialLinks {
		if socialLinks[i].PublicID == uuid.Nil {
			socialLinks[i].PublicID = uuid.New()
		}
		socialLinks[i].CreatedAt = time.Now()
	}

	if err := tx.Create(&socialLinks).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}