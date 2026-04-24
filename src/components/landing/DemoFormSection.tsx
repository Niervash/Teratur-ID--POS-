import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Building2, User, Mail, Phone, MessageSquare, Send } from 'lucide-react';

export const DemoFormSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const requests = JSON.parse(localStorage.getItem('teratur_demo_requests') || '[]');
      const newRequest = {
        ...formData,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('teratur_demo_requests', JSON.stringify([...requests, newRequest]));
      
      setIsSubmitting(false);
      toast.success('Permintaan demo berhasil dikirim! Tim TERATUR.ID akan segera menghubungi Anda.');
      setFormData({
        businessName: '',
        ownerName: '',
        email: '',
        phone: '',
        message: ''
      });
    }, 1500);
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
              Daftar sekarang untuk mendapatkan sesi demo gratis dan konsultasi dengan tim ahli kami.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-card border border-border/50 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-sm"
          >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" /> Nama Bisnis
                  </Label>
                  <Input 
                    id="businessName" 
                    placeholder="Contoh: Kopi Teratur" 
                    required 
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Nama Pemilik / Manager
                  </Label>
                  <Input 
                    id="ownerName" 
                    placeholder="Nama lengkap Anda" 
                    required 
                    value={formData.ownerName}
                    onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" /> Email Bisnis
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="email@bisnisanda.com" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" /> Nomor WhatsApp
                  </Label>
                  <Input 
                    id="phone" 
                    placeholder="0812xxxx" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" /> Pesan atau Kebutuhan Khusus
                  </Label>
                  <Textarea 
                    id="message" 
                    placeholder="Ceritakan sedikit tentang bisnis Anda..." 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
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
                      Kirim Permintaan Demo <Send className="w-5 h-5" />
                    </span>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Dengan mengirim form ini, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi Teratur.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
