import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { buildRoleOptions } from "./roles";
import { createTeacher, listTeachers } from "@/src/lib/repo";

type LehrpersonenPageProps = {
  searchParams?: {
    q?: string;
    active?: string;
  };
};

export default async function LehrpersonenPage({
  searchParams,
}: LehrpersonenPageProps) {
  const query = typeof searchParams?.q === "string" ? searchParams.q.trim() : "";
  const activeOnly = searchParams?.active === "on";
  const teachers = await listTeachers();
  const filteredTeachers = teachers.filter((teacher) => {
    const fullName = `${teacher.firstName} ${teacher.lastName}`.trim();
    const matchesQuery = query
      ? fullName.toLowerCase().includes(query.toLowerCase()) ||
        teacher.firstName.toLowerCase().includes(query.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(query.toLowerCase()) ||
        teacher.role.toLowerCase().includes(query.toLowerCase())
      : true;
    const matchesActive = activeOnly ? teacher.active : true;
    return matchesQuery && matchesActive;
  });

  async function handleCreate(formData: FormData) {
    "use server";
    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const role = String(formData.get("role") || "").trim();
    const active = formData.get("active") === "on";
    if (!firstName || !lastName || !role) {
      return;
    }
    await createTeacher({ firstName, lastName, role, active });
    revalidatePath("/lehrpersonen");
    redirect("/lehrpersonen");
  }

  return (
    <section className="card">
      <h2>Lehrpersonen</h2>
      <p>
        Verwalte hier alle Lehrpersonen, Rollen und Einsatzmöglichkeiten für
        Vertretungen.
      </p>

      <h3>Lehrperson hinzufügen</h3>
      <form action={handleCreate} style={{ display: "grid", gap: "0.75rem" }}>
        <label style={{ display: "grid", gap: "0.35rem" }}>
          Vorname
          <input name="firstName" type="text" required />
        </label>
        <label style={{ display: "grid", gap: "0.35rem" }}>
          Nachname
          <input name="lastName" type="text" required />
        </label>
        <label style={{ display: "grid", gap: "0.35rem" }}>
          Rolle
          <select name="role" required defaultValue="">
            <option value="" disabled>
              Bitte wählen
            </option>
            {buildRoleOptions().map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleOption}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input name="active" type="checkbox" defaultChecked />
          Aktiv
        </label>
        <button type="submit">Speichern</button>
      </form>

      <h3 style={{ marginTop: "2rem" }}>Übersicht</h3>
      <form method="get" style={{ display: "grid", gap: "0.75rem" }}>
        <label style={{ display: "grid", gap: "0.35rem" }}>
          Suche
          <input
            name="q"
            type="search"
            placeholder="Name oder Rolle"
            defaultValue={query}
          />
        </label>
        <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input name="active" type="checkbox" defaultChecked={activeOnly} />
          Nur aktiv
        </label>
        <button type="submit">Filtern</button>
      </form>

      <div style={{ marginTop: "1.5rem" }}>
        {filteredTeachers.length === 0 ? (
          <p>Keine Lehrpersonen gefunden.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Name</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Rolle</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Status</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td style={{ padding: "0.5rem" }}>
                    {teacher.firstName} {teacher.lastName}
                  </td>
                  <td style={{ padding: "0.5rem" }}>{teacher.role}</td>
                  <td style={{ padding: "0.5rem" }}>
                    {teacher.active ? "Aktiv" : "Inaktiv"}
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    <a href={`/lehrpersonen/${teacher.id}`}>Bearbeiten</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
