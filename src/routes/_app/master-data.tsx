import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/master-data")({
  head: () => ({ meta: [{ title: "Master Data — SIAT" }] }),
  component: MasterDataPage,
});

function MasterDataPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal open states
  const [openStudentModal, setOpenStudentModal] = useState(false);
  const [openLecturerModal, setOpenLecturerModal] = useState(false);
  const [openCourseModal, setOpenCourseModal] = useState(false);
  const [openRoomModal, setOpenRoomModal] = useState(false);

  // Edit Modal open states
  const [openEditStudentModal, setOpenEditStudentModal] = useState(false);
  const [openEditLecturerModal, setOpenEditLecturerModal] = useState(false);
  const [openEditCourseModal, setOpenEditCourseModal] = useState(false);
  const [openEditRoomModal, setOpenEditRoomModal] = useState(false);

  // Edit Form states - Student
  const [selectedStudentNim, setSelectedStudentNim] = useState("");
  const [editMNim, setEditMNim] = useState("");
  const [editMName, setEditMName] = useState("");
  const [editMEmail, setEditMEmail] = useState("");
  const [editMDeptId, setEditMDeptId] = useState("");
  const [editMAdvisorId, setEditMAdvisorId] = useState("");
  const [editMPassword, setEditMPassword] = useState("");
  const [editMAlamat, setEditMAlamat] = useState("");
  const [editMThumbnail, setEditMThumbnail] = useState("");

  // Edit Form states - Lecturer
  const [editLNidn, setEditLNidn] = useState("");
  const [editLName, setEditLName] = useState("");
  const [editLEmail, setEditLEmail] = useState("");
  const [editLDeptId, setEditLDeptId] = useState("");
  const [editLPassword, setEditLPassword] = useState("");
  const [editLAlamat, setEditLAlamat] = useState("");
  const [editLThumbnail, setEditLThumbnail] = useState("");

  // Edit Form states - Course
  const [editCCode, setEditCCode] = useState("");
  const [editCName, setEditCName] = useState("");
  const [editCCredits, setEditCCredits] = useState("3");
  const [editCType, setEditCType] = useState("Wajib");
  const [editCDeptId, setEditCDeptId] = useState("");

  // Edit Form states - Room
  const [editRId, setEditRId] = useState("");
  const [editRName, setEditRName] = useState("");

  // Form states - Student
  const [mName, setMName] = useState("");
  const [mNim, setMNim] = useState("");
  const [mEmail, setMEmail] = useState("");
  const [mDeptId, setMDeptId] = useState("");
  const [mAdvisorId, setMAdvisorId] = useState("");
  const [mAlamat, setMAlamat] = useState("");
  const [mThumbnail, setMThumbnail] = useState("");

  // Form states - Lecturer
  const [lName, setLName] = useState("");
  const [lNidn, setLNidn] = useState("");
  const [lEmail, setLEmail] = useState("");
  const [lDeptId, setLDeptId] = useState("");
  const [lAlamat, setLAlamat] = useState("");
  const [lThumbnail, setLThumbnail] = useState("");

  // Form states - Course
  const [cName, setCName] = useState("");
  const [cCode, setCCode] = useState("");
  const [cCredits, setCCredits] = useState("3");
  const [cType, setCType] = useState("Wajib");
  const [cDeptId, setCDeptId] = useState("");

  // Form states - Room
  const [rName, setRName] = useState("");

  // Form states & variables for Classes
  const [classes, setClasses] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [openClassModal, setOpenClassModal] = useState(false);
  const [openEditClassModal, setOpenEditClassModal] = useState(false);

  // Form states - Class Add
  const [clCourseCode, setClCourseCode] = useState("");
  const [clLecturerNidn, setClLecturerNidn] = useState("");
  const [clRoomId, setClRoomId] = useState("");
  const [clScheduleDay, setClScheduleDay] = useState("Senin");
  const [clScheduleTime, setClScheduleTime] = useState("");
  const [clQuota, setClQuota] = useState("40");
  const [clAcademicYearId, setClAcademicYearId] = useState("");

  // Form states - Class Edit
  const [editClId, setEditClId] = useState("");
  const [editClCourseCode, setEditClCourseCode] = useState("");
  const [editClLecturerNidn, setEditClLecturerNidn] = useState("");
  const [editClRoomId, setEditClRoomId] = useState("");
  const [editClScheduleDay, setEditClScheduleDay] = useState("Senin");
  const [editClScheduleTime, setEditClScheduleTime] = useState("");
  const [editClQuota, setEditClQuota] = useState("40");
  const [editClAcademicYearId, setEditClAcademicYearId] = useState("");

  // Search and Pagination states
  const [studentSearch, setStudentSearch] = useState("");
  const [studentPage, setStudentPage] = useState(1);

  const [lecturerSearch, setLecturerSearch] = useState("");
  const [lecturerPage, setLecturerPage] = useState(1);

  const [courseSearch, setCourseSearch] = useState("");
  const [coursePage, setCoursePage] = useState(1);

  const [roomSearch, setRoomSearch] = useState("");
  const [roomPage, setRoomPage] = useState(1);

  const [classSearch, setClassSearch] = useState("");
  const [classPage, setClassPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const handleStudentSearchChange = (val: string) => {
    setStudentSearch(val);
    setStudentPage(1);
  };
  const handleLecturerSearchChange = (val: string) => {
    setLecturerSearch(val);
    setLecturerPage(1);
  };
  const handleCourseSearchChange = (val: string) => {
    setCourseSearch(val);
    setCoursePage(1);
  };
  const handleRoomSearchChange = (val: string) => {
    setRoomSearch(val);
    setRoomPage(1);
  };
  const handleClassSearchChange = (val: string) => {
    setClassSearch(val);
    setClassPage(1);
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.nama.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.nim.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.prodi && s.prodi.toLowerCase().includes(studentSearch.toLowerCase()))
    );
  }, [students, studentSearch]);

  const paginatedStudents = useMemo(() => {
    const start = (studentPage - 1) * ITEMS_PER_PAGE;
    return filteredStudents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredStudents, studentPage]);

  const studentTotalPages = Math.max(1, Math.ceil(filteredStudents.length / ITEMS_PER_PAGE));

  const filteredLecturers = useMemo(() => {
    return lecturers.filter(l => 
      l.nama.toLowerCase().includes(lecturerSearch.toLowerCase()) ||
      l.nidn.toLowerCase().includes(lecturerSearch.toLowerCase()) ||
      (l.email && l.email.toLowerCase().includes(lecturerSearch.toLowerCase())) ||
      (l.prodi && l.prodi.toLowerCase().includes(lecturerSearch.toLowerCase()))
    );
  }, [lecturers, lecturerSearch]);

  const paginatedLecturers = useMemo(() => {
    const start = (lecturerPage - 1) * ITEMS_PER_PAGE;
    return filteredLecturers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLecturers, lecturerPage]);

  const lecturerTotalPages = Math.max(1, Math.ceil(filteredLecturers.length / ITEMS_PER_PAGE));

  const filteredCourses = useMemo(() => {
    return courses.filter(c => 
      c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
      (c.prodi && c.prodi.toLowerCase().includes(courseSearch.toLowerCase()))
    );
  }, [courses, courseSearch]);

  const paginatedCourses = useMemo(() => {
    const start = (coursePage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, coursePage]);

  const courseTotalPages = Math.max(1, Math.ceil(filteredCourses.length / ITEMS_PER_PAGE));

  const filteredRooms = useMemo(() => {
    return rooms.filter(r => 
      r.name.toLowerCase().includes(roomSearch.toLowerCase()) ||
      r.id.toString().includes(roomSearch)
    );
  }, [rooms, roomSearch]);

  const paginatedRooms = useMemo(() => {
    const start = (roomPage - 1) * ITEMS_PER_PAGE;
    return filteredRooms.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRooms, roomPage]);

  const roomTotalPages = Math.max(1, Math.ceil(filteredRooms.length / ITEMS_PER_PAGE));

  const filteredClasses = useMemo(() => {
    return classes.filter(c => 
      c.courseCode.toLowerCase().includes(classSearch.toLowerCase()) ||
      (c.course?.name && c.course.name.toLowerCase().includes(classSearch.toLowerCase())) ||
      (c.lecturer?.name && c.lecturer.name.toLowerCase().includes(classSearch.toLowerCase())) ||
      (c.room?.name && c.room.name.toLowerCase().includes(classSearch.toLowerCase())) ||
      c.scheduleDay.toLowerCase().includes(classSearch.toLowerCase())
    );
  }, [classes, classSearch]);

  const paginatedClasses = useMemo(() => {
    const start = (classPage - 1) * ITEMS_PER_PAGE;
    return filteredClasses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredClasses, classPage]);

  const classTotalPages = Math.max(1, Math.ceil(filteredClasses.length / ITEMS_PER_PAGE));

  async function loadMasterData() {
    try {
      const studentData = await apiFetch<any[]>("/api/master/students");
      const courseData = await apiFetch<any[]>("/api/master/courses");
      const lecturerData = await apiFetch<any[]>("/api/master/lecturers");
      const deptData = await apiFetch<any[]>("/api/master/departments");
      const roomData = await apiFetch<any[]>("/api/master/rooms");
      const classData = await apiFetch<any[]>("/api/master/classes");
      const yearData = await apiFetch<any[]>("/api/master/academic-years");
      setStudents(studentData);
      setCourses(courseData);
      setLecturers(lecturerData);
      setDepartments(deptData);
      setRooms(roomData);
      setClasses(classData);
      setAcademicYears(yearData);

      if (yearData.length > 0) {
        const active = yearData.find((y: any) => y.isActive);
        const defaultYear = active ? active.id.toString() : yearData[0].id.toString();
        setClAcademicYearId(defaultYear);
      }
    } catch (err: any) {
      toast.error("Gagal memuat master data: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMasterData();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNim = mNim.trim();
    const trimmedName = mName.trim();
    const trimmedEmail = mEmail.trim();
    if (!trimmedNim || !trimmedName || !trimmedEmail || !mDeptId) {
      toast.error("Harap isi NIM, Nama, Email, dan Program Studi");
      return;
    }

    try {
      await apiFetch("/api/master/students", {
        method: "POST",
        body: JSON.stringify({
          nim: trimmedNim,
          name: trimmedName,
          email: trimmedEmail,
          departmentId: mDeptId,
          advisorId: mAdvisorId || null,
          alamat: mAlamat.trim() || null,
          thumbnail: mThumbnail.trim() || null
        })
      });
      toast.success("Mahasiswa berhasil ditambahkan!");
      setOpenStudentModal(false);
      // Reset forms
      setMNim("");
      setMName("");
      setMEmail("");
      setMDeptId("");
      setMAdvisorId("");
      setMAlamat("");
      setMThumbnail("");
      loadMasterData();
    } catch (err: any) {
      toast.error("Gagal menambahkan mahasiswa: " + err.message);
    }
  };

  const handleAddLecturer = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNidn = lNidn.trim();
    const trimmedName = lName.trim();
    const trimmedEmail = lEmail.trim();
    if (!trimmedNidn || !trimmedName || !trimmedEmail || !lDeptId) {
      toast.error("Harap isi NIDN, Nama, Email, dan Departemen");
      return;
    }

    try {
      await apiFetch("/api/master/lecturers", {
        method: "POST",
        body: JSON.stringify({
          nidn: trimmedNidn,
          name: trimmedName,
          email: trimmedEmail,
          departmentId: lDeptId,
          alamat: lAlamat.trim() || null,
          thumbnail: lThumbnail.trim() || null
        })
      });
      toast.success("Dosen berhasil ditambahkan!");
      setOpenLecturerModal(false);
      setLNidn("");
      setLName("");
      setLEmail("");
      setLDeptId("");
      setLAlamat("");
      setLThumbnail("");
      loadMasterData();
    } catch (err: any) {
      toast.error("Gagal menambahkan dosen: " + err.message);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cCode || !cName || !cCredits || !cType || !cDeptId) {
      toast.error("Harap isi semua kolom mata kuliah");
      return;
    }

    try {
      await apiFetch("/api/master/courses", {
        method: "POST",
        body: JSON.stringify({
          code: cCode,
          name: cName,
          credits: parseInt(cCredits),
          type: cType,
          departmentId: cDeptId
        })
      });
      toast.success("Mata kuliah berhasil ditambahkan!");
      setOpenCourseModal(false);
      setCCode("");
      setCName("");
      setCCredits("3");
      setCType("Wajib");
      setCDeptId("");
      loadMasterData();
    } catch (err: any) {
      toast.error("Gagal menambahkan mata kuliah: " + err.message);
    }
  };

  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMNim || !editMName || !editMEmail || !editMDeptId) {
      toast.error("Harap isi NIM, Nama, Email, dan Program Studi");
      return;
    }

    try {
      await apiFetch(`/api/master/students/${selectedStudentNim}`, {
        method: "PUT",
        body: JSON.stringify({
          newNim: editMNim,
          name: editMName,
          email: editMEmail,
          departmentId: editMDeptId,
          advisorId: editMAdvisorId === "none" ? null : (editMAdvisorId || null),
          password: editMPassword || undefined,
          alamat: editMAlamat.trim() || null,
          thumbnail: editMThumbnail.trim() || null
        })
      });
      toast.success("Mahasiswa berhasil diperbarui!");
      setOpenEditStudentModal(false);
      setEditMPassword("");
      loadMasterData();
    } catch (err: any) {
      toast.error("Gagal memperbarui mahasiswa: " + err.message);
    }
  };

  const handleEditLecturer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLName || !editLEmail || !editLDeptId) {
      toast.error("Harap isi Nama, Email, dan Departemen");
      return;
    }

    try {
      await apiFetch(`/api/master/lecturers/${editLNidn}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editLName,
          email: editLEmail,
          departmentId: editLDeptId,
          password: editLPassword || undefined,
          alamat: editLAlamat.trim() || null,
          thumbnail: editLThumbnail.trim() || null
        })
      });
      toast.success("Dosen berhasil diperbarui!");
      setOpenEditLecturerModal(false);
      setEditLPassword("");
      loadMasterData();
    } catch (err: any) {
      toast.error("Gagal memperbarui dosen: " + err.message);
    }
  };

  const handleEditCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCName || !editCCredits || !editCType || !editCDeptId) {
      toast.error("Harap isi semua kolom mata kuliah");
      return;
    }

    try {
      await apiFetch(`/api/master/courses/${editCCode}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editCName,
          credits: parseInt(editCCredits),
          type: editCType,
          departmentId: editCDeptId
        })
      });
      toast.success("Mata kuliah berhasil diperbarui!");
      setOpenEditCourseModal(false);
      loadMasterData();
    } catch (err: any) {
      toast.error("Gagal memperbarui mata kuliah: " + err.message);
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rName) {
      toast.error("Harap isi Nama Ruangan");
      return;
    }

    try {
      await apiFetch("/api/master/rooms", {
        method: "POST",
        body: JSON.stringify({ name: rName })
      });
      toast.success("Ruangan berhasil ditambahkan!");
      setOpenRoomModal(false);
      setRName("");
      loadMasterData();
    } catch (err: any) {
      toast.error("Gagal menambahkan ruangan: " + err.message);
    }
  };

  const handleEditRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRName) {
      toast.error("Harap isi Nama Ruangan");
      return;
    }

    try {
      await apiFetch(`/api/master/rooms/${editRId}`, {
        method: "PUT",
        body: JSON.stringify({ name: editRName })
      });
      toast.success("Ruangan berhasil diperbarui!");
      setOpenEditRoomModal(false);
      loadMasterData();
    } catch (err: any) {
      toast.error("Gagal memperbarui ruangan: " + err.message);
    }
  };

  const deleteRoom = async (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus ruangan ${name}?`)) {
      try {
        await apiFetch(`/api/master/rooms/${id}`, { method: "DELETE" });
        toast.success("Ruangan berhasil dihapus.");
        loadMasterData();
      } catch (err: any) {
        toast.error("Gagal menghapus ruangan: " + err.message);
      }
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clCourseCode || !clLecturerNidn || !clRoomId || !clScheduleDay || !clScheduleTime || !clQuota) {
      toast.error("Harap isi semua kolom jadwal kelas");
      return;
    }

    try {
      await apiFetch("/api/master/classes", {
        method: "POST",
        body: JSON.stringify({
          courseCode: clCourseCode,
          lecturerNidn: clLecturerNidn,
          roomId: clRoomId,
          scheduleDay: clScheduleDay,
          scheduleTime: clScheduleTime,
          quota: clQuota,
          academicYearId: clAcademicYearId
        })
      });
      toast.success("Jadwal kelas berhasil ditambahkan!");
      setOpenClassModal(false);
      setClScheduleTime("");
      loadMasterData();
    } catch (err: any) {
      toast.error("Gagal menambahkan kelas: " + err.message);
    }
  };

  const handleEditClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editClCourseCode || !editClLecturerNidn || !editClRoomId || !editClScheduleDay || !editClScheduleTime || !editClQuota) {
      toast.error("Harap isi semua kolom jadwal kelas");
      return;
    }

    try {
      await apiFetch(`/api/master/classes/${editClId}`, {
        method: "PUT",
        body: JSON.stringify({
          courseCode: editClCourseCode,
          lecturerNidn: editClLecturerNidn,
          roomId: editClRoomId,
          scheduleDay: editClScheduleDay,
          scheduleTime: editClScheduleTime,
          quota: editClQuota,
          academicYearId: editClAcademicYearId
        })
      });
      toast.success("Jadwal kelas berhasil diperbarui!");
      setOpenEditClassModal(false);
      loadMasterData();
    } catch (err: any) {
      toast.error("Gagal memperbarui kelas: " + err.message);
    }
  };

  const deleteClass = async (id: number, courseName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus jadwal kelas ${courseName}?`)) {
      try {
        await apiFetch(`/api/master/classes/${id}`, { method: "DELETE" });
        toast.success("Jadwal kelas berhasil dihapus.");
        loadMasterData();
      } catch (err: any) {
        toast.error("Gagal menghapus kelas: " + err.message);
      }
    }
  };

  const deleteStudent = async (nim: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus mahasiswa dengan NIM ${nim}?`)) {
      try {
        await apiFetch(`/api/master/students/${nim}`, { method: "DELETE" });
        toast.success("Mahasiswa berhasil dihapus.");
        loadMasterData();
      } catch (err: any) {
        toast.error("Gagal menghapus mahasiswa: " + err.message);
      }
    }
  };

  const deleteLecturer = async (nidn: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus dosen dengan NIDN ${nidn}?`)) {
      try {
        await apiFetch(`/api/master/lecturers/${nidn}`, { method: "DELETE" });
        toast.success("Dosen berhasil dihapus.");
        loadMasterData();
      } catch (err: any) {
        toast.error("Gagal menghapus dosen: " + err.message);
      }
    }
  };

  const deleteCourse = async (code: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus mata kuliah dengan kode ${code}?`)) {
      try {
        await apiFetch(`/api/master/courses/${code}`, { method: "DELETE" });
        toast.success("Mata kuliah berhasil dihapus.");
        loadMasterData();
      } catch (err: any) {
        toast.error("Gagal menghapus mata kuliah: " + err.message);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Memuat manajemen data…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manajemen Master Data</h1>
        <p className="text-muted-foreground text-sm">Pengelolaan data dasar oleh tenaga kependidikan</p>
      </div>
      <Tabs defaultValue="mahasiswa">
        <TabsList>
          <TabsTrigger value="mahasiswa">Mahasiswa</TabsTrigger>
          <TabsTrigger value="dosen">Dosen</TabsTrigger>
          <TabsTrigger value="matkul">Mata Kuliah</TabsTrigger>
          <TabsTrigger value="ruang">Ruangan</TabsTrigger>
          <TabsTrigger value="kelas">Jadwal Kelas</TabsTrigger>
        </TabsList>

        {/* Tab Mahasiswa */}
        <TabsContent value="mahasiswa">
          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center p-4 border-b">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari NIM, nama, atau prodi..."
                    value={studentSearch}
                    onChange={(e) => handleStudentSearchChange(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-sm text-muted-foreground">
                    {filteredStudents.length} record
                  </span>
                  <Button size="sm" onClick={() => setOpenStudentModal(true)}>
                    <Plus className="size-3 mr-1" /> Tambah
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead className="w-12">Profile</TableHead><TableHead>NIM</TableHead><TableHead>Nama</TableHead><TableHead>Alamat</TableHead><TableHead>Program Studi</TableHead><TableHead className="text-center">Angkatan</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {paginatedStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-6">
                          Tidak ada data mahasiswa.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedStudents.map((m) => (
                        <TableRow key={m.nim}>
                          <TableCell>
                            <img 
                              src={m.thumbnail || ""} 
                              className="size-8 rounded-full object-cover border bg-muted" 
                              onError={(e) => { 
                                e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.nama)}`; 
                              }} 
                              alt={m.nama}
                            />
                          </TableCell>
                          <TableCell className="font-mono text-xs">{m.nim}</TableCell>
                          <TableCell className="font-medium">{m.nama}</TableCell>
                          <TableCell className="text-sm max-w-[200px] truncate" title={m.alamat}>{m.alamat || <span className="text-muted-foreground">-</span>}</TableCell>
                          <TableCell>{m.prodi}</TableCell>
                          <TableCell className="text-center">{m.angkatan}</TableCell>
                          <TableCell><Badge variant={m.status === "Aktif" ? "secondary" : "outline"}>{m.status}</Badge></TableCell>
                          <TableCell className="text-right">
                            <Button size="icon" variant="ghost" onClick={() => {
                              setSelectedStudentNim(m.nim);
                              setEditMNim(m.nim);
                              setEditMName(m.nama);
                              setEditMEmail(m.email || "");
                              setEditMDeptId(m.departmentId?.toString() || "");
                              setEditMAdvisorId(m.advisorId || "none");
                              setEditMAlamat(m.alamat || "");
                              setEditMThumbnail(m.thumbnail || "");
                              setOpenEditStudentModal(true);
                            }}><Pencil className="size-3" /></Button>
                            <Button size="icon" variant="ghost" onClick={() => deleteStudent(m.nim)}><Trash2 className="size-3" /></Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                  Menampilkan {filteredStudents.length > 0 ? (studentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(studentPage * ITEMS_PER_PAGE, filteredStudents.length)} dari {filteredStudents.length} record
                </div>
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStudentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={studentPage === 1}
                  >
                    Sebelumnya
                  </Button>
                  <span className="text-sm font-medium">
                    Hal {studentPage} / {studentTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStudentPage((prev) => Math.min(prev + 1, studentTotalPages))}
                    disabled={studentPage === studentTotalPages}
                  >
                    Berikutnya
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Dosen */}
        <TabsContent value="dosen">
          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center p-4 border-b">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari NIDN, nama, email, atau prodi..."
                    value={lecturerSearch}
                    onChange={(e) => handleLecturerSearchChange(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-sm text-muted-foreground">
                    {filteredLecturers.length} record
                  </span>
                  <Button size="sm" onClick={() => setOpenLecturerModal(true)}>
                    <Plus className="size-3 mr-1" /> Tambah
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead className="w-12">Profile</TableHead><TableHead>NIDN</TableHead><TableHead>Nama</TableHead><TableHead>Alamat</TableHead><TableHead>Program Studi</TableHead><TableHead>Email</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {paginatedLecturers.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">Tidak ada data dosen.</TableCell></TableRow>
                    ) : (
                      paginatedLecturers.map((l) => (
                        <TableRow key={l.nidn}>
                          <TableCell>
                            <img 
                              src={l.thumbnail || ""} 
                              className="size-8 rounded-full object-cover border bg-muted" 
                              onError={(e) => { 
                                e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(l.nama)}`; 
                              }} 
                              alt={l.nama}
                            />
                          </TableCell>
                          <TableCell className="font-mono text-xs">{l.nidn}</TableCell>
                          <TableCell className="font-medium">{l.nama}</TableCell>
                          <TableCell className="text-sm max-w-[200px] truncate" title={l.alamat}>{l.alamat || <span className="text-muted-foreground">-</span>}</TableCell>
                          <TableCell>{l.prodi}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{l.email}</TableCell>
                          <TableCell className="text-right">
                            <Button size="icon" variant="ghost" onClick={() => {
                              setEditLNidn(l.nidn);
                              setEditLName(l.nama);
                              setEditLEmail(l.email || "");
                              setEditLDeptId(l.departmentId?.toString() || "");
                              setEditLAlamat(l.alamat || "");
                              setEditLThumbnail(l.thumbnail || "");
                              setOpenEditLecturerModal(true);
                            }}><Pencil className="size-3" /></Button>
                            <Button size="icon" variant="ghost" onClick={() => deleteLecturer(l.nidn)}><Trash2 className="size-3" /></Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                  Menampilkan {filteredLecturers.length > 0 ? (lecturerPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(lecturerPage * ITEMS_PER_PAGE, filteredLecturers.length)} dari {filteredLecturers.length} record
                </div>
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLecturerPage((prev) => Math.max(prev - 1, 1))}
                    disabled={lecturerPage === 1}
                  >
                    Sebelumnya
                  </Button>
                  <span className="text-sm font-medium">
                    Hal {lecturerPage} / {lecturerTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLecturerPage((prev) => Math.min(prev + 1, lecturerTotalPages))}
                    disabled={lecturerPage === lecturerTotalPages}
                  >
                    Berikutnya
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Mata Kuliah */}
        <TabsContent value="matkul">
          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center p-4 border-b">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari kode, nama matkul, atau prodi..."
                    value={courseSearch}
                    onChange={(e) => handleCourseSearchChange(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-sm text-muted-foreground">
                    {filteredCourses.length} record
                  </span>
                  <Button size="sm" onClick={() => setOpenCourseModal(true)}>
                    <Plus className="size-3 mr-1" /> Tambah
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Kode</TableHead><TableHead>Mata Kuliah</TableHead><TableHead className="text-center">SKS</TableHead><TableHead>Kategori</TableHead><TableHead>Program Studi</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {paginatedCourses.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6">Tidak ada data mata kuliah.</TableCell></TableRow>
                    ) : (
                      paginatedCourses.map((c) => (
                        <TableRow key={c.code}>
                          <TableCell className="font-mono text-xs">{c.code}</TableCell>
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell className="text-center font-semibold">{c.sks}</TableCell>
                          <TableCell><Badge variant={c.category === "Wajib" ? "default" : "secondary"}>{c.category}</Badge></TableCell>
                          <TableCell className="text-sm text-muted-foreground">{c.prodi}</TableCell>
                          <TableCell className="text-right">
                            <Button size="icon" variant="ghost" onClick={() => {
                              setEditCCode(c.code);
                              setEditCName(c.name);
                              setEditCCredits(c.sks?.toString() || "3");
                              setEditCType(c.category || "Wajib");
                              setEditCDeptId(c.departmentId?.toString() || "");
                              setOpenEditCourseModal(true);
                            }}><Pencil className="size-3" /></Button>
                            <Button size="icon" variant="ghost" onClick={() => deleteCourse(c.code)}><Trash2 className="size-3" /></Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                  Menampilkan {filteredCourses.length > 0 ? (coursePage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(coursePage * ITEMS_PER_PAGE, filteredCourses.length)} dari {filteredCourses.length} record
                </div>
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCoursePage((prev) => Math.max(prev - 1, 1))}
                    disabled={coursePage === 1}
                  >
                    Sebelumnya
                  </Button>
                  <span className="text-sm font-medium">
                    Hal {coursePage} / {courseTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCoursePage((prev) => Math.min(prev + 1, courseTotalPages))}
                    disabled={coursePage === courseTotalPages}
                  >
                    Berikutnya
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Ruangan */}
        <TabsContent value="ruang">
          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center p-4 border-b">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari ID atau nama ruangan..."
                    value={roomSearch}
                    onChange={(e) => handleRoomSearchChange(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-sm text-muted-foreground">
                    {filteredRooms.length} record
                  </span>
                  <Button size="sm" onClick={() => setOpenRoomModal(true)}>
                    <Plus className="size-3 mr-1" /> Tambah
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">ID</TableHead>
                      <TableHead>Nama Ruangan</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRooms.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-6">Tidak ada data ruangan.</TableCell>
                      </TableRow>
                    ) : (
                      paginatedRooms.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-mono text-xs">{r.id}</TableCell>
                          <TableCell className="font-medium">{r.name}</TableCell>
                          <TableCell className="text-right">
                            <Button size="icon" variant="ghost" onClick={() => {
                              setEditRId(r.id.toString());
                              setEditRName(r.name);
                              setOpenEditRoomModal(true);
                            }}><Pencil className="size-3" /></Button>
                            <Button size="icon" variant="ghost" onClick={() => deleteRoom(r.id, r.name)}><Trash2 className="size-3" /></Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                  Menampilkan {filteredRooms.length > 0 ? (roomPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(roomPage * ITEMS_PER_PAGE, filteredRooms.length)} dari {filteredRooms.length} record
                </div>
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRoomPage((prev) => Math.max(prev - 1, 1))}
                    disabled={roomPage === 1}
                  >
                    Sebelumnya
                  </Button>
                  <span className="text-sm font-medium">
                    Hal {roomPage} / {roomTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRoomPage((prev) => Math.min(prev + 1, roomTotalPages))}
                    disabled={roomPage === roomTotalPages}
                  >
                    Berikutnya
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Jadwal Kelas */}
        <TabsContent value="kelas">
          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center p-4 border-b">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari kode matkul, nama, dosen, ruangan, hari..."
                    value={classSearch}
                    onChange={(e) => handleClassSearchChange(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-sm text-muted-foreground">
                    {filteredClasses.length} record
                  </span>
                  <Button size="sm" onClick={() => {
                    if (courses.length > 0) setClCourseCode(courses[0].code);
                    if (lecturers.length > 0) setClLecturerNidn(lecturers[0].nidn);
                    if (rooms.length > 0) setClRoomId(rooms[0].id.toString());
                    setOpenClassModal(true);
                  }}><Plus className="size-3 mr-1" /> Tambah Kelas</Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode & Mata Kuliah</TableHead>
                      <TableHead>Dosen Pengampu</TableHead>
                      <TableHead>Tahun Akademik</TableHead>
                      <TableHead>Hari & Jam</TableHead>
                      <TableHead>Ruangan</TableHead>
                      <TableHead className="text-center">Kapasitas</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedClasses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-6">Tidak ada data jadwal kelas.</TableCell>
                      </TableRow>
                    ) : (
                      paginatedClasses.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>
                            <div className="font-semibold text-xs font-mono">{c.courseCode}</div>
                            <div className="font-medium text-sm">{c.course?.name}</div>
                          </TableCell>
                          <TableCell className="text-sm">{c.lecturer?.name}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{c.academicYear?.year}</TableCell>
                          <TableCell className="text-sm">{c.scheduleDay}, {c.scheduleTime}</TableCell>
                          <TableCell className="text-sm">{c.room?.name}</TableCell>
                          <TableCell className="text-center text-sm">
                            <span className="font-semibold">{c.quotaFilled}</span> / <span className="text-muted-foreground">{c.quota}</span>
                            <div className="text-[10px] text-muted-foreground">mahasiswa</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="icon" variant="ghost" onClick={() => {
                              setEditClId(c.id.toString());
                              setEditClCourseCode(c.courseCode);
                              setEditClLecturerNidn(c.lecturerNidn);
                              setEditClRoomId(c.roomId.toString());
                              setEditClScheduleDay(c.scheduleDay);
                              setEditClScheduleTime(c.scheduleTime);
                              setEditClQuota(c.quota.toString());
                              setEditClAcademicYearId(c.academicYearId.toString());
                              setOpenEditClassModal(true);
                            }}><Pencil className="size-3" /></Button>
                            <Button size="icon" variant="ghost" onClick={() => deleteClass(c.id, c.course?.name || c.courseCode)}><Trash2 className="size-3" /></Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                  Menampilkan {filteredClasses.length > 0 ? (classPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(classPage * ITEMS_PER_PAGE, filteredClasses.length)} dari {filteredClasses.length} record
                </div>
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setClassPage((prev) => Math.max(prev - 1, 1))}
                    disabled={classPage === 1}
                  >
                    Sebelumnya
                  </Button>
                  <span className="text-sm font-medium">
                    Hal {classPage} / {classTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setClassPage((prev) => Math.min(prev + 1, classTotalPages))}
                    disabled={classPage === classTotalPages}
                  >
                    Berikutnya
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* dialog modal tambah mahasiswa */}
      <Dialog open={openStudentModal} onOpenChange={setOpenStudentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Mahasiswa Baru</DialogTitle>
            <DialogDescription>Masukkan profil dasar mahasiswa. Akun login akan dibuat otomatis dengan password default: 123456.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="m_nim">NIM</Label>
              <Input id="m_nim" placeholder="contoh: 210411100127" value={mNim} onChange={(e) => setMNim(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="m_name">Nama Lengkap</Label>
              <Input id="m_name" placeholder="Nama Mahasiswa" value={mName} onChange={(e) => setMName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="m_email">Email</Label>
              <Input id="m_email" type="email" placeholder="mahasiswa@mhs.unira.ac.id" value={mEmail} onChange={(e) => setMEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="m_dept">Program Studi</Label>
              <Select value={mDeptId} onValueChange={setMDeptId}>
                <SelectTrigger id="m_dept"><SelectValue placeholder="Pilih Program Studi" /></SelectTrigger>
                <SelectContent>
                  {departments.map((d) => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="m_advisor">Dosen Wali (Optional)</Label>
              <Select value={mAdvisorId} onValueChange={setMAdvisorId}>
                <SelectTrigger id="m_advisor"><SelectValue placeholder="Pilih Dosen Wali" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Tanpa Dosen Wali —</SelectItem>
                  {lecturers.map((l) => <SelectItem key={l.nidn} value={l.nidn}>{l.nama}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="m_alamat">Alamat</Label>
              <Input id="m_alamat" placeholder="Alamat Lengkap" value={mAlamat} onChange={(e) => setMAlamat(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="m_thumbnail">Profile / Foto URL</Label>
              <Input id="m_thumbnail" placeholder="https://api.unira.ac.id/img/profil/mhs/..." value={mThumbnail} onChange={(e) => setMThumbnail(e.target.value)} />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpenStudentModal(false)}>Batal</Button>
              <Button type="submit">Simpan Mahasiswa</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* dialog modal tambah dosen */}
      <Dialog open={openLecturerModal} onOpenChange={setOpenLecturerModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Dosen Baru</DialogTitle>
            <DialogDescription>Masukkan profil dasar dosen baru. Akun login akan dibuat otomatis dengan password default: 123456.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddLecturer} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="l_nidn">NIDN</Label>
              <Input id="l_nidn" placeholder="contoh: 0712038509" value={lNidn} onChange={(e) => setLNidn(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="l_name">Nama Lengkap & Gelar</Label>
              <Input id="l_name" placeholder="Nama Dosen" value={lName} onChange={(e) => setLName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="l_email">Email Resmi</Label>
              <Input id="l_email" type="email" placeholder="dosen@unira.ac.id" value={lEmail} onChange={(e) => setLEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="l_dept">Departemen Program Studi</Label>
              <Select value={lDeptId} onValueChange={setLDeptId}>
                <SelectTrigger id="l_dept"><SelectValue placeholder="Pilih Departemen" /></SelectTrigger>
                <SelectContent>
                  {departments.map((d) => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="l_alamat">Alamat</Label>
              <Input id="l_alamat" placeholder="Alamat Lengkap" value={lAlamat} onChange={(e) => setLAlamat(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="l_thumbnail">Profile / Foto URL</Label>
              <Input id="l_thumbnail" placeholder="https://api.unira.ac.id/img/profil/dkr/..." value={lThumbnail} onChange={(e) => setLThumbnail(e.target.value)} />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpenLecturerModal(false)}>Batal</Button>
              <Button type="submit">Simpan Dosen</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* dialog modal tambah matkul */}
      <Dialog open={openCourseModal} onOpenChange={setOpenCourseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Mata Kuliah Baru</DialogTitle>
            <DialogDescription>Masukkan detail data mata kuliah baru.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCourse} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="c_code">Kode Mata Kuliah</Label>
              <Input id="c_code" placeholder="contoh: TIF506" value={cCode} onChange={(e) => setCCode(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="c_name">Nama Mata Kuliah</Label>
              <Input id="c_name" placeholder="Nama Matkul" value={cName} onChange={(e) => setCName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="c_credits">Bobot SKS</Label>
              <Select value={cCredits} onValueChange={setCCredits}>
                <SelectTrigger id="c_credits"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["1", "2", "3", "4", "6"].map((num) => <SelectItem key={num} value={num}>{num} SKS</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="c_type">Kategori</Label>
              <Select value={cType} onValueChange={setCType}>
                <SelectTrigger id="c_type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wajib">Wajib</SelectItem>
                  <SelectItem value="Pilihan">Pilihan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="c_dept">Program Studi Penyelenggara</Label>
              <Select value={cDeptId} onValueChange={setCDeptId}>
                <SelectTrigger id="c_dept"><SelectValue placeholder="Pilih Program Studi" /></SelectTrigger>
                <SelectContent>
                  {departments.map((d) => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpenCourseModal(false)}>Batal</Button>
              <Button type="submit">Simpan Mata Kuliah</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* dialog modal edit mahasiswa */}
      <Dialog open={openEditStudentModal} onOpenChange={setOpenEditStudentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Mahasiswa</DialogTitle>
            <DialogDescription>Perbarui profil dasar mahasiswa.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditStudent} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="edit_m_nim">NIM</Label>
              <Input id="edit_m_nim" placeholder="contoh: 210411100127" value={editMNim} onChange={(e) => setEditMNim(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_m_name">Nama Lengkap</Label>
              <Input id="edit_m_name" placeholder="Nama Mahasiswa" value={editMName} onChange={(e) => setEditMName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_m_email">Email</Label>
              <Input id="edit_m_email" type="email" placeholder="mahasiswa@mhs.unira.ac.id" value={editMEmail} onChange={(e) => setEditMEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_m_dept">Program Studi</Label>
              <Select value={editMDeptId} onValueChange={setEditMDeptId}>
                <SelectTrigger id="edit_m_dept"><SelectValue placeholder="Pilih Program Studi" /></SelectTrigger>
                <SelectContent>
                  {departments.map((d) => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_m_advisor">Dosen Wali (Optional)</Label>
              <Select value={editMAdvisorId} onValueChange={setEditMAdvisorId}>
                <SelectTrigger id="edit_m_advisor"><SelectValue placeholder="Pilih Dosen Wali" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Tanpa Dosen Wali —</SelectItem>
                  {lecturers.map((l) => <SelectItem key={l.nidn} value={l.nidn}>{l.nama}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_m_alamat">Alamat</Label>
              <Input id="edit_m_alamat" placeholder="Alamat Lengkap" value={editMAlamat} onChange={(e) => setEditMAlamat(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_m_thumbnail">Profile / Foto URL</Label>
              <Input id="edit_m_thumbnail" placeholder="https://api.unira.ac.id/img/profil/mhs/..." value={editMThumbnail} onChange={(e) => setEditMThumbnail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_m_password">Password Baru (Opsional)</Label>
              <Input id="edit_m_password" type="password" placeholder="Kosongkan jika tidak ingin diubah" value={editMPassword} onChange={(e) => setEditMPassword(e.target.value)} />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => { setOpenEditStudentModal(false); setEditMPassword(""); }}>Batal</Button>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* dialog modal edit dosen */}
      <Dialog open={openEditLecturerModal} onOpenChange={setOpenEditLecturerModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Dosen</DialogTitle>
            <DialogDescription>Perbarui profil dasar dosen.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditLecturer} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="edit_l_nidn">NIDN (Tidak dapat diubah)</Label>
              <Input id="edit_l_nidn" value={editLNidn} disabled />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_l_name">Nama Lengkap & Gelar</Label>
              <Input id="edit_l_name" placeholder="Nama Dosen" value={editLName} onChange={(e) => setEditLName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_l_email">Email Resmi</Label>
              <Input id="edit_l_email" type="email" placeholder="dosen@unira.ac.id" value={editLEmail} onChange={(e) => setEditLEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_l_dept">Departemen Program Studi</Label>
              <Select value={editLDeptId} onValueChange={setEditLDeptId}>
                <SelectTrigger id="edit_l_dept"><SelectValue placeholder="Pilih Departemen" /></SelectTrigger>
                <SelectContent>
                  {departments.map((d) => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_l_alamat">Alamat</Label>
              <Input id="edit_l_alamat" placeholder="Alamat Lengkap" value={editLAlamat} onChange={(e) => setEditLAlamat(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_l_thumbnail">Profile / Foto URL</Label>
              <Input id="edit_l_thumbnail" placeholder="https://api.unira.ac.id/img/profil/dkr/..." value={editLThumbnail} onChange={(e) => setEditLThumbnail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_l_password">Password Baru (Opsional)</Label>
              <Input id="edit_l_password" type="password" placeholder="Kosongkan jika tidak ingin diubah" value={editLPassword} onChange={(e) => setEditLPassword(e.target.value)} />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => { setOpenEditLecturerModal(false); setEditLPassword(""); }}>Batal</Button>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* dialog modal edit matkul */}
      <Dialog open={openEditCourseModal} onOpenChange={setOpenEditCourseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Mata Kuliah</DialogTitle>
            <DialogDescription>Perbarui detail data mata kuliah.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCourse} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="edit_c_code">Kode Mata Kuliah (Tidak dapat diubah)</Label>
              <Input id="edit_c_code" value={editCCode} disabled />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_c_name">Nama Mata Kuliah</Label>
              <Input id="edit_c_name" placeholder="Nama Matkul" value={editCName} onChange={(e) => setEditCName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_c_credits">Bobot SKS</Label>
              <Select value={editCCredits} onValueChange={setEditCCredits}>
                <SelectTrigger id="edit_c_credits"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["1", "2", "3", "4", "6"].map((num) => <SelectItem key={num} value={num}>{num} SKS</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_c_type">Kategori</Label>
              <Select value={editCType} onValueChange={setEditCType}>
                <SelectTrigger id="edit_c_type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wajib">Wajib</SelectItem>
                  <SelectItem value="Pilihan">Pilihan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_c_dept">Program Studi Penyelenggara</Label>
              <Select value={editCDeptId} onValueChange={setEditCDeptId}>
                <SelectTrigger id="edit_c_dept"><SelectValue placeholder="Pilih Program Studi" /></SelectTrigger>
                <SelectContent>
                  {departments.map((d) => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpenEditCourseModal(false)}>Batal</Button>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* dialog modal tambah ruangan */}
      <Dialog open={openRoomModal} onOpenChange={setOpenRoomModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Ruangan Baru</DialogTitle>
            <DialogDescription>Masukkan nama ruangan perkuliahan baru.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRoom} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="r_name">Nama Ruangan</Label>
              <Input id="r_name" placeholder="contoh: Ruang 301, Lab Komputer" value={rName} onChange={(e) => setRName(e.target.value)} />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpenRoomModal(false)}>Batal</Button>
              <Button type="submit">Simpan Ruangan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* dialog modal edit ruangan */}
      <Dialog open={openEditRoomModal} onOpenChange={setOpenEditRoomModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Ruangan</DialogTitle>
            <DialogDescription>Perbarui nama ruangan perkuliahan.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditRoom} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="edit_r_id">ID Ruangan (Tidak dapat diubah)</Label>
              <Input id="edit_r_id" value={editRId} disabled />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_r_name">Nama Ruangan</Label>
              <Input id="edit_r_name" placeholder="contoh: Ruang 301" value={editRName} onChange={(e) => setEditRName(e.target.value)} />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpenEditRoomModal(false)}>Batal</Button>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* dialog modal tambah jadwal kelas */}
      <Dialog open={openClassModal} onOpenChange={setOpenClassModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Jadwal Kelas Baru</DialogTitle>
            <DialogDescription>Hubungkan mata kuliah, dosen pengampu, waktu, dan ruangan perkuliahan.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddClass} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="cl_course">Mata Kuliah</Label>
              <Select value={clCourseCode} onValueChange={setClCourseCode}>
                <SelectTrigger id="cl_course"><SelectValue placeholder="Pilih Mata Kuliah" /></SelectTrigger>
                <SelectContent>
                  {courses.map((c) => <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="cl_lecturer">Dosen Pengampu</Label>
              <Select value={clLecturerNidn} onValueChange={setClLecturerNidn}>
                <SelectTrigger id="cl_lecturer"><SelectValue placeholder="Pilih Dosen Pengampu" /></SelectTrigger>
                <SelectContent>
                  {lecturers.map((l) => <SelectItem key={l.nidn} value={l.nidn}>{l.nama}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="cl_day">Hari</Label>
                <Select value={clScheduleDay} onValueChange={setClScheduleDay}>
                  <SelectTrigger id="cl_day"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="cl_time">Jam Kuliah</Label>
                <Input id="cl_time" placeholder="contoh: 08:00–10:30" value={clScheduleTime} onChange={(e) => setClScheduleTime(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="cl_room">Ruangan</Label>
                <Select value={clRoomId} onValueChange={setClRoomId}>
                  <SelectTrigger id="cl_room"><SelectValue placeholder="Pilih Ruang" /></SelectTrigger>
                  <SelectContent>
                    {rooms.map((r) => <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="cl_quota">Kuota Kelas</Label>
                <Input id="cl_quota" type="number" placeholder="40" value={clQuota} onChange={(e) => setClQuota(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="cl_year">Tahun Akademik</Label>
              <Select value={clAcademicYearId} onValueChange={setClAcademicYearId}>
                <SelectTrigger id="cl_year"><SelectValue placeholder="Pilih Tahun Akademik" /></SelectTrigger>
                <SelectContent>
                  {academicYears.map((y) => <SelectItem key={y.id} value={y.id.toString()}>{y.year} {y.isActive ? "(Aktif)" : ""}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpenClassModal(false)}>Batal</Button>
              <Button type="submit">Simpan Jadwal Kelas</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* dialog modal edit jadwal kelas */}
      <Dialog open={openEditClassModal} onOpenChange={setOpenEditClassModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Jadwal Kelas</DialogTitle>
            <DialogDescription>Perbarui relasi mata kuliah, dosen pengampu, waktu, dan ruangan.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditClass} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="edit_cl_course">Mata Kuliah</Label>
              <Select value={editClCourseCode} onValueChange={setEditClCourseCode}>
                <SelectTrigger id="edit_cl_course"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {courses.map((c) => <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_cl_lecturer">Dosen Pengampu</Label>
              <Select value={editClLecturerNidn} onValueChange={setEditClLecturerNidn}>
                <SelectTrigger id="edit_cl_lecturer"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {lecturers.map((l) => <SelectItem key={l.nidn} value={l.nidn}>{l.nama}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="edit_cl_day">Hari</Label>
                <Select value={editClScheduleDay} onValueChange={setEditClScheduleDay}>
                  <SelectTrigger id="edit_cl_day"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit_cl_time">Jam Kuliah</Label>
                <Input id="edit_cl_time" placeholder="contoh: 08:00–10:30" value={editClScheduleTime} onChange={(e) => setEditClScheduleTime(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="edit_cl_room">Ruangan</Label>
                <Select value={editClRoomId} onValueChange={setEditClRoomId}>
                  <SelectTrigger id="edit_cl_room"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {rooms.map((r) => <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit_cl_quota">Kuota Kelas</Label>
                <Input id="edit_cl_quota" type="number" placeholder="40" value={editClQuota} onChange={(e) => setEditClQuota(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit_cl_year">Tahun Akademik</Label>
              <Select value={editClAcademicYearId} onValueChange={setEditClAcademicYearId}>
                <SelectTrigger id="edit_cl_year"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {academicYears.map((y) => <SelectItem key={y.id} value={y.id.toString()}>{y.year} {y.isActive ? "(Aktif)" : ""}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpenEditClassModal(false)}>Batal</Button>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
