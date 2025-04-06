
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Instructions: React.FC = () => {
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-taboo-primary/10">
        <CardTitle className="text-taboo-primary">Come si gioca a Taboo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p>
          <strong>Obiettivo:</strong> Far indovinare ai propri compagni di squadra il maggior numero possibile di parole senza usare le "parole taboo".
        </p>
        
        <Separator className="my-2" />
        
        <ol className="list-decimal list-inside space-y-2">
          <li>I giocatori si dividono in due o più squadre.</li>
          <li>Un giocatore descrive la parola in cima alla carta senza usare le parole taboo elencate sotto.</li>
          <li>I compagni di squadra cercano di indovinare la parola entro il tempo stabilito.</li>
          <li>La squadra guadagna un punto per ogni parola indovinata correttamente.</li>
          <li>Se il giocatore usa una parola taboo, la squadra perde un punto.</li>
          <li>Le squadre si alternano finché non si decide di terminare il gioco.</li>
        </ol>
        
        <Separator className="my-2" />
        
        <p>
          <strong>Vince:</strong> La squadra con il maggior numero di punti alla fine del gioco!
        </p>
      </CardContent>
    </Card>
  );
};

export default Instructions;
