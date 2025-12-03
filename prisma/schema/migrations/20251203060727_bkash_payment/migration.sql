-- CreateTable
CREATE TABLE "public"."Bkash" (
    "id" SERIAL NOT NULL,
    "authToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bkash_pkey" PRIMARY KEY ("id")
);
