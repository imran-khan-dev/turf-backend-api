/*
  Warnings:

  - You are about to drop the column `payload` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "payload",
ADD COLUMN     "amountPaid" INTEGER,
ADD COLUMN     "providerPaymentId" TEXT,
ADD COLUMN     "providerPaymentStatus" TEXT,
ADD COLUMN     "providerResponse" JSONB,
ALTER COLUMN "provider" DROP NOT NULL;
