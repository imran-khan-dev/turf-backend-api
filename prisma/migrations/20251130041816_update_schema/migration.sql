/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'MANAGER', 'OWNER');

-- CreateEnum
CREATE TYPE "public"."AdminRole" AS ENUM ('SUPER_ADMIN', 'MANAGER_ADMIN');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PAID', 'DUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "role" "public"."UserRole" NOT NULL,
ADD COLUMN     "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."AdminRole" NOT NULL DEFAULT 'MANAGER_ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TurfUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "photo" TEXT,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "turfProfileId" TEXT NOT NULL,
    "appUserId" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TurfUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TurfManager" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "turfProfileId" TEXT NOT NULL,

    CONSTRAINT "TurfManager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OTP" (
    "id" TEXT NOT NULL,
    "appUserId" TEXT,
    "turfUserId" TEXT,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TurfProfile" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "openHours" TEXT,
    "facebookLink" TEXT,
    "instagramLink" TEXT,
    "whatsappLink" TEXT,
    "heroImage" TEXT,
    "heroTitle" TEXT,
    "aboutTitle" TEXT,
    "aboutDesc" TEXT,
    "aboutImg" TEXT,
    "address" TEXT,
    "googleMapLink" TEXT,
    "footerText" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TurfProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TurfField" (
    "id" TEXT NOT NULL,
    "turfProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pricePerHour" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TurfField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NavMenuItem" (
    "id" TEXT NOT NULL,
    "turfProfileId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "NavMenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TurfFeature" (
    "id" TEXT NOT NULL,
    "turfProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "TurfFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GalleryItem" (
    "id" TEXT NOT NULL,
    "turfProfileId" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" TEXT NOT NULL,
    "turfProfileId" TEXT NOT NULL,
    "turfFieldId" TEXT NOT NULL,
    "userId" TEXT,
    "turfUserId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentAmount" INTEGER,
    "status" "public"."BookingStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TurfUser_appUserId_key" ON "public"."TurfUser"("appUserId");

-- CreateIndex
CREATE UNIQUE INDEX "TurfUser_email_turfProfileId_key" ON "public"."TurfUser"("email", "turfProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "OTP_appUserId_key" ON "public"."OTP"("appUserId");

-- CreateIndex
CREATE UNIQUE INDEX "OTP_turfUserId_key" ON "public"."OTP"("turfUserId");

-- CreateIndex
CREATE UNIQUE INDEX "TurfProfile_slug_key" ON "public"."TurfProfile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TurfProfile_ownerId_key" ON "public"."TurfProfile"("ownerId");

-- AddForeignKey
ALTER TABLE "public"."TurfUser" ADD CONSTRAINT "TurfUser_turfProfileId_fkey" FOREIGN KEY ("turfProfileId") REFERENCES "public"."TurfProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TurfUser" ADD CONSTRAINT "TurfUser_appUserId_fkey" FOREIGN KEY ("appUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TurfManager" ADD CONSTRAINT "TurfManager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TurfManager" ADD CONSTRAINT "TurfManager_turfProfileId_fkey" FOREIGN KEY ("turfProfileId") REFERENCES "public"."TurfProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OTP" ADD CONSTRAINT "OTP_appUserId_fkey" FOREIGN KEY ("appUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OTP" ADD CONSTRAINT "OTP_turfUserId_fkey" FOREIGN KEY ("turfUserId") REFERENCES "public"."TurfUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TurfProfile" ADD CONSTRAINT "TurfProfile_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TurfProfile" ADD CONSTRAINT "TurfProfile_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "public"."Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TurfField" ADD CONSTRAINT "TurfField_turfProfileId_fkey" FOREIGN KEY ("turfProfileId") REFERENCES "public"."TurfProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NavMenuItem" ADD CONSTRAINT "NavMenuItem_turfProfileId_fkey" FOREIGN KEY ("turfProfileId") REFERENCES "public"."TurfProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TurfFeature" ADD CONSTRAINT "TurfFeature_turfProfileId_fkey" FOREIGN KEY ("turfProfileId") REFERENCES "public"."TurfProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GalleryItem" ADD CONSTRAINT "GalleryItem_turfProfileId_fkey" FOREIGN KEY ("turfProfileId") REFERENCES "public"."TurfProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_turfProfileId_fkey" FOREIGN KEY ("turfProfileId") REFERENCES "public"."TurfProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_turfFieldId_fkey" FOREIGN KEY ("turfFieldId") REFERENCES "public"."TurfField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_turfUserId_fkey" FOREIGN KEY ("turfUserId") REFERENCES "public"."TurfUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
