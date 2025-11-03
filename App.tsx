import React from 'react';
import { ChatPanel } from './components/ChatPanel';

const App: React.FC = () => {
  const user1 = {
    name: "Alex",
    avatar: "https://i.pravatar.cc/150?u=alex",
    color: "cyan"
  };

  const user2 = {
    name: "Sam",
    avatar: "https://i.pravatar.cc/150?u=sam",
    color: "fuchsia"
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            WebRTC <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">Peer-to-Peer</span> Voice Chat
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            A two-sided P2P conversation powered by WebRTC. Press call to start.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ChatPanel 
            localUserName={user1.name} 
            remoteUserName={user2.name}
            avatarUrl={user1.avatar} 
            accentColor={user1.color}
          />
          <ChatPanel 
            localUserName={user2.name} 
            remoteUserName={user1.name}
            avatarUrl={user2.avatar} 
            accentColor={user2.color}
          />
        </main>
      </div>
    </div>
  );
};

export default App;