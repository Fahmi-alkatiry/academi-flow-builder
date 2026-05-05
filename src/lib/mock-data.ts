export type Role = "student" | "lecturer" | "admin" | "staff";

export const roleLabel: Record<Role, string> = {
  student: "Mahasiswa",
  lecturer: "Dosen",
  admin: "Pimpinan / Admin",
  staff: "Tenaga Kependidikan",
};

export const mockUserByRole: Record<Role, { name: string; nim: string; program: string }> = {
  student: { name: "Aisyah Ramadhani", nim: "210411100123", program: "Teknik Informatika" },
  lecturer: { name: "Dr. Bambang Hartono, M.Kom.", nim: "NIDN 0712038501", program: "Teknik Informatika" },
  admin: { name: "Prof. Siti Maryam, Ph.D.", nim: "Wakil Rektor I", program: "Universitas Madura" },
  staff: { name: "Hendra Wijaya, S.Kom.", nim: "NIP 199003142020121005", program: "BAAK" },
};

export type Course = {
  code: string;
  name: string;
  sks: number;
  category: "Wajib" | "Pilihan";
  lecturer: string;
  schedule: string;
  quotaFilled: number;
  quotaTotal: number;
  semester: number;
};

export const courses: Course[] = [
  { code: "TIF301", name: "Rekayasa Perangkat Lunak", sks: 3, category: "Wajib", lecturer: "Dr. Bambang Hartono", schedule: "Sen 08:00–10:30", quotaFilled: 38, quotaTotal: 40, semester: 5 },
  { code: "TIF302", name: "Basis Data Lanjut", sks: 3, category: "Wajib", lecturer: "Ir. Linda Kusuma, M.T.", schedule: "Sen 13:00–15:30", quotaFilled: 35, quotaTotal: 40, semester: 5 },
  { code: "TIF303", name: "Jaringan Komputer", sks: 3, category: "Wajib", lecturer: "Dr. Anwar Sadat", schedule: "Sel 08:00–10:30", quotaFilled: 40, quotaTotal: 40, semester: 5 },
  { code: "TIF304", name: "Kecerdasan Buatan", sks: 3, category: "Wajib", lecturer: "Dr. Farah Diba", schedule: "Sel 13:00–15:30", quotaFilled: 32, quotaTotal: 40, semester: 5 },
  { code: "TIF305", name: "Interaksi Manusia & Komputer", sks: 2, category: "Wajib", lecturer: "Rina Marlina, M.Kom.", schedule: "Rab 08:00–09:40", quotaFilled: 30, quotaTotal: 40, semester: 5 },
  { code: "TIF401", name: "Data Mining", sks: 3, category: "Pilihan", lecturer: "Dr. Farah Diba", schedule: "Rab 13:00–15:30", quotaFilled: 28, quotaTotal: 35, semester: 5 },
  { code: "TIF402", name: "Pemrograman Mobile", sks: 3, category: "Pilihan", lecturer: "Yudha Pratama, M.T.", schedule: "Kam 08:00–10:30", quotaFilled: 34, quotaTotal: 35, semester: 5 },
  { code: "TIF403", name: "Cloud Computing", sks: 3, category: "Pilihan", lecturer: "Ir. Linda Kusuma, M.T.", schedule: "Kam 13:00–15:30", quotaFilled: 22, quotaTotal: 35, semester: 5 },
  { code: "MKU301", name: "Kewirausahaan", sks: 2, category: "Wajib", lecturer: "Drs. Hadi Susanto, M.M.", schedule: "Jum 08:00–09:40", quotaFilled: 60, quotaTotal: 80, semester: 5 },
  { code: "MKU302", name: "Bahasa Inggris Profesi", sks: 2, category: "Pilihan", lecturer: "Sarah Anggraini, M.Pd.", schedule: "Jum 10:00–11:40", quotaFilled: 40, quotaTotal: 60, semester: 5 },
];

export type Grade = { semester: number; code: string; name: string; sks: number; grade: string; mutu: number };

