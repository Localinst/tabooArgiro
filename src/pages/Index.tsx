import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle, Users, Timer, Trophy, BookOpen, Info } from 'lucide-react';
import FeedbackForm from '@/components/FeedbackForm';

const Index: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <main className="min-h-screen bg-gradient-to-b from-taboo-primary/5 to-taboo-accent/5 flex flex-col items-center justify-start pt-12 md:pt-20 pb-12">
      <div className="text-center px-4 w-full max-w-2xl mx-auto space-y-8">
        {/* Logo e Titolo */}
        <header className="space-y-4">
          <h1 className="text-7xl font-bold text-taboo-primary">
            PAROLE TABOO
          </h1>
          <p className="text-xl text-muted-foreground">
            Il gioco di società che mette alla prova la tua capacità di descrivere le parole!
          </p>
        </header>

        {/* Caratteristiche del gioco */}
        <section aria-label="Caratteristiche del gioco" className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-8">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className={`flex flex-col items-center space-y-0.5 ${isMobile ? 'p-1' : 'p-4'}`}>
              <Users className={`${isMobile ? 'w-4 h-4' : 'w-8 h-8'} text-taboo-primary`} aria-hidden="true" />
              <h2 className={`font-semibold ${isMobile ? 'text-xs' : ''}`}>Gioco di Squadra</h2>
              <p className={`${isMobile ? 'text-[10px]' : 'text-sm'} text-muted-foreground`}>Gioca con amici e famiglia</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className={`flex flex-col items-center space-y-0.5 ${isMobile ? 'p-1' : 'p-4'}`}>
              <Timer className={`${isMobile ? 'w-4 h-4' : 'w-8 h-8'} text-taboo-primary`} aria-hidden="true" />
              <h2 className={`font-semibold ${isMobile ? 'text-xs' : ''}`}>Contro il Tempo</h2>
              <p className={`${isMobile ? 'text-[10px]' : 'text-sm'} text-muted-foreground`}>Turni cronometrati</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className={`flex flex-col items-center space-y-0.5 ${isMobile ? 'p-1' : 'p-4'}`}>
              <Trophy className={`${isMobile ? 'w-4 h-4' : 'w-8 h-8'} text-taboo-primary`} aria-hidden="true" />
              <h2 className={`font-semibold ${isMobile ? 'text-xs' : ''}`}>Competizione</h2>
              <p className={`${isMobile ? 'text-[10px]' : 'text-sm'} text-muted-foreground`}>Vinci punti e round</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className={`flex flex-col items-center space-y-0.5 ${isMobile ? 'p-1' : 'p-4'}`}>
              <PlayCircle className={`${isMobile ? 'w-4 h-4' : 'w-8 h-8'} text-taboo-primary`} aria-hidden="true" />
              <h2 className={`font-semibold ${isMobile ? 'text-xs' : ''}`}>Divertimento</h2>
              <p className={`${isMobile ? 'text-[10px]' : 'text-sm'} text-muted-foreground`}>Risata garantita</p>
            </CardContent>
          </Card>
        </section>

        {/* Pulsante Inizia */}
        <section aria-label="Inizia a giocare">
          <Link to="/game" className="w-full block">
            <Button 
              className="w-full bg-taboo-primary hover:bg-taboo-primary/90 text-white text-xl py-6 shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Inizia a giocare a Parole Taboo"
            >
              INIZIA A GIOCARE
            </Button>
          </Link>
        </section>

        {/* Regole rapide */}
        <section aria-label="Regole del gioco" className="mt-8">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Come si gioca?</h2>
              <div className="space-y-2 text-left">
                <p>1. Dividi i giocatori in due squadre</p>
                <p>2. A turno, un giocatore deve far indovinare una parola alla sua squadra</p>
                <p>3. Non puoi usare le parole "taboo" indicate sulla carta</p>
                <p>4. Guadagna punti per ogni parola indovinata</p>
                <p>5. Perdi punti se usi una parola taboo</p>
              </div>
              <Link to="/rules" className="inline-flex items-center mt-4 text-taboo-primary hover:text-taboo-primary/80">
                <BookOpen className="w-4 h-4 mr-2" />
                Leggi le regole complete
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Link utili */}
        <section aria-label="Link utili" className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-8">
          <Link to="/rules" className="inline-flex items-center justify-center p-4 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-white/70 transition-colors">
            <BookOpen className="w-5 h-5 mr-2 text-taboo-primary" />
            Regole complete
          </Link>
        </section>

        {/* Inserisci il componente FeedbackForm qui */}
        
      </div>
    </main>
  );
};

export default Index;
