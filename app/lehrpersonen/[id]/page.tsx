import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import ConfirmDeleteButton from "../ConfirmDeleteButton";
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
    const name = String(formData.get("name") || "").trim();
    const role = String(formData.get("role") || "").trim();
    if (!name || !role) {
      return;
    }
    await updateTeacher(teacherId, { name, role });
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
          Name
          <input name="name" type="text" defaultValue={teacher.name} required />
        </label>
        <label style={{ display: "grid", gap: "0.35rem" }}>
          Rolle
          <input name="role" type="text" defaultValue={teacher.role} required />
        </label>
        <button type="submit">Speichern</button>
      </form>

      <form action={handleDelete} style={{ marginTop: "1rem" }}>
        <ConfirmDeleteButton>Löschen</ConfirmDeleteButton>
      </form>
    </section>
  );
}
