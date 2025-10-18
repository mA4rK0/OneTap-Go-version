package repositories

import (
	"github.com/mA4rK0/OneTap-Go-version/config"
	"github.com/mA4rK0/OneTap-Go-version/models"
)

type ProfileRepository interface{
	Create(profile *models.Profile) error
	Update (profile *models.Profile) error
	FindByPublicID (publicID string) (*models.Profile, error)
}

type profileRepository struct{}

func NewProfileRepository() ProfileRepository {
	return &profileRepository{}
}

func (r *profileRepository) Create(profile *models.Profile) error {
	return config.DB.Create(profile).Error
}

func (r *profileRepository) Update (profile *models.Profile) error {
	return config.DB.Model(&models.Profile{}).Where("public_id = ?", profile.PublicID).Updates(map[string]interface{}{
		"username": profile.Username,
		"category": profile.Category,
		"avatar": profile.Avatar,
		"theme_name": profile.ThemeName,
		"bg_colour": profile.BgColour,
		"username_colour": profile.UsernameColour,
		"btn_round": profile.BtnRound,
		"btn_bg_colour": profile.BtnBgColour,
		"btn_text_colour": profile.BtnTextColour,
		"btn_outline_colour": profile.BtnOutlineColour,
		"icon_colour": profile.IconColour,
	}).Error
}

func (r *profileRepository) FindByPublicID (publicID string) (*models.Profile, error) {
	var profile models.Profile
	err := config.DB.Where("public_id = ?", publicID).First(&profile).Error
	return &profile, err
}