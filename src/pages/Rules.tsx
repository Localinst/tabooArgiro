import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Timer, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const Rules: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-taboo-primary/5 to-taboo-accent/5 flex flex-col items-center justify-start pt-12 md:pt-20 px-4">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-taboo-primary">
            Regole del Gioco Taboo
          </h1>
          <p className="text-xl text-muted-foreground">
            Scopri come giocare al classico gioco di società Taboo online
          </p>
        </header>

        {/* Pulsante torna indietro */}
        <div className="flex justify-start">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Torna alla home
            </Button>
          </Link>
        </div>

        {/* Regole principali */}
        <section className="space-y-6">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-2xl font-semibold text-taboo-primary">Come si Gioca</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-taboo-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Formazione delle Squadre</h3>
                    <p>Dividi i giocatori in due squadre. Ogni squadra sceglie un giocatore che dovrà far indovinare le parole.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Timer className="w-6 h-6 text-taboo-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Turni di Gioco</h3>
                    <p>Ogni turno dura 60 secondi. Il giocatore deve far indovinare alla propria squadra quante più parole possibile.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-taboo-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Parole Taboo</h3>
                    <p>Ogni carta ha una parola principale e 5 parole "taboo" che NON possono essere utilizzate per descrivere la parola principale.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <section className="text-center py-4">
          <Link to="/game">
            <Button 
              className="bg-taboo-primary hover:bg-taboo-primary/90 text-white text-xl py-6 px-8 shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Inizia a giocare a Taboo"
            >
              INIZIA A GIOCARE
            </Button>
          </Link>
        </section>
          {/* Punteggio */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-2xl font-semibold text-taboo-primary">Punteggio</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Punti Positivi</h3>
                    <p>+1 punto per ogni parola indovinata correttamente dalla squadra.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Punti Negativi</h3>
                    <p>-1 punto per ogni parola "taboo" utilizzata durante la descrizione.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consigli */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-2xl font-semibold text-taboo-primary">Consigli per Vincere</h2>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Usa sinonimi e descrizioni creative per evitare le parole taboo</li>
                <li>Concentrati sulla comunicazione non verbale quando possibile</li>
                <li>Mantieni un ritmo veloce per massimizzare il numero di parole indovinate</li>
                <li>Familiarizza con le carte per anticipare le parole taboo</li>
                <li>Lavora in squadra e ascolta i suggerimenti dei compagni</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* CTA per iniziare a giocare */}
        
      </div>
    </main>
  );
};

export default Rules; 