-- AlterTable
ALTER TABLE "public"."TurfProfile" ALTER COLUMN "isApproved" SET DEFAULT true;

-- AlterTable
ALTER TABLE "public"."TurfUser" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'TURF_USER';
