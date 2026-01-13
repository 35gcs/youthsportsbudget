import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import Dashboard from './pages/Dashboard';
import Seasons from './pages/Seasons';
import Teams from './pages/Teams';
import Expenses from './pages/Expenses';
import Revenues from './pages/Revenues';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';
import QuickActions from './pages/QuickActions';
import Transparency from './pages/Transparency';
import Import from './pages/Import';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/seasons" element={<Seasons />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/revenues" element={<Revenues />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/quick-actions" element={<QuickActions />} />
          <Route path="/transparency" element={<Transparency />} />
          <Route path="/import" element={<Import />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
