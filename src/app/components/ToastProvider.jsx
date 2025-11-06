'use client';

import { Toaster } from 'sonner';

export function ToastProvider({ children }) {
  return (
    <>
      {children}
      <Toaster 
        position="top-center"
        richColors
        closeButton
        expand={true}
      />
    </>
  );
}