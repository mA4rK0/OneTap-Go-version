package models

import "github.com/google/uuid"

type Bio struct {
	InternalID      uint64    `json:"internal_id" db:"internal_id" gorm:"primaryKey;autoIncrement"`
	ProfileID       uint64    `json:"profile_internal_id" db:"profile_internal_id" gorm:"column:profile_internal_id"`
	ProfilePublicID uuid.UUID   `json:"profile_public_id" db:"profile_public_id" gorm:"column:profile_public_id"`
	PublicID        uuid.UUID `json:"public_id" db:"public_id"`
	Description     string    `json:"description" db:"description"`
	Active          bool      `json:"active" db:"active"`
}