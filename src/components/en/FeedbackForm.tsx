import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1403803463074320514/MzKEH66k3oHAM2GcOuxf9Dtbn_79pZW5pHu0pP217lsHPkZjUVfmRvvqMObUZMJQK1JF';

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
        setError('Error sending feedback. Please try again.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Leave Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="text-green-600 text-center py-4">Thank you for your feedback!</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email (optional, for response if needed)</Label>
                <Input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  required 
                  value={message} 
                  onChange={e => setMessage(e.target.value)}
                  maxLength={100}
                />
                <div className="text-sm text-gray-500 mt-1">{message.length}/100 characters</div>
              </div>
              {error && <div className="text-red-600 text-center">{error}</div>}
              <Button type="submit" className="w-full bg-taboo-primary hover:bg-taboo-primary/90" disabled={loading}>
                {loading ? 'Sending...' : 'Send Feedback'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
