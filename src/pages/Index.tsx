
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Instructions from '@/components/Instructions';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-taboo-primary/5 to-taboo-accent/5">
      <div className="container max-w-5xl px-4 py-12 mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-taboo-primary mb-4 animate-bounce-light">
            Taboo
            <span className="text-taboo-secondary">Word</span>
            <span className="text-taboo-accent">Wizard</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Il classico gioco di parole dove dovrai far indovinare parole ai tuoi amici senza usare le parole "taboo". 
            Dividi i giocatori in squadre e sfidatevi a chi ottiene il punteggio più alto!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <Instructions />
          </div>
          <Card className="shadow-md bg-taboo-primary/5">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-taboo-primary">Caratteristiche del gioco:</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-taboo-secondary">✓</span>
                  <span>Più di 15 parole con relative parole taboo</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-taboo-secondary">✓</span>
                  <span>Timer per ogni turno di gioco</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-taboo-secondary">✓</span>
                  <span>Sistema di punteggio automatico</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-taboo-secondary">✓</span>
                  <span>Gestione delle squadre personalizzabile</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-taboo-secondary">✓</span>
                  <span>Interfaccia intuitiva e facile da usare</span>
                </li>
              </ul>
              
              <div className="pt-6">
                <Link to="/game">
                  <Button className="w-full bg-taboo-primary hover:bg-taboo-primary/90 text-white text-lg py-6">
                    Inizia a Giocare!
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center text-gray-500 text-sm">
          <p>© 2025 TabooWordWizard - Divertiti con i tuoi amici!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
