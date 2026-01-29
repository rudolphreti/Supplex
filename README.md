## Project Overview

This repository contains a minimal MVP for generating **teacher substitution plans** (“Supplierplan”).  
Instead of building plans manually, the app lets you:

- record **teacher absences** for a given date,
- **generate substitution suggestions** based on availability,
- **confirm** assignments,
- view a clean **printable substitution plan** and a **history** of who covered what.

The goal is to demonstrate the workflow to school management quickly, with a simple UI and a real database.

### Core Idea (Data Model)
The system treats the timetable as **database records**:
- **Teachers**: who can substitute (role + active flag)
- **Time slots**: weekday + lesson number (1..10)
- **Assignments**: who is already busy in a slot (teaching / FZ / FÖ / WE / other)
- **Absences**: who is missing on a date
- **Cover requests**: “gaps” created from absences + assignments
- **Cover assignments**: confirmed substitutions

### How Generation Works (MVP Rules)
For each gap (class + time slot), the generator proposes candidates who:
- are **active**
- are **not absent**
- are **not busy** in the same slot (no assignment)

Candidates are ranked with a simple score, e.g.:
- prefer roles like **Springer/TL**,
- prefer teachers who have worked with the class before,
- avoid overloading the same person with too many covers.

### Minimal User Flow
1. Add absences for a date
2. Generate substitution suggestions
3. Confirm the selected substitutions
4. Print the substitution plan and review history
