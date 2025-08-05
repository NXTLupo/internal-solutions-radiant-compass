import React from 'react';

interface ElegantAppLayoutProps {
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
  rightPanel: React.ReactNode;
}

export const ElegantAppLayout: React.FC<ElegantAppLayoutProps> = ({ sidebar, mainContent, rightPanel }) => {
  return (
    <div className="h-screen w-screen flex bg-background" style={{ color: 'var(--color-text-primary)' }}>
      {/* Sidebar */}
      <aside 
        className="w-20 flex flex-col items-center py-6 bg-surface"
        style={{ borderRight: '1px solid var(--color-border)' }}
      >
        {sidebar}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-12">
        {mainContent}
      </main>

      {/* Right Panel */}
      <aside 
        className="w-80 bg-surface p-8"
        style={{ borderLeft: '1px solid var(--color-border)' }}
      >
        {rightPanel}
      </aside>
    </div>
  );
};
