-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "services" INTEGER[],
    "regions" INTEGER[],
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mover" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "services" INTEGER[],
    "regions" INTEGER[],
    "career" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "introduction" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mover_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovingRequest" (
    "id" SERIAL NOT NULL,
    "serviceType" INTEGER NOT NULL,
    "movingDate" TIMESTAMP(3) NOT NULL,
    "pickupAddress" TEXT NOT NULL,
    "dropOffAddress" TEXT NOT NULL,
    "requestCount" INTEGER NOT NULL DEFAULT 0,
    "designateCount" INTEGER NOT NULL DEFAULT 0,
    "isDesignated" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "customerId" INTEGER NOT NULL,

    CONSTRAINT "MovingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "movingInfoId" INTEGER NOT NULL,
    "moverId" INTEGER NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfirmedQuote" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "movingRequestId" INTEGER NOT NULL,
    "quoteId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "moverId" INTEGER NOT NULL,

    CONSTRAINT "ConfirmedQuote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "imageUrl" TEXT[],
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "confirmedQuoteId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "moverId" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewComment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "moverId" INTEGER NOT NULL,

    CONSTRAINT "ReviewComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CustomerToMover" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MoverToMovingRequest" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_companion" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_id_key" ON "Customer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_key" ON "Customer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Mover_id_key" ON "Mover"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Mover_userId_key" ON "Mover"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Service_id_key" ON "Service"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Region_id_key" ON "Region"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MovingRequest_id_key" ON "MovingRequest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_id_key" ON "Quote"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ConfirmedQuote_id_key" ON "ConfirmedQuote"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ConfirmedQuote_movingRequestId_key" ON "ConfirmedQuote"("movingRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "ConfirmedQuote_quoteId_key" ON "ConfirmedQuote"("quoteId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_id_key" ON "Review"("id");

-- CreateIndex
CREATE UNIQUE INDEX "notification_id_key" ON "notification"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewComment_id_key" ON "ReviewComment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_CustomerToMover_AB_unique" ON "_CustomerToMover"("A", "B");

-- CreateIndex
CREATE INDEX "_CustomerToMover_B_index" ON "_CustomerToMover"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MoverToMovingRequest_AB_unique" ON "_MoverToMovingRequest"("A", "B");

-- CreateIndex
CREATE INDEX "_MoverToMovingRequest_B_index" ON "_MoverToMovingRequest"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_companion_AB_unique" ON "_companion"("A", "B");

-- CreateIndex
CREATE INDEX "_companion_B_index" ON "_companion"("B");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mover" ADD CONSTRAINT "Mover_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovingRequest" ADD CONSTRAINT "MovingRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_movingInfoId_fkey" FOREIGN KEY ("movingInfoId") REFERENCES "MovingRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_moverId_fkey" FOREIGN KEY ("moverId") REFERENCES "Mover"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmedQuote" ADD CONSTRAINT "ConfirmedQuote_movingRequestId_fkey" FOREIGN KEY ("movingRequestId") REFERENCES "MovingRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmedQuote" ADD CONSTRAINT "ConfirmedQuote_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmedQuote" ADD CONSTRAINT "ConfirmedQuote_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmedQuote" ADD CONSTRAINT "ConfirmedQuote_moverId_fkey" FOREIGN KEY ("moverId") REFERENCES "Mover"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_confirmedQuoteId_fkey" FOREIGN KEY ("confirmedQuoteId") REFERENCES "ConfirmedQuote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_moverId_fkey" FOREIGN KEY ("moverId") REFERENCES "Mover"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewComment" ADD CONSTRAINT "ReviewComment_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewComment" ADD CONSTRAINT "ReviewComment_moverId_fkey" FOREIGN KEY ("moverId") REFERENCES "Mover"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomerToMover" ADD CONSTRAINT "_CustomerToMover_A_fkey" FOREIGN KEY ("A") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomerToMover" ADD CONSTRAINT "_CustomerToMover_B_fkey" FOREIGN KEY ("B") REFERENCES "Mover"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoverToMovingRequest" ADD CONSTRAINT "_MoverToMovingRequest_A_fkey" FOREIGN KEY ("A") REFERENCES "Mover"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoverToMovingRequest" ADD CONSTRAINT "_MoverToMovingRequest_B_fkey" FOREIGN KEY ("B") REFERENCES "MovingRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_companion" ADD CONSTRAINT "_companion_A_fkey" FOREIGN KEY ("A") REFERENCES "Mover"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_companion" ADD CONSTRAINT "_companion_B_fkey" FOREIGN KEY ("B") REFERENCES "MovingRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
