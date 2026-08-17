import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, MessageSquare, Heart, ShieldAlert, CheckCircle2, User } from 'lucide-react';

export default function VoiceAssistantAgent({ 
  medications, 
  onValidateSlot, 
  onAddSymptom, 
  speakText, 
  timeSlots 
}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'ai',
      text: "Bonjour Joseph ! C'est votre assistant médical CarePill. Comment vous sentez-vous aujourd'hui ?",
      time: 'Maintenant'
    }
  ]);

  // Speech Recognition setup
  useEffect(() => {
    let recognition = null;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);
      recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e);
        setListening(false);
      };

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleUserSpeech(text);
      };
    }

    return () => {
      if (recognition) recognition.abort();
    };
  }, []);

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.start();
      setListening(true);

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleUserSpeech(text);
      };
      recognition.onend = () => setListening(false);
    } else {
      // Fallback for browsers without SpeechRecognition API
      const fakeText = prompt("Entrez votre message vocal pour l'Assistant IA (ex: J'ai pris mes cachets du soir / J'ai de la fièvre):");
      if (fakeText) handleUserSpeech(fakeText);
    }
  };

  const handleUserSpeech = (userText) => {
    const timeNow = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    // Add user message to chat
    setChatLog(prev => [...prev, { sender: 'user', text: userText, time: timeNow }]);

    const lower = userText.toLowerCase();
    let reply = "";

    // Intention 1: Validation of pills
    if (lower.includes('pris') || lower.includes('fait') || lower.includes('valider')) {
      reply = "Formidable Joseph ! J'ai validé votre créneau de médicaments dans le pilulier et prévenu Thomas.";
      onValidateSlot('mar', 'Matin');
    } 
    // Intention 2: Symptom or Pain reported
    else if (lower.includes('mal') || lower.includes('fièvre') || lower.includes('vertige') || lower.includes('fatigué')) {
      reply = "J'ai bien noté ce que vous ressentez. J'inscris ce symptôme dans votre journal de santé pour le Dr. Laurent et j'envoie une alerte douce à Thomas.";
      onAddSymptom({
        id: Date.now(),
        date: `Aujourd'hui, ${timeNow}`,
        type: 'Sensation Signalée',
        detail: userText,
        status: 'warning'
      });
    } 
    // Intention 3: Question about medications
    else if (lower.includes('quoi') || lower.includes('quel') || lower.includes('ce soir') || lower.includes('midi')) {
      reply = "Pour la prise du soir, vous avez le Tahor 20mg à prendre au milieu du repas du soir avec un grand verre d'eau.";
    } 
    // Default friendly AI response
    else {
      reply = "Merci Joseph. Je suis toujours là pour veiller sur la bonne prise de vos médicaments. N'hésitez pas si vous avez la moindre question !";
    }

    // Append AI reply to chat & speak it out loud
    setTimeout(() => {
      setChatLog(prev => [...prev, { sender: 'ai', text: reply, time: timeNow }]);
      speakText(reply);
    }, 600);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }} className="animate-slide-up">
      
      <div className="card" style={{ padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '0.4rem 1.1rem',
            borderRadius: '999px',
            fontSize: '0.9rem',
            fontWeight: 800,
            marginBottom: '0.65rem'
          }}>
            <Sparkles size={18} /> Le Petit-Fils Numérique (IA Conversationnelle)
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-family-heading)', margin: 0 }}>
            Assistant Vocal Bientraitant
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.35rem', fontWeight: 500 }}>
            Parlez naturellement à votre assistant : dites-lui si vous avez pris vos médicaments ou si vous ne vous sentez pas bien.
          </p>
        </div>

        {/* AI Avatar & Voice Wave Form Visualizer */}
        <div style={{
          background: 'linear-gradient(135deg, #0284c7, #0369a1)',
          color: 'white',
          borderRadius: '24px',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: '#ffffff',
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
            marginBottom: '1rem',
            transform: listening ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}>
            <Mic size={44} color={listening ? '#16a34a' : 'var(--primary)'} />
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
            {listening ? "🎙️ L'assistant écoute Joseph..." : "Parlez à votre assistant médical"}
          </h3>
          <p style={{ opacity: 0.9, fontSize: '1rem', fontWeight: 500, maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            {listening ? "Exprimez-vous librement à voix haute." : "Appuyez sur le micro géant et dites : « J'ai pris mes cachets » ou « J'ai un peu mal à la tête »."}
          </p>

          <button
            onClick={startVoiceInput}
            className="btn-giant"
            style={{
              background: listening ? '#16a34a' : '#ffffff',
              color: listening ? 'white' : 'var(--text-main)',
              fontSize: '1.3rem',
              padding: '1.2rem 2.5rem',
              border: '3px solid #ffffff'
            }}
          >
            <Mic size={28} /> {listening ? 'Écoute en cours... 🟢' : 'Appuyer pour Parler à l\'IA 🎤'}
          </button>
        </div>

        {/* Quick Voice Prompts */}
        <div style={{ marginBottom: '1.75rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Exemples de phrases rapides à tester :
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '0.65rem' }}>
            <button
              onClick={() => handleUserSpeech("J'ai pris tous mes médicaments du matin !")}
              style={{ padding: '0.65rem 1rem', borderRadius: '12px', background: 'var(--success-light)', color: 'var(--success)', fontWeight: 700, border: '1px solid var(--success)' }}
            >
              🟢 "J'ai pris tous mes médicaments du matin !"
            </button>
            <button
              onClick={() => handleUserSpeech("J'ai un peu mal à la tête ce midi.")}
              style={{ padding: '0.65rem 1rem', borderRadius: '12px', background: '#fef3c7', color: '#b45309', fontWeight: 700, border: '1px solid #f59e0b' }}
            >
              ⚠️ "J'ai un peu mal à la tête ce midi."
            </button>
            <button
              onClick={() => handleUserSpeech("Quels sont mes comprimés pour ce soir ?")}
              style={{ padding: '0.65rem 1rem', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, border: '1px solid var(--primary)' }}
            >
              ❓ "Quels sont mes comprimés pour ce soir ?"
            </button>
          </div>
        </div>

        {/* Dialogue Chat History */}
        <div style={{
          background: 'var(--bg-main)',
          border: '1.5px solid var(--border)',
          borderRadius: '20px',
          padding: '1.25rem',
          maxHeight: '360px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {chatLog.map((msg, idx) => (
            <div key={idx} style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              background: msg.sender === 'user' ? 'var(--primary)' : 'var(--card-bg)',
              color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
              padding: '1rem 1.25rem',
              borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              border: msg.sender === 'ai' ? '1px solid var(--border)' : 'none'
            }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 700, marginBottom: '0.25rem' }}>
                {msg.sender === 'user' ? '👴 Papa Joseph' : '🤖 Assistant CarePill'} • {msg.time}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
