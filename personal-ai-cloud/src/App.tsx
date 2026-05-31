import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { ChatView } from './components/ChatView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';

export type ViewState = 'dashboard' | 'chat' | 'knowledge';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  return (
    <div className="flex h-screen overflow-hidden bg-background selection:bg-primary/30">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <div className="flex-1 flex flex-col ml-[280px]">
        <TopBar currentView={currentView} />
        <main className="flex-1 overflow-hidden relative mt-16">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'chat' && <ChatView />}
          {currentView === 'knowledge' && <KnowledgeBaseView />}
        </main>
      </div>
      
      {/* Global FAB */}
      <button 
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-tr from-primary to-secondary rounded-full shadow-lg shadow-primary/20 flex items-center justify-center text-on-primary hover:scale-110 active:scale-95 transition-all z-[100]"
        onClick={() => setCurrentView('chat')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9.933 13.935 4.103-4.104"/><path d="m6.604 17.265 8.204-8.206a2.828 2.828 0 1 0-4-4l-8.204 8.206a2.828 2.828 0 1 0 4 4z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/></svg>
      </button>
    </div>
  );
}
