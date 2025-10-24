CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE custom_links (
  internal_id BIGSERIAL PRIMARY KEY,
  public_id UUID NOT NULL DEFAULT gen_random_uuid(),
  profile_internal_id BIGINT NOT NULL REFERENCES profiles(internal_id),
  profile_public_id UUID NOT NULL,
  url TEXT NOT NULL,
  tag_line VARCHAR(255) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT custom_links_public_id_unique UNIQUE (public_id),
  CONSTRAINT fk_custom_links_profile_public_id
    FOREIGN KEY (profile_public_id)
      REFERENCES profiles(public_id)
      ON DELETE CASCADE
);