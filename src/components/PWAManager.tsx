import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'sonner';

export const PWAManager = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  useEffect(() => {
    if (offlineReady) {
      toast.success('App siap digunakan offline!', {
        description: 'Aplikasi telah berhasil dipasang di perangkat Anda.',
        duration: 5000,
      });
    }
    if (needRefresh) {
      toast('Update tersedia!', {
        description: 'Ada versi baru aplikasi kasir, klik update untuk memuat ulang.',
        action: {
          label: 'UPDATE',
          onClick: () => updateServiceWorker(true),
        },
        duration: Infinity,
      });
    }
  }, [offlineReady, needRefresh, updateServiceWorker]);

  return null;
};
