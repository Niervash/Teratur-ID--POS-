import { useEffect } from 'react';
import { products, ingredients, members, employees } from '@/data/mockData';

/**
 * DataInitializer component
 * Responsible for seeding localStorage with initial data if empty.
 * This enables offline-first capabilities for the application.
 */
export const DataInitializer = () => {
  useEffect(() => {
    // Helper to check and seed
    const seedIfEmpty = (key: string, data: any) => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`[Offline] Seeded ${key} to localStorage`);
      }
    };

    seedIfEmpty('teratur_products', products);
    seedIfEmpty('teratur_ingredients', ingredients);
    seedIfEmpty('teratur_members', members);
    seedIfEmpty('teratur_employees', employees);
    
    // Initialize shift definitions if not exists
    if (!localStorage.getItem('teratur_shift_defs')) {
      localStorage.setItem('teratur_shift_defs', '[]');
    }

    // Initialize employee schedules if not exists
    if (!localStorage.getItem('teratur_employee_schedules')) {
      localStorage.setItem('teratur_employee_schedules', '[]');
    }

    // Initialize sales tracker for shift if not exists
    if (!localStorage.getItem('teratur_today_sales')) {
      localStorage.setItem('teratur_today_sales', '0');
    }

    // Initialize shift history if not exists
    if (!localStorage.getItem('teratur_shift_history')) {
      localStorage.setItem('teratur_shift_history', '[]');
    }

    // Initialize audit logs if not exists
    if (!localStorage.getItem('teratur_audit_logs')) {
      localStorage.setItem('teratur_audit_logs', '[]');
    }
  }, []);

  return null; // This component doesn't render anything
};
