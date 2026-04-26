import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, Clock, Plus, Trash2, 
  ChevronLeft, ChevronRight, User, Settings2 
} from 'lucide-react';
import { toast } from 'sonner';
import { Modal, Form, Input, TimePicker, Select } from 'antd';
import dayjs from 'dayjs';

interface ShiftDefinition {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  color: string;
}

interface EmployeeSchedule {
  id: string;
  employeeId: string;
  employeeName: string;
  shiftId: string;
  date: string;
}

const defaultShifts: ShiftDefinition[] = [
  { id: 's1', name: 'Shift Pagi', startTime: '08:00', endTime: '16:00', color: 'bg-blue-500' },
  { id: 's2', name: 'Shift Siang', startTime: '12:00', endTime: '20:00', color: 'bg-orange-500' },
  { id: 's3', name: 'Shift Malam', startTime: '16:00', endTime: '00:00', color: 'bg-indigo-500' },
];

const JadwalKerja = () => {
  const [shifts, setShifts] = useState<ShiftDefinition[]>([]);
  const [schedules, setSchedules] = useState<EmployeeSchedule[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [assignForm] = Form.useForm();

  useEffect(() => {
    const storedShifts = localStorage.getItem('teratur_shift_defs');
    const storedSchedules = localStorage.getItem('teratur_employee_schedules');
    const storedEmployees = localStorage.getItem('teratur_employees');

    setShifts(storedShifts ? JSON.parse(storedShifts) : defaultShifts);
    setSchedules(storedSchedules ? JSON.parse(storedSchedules) : []);
    setEmployees(storedEmployees ? JSON.parse(storedEmployees) : []);
    
    if (!storedShifts) localStorage.setItem('teratur_shift_defs', JSON.stringify(defaultShifts));
  }, []);

  const saveShifts = (data: ShiftDefinition[]) => {
    setShifts(data);
    localStorage.setItem('teratur_shift_defs', JSON.stringify(data));
  };

  const saveSchedules = (data: EmployeeSchedule[]) => {
    setSchedules(data);
    localStorage.setItem('teratur_employee_schedules', JSON.stringify(data));
  };

  const handleAddShift = (values: any) => {
    const newShift: ShiftDefinition = {
      id: `shift-${Date.now()}`,
      name: values.name,
      startTime: values.times[0].format('HH:mm'),
      endTime: values.times[1].format('HH:mm'),
      color: 'bg-primary'
    };
    saveShifts([...shifts, newShift]);
    toast.success("Shift baru berhasil dibuat");
    setIsShiftModalOpen(false);
    form.resetFields();
  };

  const handleAssignShift = (values: any) => {
    const emp = employees.find(e => e.id === values.employeeId);
    const newAssign: EmployeeSchedule = {
      id: `assign-${Date.now()}`,
      employeeId: values.employeeId,
      employeeName: emp?.name || 'Karyawan',
      shiftId: values.shiftId,
      date: values.date.format('YYYY-MM-DD')
    };
    saveSchedules([...schedules, newAssign]);
    toast.success(`Jadwal ditambahkan untuk ${emp?.name}`);
    setIsAssignModalOpen(false);
    assignForm.resetFields();
  };

  const deleteSchedule = (id: string) => {
    saveSchedules(schedules.filter(s => s.id !== id));
    toast.success("Jadwal dihapus");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Jadwal Kerja</h1>
            <p className="text-muted-foreground text-sm">Atur shift dan penugasan harian karyawan.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsShiftModalOpen(true)} className="rounded-xl gap-2">
              <Settings2 className="w-4 h-4" /> Atur Shift
            </Button>
            <Button onClick={() => setIsAssignModalOpen(true)} className="rounded-xl gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" /> Tambah Jadwal
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shift Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="rounded-[2rem] border-none shadow-sm bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Daftar Shift</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {shifts.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/20 border border-border/10">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${s.color}`} />
                      <div>
                        <p className="text-sm font-bold">{s.name}</p>
                        <p className="text-[10px] text-muted-foreground">{s.startTime} - {s.endTime}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Schedule Table */}
          <div className="lg:col-span-2">
            <Card className="rounded-[2rem] border-none shadow-sm bg-card overflow-hidden">
              <div className="p-6 border-b border-border/30 flex items-center justify-between">
                <h3 className="font-bold">Jadwal Mendatang</h3>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><ChevronLeft className="w-4 h-4" /></Button>
                  <span className="text-sm font-bold">April 2026</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><ChevronRight className="w-4 h-4" /></Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/5">
                    <TableHead className="pl-6">Tanggal</TableHead>
                    <TableHead>Karyawan</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead className="text-right pr-6">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">Belum ada penugasan jadwal.</TableCell>
                    </TableRow>
                  ) : schedules.map((s) => {
                    const shift = shifts.find(sh => sh.id === s.shiftId);
                    return (
                      <TableRow key={s.id}>
                        <TableCell className="pl-6 py-4 font-medium text-xs">
                          {dayjs(s.date).format('DD MMM YYYY')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                              {s.employeeName.charAt(0)}
                            </div>
                            <span className="text-sm font-bold">{s.employeeName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${shift?.color || 'bg-slate-500'} text-white border-none rounded-lg text-[9px]`}>
                            {shift?.name} ({shift?.startTime})
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteSchedule(s.id)}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal Atur Shift */}
      <Modal
        title="Pengaturan Shift"
        open={isShiftModalOpen}
        onCancel={() => setIsShiftModalOpen(false)}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleAddShift} className="pt-4">
          <Form.Item name="name" label="Nama Shift" rules={[{ required: true }]}>
            <Input placeholder="E.g. Shift Pagi" className="h-11 rounded-xl" />
          </Form.Item>
          <Form.Item name="times" label="Waktu (Mulai - Selesai)" rules={[{ required: true }]}>
            <TimePicker.RangePicker format="HH:mm" className="w-full h-11 rounded-xl" />
          </Form.Item>
          <Button type="submit" className="w-full h-11 rounded-xl mt-4">Tambah Shift</Button>
        </Form>
      </Modal>

      {/* Modal Penugasan Jadwal */}
      <Modal
        title="Tambah Penugasan Jadwal"
        open={isAssignModalOpen}
        onCancel={() => setIsAssignModalOpen(false)}
        footer={null}
        centered
      >
        <Form form={assignForm} layout="vertical" onFinish={handleAssignShift} className="pt-4">
          <Form.Item name="employeeId" label="Pilih Karyawan" rules={[{ required: true }]}>
            <Select className="h-11 w-full" placeholder="Pilih Karyawan">
              {employees.map(e => <Select.Option key={e.id} value={e.id}>{e.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="shiftId" label="Pilih Shift" rules={[{ required: true }]}>
            <Select className="h-11 w-full" placeholder="Pilih Shift">
              {shifts.map(s => <Select.Option key={s.id} value={s.id}>{s.name} ({s.startTime}-{s.endTime})</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Tanggal Tugas" rules={[{ required: true }]}>
            <Calendar
              // This is antd calendar, we might want simple DatePicker for form
              mode="month"
              className="hidden" // Hiding calendar if using simple Picker
            />
            {/* Using simple Input for mock if needed, but let's use proper picker if available */}
            <Input type="date" className="h-11 rounded-xl" />
          </Form.Item>
          <Button type="submit" className="w-full h-11 rounded-xl mt-4">Simpan Jadwal</Button>
        </Form>
      </Modal>
    </Layout>
  );
};

export default JadwalKerja;
