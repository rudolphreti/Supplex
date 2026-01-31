import "server-only";

import type {
  Absence,
  Assignment,
  ClassRoom,
  CoverAssignment,
  Teacher,
  TimeSlot,
} from "@prisma/client";

import prisma from "./db";

const toDateRange = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const ensureTeacherTable = async () => {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Teacher" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      active BOOLEAN NOT NULL DEFAULT 1
    )
  `);
};

export const listTeachers = async (): Promise<Teacher[]> => {
  await ensureTeacherTable();
  return prisma.teacher.findMany({ orderBy: { name: "asc" } });
};

export const getTeacherById = async (id: number): Promise<Teacher | null> => {
  await ensureTeacherTable();
  return prisma.teacher.findUnique({ where: { id } });
};

export const createTeacher = async (input: {
  name: string;
  role: string;
  active?: boolean;
}): Promise<Teacher> => {
  await ensureTeacherTable();
  return prisma.teacher.create({
    data: {
      name: input.name,
      role: input.role,
      active: input.active ?? true,
    },
  });
};

export const updateTeacher = async (
  id: number,
  input: { name: string; role: string },
): Promise<Teacher> => {
  await ensureTeacherTable();
  return prisma.teacher.update({
    where: { id },
    data: {
      name: input.name,
      role: input.role,
    },
  });
};

export const deleteTeacher = async (id: number): Promise<Teacher> => {
  await ensureTeacherTable();
  return prisma.teacher.delete({ where: { id } });
};

export const toggleTeacherActive = async (id: number): Promise<Teacher> => {
  await ensureTeacherTable();
  const teacher = await prisma.teacher.findUnique({ where: { id } });
  if (!teacher) {
    throw new Error(`Teacher ${id} not found`);
  }
  return prisma.teacher.update({
    where: { id },
    data: { active: !teacher.active },
  });
};

export const listClasses = async (): Promise<ClassRoom[]> =>
  prisma.classRoom.findMany({ orderBy: { name: "asc" } });

export const createClass = async (input: { name: string }): Promise<ClassRoom> =>
  prisma.classRoom.create({ data: { name: input.name } });

export const listTimeSlots = async (): Promise<TimeSlot[]> =>
  prisma.timeSlot.findMany({
    orderBy: [{ weekday: "asc" }, { lessonNo: "asc" }],
  });

export const listAssignmentsByDate = async (date: Date): Promise<Assignment[]> => {
  const range = toDateRange(date);
  return prisma.assignment.findMany({
    where: { date: { gte: range.start, lte: range.end } },
    orderBy: [{ timeSlotId: "asc" }, { id: "asc" }],
  });
};

export const createAssignment = async (input: {
  date: Date;
  timeSlotId: number;
  teacherId: number;
  classRoomId?: number | null;
  kind: string;
  note?: string | null;
}): Promise<Assignment> =>
  prisma.assignment.create({
    data: {
      date: input.date,
      timeSlot: { connect: { id: input.timeSlotId } },
      teacher: { connect: { id: input.teacherId } },
      classRoom: input.classRoomId
        ? { connect: { id: input.classRoomId } }
        : undefined,
      kind: input.kind,
      note: input.note ?? undefined,
    },
  });

export const deleteAssignment = async (id: number): Promise<Assignment> =>
  prisma.assignment.delete({ where: { id } });

export const listAbsencesByDate = async (date: Date): Promise<Absence[]> => {
  const range = toDateRange(date);
  return prisma.absence.findMany({
    where: { date: { gte: range.start, lte: range.end } },
    orderBy: [{ teacherId: "asc" }, { id: "asc" }],
  });
};

export const createAbsence = async (input: {
  date: Date;
  teacherId: number;
  note?: string | null;
}): Promise<Absence> =>
  prisma.absence.create({
    data: {
      date: input.date,
      teacher: { connect: { id: input.teacherId } },
      note: input.note ?? undefined,
    },
  });

export const deleteAbsence = async (id: number): Promise<Absence> =>
  prisma.absence.delete({ where: { id } });

export const listCoverAssignmentsByDate = async (
  date: Date,
): Promise<CoverAssignment[]> => {
  const range = toDateRange(date);
  return prisma.coverAssignment.findMany({
    where: { date: { gte: range.start, lte: range.end } },
    orderBy: [{ timeSlotId: "asc" }, { id: "asc" }],
  });
};
