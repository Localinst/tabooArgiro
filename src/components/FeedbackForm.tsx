import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1385311305015103619/PQELLvCKthltt-9vjy3WTyNNIJ1cFQ4SGJa2BHstePTLHppJRS19vQs_VMBop9HcJfn-';

const FeedbackForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const content = email ? `Email: ${email}\n${message}` : message;
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setSuccess(true);
        setEmail('');
        setMessage('');
      } else {
        setError('Errore durante l\'invio. Riprova.');
      }
    } catch (err) {
      setError('Errore di rete.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Lascia un Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="text-green-600 text-center py-4">Grazie per il feedback!</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email (opzionale, per eventuale risposta)</Label>
                <Input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="message">Messaggio</Label>
                <Textarea id="message" name="message" required value={message} onChange={e => setMessage(e.target.value)} />
              </div>
              {error && <div className="text-red-600 text-center">{error}</div>}
              <Button type="submit" className="w-full bg-taboo-primary hover:bg-taboo-primary/90" disabled={loading}>
                {loading ? 'Invio...' : 'Invia Feedback'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackForm; 