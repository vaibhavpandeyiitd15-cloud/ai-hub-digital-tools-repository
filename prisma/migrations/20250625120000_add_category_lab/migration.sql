-- Add lab assignment to categories (Consumer vs Science)
CREATE TYPE "LabType" AS ENUM ('CONSUMER', 'SCIENCE');

ALTER TABLE "Category" ADD COLUMN "lab" "LabType" NOT NULL DEFAULT 'CONSUMER';
