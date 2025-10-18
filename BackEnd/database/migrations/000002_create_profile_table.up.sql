CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE profiles (
  internal_id BIGSERIAL PRIMARY KEY,
  public_id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_internal_id BIGINT NOT NULL REFERENCES users(internal_id),
  user_public_id UUID NOT NULL,
  avatar TEXT,
  username VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(255),
  theme_name VARCHAR(255) NOT NULL DEFAULT 'default',
  bg_colour VARCHAR(255) NOT NULL DEFAULT '#FFFFFF',
  username_colour VARCHAR(255) NOT NULL DEFAULT '#000000',
  btn_round VARCHAR(255) NOT NULL DEFAULT '4px',
  btn_bg_colour VARCHAR(255) NOT NULL DEFAULT '#000000',
  btn_text_colour VARCHAR(255) NOT NULL DEFAULT '#FFFFFF',
  btn_outline_colour VARCHAR(255) NOT NULL DEFAULT '#000000',
  icon_colour VARCHAR(255) NOT NULL DEFAULT '#000000',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT profiles_public_id_unique UNIQUE (public_id),
  CONSTRAINT fk_profiles_user_public_id
    FOREIGN KEY (user_public_id)
      REFERENCES users(public_id)
      ON DELETE CASCADE
);