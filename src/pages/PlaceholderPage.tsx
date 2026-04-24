import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
}

const PlaceholderPage = ({ title, description, icon: Icon = Construction }: PlaceholderPageProps) => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center"
        >
          <Icon className="w-10 h-10 text-primary" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-foreground"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground max-w-md"
        >
          {description || 'Fitur ini sedang dalam tahap pengembangan. Akan segera tersedia.'}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="px-4 py-2 rounded-full bg-warning/10 text-warning text-sm font-medium"
        >
          🚧 Coming Soon
        </motion.div>
      </div>
    </Layout>
  );
};

export default PlaceholderPage;
