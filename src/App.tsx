import { useState } from 'react';
import { AppProvider } from './context/AppProvider';
import { Layout } from './components/Layout';
import { ScannerView } from './components/ScannerView';
import { ProfileView } from './components/ProfileView';
import { HistoryView } from './components/HistoryView';

function AppContent() {
  const [activeTab, setActiveTab] = useState('scanner');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'scanner' && <ScannerView />}
      {activeTab === 'profile' && <ProfileView />}
      {activeTab === 'history' && <HistoryView />}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
