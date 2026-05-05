# SIAT — Universitas Madura Wireframe Plan

A functional, mock-data wireframe for an Integrated Academic Information System with 4 roles: **Student, Lecturer, Admin/Leadership, Staff (Tenaga Kependidikan)**.

## Design language

- Corporate, clean, professional. Primary blue + white, subtle gray surfaces.
- Tailwind tokens via `src/styles.css` (update primary to a corporate blue, keep neutral grays).
- shadcn components: `card`, `table`, `button`, `input`, `select`, `badge`, `tabs`, `sidebar`, `chart`, `progress`, `dialog`.
- Fully responsive: sidebar collapses to icon mini-rail; tables scroll horizontally on mobile; dashboard cards stack.

## Auth (mock)

- `/login` — single page with role selector (Student / Lecturer / Admin / Staff) + username/password fields (any value works).
- Selected role stored in `localStorage` + a small `useAuth()` hook (mock only — no real backend).
- Pathless layout `_app.tsx` reads role and renders the shared shell (sidebar + header). Sidebar items are filtered per role.
- Logout clears storage and returns to `/login`.

## Routes (file-based, TanStack Start)

```text
src/routes/
  __root.tsx                  shell (html/head/body)
  index.tsx                   landing → redirect to /login or /dashboard
  login.tsx
  _app.tsx                    sidebar+header layout (role-aware)
  _app/dashboard.tsx          role-routing dashboard
  _app/krs.tsx                Student: course registration
  _app/schedule.tsx           Student: weekly schedule
  _app/grades.tsx             Student: transcript + semester results
  _app/teaching.tsx           Lecturer: class list
  _app/grade-input.tsx        Lecturer: input grades form
  _app/advisees.tsx           Lecturer: advisee list + KRS approval
  _app/monitoring.tsx         Admin/Leadership: charts dashboard
  _app/accreditation.tsx      Admin/Leadership: accreditation tracker
  _app/integration.tsx        Admin/Staff: legacy system status
  _app/master-data.tsx        Staff: master data management
```

## Modules

**Student Dashboard** — cards for IPK, total SKS, semester aktif; "Today's classes" list; quick links to KRS & Grades.

**KRS (Course Registration)** — refined per Prompt 2:
- Search input + category filter (Wajib / Pilihan).
- Course table: code, name, SKS, lecturer, schedule, quota (filled/total), Add/Remove toggle.
- Sticky right sidebar "Ringkasan Pilihan": list of selected courses, **real-time total SKS**, progress bar to 24, **red warning** when > 24 (disables submit).
- Submit button → toast + status "Menunggu persetujuan dosen wali".

**Schedule** — weekly grid (Mon–Sat × time slots) with color-coded course blocks; mobile = day tabs.

**Grades / Transcript** — tabs: per-semester table (course, SKS, grade, mutu) + cumulative transcript with running IPK.

**Lecturer — Teaching** — table of classes taught, students enrolled, link to grade input.

**Lecturer — Grade Input** — pick class → student table with grade dropdown (A/B+/B/…/E) + auto-calculated mutu; save draft / submit.

**Lecturer — Advisees** — list of advisee students with pending KRS to approve/reject (dialog shows their course list + total SKS).

**Monitoring & Accreditation Dashboard (Pimpinan)** — Prompt 3:
- KPI cards: total mahasiswa aktif, rata-rata IPK, rasio dosen:mahasiswa, lulusan tepat waktu %.
- Bar chart: grade distribution (A/B/C/D/E) using shadcn `chart` (Recharts).
- Line chart: enrollment trend per year per faculty.
- Pie/donut: status mahasiswa (aktif / cuti / lulus / DO).
- Filter by fakultas / program studi.

**Accreditation Tracker** — table of program studi: current grade (Unggul / A / B), expiry date, days until audit, status badge, automated alert row (red) when audit < 90 days.

**Integration Status** — panel listing legacy systems (SIAKAD lama, Keuangan, Perpustakaan, Feeder PDDikti) with green/amber/red status dots, last sync time, manual "Sync now" button (mock).

**Master Data (Staff)** — tabbed CRUD wireframes for Mahasiswa, Dosen, Mata Kuliah, Ruangan, Tahun Akademik (table + add/edit dialogs, mock state).

## Mock data

Single `src/lib/mock-data.ts` with: users (per role), courses, schedules, grades, programs, faculties, enrollment trend series, integration systems. All views read from here so numbers are consistent across dashboards.

## Sidebar (role-aware)

| Role | Menu items |
|------|-----------|
| Student | Dashboard, KRS, Jadwal, Nilai/Transkrip |
| Lecturer | Dashboard, Kelas Diampu, Input Nilai, Mahasiswa Perwalian |
| Admin/Leadership | Dashboard, Monitoring, Akreditasi, Integrasi |
| Staff | Dashboard, Master Data, Integrasi |

Header shows: Universitas Madura logo/text, current role badge, user name, logout.

## Out of scope (wireframe)

No real auth, no DB persistence, no file uploads, no email. Form submissions show toast + update local React state only.

## Deliverable check

After build: visit each route per role, verify sidebar filtering, verify KRS SKS warning triggers > 24, verify charts render, verify mobile layout at 375px.
