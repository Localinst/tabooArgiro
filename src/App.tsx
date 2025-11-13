import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Game from "./pages/Game";
import Rules from "./pages/Rules"
import NotFound from "./pages/NotFound";
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './context/LanguageContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HelmetProvider>
        <BrowserRouter>
          <LanguageProvider>
            <Routes>
              {/* Italian routes (default) */}
              <Route path="/" element={<Index />} />
              <Route path="/game" element={<Game />} />
              <Route path="/rules" element={<Rules />} />
              
              {/* English routes */}
              <Route path="/en" element={<Index />} />
              <Route path="/en/game" element={<Game />} />
              <Route path="/en/rules" element={<Rules />} />
              
              {/* Turkish routes */}
              <Route path="/tr" element={<Index />} />
              <Route path="/tr/game" element={<Game />} />
              <Route path="/tr/rules" element={<Rules />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LanguageProvider>
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
