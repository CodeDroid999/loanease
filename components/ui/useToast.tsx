import { useState } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState<{ title: string; description: string; variant?: string } | null>(null);

  const showToast = (message: { title: string; description: string; variant?: string }) => {
    setToast(message);
    setTimeout(() => {
      setToast(null); // Hide toast after 3 seconds
    }, 3000);
  };

  return {
    toast,
    showToast,
  };
};
