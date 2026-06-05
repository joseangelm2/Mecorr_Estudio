CREATE TABLE projects (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT UNIQUE NOT NULL,
  template          TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'draft',
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  quinceanera_name  TEXT NOT NULL,
  guest_name        TEXT,
  event_date        TIMESTAMPTZ NOT NULL,
  rsvp_phone        TEXT,
  hashtag           TEXT,
  music_url         TEXT,
  hero_photo_url    TEXT,
  parent_names      JSONB DEFAULT '[]',
  padrinos          JSONB DEFAULT '[]',
  ceremony          JSONB,
  reception         JSONB,
  itinerary         JSONB DEFAULT '[]',
  dress_code        JSONB,
  photos            JSONB DEFAULT '[]',
  gift_registry     JSONB,
  extra_config      JSONB DEFAULT '{}'
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_published"
  ON projects FOR SELECT
  USING (status = 'published');

CREATE POLICY "admin_all"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
