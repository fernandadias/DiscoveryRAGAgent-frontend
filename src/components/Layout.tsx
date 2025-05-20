
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Plus, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@heroui/react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile menu button */}
      <button
        className={cn(
          "md:hidden fixed top-4 left-4 z-30 p-2 rounded-md transition-all",
          isSidebarOpen ? "left-[240px]" : "left-4",
        )}
        onClick={toggleSidebar}
      >
        <Menu size={20} className="text-white" />
      </button>

      {/* Overlay when sidebar is open on mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed md:static inset-y-0 left-0 z-20 transition-all duration-300 ease-in-out transform w-60 bg-sidebar border-r border-sidebar-border",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-gradient">Discovery AI</h1>
        </div>
        
        <div className="flex flex-col h-full p-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-xs text-gray-500 uppercase tracking-wider">Principal</div>
              <div className="space-y-1">
                <Link to="/" className={cn(
                  "flex items-center space-x-2 p-2 rounded-md transition-colors",
                  isActive('/') ? "bg-sidebar-accent text-white" : "hover:bg-sidebar-accent/50"
                )}>
                  <span>Chat</span>
                </Link>
                
                <Link to="/history" className={cn(
                  "flex items-center space-x-2 p-2 rounded-md transition-colors",
                  isActive('/history') ? "bg-sidebar-accent text-white" : "hover:bg-sidebar-accent/50"
                )}>
                  <span>Histórico</span>
                </Link>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs text-gray-500 uppercase tracking-wider">Conhecimento</div>
              <div className="space-y-1">
                <Link to="/documents" className={cn(
                  "flex items-center space-x-2 p-2 rounded-md transition-colors",
                  isActive('/documents') ? "bg-sidebar-accent text-white" : "hover:bg-sidebar-accent/50"
                )}>
                  <span>Documentos</span>
                </Link>
                
                <Link to="/requirements" className={cn(
                  "flex items-center space-x-2 p-2 rounded-md transition-colors",
                  isActive('/requirements') ? "bg-sidebar-accent text-white" : "hover:bg-sidebar-accent/50"
                )}>
                  <span>Requisitos</span>
                </Link>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs text-gray-500 uppercase tracking-wider">Sistema</div>
              <div className="space-y-1">
                <Link to="/infrastructure" className={cn(
                  "flex items-center space-x-2 p-2 rounded-md transition-colors",
                  isActive('/infrastructure') ? "bg-sidebar-accent text-white" : "hover:bg-sidebar-accent/50"
                )}>
                  <span>Infraestrutura</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-sidebar-border mt-auto">
          <Button 
            color="primary" 
            className="w-full flex items-center gap-2"
          >
            <Plus size={18} />
            Nova conversa
          </Button>
        </div>
      </div>
      
      {/* Main content - Removed margin left */}
      <main className={cn(
        "flex-1 flex flex-col overflow-hidden transition-all duration-300"
      )}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
