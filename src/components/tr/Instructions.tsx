import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Instructions: React.FC = () => {
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-taboo-primary/10">
        <CardTitle className="text-taboo-primary">Taboo Nasıl Oynanır</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p>
          <strong>Hedef:</strong> Takım arkadaşlarının "yasak" kelimeleri kullanmadan mümkün olduğunca çok kelimeyi tahmin etmesini sağlayın.
        </p>
        
        <Separator className="my-2" />
        
        <ol className="list-decimal list-inside space-y-2">
          <li>Oyuncular iki veya daha fazla takıma ayrılır.</li>
          <li>Bir oyuncu kartta üstte yazılı olan kelimeyi, aşağıda listelenen yasak kelimeleri kullanmadan açıklar.</li>
          <li>Takım arkadaşları, zaman sınırı içinde kelimeyi tahmin etmeye çalışırlar.</li>
          <li>Takım, doğru tahmin edilen her kelime için bir puan kazanır.</li>
          <li>Oyuncu yasak bir kelime kullanırsa, takım bir puan kaybeder.</li>
          <li>Oyun bitene kadar takımlar sırayla oyunlarını oynarlar.</li>
        </ol>
        
        <Separator className="my-2" />
        
        <p>
          <strong>Kazanan:</strong> Oyun sonunda en fazla puana sahip olan takım!
        </p>
      </CardContent>
    </Card>
  );
};

export default Instructions;
