package models

import (
	"time"

	"github.com/google/uuid"
)

type Profile struct {
	InternalID uint64 `json:"internal_id" db:"internal_id" gorm:"primaryKey;autoIncrement"`
	UserID     uint64 `json:"user_internal_id" db:"user_internal_id" gorm:"column:user_internal_id"`
	Username   string `json:"username" db:"username" gorm:"unique"`
	Category   string `json:"category" db:"category"`
	Avatar     string `json:"avatar" db:"avatar"`
	ThemeName  string `json:"theme_name" db:"theme_name" gorm:"column:theme_name"`
	BgColour   string `json:"bg_colour" db:"bg_colour" gorm:"column:bg_colour"`
	UsernameColour string `json:"username_colour" db:"username_colour" gorm:"column:username_colour"`
	BtnRound   string `json:"btn_round" db:"btn_round" gorm:"column:btn_round"`
	BtnBgColour string `json:"btn_bg_colour" db:"btn_bg_colour" gorm:"column:btn_bg_colour"`
	BtnTextColour string `json:"btn_text_colour" db:"btn_text_colour" gorm:"column:btn_text_colour"`
	BtnOutlineColour string `json:"btn_outline_colour" db:"btn_outline_colour" gorm:"column:btn_outline_colour"`
	IconColour string `json:"icon_colour" db:"icon_colour" gorm:"column:icon_colour"`
	PublicID   uuid.UUID `json:"public_id" db:"public_id"`
	UserPublicID uuid.UUID `json:"user_public_id" db:"user_public_id" gorm:"column:user_public_id"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

type ProfileResponse struct {
	Username   string `json:"username"`
	Category   string `json:"category"`
	Avatar     string `json:"avatar"`
	ThemeName  string `json:"theme_name"`
	BgColour   string `json:"bg_colour"`
	UsernameColour string `json:"username_colour"`
	BtnRound   string `json:"btn_round"`
	BtnBgColour string `json:"btn_bg_colour"`
	BtnTextColour string `json:"btn_text_colour"`
	BtnOutlineColour string `json:"btn_outline_colour"`
	IconColour string `json:"icon_colour"`
	PublicID   uuid.UUID `json:"public_id"`
	UserPublicID uuid.UUID `json:"user_public_id"`
	CreatedAt  time.Time `json:"created_at"`
}