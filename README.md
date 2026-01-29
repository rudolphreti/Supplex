# Supplier Plan – MVP

A simple prototype application for **creating teacher substitution plans (Supplier Plans)** in a school.
The goal is to **replace manual, daily substitution planning** and to gradually collect requirements for a full system — **no Excel files and no file imports**.

## Project Goal

* Structure teacher and schedule data in one place
* Reduce daily manual work for the team leadership
* Automatically suggest suitable substitutions
* Keep full human control with easy manual adjustments

## MVP Scope

The application consists of three main areas:

### 1. Teacher Database

* List of teachers
* Roles (e.g. class teacher, subject teacher, FÖ, WE, substitute)
* Basic constraints (e.g. no substitutions, only FZ, limited availability)
* Optional class assignments

### 2. Timetable (Stundenplan)

* Timetable is **created directly in the application**
* Views:

  * by class
  * by teacher
* Clear indication of occupied vs. free time slots

### 3. Supplier Plan (Substitutions)

* Select a date
* Select absent teachers
* Automatic detection of uncovered lessons
* System suggests suitable substitute teachers:

  * only available teachers
  * respecting roles and constraints
  * prioritising low workload and existing class relations
* Manual override of suggestions (one click)

## What the MVP Does *Not* Include

* No Excel import or export
* No automatic data sync with external systems
* No user management or permissions (single-user prototype)
* No complex rule engine (simple, transparent logic only)

## Why This MVP

* Fast to build
* Easy to explain to non-technical staff
* Makes current manual decision logic visible
* Creates a solid base for step-by-step feature expansion

## Next Steps (After MVP)

* Add more substitution rules and priorities
* Track substitution history and workload
* Improve reporting and overview
* Optional PDF/print views

---

If you want, I can now:

* adapt this README for **Teamleitung / non-technical audience**
* shorten it to a **one-page concept**
* or align it with a **specific tech stack (Node + TS + DB)**
