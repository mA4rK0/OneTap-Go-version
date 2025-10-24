package models

import (
	"time"

	"github.com/google/uuid"
)

type SocialLink struct {
	InternalID uint64  `json:"internal_id" db:"internal_id" gorm:"primaryKey;autoIncrement"`
	ProfileID  uint64  `json:"profile_internal_id" db:"profile_internal_id" gorm:"column:profile_internal_id"`
	ProfilePublicID uuid.UUID `json:"profile_public_id" db:"profile_public_id" gorm:"column:profile_public_id"`
	PublicID   uuid.UUID `json:"public_id" db:"public_id"`
	Position   string   `json:"position" db:"position"`
	Icon       string   `json:"icon" db:"icon"`
	Url        string   `json:"url" db:"url"`
	Active     bool     `json:"active" db:"active"`
	Order      uint64   `json:"order" db:"order"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

type SocialLinksRequest struct {
	Position    string `json:"position"`
	SocialLinks []SocialLinkItemRequest `json:"social_links"`
}

type SocialLinkItemRequest struct {
	Icon       string   `json:"icon"`
	Url        string   `json:"url"`
	Active     bool     `json:"active"`
	Order      uint64   `json:"order"`
}

type SocialLinkResponse struct {
	PublicID        uuid.UUID `json:"public_id"`
	Position        string    `json:"position"`
	Icon            string    `json:"icon"`
	Url             string    `json:"url"`
	Active          bool      `json:"active"`
	Order           uint64      `json:"order"`
	CreatedAt       time.Time `json:"created_at"`
}

type SocialLinksResponse struct {
	ProfilePublicID uuid.UUID             `json:"profile_public_id"`
	SocialLinks     []SocialLinkResponse `json:"social_links"`
}