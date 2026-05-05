
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Users, UserPlus, Search, Phone, 
  Mail, Star, Trash2, Edit2, Download 
} from 'lucide-react';
import { toast } from 'sonner';
import { Modal, Form, Input as AntdInput, Select } from 'antd';

import { members as initialMembers } from '@/data/mockData';

export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  points: number;
  level: 'Bronze' | 'Silver' | 'Gold';
  joinDate: string;
}

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const stored = localStorage.getItem('teratur_members');
    if (stored) {
      setMembers(JSON.parse(stored));
    } else {
      setMembers(initialMembers);
      localStorage.setItem('teratur_members', JSON.stringify(initialMembers));
    }
  }, []);

  const saveMembers = (data: Member[]) => {
    setMembers(data);
    localStorage.setItem('teratur_members', JSON.stringify(data));
  };

  const handleOpenModal = (member?: Member) => {
    if (member) {
      setEditingMember(member);
      form.setFieldsValue(member);
    } else {
      setEditingMember(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingMember) {
        const updatedMembers = members.map(m => 
          m.id === editingMember.id ? { ...m, ...values } : m
        );
        saveMembers(updatedMembers);
        toast.success(`Data member ${values.name} berhasil diperbarui!`);
      } else {
        const newMember: Member = {
          id: `mem-${Date.now()}`,
          name: values.name,
          phone: values.phone,
          email: values.email || '',
          points: 0,
          level: 'Bronze',
          joinDate: new Date().toISOString().split('T')[0]
        };
        const updated = [newMember, ...members];
        saveMembers(updated);
        toast.success(`Member ${values.name} berhasil didaftarkan!`);
      }
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus member ${name}?`)) {
      const updated = members.filter(m => m.id !== id);
      saveMembers(updated);
      toast.success("Member berhasil dihapus");
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.phone.includes(searchTerm)
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manajemen Member</h1>
            <p className="text-muted-foreground text-sm">Kelola data pelanggan setia dan program loyalitas.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl gap-2"><Download className="w-4 h-4" /> Export</Button>
            <Button onClick={() => handleOpenModal()} className="rounded-xl gap-2 shadow-lg shadow-primary/20">
              <UserPlus className="w-4 h-4" /> Tambah Member
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-primary/10 rounded-2xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Total Member</p>
                <p className="text-2xl font-black">{members.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/5 border-amber-500/10 rounded-2xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Point Terkumpul</p>
                <p className="text-2xl font-black">{members.reduce((s, m) => s + m.points, 0)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card border border-border/50 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border/30 bg-secondary/10 flex items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Cari nama atau no. HP..." 
                className="pl-9 h-11 rounded-xl bg-background border-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/5">
                <TableHead className="pl-6">Nama Member</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Tgl Bergabung</TableHead>
                <TableHead className="text-right pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((m) => (
                <TableRow key={m.id} className="hover:bg-secondary/5 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {m.name.charAt(0)}
                      </div>
                      <span className="font-bold">{m.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" /> {m.phone}
                      </div>
                      {m.email && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" /> {m.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${
                      m.level === 'Gold' ? 'bg-amber-500' : m.level === 'Silver' ? 'bg-slate-400' : 'bg-orange-400'
                    } text-white border-none rounded-lg font-bold text-[10px]`}>
                      {m.level.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="font-black text-sm">{m.points}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{m.joinDate}</TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenModal(m)}
                        className="h-8 w-8 text-muted-foreground"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id, m.name)} className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal
        title={editingMember ? "Edit Data Member" : "Daftarkan Member Baru"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText={editingMember ? "Simpan Perubahan" : "Simpan Member"}
        centered
        className="rounded-2xl"
      >
        <Form form={form} layout="vertical" className="pt-4">
          <Form.Item name="name" label="Nama Lengkap" rules={[{ required: true, message: 'Nama wajib diisi' }]}>
            <AntdInput className="h-11 rounded-xl" placeholder="E.g. Budi Santoso" />
          </Form.Item>
          <Form.Item name="phone" label="Nomor WhatsApp" rules={[{ required: true, message: 'No HP wajib diisi' }]}>
            <AntdInput className="h-11 rounded-xl" placeholder="E.g. 08123456789" />
          </Form.Item>
          <Form.Item name="email" label="Email (Opsional)">
            <AntdInput className="h-11 rounded-xl" placeholder="E.g. budi@email.com" />
          </Form.Item>
          {editingMember && (
            <Form.Item name="level" label="Level Member">
              <Select className="h-11 rounded-xl">
                <Select.Option value="Bronze">BRONZE</Select.Option>
                <Select.Option value="Silver">SILVER</Select.Option>
                <Select.Option value="Gold">GOLD</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </Layout>
  );
};

export default Members;
