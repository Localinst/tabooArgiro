
import React from 'react';
import { TabooCard } from '../data/words';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GameCardProps {
  card: TabooCard | null;
}

const GameCard: React.FC<GameCardProps> = ({ card }) => {
  if (!card) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-taboo-primary bg-taboo-card">
        <CardHeader className="text-center border-b border-taboo-primary/20">
          <CardTitle className="text-3xl font-bold text-taboo-primary">In attesa...</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Premi "Inizia" per cominciare il gioco!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-taboo-primary bg-taboo-card">
      <CardHeader className="text-center border-b border-taboo-primary/20 bg-taboo-primary/5">
        <CardTitle className="text-3xl font-bold text-taboo-primary">{card.word}</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-taboo-secondary">Parole Taboo:</h3>
          <div className="flex flex-wrap gap-2">
            {card.tabooWords.map((word, index) => (
              <Badge key={index} variant="outline" className="text-md py-1.5 px-3 bg-taboo-wrong/10 text-taboo-wrong border-taboo-wrong/30">
                {word}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
