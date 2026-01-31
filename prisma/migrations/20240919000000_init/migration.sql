-- CreateTable
CREATE TABLE "Teacher" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "ClassRoom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TimeSlot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weekday" TEXT NOT NULL CHECK ("weekday" IN ('MO', 'DI', 'MI', 'DO', 'FR')),
    "lessonNo" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "timeSlotId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "classRoomId" INTEGER,
    "kind" TEXT NOT NULL CHECK ("kind" IN ('TEACHING', 'FZ', 'FO', 'WE', 'OTHER')),
    "note" TEXT,
    CONSTRAINT "Assignment_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_classRoomId_fkey" FOREIGN KEY ("classRoomId") REFERENCES "ClassRoom" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Absence" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "note" TEXT,
    CONSTRAINT "Absence_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CoverRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "timeSlotId" INTEGER NOT NULL,
    "classRoomId" INTEGER NOT NULL,
    "missingTeacherId" INTEGER NOT NULL,
    CONSTRAINT "CoverRequest_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CoverRequest_classRoomId_fkey" FOREIGN KEY ("classRoomId") REFERENCES "ClassRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CoverRequest_missingTeacherId_fkey" FOREIGN KEY ("missingTeacherId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CoverAssignment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "timeSlotId" INTEGER NOT NULL,
    "classRoomId" INTEGER NOT NULL,
    "missingTeacherId" INTEGER NOT NULL,
    "assignedTeacherId" INTEGER NOT NULL,
    "status" TEXT NOT NULL CHECK ("status" IN ('CONFIRMED')),
    "decidedAt" DATETIME NOT NULL,
    CONSTRAINT "CoverAssignment_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CoverAssignment_classRoomId_fkey" FOREIGN KEY ("classRoomId") REFERENCES "ClassRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CoverAssignment_missingTeacherId_fkey" FOREIGN KEY ("missingTeacherId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CoverAssignment_assignedTeacherId_fkey" FOREIGN KEY ("assignedTeacherId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Assignment_timeSlotId_idx" ON "Assignment"("timeSlotId");

-- CreateIndex
CREATE INDEX "Assignment_teacherId_idx" ON "Assignment"("teacherId");

-- CreateIndex
CREATE INDEX "Assignment_classRoomId_idx" ON "Assignment"("classRoomId");

-- CreateIndex
CREATE INDEX "Absence_teacherId_idx" ON "Absence"("teacherId");

-- CreateIndex
CREATE INDEX "CoverRequest_timeSlotId_idx" ON "CoverRequest"("timeSlotId");

-- CreateIndex
CREATE INDEX "CoverRequest_classRoomId_idx" ON "CoverRequest"("classRoomId");

-- CreateIndex
CREATE INDEX "CoverRequest_missingTeacherId_idx" ON "CoverRequest"("missingTeacherId");

-- CreateIndex
CREATE INDEX "CoverAssignment_timeSlotId_idx" ON "CoverAssignment"("timeSlotId");

-- CreateIndex
CREATE INDEX "CoverAssignment_classRoomId_idx" ON "CoverAssignment"("classRoomId");

-- CreateIndex
CREATE INDEX "CoverAssignment_missingTeacherId_idx" ON "CoverAssignment"("missingTeacherId");

-- CreateIndex
CREATE INDEX "CoverAssignment_assignedTeacherId_idx" ON "CoverAssignment"("assignedTeacherId");
