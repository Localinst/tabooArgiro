import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const FeedbackForm: React.FC = () => {
  // Nota: Netlify gestisce l'invio del form tramite l'attributo 'netlify'
  // Non è necessario gestire lo stato o l'invio con JavaScript qui.

  return (
    <Card className="w-full max-w-md mx-auto mt-8 bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Lascia un Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <form name="feedback" method="POST" data-netlify="true">
          {/* Campo nascosto richiesto da Netlify */}
          <input type="hidden" name="form-name" value="feedback" />

          <div className="space-y-4">
           
            <div>
              <Label htmlFor="email">Email (opzionale, per eventuale risposta)</Label>
              <Input id="email" name="email" type="email" />
            </div>
            <div>
              <Label htmlFor="message">Messaggio</Label>
              <Textarea id="message" name="message" required />
            </div>
            <Button type="submit" className="w-full bg-taboo-primary hover:bg-taboo-primary/90">
              Invia Feedback
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm; 