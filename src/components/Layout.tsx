
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MessageSquare, Clock, Plus, Menu, FileText, BookText, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarMenu,
  SidebarMenuSection,
  SidebarMenuItem,
  SidebarMenuLink,
  Button
} from '@heroui/react';

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
      <Sidebar 
        expanded={isSidebarOpen} 
        className={cn(
          "fixed md:static inset-y-0 left-0 z-20 transition-all duration-300 ease-in-out transform",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <SidebarHeader>
          <h1 className="text-xl font-bold text-gradient">Discovery AI</h1>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuSection label="Principal">
              <SidebarMenuItem active={isActive('/')}>
                <SidebarMenuLink as={Link} to="/">
                  <MessageSquare size={18} />
                  <span>Chat</span>
                </SidebarMenuLink>
              </SidebarMenuItem>
              
              <SidebarMenuItem active={isActive('/history')}>
                <SidebarMenuLink as={Link} to="/history">
                  <Clock size={18} />
                  <span>Histórico</span>
                </SidebarMenuLink>
              </SidebarMenuItem>
            </SidebarMenuSection>
            
            <SidebarMenuSection label="Conhecimento">
              <SidebarMenuItem active={isActive('/documents')}>
                <SidebarMenuLink as={Link} to="/documents">
                  <FileText size={18} />
                  <span>Documentos</span>
                </SidebarMenuLink>
              </SidebarMenuItem>
              
              <SidebarMenuItem active={isActive('/requirements')}>
                <SidebarMenuLink as={Link} to="/requirements">
                  <BookText size={18} />
                  <span>Requisitos</span>
                </SidebarMenuLink>
              </SidebarMenuItem>
            </SidebarMenuSection>
            
            <SidebarMenuSection label="Sistema">
              <SidebarMenuItem active={isActive('/infrastructure')}>
                <SidebarMenuLink as={Link} to="/infrastructure">
                  <Database size={18} />
                  <span>Infraestrutura</span>
                </SidebarMenuLink>
              </SidebarMenuItem>
            </SidebarMenuSection>
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter>
          <Button 
            colorScheme="primary" 
            className="w-full"
            leftIcon={<Plus size={18} />}
          >
            Nova conversa
          </Button>
        </SidebarFooter>
      </Sidebar>
      
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
