import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Home } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="relative">
          <h1 className="text-[120px] font-black text-primary/10 tracking-tighter">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-20 h-20 text-primary animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Halaman Tidak Ditemukan</h2>
          <p className="text-muted-foreground">
            Sepertinya halaman yang Anda cari telah dipindahkan atau tidak ada dalam sistem Teratur.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild variant="outline" className="rounded-xl h-12 gap-2">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" /> Kembali Sebelumnya
            </Link>
          </Button>
          <Button asChild className="rounded-xl h-12 gap-2 shadow-lg shadow-primary/20">
            <Link to="/dashboard">
              <Home className="w-4 h-4" /> Pergi ke Dashboard
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