export const transcript: Grade[] = [
  { semester: 1, code: "MKU101", name: "Pendidikan Agama", sks: 2, grade: "A", mutu: 4.0 },
  { semester: 1, code: "MKU102", name: "Pancasila", sks: 2, grade: "A-", mutu: 3.7 },
  { semester: 1, code: "TIF101", name: "Algoritma & Pemrograman", sks: 4, grade: "B+", mutu: 3.3 },
  { semester: 1, code: "TIF102", name: "Matematika Diskrit", sks: 3, grade: "B", mutu: 3.0 },
  { semester: 1, code: "TIF103", name: "Pengantar Teknologi Informasi", sks: 3, grade: "A", mutu: 4.0 },
  { semester: 2, code: "TIF201", name: "Struktur Data", sks: 4, grade: "A-", mutu: 3.7 },
  { semester: 2, code: "TIF202", name: "Kalkulus", sks: 3, grade: "B", mutu: 3.0 },
  { semester: 2, code: "TIF203", name: "Sistem Digital", sks: 3, grade: "B+", mutu: 3.3 },
  { semester: 2, code: "TIF204", name: "Pemrograman Berorientasi Objek", sks: 4, grade: "A", mutu: 4.0 },
  { semester: 3, code: "TIF205", name: "Basis Data", sks: 3, grade: "A", mutu: 4.0 },
  { semester: 3, code: "TIF206", name: "Statistika", sks: 3, grade: "B+", mutu: 3.3 },
  { semester: 3, code: "TIF207", name: "Sistem Operasi", sks: 3, grade: "A-", mutu: 3.7 },
  { semester: 3, code: "TIF208", name: "Analisis & Perancangan Sistem", sks: 3, grade: "A", mutu: 4.0 },
  { semester: 4, code: "TIF209", name: "Pemrograman Web", sks: 3, grade: "A", mutu: 4.0 },
  { semester: 4, code: "TIF210", name: "Riset Operasi", sks: 3, grade: "B+", mutu: 3.3 },
  { semester: 4, code: "TIF211", name: "Metodologi Penelitian", sks: 2, grade: "A-", mutu: 3.7 },
  { semester: 4, code: "TIF212", name: "Grafika Komputer", sks: 3, grade: "B+", mutu: 3.3 },
];

export const todaySchedule = [
  { time: "08:00 – 10:30", course: "Rekayasa Perangkat Lunak", room: "Lab RPL 2", lecturer: "Dr. Bambang H." },
  { time: "13:00 – 15:30", course: "Basis Data Lanjut", room: "Ruang 3.04", lecturer: "Ir. Linda K." },
  { time: "16:00 – 17:40", course: "Kewirausahaan", room: "Aula B", lecturer: "Drs. Hadi S." },
];

export const weeklySchedule = [
  { day: "Senin", items: [{ time: "08:00", end: "10:30", name: "RPL", room: "Lab RPL 2" }, { time: "13:00", end: "15:30", name: "Basis Data Lanjut", room: "R 3.04" }] },
  { day: "Selasa", items: [{ time: "08:00", end: "10:30", name: "Jaringan Komputer", room: "R 2.11" }, { time: "13:00", end: "15:30", name: "Kecerdasan Buatan", room: "Lab AI" }] },
  { day: "Rabu", items: [{ time: "08:00", end: "09:40", name: "IMK", room: "R 2.05" }] },
  { day: "Kamis", items: [{ time: "08:00", end: "10:30", name: "Pemrograman Mobile", room: "Lab Mobile" }] },
  { day: "Jumat", items: [{ time: "08:00", end: "09:40", name: "Kewirausahaan", room: "Aula B" }] },
  { day: "Sabtu", items: [] },
];

export const lecturerClasses = [
  { code: "TIF301-A", name: "Rekayasa Perangkat Lunak", students: 38, schedule: "Sen 08:00–10:30", room: "Lab RPL 2" },
  { code: "TIF301-B", name: "Rekayasa Perangkat Lunak", students: 35, schedule: "Rab 10:00–12:30", room: "Lab RPL 1" },
  { code: "TIF505", name: "Manajemen Proyek TI", students: 42, schedule: "Kam 13:00–15:30", room: "R 3.10" },
];

export const classRoster = [
  { nim: "210411100101", name: "Adi Pratama", grade: "" },
  { nim: "210411100102", name: "Bella Safira", grade: "" },
  { nim: "210411100103", name: "Citra Dewi", grade: "" },
  { nim: "210411100104", name: "Dimas Anggara", grade: "" },
  { nim: "210411100105", name: "Eka Putra", grade: "" },
  { nim: "210411100123", name: "Aisyah Ramadhani", grade: "" },
  { nim: "210411100124", name: "Fajar Nugroho", grade: "" },
  { nim: "210411100125", name: "Gita Larasati", grade: "" },
];

