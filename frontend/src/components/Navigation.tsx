import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Trophy,
  Zap,
  Eye,
  Upload,
} from 'lucide-react';

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/seasons', label: 'Seasons', icon: Calendar },
    { path: '/teams', label: 'Teams', icon: Users },
    { path: '/quick-actions', label: 'Quick Entry', icon: Zap },
    { path: '/budgets', label: 'Budgets', icon: DollarSign },
    { path: '/expenses', label: 'Expenses', icon: TrendingDown },
    { path: '/revenues', label: 'Revenues', icon: TrendingUp },
    { path: '/transparency', label: 'Transparency', icon: Eye },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/import', label: 'Import', icon: Upload },
  ];

  return (
    <nav className="bg-bg-secondary border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-sports-primary" />
              <span className="text-xl font-bold text-white">Sports Budget</span>
            </Link>
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-sports-primary/20 text-sports-primary'
                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
