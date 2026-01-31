const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const weekdays = ["MO", "DI", "MI", "DO", "FR"];

function minutesToTime(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

function getWeekdayForDate(date) {
  const day = date.getDay();
  switch (day) {
    case 1:
      return "MO";
    case 2:
      return "DI";
    case 3:
      return "MI";
    case 4:
      return "DO";
    case 5:
      return "FR";
    default:
      return "MO";
  }
}

async function main() {
  await prisma.coverAssignment.deleteMany();
  await prisma.coverRequest.deleteMany();
  await prisma.absence.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.classRoom.deleteMany();
  await prisma.teacher.deleteMany();

  const teacherData = [
    { firstName: "Klara", lastName: "Vogel", role: "KV", active: true },
    { firstName: "Thomas", lastName: "Lang", role: "TL", active: true },
    { firstName: "Svenja", lastName: "Kramer", role: "Springer", active: true },
    { firstName: "Nils", lastName: "Becker", role: "KV", active: true },
    { firstName: "Elena", lastName: "Fuchs", role: "TL", active: true },
    { firstName: "Mara", lastName: "Jost", role: "Springer", active: true }
  ];

  const classRoomData = [
    { name: "1A" },
    { name: "1B" },
    { name: "2A" },
    { name: "2B" }
  ];

  const timeSlotData = [];
  weekdays.forEach((weekday) => {
    for (let lessonNo = 1; lessonNo <= 10; lessonNo += 1) {
      const startMinutes = 8 * 60 + (lessonNo - 1) * 45;
      const endMinutes = startMinutes + 45;
      timeSlotData.push({
        weekday,
        lessonNo,
        startTime: minutesToTime(startMinutes),
        endTime: minutesToTime(endMinutes)
      });
    }
  });

  await prisma.teacher.createMany({ data: teacherData });
  await prisma.classRoom.createMany({ data: classRoomData });
  await prisma.timeSlot.createMany({ data: timeSlotData });

  const teachers = await prisma.teacher.findMany({ orderBy: { id: "asc" } });
  const classRooms = await prisma.classRoom.findMany({ orderBy: { id: "asc" } });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayWeekday = getWeekdayForDate(today);

  const todayTimeSlots = await prisma.timeSlot.findMany({
    where: { weekday: todayWeekday },
    orderBy: { lessonNo: "asc" }
  });

  const assignments = [];
  const lessonCount = Math.min(4, todayTimeSlots.length);

  for (let lessonIndex = 0; lessonIndex < lessonCount; lessonIndex += 1) {
    const timeSlot = todayTimeSlots[lessonIndex];
    classRooms.forEach((classRoom, classIndex) => {
      const teacher = teachers[(lessonIndex + classIndex) % teachers.length];
      assignments.push({
        date: today,
        timeSlotId: timeSlot.id,
        teacherId: teacher.id,
        classRoomId: classRoom.id,
        kind: "TEACHING",
        note: "Demo-Unterricht"
      });
    });
  }

  if (assignments.length > 0) {
    await prisma.assignment.createMany({ data: assignments });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
