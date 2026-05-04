import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Building2,
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Briefcase,
  Users,
  UserCheck,
} from "lucide-react";

// URL Google Apps Script yang akan menerima data form
const GOOGLE_SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxWHS7OeWpAHWg5JomPQWV9NxcUX7siHpC94zDz2Qr9jzFwX4ZErJ7q0fUU-UFdUW5g/exec';

export const DemoFormSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    businessField: "",
    role: "",
    employeeCount: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Simpan ke local storage (Opsional, untuk backup)
      const requests = JSON.parse(
        localStorage.getItem("teratur_demo_requests") || "[]",
      );
      const newRequest = {
        ...formData,
        id: Date.now().toString(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(
        "teratur_demo_requests",
        JSON.stringify([...requests, newRequest]),
      );

      // 2. Kirim ke Google Sheets
      await fetch(GOOGLE_SHEET_WEBAPP_URL, {
        method: "POST",
        mode: "no-cors", // Penting untuk Google Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Berikan feedback ke user
      toast.success(
        "Permintaan demo berhasil dikirim! Tim TERATUR.ID akan segera menghubungi Anda.",
      );
      setFormData({
        businessName: "",
        ownerName: "",
        email: "",
        phone: "",
        businessField: "",
        role: "",
        employeeCount: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Gagal mengirim permintaan. Silakan coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -skew-y-6 transform origin-top-left -z-10" />

      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Mulai Transformasi Bisnis F&B Anda
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg"
            >
              Daftar sekarang untuk mendapatkan sesi demo gratis dan konsultasi
              dengan tim ahli kami.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-card border border-border/50 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-sm"
          >
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="ownerName"
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-primary" /> Nama Anda
                  </Label>
                  <Input
                    id="ownerName"
                    placeholder="Nama lengkap Anda"
                    required
                    value={formData.ownerName}
                    onChange={(e) =>
                      setFormData({ ...formData, ownerName: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" /> Nomor WhatsApp /
                    HP
                  </Label>
                  <Input
                    id="phone"
                    placeholder="0812xxxx"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" /> Alamat Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@bisnisanda.com"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="businessName"
                    className="flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4 text-primary" /> Nama Bisnis
                  </Label>
                  <Input
                    id="businessName"
                    placeholder="Contoh: Kopi Teratur"
                    required
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" /> Pilih Bidang
                    Usaha
                  </Label>
                  <Select
                    value={formData.businessField}
                    onValueChange={(value) =>
                      setFormData({ ...formData, businessField: value })
                    }
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Pilih bidang usaha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coffee_shop">Coffee Shop</SelectItem>
                      <SelectItem value="restaurant">
                        Restoran / Rumah Makan
                      </SelectItem>
                      <SelectItem value="retail">Retail / Toko</SelectItem>
                      <SelectItem value="bakery">Bakery / Kue</SelectItem>
                      <SelectItem value="food_truck">
                        Food Truck / Booth
                      </SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-primary" /> Peran Anda
                    Saat Ini
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Pilih peran anda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Pemilik Bisnis</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="employee">Karyawan</SelectItem>
                      <SelectItem value="student">Mahasiswa / Umum</SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" /> Jumlah Karyawan
                  </Label>
                  <Select
                    value={formData.employeeCount}
                    onValueChange={(value) =>
                      setFormData({ ...formData, employeeCount: value })
                    }
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Pilih jumlah karyawan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1 - 5 orang</SelectItem>
                      <SelectItem value="6-20">6 - 20 orang</SelectItem>
                      <SelectItem value="21-50">21 - 50 orang</SelectItem>
                      <SelectItem value=">50">Lebih dari 50 orang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" /> Kebutuhan
                    Anda
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Ceritakan apa yang Anda butuhkan untuk bisnis Anda..."
                    rows={2}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="bg-background/50 resize-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all rounded-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2 italic">
                      Mengirim...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Ikuti Demo Sekarang <Send className="w-5 h-5" />
                    </span>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Dengan mengirim form ini, Anda menyetujui Ketentuan Layanan
                  dan Kebijakan Privasi Teratur.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
