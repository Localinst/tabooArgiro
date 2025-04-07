import { useEffect } from 'react';

interface AdSenseProps {
  style?: React.CSSProperties;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  slot?: string;
  className?: string;
}

const AdSense = ({ 
  style = { display: 'block' }, 
  format = 'auto',
  slot = '',
  className = '',
}: AdSenseProps) => {
  useEffect(() => {
    try {
      // Questo tipo va aggiunto solo se l'oggetto adsbygoogle non esiste già
      if (typeof window !== 'undefined') {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-2483563373320316"
        data-ad-slot={slot || 'auto'}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSense; 