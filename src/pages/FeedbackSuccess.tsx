import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const FeedbackSuccess: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-taboo-primary/5 to-taboo-accent/5 flex flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md mx-auto text-center bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-2xl">
            <CheckCircle className="w-8 h-8 mr-2 text-green-500" />
            Feedback Inviato!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Grazie per aver condiviso la tua opinione. Apprezziamo il tuo contributo!
          </p>
          <Link to="/">
            <Button variant="outline">Torna alla Home</Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
};

export default FeedbackSuccess; 