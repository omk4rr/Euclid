import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Activity, 
  Database, 
  Download, 
  BarChart3,
  Settings,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Pipeline', href: '/pipeline', icon: Activity },
  { name: 'Dataset', href: '/dataset', icon: Database },
  { name: 'Download', href: '/download', icon: Download },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b border-border bg-background-subtle/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow-primary">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gradient">Euclid</span>
                <span className="text-xs text-foreground-subtle -mt-1">Data Intelligence</span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-glow-primary"
                        : "text-foreground-muted hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Settings */}
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Settings className="w-5 h-5 text-foreground-muted" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-6 py-8"
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background-subtle/90 backdrop-blur-xl border-t border-border">
        <div className="flex items-center justify-around py-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-foreground-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};