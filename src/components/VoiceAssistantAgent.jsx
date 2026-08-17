import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Heart, Bot, Send } from 'lucide-react';

export default function VoiceAssistantAgent({ 
  medications, 
  onValidateSlot, 
  onAddSymptom, 
  speakText, 
  timeSlots,
  patientName 
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState([
    {
      sender: 'agent',
      text: `Bonjour ! Je suis "Le Petit-Fils Numérique". Comment puis-je aider ${patientName || 'votre proche'} aujourd'hui ? Vous pouvez me dire "J'ai pris mes cachets du matin" ou "J'ai mal à la tête".`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const processUserSpeech = (userText) => {
    const lower = userText.toLowerCase();
    
    setConversation(prev => [...prev, { sender: 'user', text: userText }]);

    let reply = "";

    if (lower.includes('matin') || lower.includes('cachet') || lower.includes('pris')) {
      onValidateSlot('mar', 'Matin');
      reply = `Bravo ${patientName || ''} ! J'ai bien enregistré vos médicaments du matin dans le pilulier. Passez une magnifique journée !`;
    } else if (lower.includes('midi') || lower.includes('déjeuner')) {
      onValidateSlot('mar', 'Midi');
      reply = `C'est noté ! Traitement du midi validé avec succès. Bon appétit !`;
    } else if (lower.includes('soir') || lower.includes('dîner')) {
      onValidateSlot('mar', 'Soir');
      reply = `Très bien ! Traitement du soir enregistré. Reposez-vous bien.`;
    } else if (lower.includes('mal') || lower.includes('tête') || lower.includes('vertige') || lower.includes('douleur')) {
      onAddSymptom({
        id: Date.now(),
        date: "Aujourd'hui, " + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: lower.includes('tête') ? 'Céphalée' : 'Vertiges / Sensations',
        detail: `Signalé par voix : "${userText}"`,
        status: 'warning'
      });
      reply = `J'ai noté ce symptôme dans le journal de santé pour le médecin. Pensez à vous allonger et à boire un verre d'eau.`;
    } else {
      reply = `J'ai bien entendu : "${userText}". Tout est sous contrôle pour votre suivi médical. Avez-vous besoin d'autre chose ?`;
    }

    setTimeout(() => {
      setConversation(prev => [...prev, { sender: 'agent', text: reply }]);
      speakText(reply);
    }, 600);
  };

  const handleToggleMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("La reconnaissance vocale directe n'est pas supportée sur ce navigateur. Utilisez le champ texte ci-dessous !");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;

    if (!isListening) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        processUserSpeech(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsListening(false);
    }
  };

  const handleSendTextSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    processUserSpeech(inputMessage);
    setInputMessage('');
  };

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }} className="animate-slide-up">
      
      <div className="card" style={{ padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--accent-primary-light)',
            color: 'var(--accent-primary)',
            padding: '0.4rem 1.1rem',
            borderRadius: '999px',
            fontSize: '0.9rem',
            fontWeight: 800,
            marginBottom: '0.65rem'
          }}>
            <Bot size={18} /> IA Conversationnelle "Le Petit-Fils Numérique"
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0 }}>
            Assistant Vocal Bientraitant
          </h2>
          <p style={{ color: 'var(--system-text-secondary)', fontSize: '1.05rem', marginTop: '0.35rem', fontWeight: 500 }}>
            Parlez naturellement ou tapez une phrase pour valider les cachets ou enregistrer un symptôme.
          </p>
        </div>

        {/* Big Mic Button Container */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            onClick={handleToggleMic}
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              background: isListening ? 'var(--accent-danger)' : 'var(--accent-primary)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isListening ? '0 0 35px rgba(255, 59, 48, 0.6)' : 'var(--shadow-lg)',
              animation: isListening ? 'pulse-gentle 1s infinite' : 'none'
            }}
          >
            {isListening ? <MicOff size={48} /> : <Mic size={48} />}
          </button>
          
          <div style={{ marginTop: '0.85rem', fontWeight: 800, fontSize: '1.1rem', color: isListening ? 'var(--accent-danger)' : 'var(--system-text)' }}>
            {isListening ? "🎙️ Écoute en cours... Parlez maintenant !" : "Appuyez sur le micro pour parler"}
          </div>
        </div>

        {/* Conversation Dialogue Bubble Stream */}
        <div style={{
          background: 'var(--system-bg)',
          borderRadius: '24px',
          padding: '1.25rem',
          maxHeight: '320px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          marginBottom: '1.25rem',
          border: '1px solid var(--system-card-border)'
        }}>
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                background: msg.sender === 'user' ? 'var(--accent-primary)' : 'var(--system-card-bg)',
                color: msg.sender === 'user' ? '#ffffff' : 'var(--system-text)',
                padding: '0.85rem 1.15rem',
                borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                boxShadow: 'var(--shadow-sm)',
                fontWeight: 600,
                fontSize: '0.98rem'
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Text Input Fallback */}
        <form onSubmit={handleSendTextSubmit} style={{ display: 'flex', gap: '0.65rem' }}>
          <input
            type="text"
            placeholder="Exemple: J'ai pris mes cachets du matin..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            style={{
              flex: 1,
              padding: '0.85rem 1.1rem',
              borderRadius: '16px',
              border: '1px solid var(--system-card-border)',
              fontSize: '0.95rem',
              outline: 'none',
              background: 'var(--system-bg)'
            }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0.85rem 1.35rem', borderRadius: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Send size={18} /> Envoyer
          </button>
        </form>

      </div>

    </div>
  );
}
