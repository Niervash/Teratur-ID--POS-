import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChatbotFloating } from './ChatbotFloating';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
  hideHeader?: boolean;
}

export const Layout = ({ children, hideSidebar = false, hideHeader = false }: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  // Auto-collapse sidebar on tablet screens (768px to 1280px)
  useEffect(() => {
    if (hideSidebar) return;
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1280) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1280) {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hideSidebar]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      {!hideSidebar && (
        <Sidebar 
          isCollapsed={isCollapsed} 
          onToggle={toggleSidebar}
          isOpenMobile={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />
      )}
      
      <motion.div
        initial={false}
        animate={{ 
          marginLeft: isMobile || hideSidebar ? 0 : (isCollapsed ? 72 : 260) 
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen flex flex-col"
      >
        {!hideHeader && (
          <Header 
            onOpenMobile={() => setIsMobileOpen(true)} 
            isCollapsed={isCollapsed}
            onToggleSidebar={toggleSidebar}
          />
        )}
        <main className={`flex-1 overflow-x-hidden ${hideHeader ? 'p-0' : 'p-4 md:p-6'}`}>
          <div className={`${hideHeader ? 'max-w-full' : 'max-w-[1600px]'} mx-auto h-full`}>
            {children}
          </div>
        </main>
      </motion.div>
      {!hideSidebar && <ChatbotFloating />}
    </div>
  );
};
