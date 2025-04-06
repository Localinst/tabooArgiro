
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Index: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-b from-taboo-primary/5 to-taboo-accent/5 flex flex-col items-center justify-center">
      <div className="text-center px-4 w-full max-w-sm mx-auto">
        <h1 className="text-7xl font-bold text-taboo-primary mb-16 animate-bounce-light">
          TABOO
        </h1>
        
        <Link to="/game" className="w-full block">
          <Button 
            className="w-full bg-taboo-primary hover:bg-taboo-primary/90 text-white text-xl py-6"
          >
            INIZIA
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
