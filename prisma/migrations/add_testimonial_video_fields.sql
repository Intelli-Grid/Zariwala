-- Migration: add_testimonial_video_fields
-- Adds videoUrl and thumbnailUrl optional columns to the Testimonial table.
-- Run this in the Neon SQL Editor: https://console.neon.tech

ALTER TABLE "Testimonial"
  ADD COLUMN IF NOT EXISTS "videoUrl"     TEXT,
  ADD COLUMN IF NOT EXISTS "thumbnailUrl" TEXT;
