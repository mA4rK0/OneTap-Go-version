package models

import (
	"time"

	"github.com/google/uuid"
)

type CustomLink struct {
	InternalID uint64  `json:"internal_id" db:"internal_id" gorm:"primaryKey;autoIncrement"`
	ProfileID  uint64  `json:"profile_internal_id" db:"profile_internal_id" gorm:"column:profile_internal_id"`
	ProfilePublicID uuid.UUID `json:"profile_public_id" db:"profile_public_id" gorm:"column:profile_public_id"`
	PublicID   uuid.UUID `json:"public_id" db:"public_id"`
	Url        string   `json:"url" db:"url"`
	TagLine    string   `json:"tag_line" db:"tag_line" gorm:"column:tag_line"`
	Active     bool     `json:"active" db:"active"`
	Order      uint64   `json:"order" db:"order"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type CustomLinksRequest struct {
	Links []CustomLinkRequest `json:"links"`
}

type CustomLinkRequest struct {
	Url        string   `json:"url"`
	TagLine    string   `json:"tag_line"`
	Active     bool     `json:"active"`
	Order      uint64   `json:"order"`
}

type CustomLinkResponse struct {
	PublicID   uuid.UUID `json:"public_id"`
	Url        string   `json:"url"`
	TagLine    string   `json:"tag_line"`
	Active     bool     `json:"active"`
	Order      uint64   `json:"order"`
	CreatedAt time.Time `json:"created_at"`
}

type CustomLinksResponse struct {
	ProfilePublicID uuid.UUID `json:"profile_public_id"`
	Links []CustomLinkResponse `json:"links"`
}