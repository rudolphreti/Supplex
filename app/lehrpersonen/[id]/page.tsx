import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import ConfirmDeleteButton from "../ConfirmDeleteButton";
import { buildRoleOptions } from "../roles";
import {
  deleteTeacher,
  getTeacherById,
  updateTeacher,
} from "@/src/lib/repo";

type LehrpersonDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function LehrpersonDetailPage({
  params,
}: LehrpersonDetailPageProps) {
  const teacherId = Number(params.id);
  if (!Number.isFinite(teacherId)) {
    notFound();
  }

  const teacher = await getTeacherById(teacherId);
  if (!teacher) {
    notFound();
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const role = String(formData.get("role") || "").trim();
    if (!firstName || !lastName || !role) {
      return;
    }
    await updateTeacher(teacherId, { firstName, lastName, role });
    revalidatePath("/lehrpersonen");
    redirect("/lehrpersonen");
  }

  async function handleDelete() {
    "use server";
    await deleteTeacher(teacherId);
    revalidatePath("/lehrpersonen");
    redirect("/lehrpersonen");
  }

  return (
    <section className="card">
      <a href="/lehrpersonen">Zurück</a>
      <h2 style={{ marginTop: "0.75rem" }}>Lehrperson bearbeiten</h2>
      <p>Status: {teacher.active ? "Aktiv" : "Inaktiv"}</p>

      <form action={handleUpdate} style={{ display: "grid", gap: "0.75rem" }}>
        <label style={{ display: "grid", gap: "0.35rem" }}>
          Vorname
          <input
            name="firstName"
            type="text"
            defaultValue={teacher.firstName}
            required
          />
        </label>
        <label style={{ display: "grid", gap: "0.35rem" }}>
          Nachname
          <input
            name="lastName"
            type="text"
            defaultValue={teacher.lastName}
            required
          />
        </label>
        <label style={{ display: "grid", gap: "0.35rem" }}>
          Rolle
          <select name="role" required defaultValue={teacher.role}>
            {buildRoleOptions(teacher.role).map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleOption}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Speichern</button>
      </form>

      <form action={handleDelete} style={{ marginTop: "1rem" }}>
        <ConfirmDeleteButton>Löschen</ConfirmDeleteButton>
      </form>
    </section>
  );
}
