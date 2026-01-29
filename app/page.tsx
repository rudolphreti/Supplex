export default function HomePage() {
  return (
    <section className="card">
      <h2>Willkommen zur Vertretungsplanung</h2>
      <p>
        Diese Demo zeigt den Ablauf zur Verwaltung von Abwesenheiten und zur
        Erstellung von Vertretungsplänen für Lehrpersonen.
      </p>
      <p>
        Wähle einen Bereich aus der Navigation, um Lehrpersonen zu verwalten,
        Abwesenheiten zu erfassen oder Vertretungen zu generieren.
      </p>
      <ul className="section-list">
        <li>Lehrpersonen und Stammdaten pflegen</li>
        <li>Abwesenheiten für einzelne Tage erfassen</li>
        <li>Vertretungen erzeugen und bestätigen</li>
        <li>Historie und Druckansicht prüfen</li>
      </ul>
    </section>
  );
}
