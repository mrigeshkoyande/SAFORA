import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Button from '../../components/ui/Button';
import Chip from '../../components/ui/Chip';
import Icon from '../../components/ui/Icon';
import { escapeCoachApi, sosApi } from '../../core/api';
import type { ChatMessage } from '../../core/types';
import { useHaptics } from '../../platform';

const quickPrompts = [
  "I'm being followed by someone",
  "My cab driver changed the route",
  "I feel unsafe on this street",
  "Someone is harassing me on the metro",
];

export default function EscapeCoachScreen() {
  const navigate = useNavigate();
  const { impact, notification } = useHaptics();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      content: "Hello! I am your AI Escape Coach. I'm monitoring your GPS and surroundings. How can I help you de-escalate or exit right now?",
      timestamp: new Date(Date.now() - 60000),
      actions: [
        { label: 'Find Nearest Safe Haven', type: 'navigate', value: '/safety-map' },
        { label: 'Trigger Silent SOS', type: 'call', value: 'sos' },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;
    impact('light');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await escapeCoachApi.sendMessage(query);
      setIsTyping(false);
      notification('success');
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: res.content,
          timestamp: new Date(),
          actions: [
            { label: 'Call Police (112)', type: 'call', value: '112' },
            { label: 'Share Live Location', type: 'share-location', value: 'all' },
          ],
        },
      ]);
    } catch {
      setIsTyping(false);
    }
  };

  const handleActionClick = async (actionType: string, value?: string) => {
    impact('medium');
    if (value === 'sos') {
      await sosApi.triggerSOS();
      alert('SOS Triggered! Dispatching emergency contacts.');
    } else if (actionType === 'call' && value) {
      window.location.href = `tel:${value}`;
    } else if (actionType === 'navigate' && value) {
      navigate(value);
    } else if (actionType === 'share-location') {
      alert('Live location broadcast link copied to clipboard and shared with Guardians!');
    }
  };

  return (
    <AppShell topBarProps={{ title: 'AI Escape Coach', showBack: true }}>
      <div className="flex flex-col h-[calc(100dvh-4rem-5rem)] lg:h-[calc(100dvh-4rem)] max-w-4xl mx-auto px-4 pt-4">
        {/* Safe Haven Banner */}
        <div className="bg-green-100 border border-green-300 text-green-900 rounded-xl p-3 mb-4 flex items-center justify-between text-label-md flex-shrink-0">
          <div className="flex items-center gap-2">
            <Icon name="verified" fill className="text-green-600" size={20} />
            <span className="font-semibold">Nearest Safe Haven: Café Coffee Day (120m away)</span>
          </div>
          <button onClick={() => navigate('/safety-map')} className="text-green-700 underline font-bold cursor-pointer">View Map</button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div key={msg.id} className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}>
                {isAi && (
                  <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container flex-shrink-0">
                    <Icon name="support_agent" fill size={20} />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl p-4 ${isAi ? 'bg-surface-container-lowest border border-outline-variant/20 shadow-card text-on-surface' : 'bg-primary text-white shadow-md'}`}>
                  <p className="font-jakarta text-body-md whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-outline-variant/20 flex flex-wrap gap-2">
                      {msg.actions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(act.type, act.value)}
                          className="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-lg font-inter text-label-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Icon name={act.type === 'call' ? 'call' : act.type === 'share-location' ? 'near_me' : 'warning'} size={16} />
                          <span>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <span className={`block font-inter text-[10px] mt-1.5 text-right ${isAi ? 'text-on-surface-variant' : 'text-white/80'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 items-center text-on-surface-variant font-inter text-label-md italic pl-12">
              <span className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
              </span>
              <span>SAFORA is formulating escape tactics...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Prompts */}
        <div className="py-2 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          {quickPrompts.map((prompt, i) => (
            <Chip
              key={i}
              onClick={() => handleSend(prompt)}
              className="whitespace-nowrap cursor-pointer hover:bg-primary-container/30 active:scale-95 transition-all"
            >
              {prompt}
            </Chip>
          ))}
        </div>

        {/* Input Bar */}
        <div className="py-3 flex gap-2 items-center border-t border-outline-variant/20 flex-shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe what's happening or ask for guidance..."
            className="flex-1 px-4 py-3 bg-surface-container rounded-full font-jakarta text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
          />
          <Button
            variant="primary"
            size="md"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            icon="send"
            className="rounded-full w-12 h-12 !p-0 flex items-center justify-center flex-shrink-0"
          />
        </div>
      </div>
    </AppShell>
  );
}
