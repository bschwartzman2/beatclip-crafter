
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, Plus, Search } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="py-4 px-6 sm:px-8 border-b backdrop-blur-lg bg-background/70 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Music className="h-6 w-6" />
            <span className="font-semibold text-lg">BeatSync</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" current={location.pathname}>Home</NavLink>
            <NavLink to="/create" current={location.pathname}>Create</NavLink>
            <NavLink to="/templates" current={location.pathname}>Templates</NavLink>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/create" 
              className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover-scale"
            >
              <Plus className="h-4 w-4" />
              <span>New Template</span>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 pt-16 relative">
        {children}
      </main>
      
      <footer className="py-8 px-6 border-t">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2023 BeatSync. All rights reserved.</p>
        </div>
      </footer>
      
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t py-3 px-6 flex items-center justify-around z-50">
        <MobileNavLink to="/" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>} 
          current={location.pathname}
        />
        <MobileNavLink to="/create" icon={<Plus className="h-6 w-6" />} current={location.pathname} />
        <MobileNavLink to="/templates" icon={<Search className="h-6 w-6" />} current={location.pathname} />
      </nav>
    </div>
  );
};

const NavLink = ({ to, children, current }: { to: string; children: React.ReactNode; current: string }) => {
  const isActive = current === to || (to !== '/' && current.startsWith(to));
  
  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors hover:text-primary ${
        isActive ? 'text-primary' : 'text-muted-foreground'
      }`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, icon, current }: { to: string; icon: React.ReactNode; current: string }) => {
  const isActive = current === to || (to !== '/' && current.startsWith(to));
  
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center p-2 rounded-md ${
        isActive ? 'text-primary' : 'text-muted-foreground'
      }`}
    >
      {icon}
    </Link>
  );
};

export default Layout;
