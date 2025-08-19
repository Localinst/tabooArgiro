import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Instructions: React.FC = () => {
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-taboo-primary/10">
        <CardTitle className="text-taboo-primary">How to Play Taboo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p>
          <strong>Objective:</strong> Get your teammates to guess as many words as possible without using the "taboo" words.
        </p>
        
        <Separator className="my-2" />
        
        <ol className="list-decimal list-inside space-y-2">
          <li>Players split into two or more teams.</li>
          <li>One player describes the word at the top of the card without using the taboo words listed below.</li>
          <li>Teammates try to guess the word within the time limit.</li>
          <li>The team earns a point for each correctly guessed word.</li>
          <li>If the player uses a taboo word, the team loses a point.</li>
          <li>Teams alternate until the game ends.</li>
        </ol>
        
        <Separator className="my-2" />
        
        <p>
          <strong>Winner:</strong> The team with the most points at the end of the game!
        </p>
      </CardContent>
    </Card>
  );
};

export default Instructions;
