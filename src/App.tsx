import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import Layout from "@/components/Layout";
import Chat from "@/pages/Chat";
import History from "@/pages/History";
import Documents from "@/pages/Documents";
import Requirements from "@/pages/Requirements";
import Infrastructure from "@/pages/Infrastructure";
import Login from "@/pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { isAuthenticated } from "./lib/api";

const queryClient = new QueryClient();

const App = () => {
  return (
    <HeroUIProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={
                isAuthenticated() ? <Navigate to="/" /> : <Login />
              } />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Chat />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <Layout>
                    <History />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/documents" element={
                <ProtectedRoute>
                  <Layout>
                    <Documents />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/requirements" element={
                <ProtectedRoute>
                  <Layout>
                    <Requirements />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/infrastructure" element={
                <ProtectedRoute>
                  <Layout>
                    <Infrastructure />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HeroUIProvider>
  );
};

export default App;