export const advisees = [
  { nim: "210411100123", name: "Aisyah Ramadhani", semester: 5, ipk: 3.62, krsStatus: "Menunggu" as const, krsSks: 21 },
  { nim: "210411100124", name: "Fajar Nugroho", semester: 5, ipk: 3.21, krsStatus: "Disetujui" as const, krsSks: 20 },
  { nim: "210411100125", name: "Gita Larasati", semester: 5, ipk: 3.78, krsStatus: "Menunggu" as const, krsSks: 23 },
  { nim: "210411100126", name: "Hendra Saputra", semester: 5, ipk: 2.89, krsStatus: "Revisi" as const, krsSks: 18 },
];

export const gradeDistribution = [
  { grade: "A", jumlah: 1240 },
  { grade: "A-", jumlah: 980 },
  { grade: "B+", jumlah: 1450 },
  { grade: "B", jumlah: 1320 },
  { grade: "B-", jumlah: 720 },
  { grade: "C+", jumlah: 410 },
  { grade: "C", jumlah: 280 },
  { grade: "D", jumlah: 90 },
  { grade: "E", jumlah: 35 },
];

export const enrollmentTrend = [
  { tahun: "2020", FT: 820, FE: 640, FH: 410, FKIP: 730 },
  { tahun: "2021", FT: 880, FE: 690, FH: 430, FKIP: 760 },
  { tahun: "2022", FT: 940, FE: 720, FH: 460, FKIP: 790 },
  { tahun: "2023", FT: 1020, FE: 780, FH: 490, FKIP: 820 },
  { tahun: "2024", FT: 1110, FE: 830, FH: 510, FKIP: 860 },
  { tahun: "2025", FT: 1180, FE: 870, FH: 530, FKIP: 890 },
];

export const studentStatus = [
  { name: "Aktif", value: 8420 },
  { name: "Cuti", value: 230 },
  { name: "Lulus", value: 1340 },
  { name: "DO", value: 95 },
];

export const accreditation = [
  { program: "Teknik Informatika", fakultas: "Teknik", grade: "Unggul", expiry: "2027-08-12", daysToAudit: 412 },
  { program: "Teknik Mesin", fakultas: "Teknik", grade: "A", expiry: "2026-03-22", daysToAudit: 87 },
  { program: "Manajemen", fakultas: "Ekonomi", grade: "Unggul", expiry: "2028-01-15", daysToAudit: 568 },
  { program: "Akuntansi", fakultas: "Ekonomi", grade: "B", expiry: "2026-06-10", daysToAudit: 165 },
  { program: "Ilmu Hukum", fakultas: "Hukum", grade: "A", expiry: "2026-02-28", daysToAudit: 65 },
  { program: "Pendidikan Bahasa Indonesia", fakultas: "FKIP", grade: "Unggul", expiry: "2027-11-30", daysToAudit: 521 },
  { program: "Pendidikan Matematika", fakultas: "FKIP", grade: "A", expiry: "2026-04-18", daysToAudit: 114 },
];

export const integrations = [
  { name: "SIAKAD Lama", status: "online" as const, lastSync: "2 menit lalu", desc: "Data mahasiswa & nilai legacy" },
  { name: "Sistem Keuangan (SIMKEU)", status: "online" as const, lastSync: "5 menit lalu", desc: "Pembayaran UKT" },
  { name: "Perpustakaan (SLiMS)", status: "warning" as const, lastSync: "3 jam lalu", desc: "Sinkronisasi tertunda" },
  { name: "Feeder PDDikti", status: "online" as const, lastSync: "1 jam lalu", desc: "Pelaporan Kemdikbud" },
  { name: "E-Learning Moodle", status: "online" as const, lastSync: "10 menit lalu", desc: "LMS terintegrasi" },
  { name: "Sistem Alumni Tracer", status: "offline" as const, lastSync: "2 hari lalu", desc: "Maintenance terjadwal" },
];

export const masterMahasiswa = [
  { nim: "210411100123", nama: "Aisyah Ramadhani", prodi: "Teknik Informatika", angkatan: 2021, status: "Aktif" },
  { nim: "210411100124", nama: "Fajar Nugroho", prodi: "Teknik Informatika", angkatan: 2021, status: "Aktif" },
  { nim: "220511100045", nama: "Mega Saraswati", prodi: "Manajemen", angkatan: 2022, status: "Aktif" },
  { nim: "200611100201", nama: "Rizki Maulana", prodi: "Ilmu Hukum", angkatan: 2020, status: "Cuti" },
  { nim: "190711100078", nama: "Putri Andini", prodi: "Akuntansi", angkatan: 2019, status: "Lulus" },
];
