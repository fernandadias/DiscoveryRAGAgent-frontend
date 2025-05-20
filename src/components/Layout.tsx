
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MessageSquare, Clock, Plus, Menu, FileText, BookText, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

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
          "fixed md:static inset-y-0 left-0 z-20 w-60 bg-secondary/30 border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out transform",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "glass-morphism md:glass-morphism"
        )}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold text-gradient">Discovery AI</h1>
        </div>
        
        <div className="mt-6 px-3">
          {/* Seção principal */}
          <div className="mb-6">
            <h2 className="text-xs uppercase tracking-wider text-white/50 px-3 mb-2">Principal</h2>
            <Link 
              to="/" 
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-all",
                isActive('/') 
                  ? "bg-primary/20 text-white" 
                  : "text-white/70 hover:bg-secondary/50 hover:text-white"
              )}
            >
              <MessageSquare size={18} />
              <span>Chat</span>
            </Link>
            
            <Link 
              to="/history" 
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all mb-1",
                isActive('/history') 
                  ? "bg-primary/20 text-white" 
                  : "text-white/70 hover:bg-secondary/50 hover:text-white"
              )}
            >
              <Clock size={18} />
              <span>Histórico</span>
            </Link>
          </div>
          
          {/* Seção de conhecimento */}
          <div className="mb-6">
            <h2 className="text-xs uppercase tracking-wider text-white/50 px-3 mb-2">Conhecimento</h2>
            <Link 
              to="/documents" 
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all mb-1",
                isActive('/documents') 
                  ? "bg-primary/20 text-white" 
                  : "text-white/70 hover:bg-secondary/50 hover:text-white"
              )}
            >
              <FileText size={18} />
              <span>Documentos</span>
            </Link>
            
            <Link 
              to="/requirements" 
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all mb-1",
                isActive('/requirements') 
                  ? "bg-primary/20 text-white" 
                  : "text-white/70 hover:bg-secondary/50 hover:text-white"
              )}
            >
              <BookText size={18} />
              <span>Requisitos</span>
            </Link>
          </div>
          
          {/* Seção técnica */}
          <div>
            <h2 className="text-xs uppercase tracking-wider text-white/50 px-3 mb-2">Sistema</h2>
            <Link 
              to="/infrastructure" 
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all",
                isActive('/infrastructure') 
                  ? "bg-primary/20 text-white" 
                  : "text-white/70 hover:bg-secondary/50 hover:text-white"
              )}
            >
              <Database size={18} />
              <span>Infraestrutura</span>
            </Link>
          </div>
        </div>
        
        <div className="mt-auto p-4">
          <button 
            className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary/80 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <Plus size={18} />
            <span>Nova conversa</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <main className={cn(
        "flex-1 flex flex-col overflow-hidden transition-all duration-300",
        isSidebarOpen && !isMobile ? "ml-60" : "ml-0"
      )}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
