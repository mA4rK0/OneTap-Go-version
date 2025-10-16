package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	InternalID uint64 `json:"internal_id" db:"internal_id" gorm:"primaryKey"`
	PublicID   uuid.UUID `json:"public_id" db:"public_id"`
	Name       string `json:"name" db:"name"`
	Email      string `json:"email" db:"email" gorm:"unique"`
	Password   string `json:"password" db:"password" gorm:"column:password"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time	`json:"updated_at" db:"updated_at"`
	DeletedAt  gorm.DeletedAt `json:"-" gorm:"index"` // "soft" delete in database, cannot return deleted data
}

type UserResponse struct {
	PublicID   uuid.UUID `json:"public_id"`
	Name       string `json:"name"`
	Email      string `json:"email"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-"`
}