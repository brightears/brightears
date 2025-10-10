-- Add search performance indexes for Artist table
-- These indexes dramatically improve search query performance

-- Enable pg_trgm extension for fuzzy text search (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add GIN index for stage name using trigram similarity
-- This enables fast ILIKE queries and fuzzy matching
CREATE INDEX IF NOT EXISTS idx_artist_stagename_trigram
  ON "Artist" USING gin("stageName" gin_trgm_ops);

-- Add full-text search index for English bio
-- Uses PostgreSQL's to_tsvector for better text search
CREATE INDEX IF NOT EXISTS idx_artist_bio_fulltext
  ON "Artist" USING gin(to_tsvector('english', COALESCE("bio", '')));

-- Add full-text search index for Thai bio
-- Uses 'simple' config for Thai text (Thai doesn't have built-in stemming)
CREATE INDEX IF NOT EXISTS idx_artist_bio_th_fulltext
  ON "Artist" USING gin(to_tsvector('simple', COALESCE("bioTh", '')));

-- Add GIN index for genres array for fast array containment queries
CREATE INDEX IF NOT EXISTS idx_artist_genres_gin
  ON "Artist" USING gin("genres");

-- Add composite index for common search + filter combinations
-- This speeds up queries that search + filter by category/location/verification
CREATE INDEX IF NOT EXISTS idx_artist_search_composite
  ON "Artist" ("category", "baseCity", "verificationLevel");

-- Add index for hourly rate for price range filtering
CREATE INDEX IF NOT EXISTS idx_artist_hourly_rate
  ON "Artist" ("hourlyRate") WHERE "hourlyRate" IS NOT NULL;

-- Add index for service areas array
CREATE INDEX IF NOT EXISTS idx_artist_service_areas_gin
  ON "Artist" USING gin("serviceAreas");

-- Add index for languages array
CREATE INDEX IF NOT EXISTS idx_artist_languages_gin
  ON "Artist" USING gin("languages");

-- Analyze the table to update statistics for query planner
ANALYZE "Artist";
