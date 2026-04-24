
import { motion } from 'framer-motion';
import { Eye, Scan, Zap, Cpu, ArrowRight } from 'lucide-react';

const roadmapItems = [
  {
    phase: "Phase 1: Current",
    title: "Financial Management",
    description: "Fokus pada optimalisasi HPP, manajemen inventori, dan analisis profitabilitas kafe secara real-time.",
    status: "Active",
    icon: Zap,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    phase: "Phase 2: Upcoming",
    title: "Smart Quality Control",
    description: "Integrasi IoT Scanner untuk mendeteksi kualitas bahan baku secara otomatis sebelum masuk ke gudang.",
    status: "In Development",
    icon: Scan,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10"
  },
  {
    phase: "Phase 3: Future",
    title: "AI Smart Vision",
    description: "Monitoring area produksi menggunakan Computer Vision untuk memastikan standar sanitasi, APD, dan SOP.",
    status: "Planned",
    icon: Eye,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  }
];

export const RoadmapSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/20">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Visi Masa Depan Teratur
          </motion.h2>
          <p className="text-muted-foreground">
            Kami memulai dengan manajemen keuangan yang kuat, dan sedang melangkah menuju ekosistem produksi pintar yang terintegrasi penuh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />
          
          {roadmapItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative z-10 bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${item.bgColor} ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-7 h-7" />
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${item.bgColor} ${item.color}`}>
                  {item.phase}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground italic">
                  • {item.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {item.description}
              </p>
              
              {item.status === "Active" && (
                <div className="flex items-center text-primary text-sm font-semibold gap-1">
                  Sudah Siap Digunakan <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
