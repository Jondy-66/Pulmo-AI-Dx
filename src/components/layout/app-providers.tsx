"use client";

import React from 'react';

// This component can be expanded with ThemeProvider, QueryClientProvider, etc. if needed.
export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
