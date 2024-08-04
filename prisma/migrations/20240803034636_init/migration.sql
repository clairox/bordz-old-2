-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_cartId_key" ON "Customer"("cartId");
