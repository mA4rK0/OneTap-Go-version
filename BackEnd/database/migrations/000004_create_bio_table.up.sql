CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE bios (
  internal_id BIGSERIAL PRIMARY KEY,
  public_id UUID NOT NULL DEFAULT gen_random_uuid(),
  profile_internal_id BIGINT NOT NULL REFERENCES profiles(internal_id),
  profile_public_id UUID NOT NULL,
  "description" VARCHAR(255) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT bios_public_id_unique UNIQUE (public_id),
  FOREIGN KEY (profile_public_id)
    REFERENCES profiles(public_id)
    ON DELETE CASCADE
)