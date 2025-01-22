import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center h-screen">      
      <div className="flex items-center justify-center w-full max-w-lg p-4 bg-white rounded">
        {children}
      </div>        
    </div>
  );
}