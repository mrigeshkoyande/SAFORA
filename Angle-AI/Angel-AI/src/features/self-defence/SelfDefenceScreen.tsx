import React from 'react';
import AppShell from '../../components/layout/AppShell';
import Card from '../../components/ui/Card';
import Chip from '../../components/ui/Chip';
import Icon from '../../components/ui/Icon';
import { useHaptics } from '../../platform';

interface VideoLesson {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  thumbnail: string;
}

const lessons: VideoLesson[] = [
  { id: '1', title: 'Breaking Wrist Grabs & Holds', category: 'Escape Tactics', duration: '3 Min', level: 'Beginner', thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop' },
  { id: '2', title: 'Night Transit & Solo Commute Safety', category: 'Situational Awareness', duration: '5 Min', level: 'Essential', thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=400&auto=format&fit=crop' },
  { id: '3', title: 'Verbal De-escalation in Enclosed Spaces', category: 'Workplace Safety', duration: '4 Min', level: 'Intermediate', thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop' },
  { id: '4', title: 'Using Daily Items for Self-Defence', category: 'Escape Tactics', duration: '6 Min', level: 'Advanced', thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop' },
];

export default function SelfDefenceScreen() {
  const { impact } = useHaptics();

  return (
    <AppShell topBarProps={{ title: 'Daily Empower & Self-Defence', showBack: true }}>
      <div className="px-5 space-y-6 pt-4 pb-12">
        {/* Banner */}
        <Card className="p-6 bg-gradient-to-br from-secondary-container/40 to-surface-container-lowest border border-secondary/20 shadow-card">
          <Chip color="secondary" icon="sports_martial_arts" className="mb-2">Micro-Learning Tracks</Chip>
          <h2 className="font-jakarta font-bold text-headline-sm text-on-surface">Build Daily Safety Muscle</h2>
          <p className="font-inter text-body-sm text-on-surface-variant max-w-md mt-1">
            Master situational awareness, verbal de-escalation, and physical escape maneuvers in bite-sized 3-minute video lessons.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 bg-surface-container h-2.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full w-2/5 rounded-full" />
            </div>
            <span className="font-inter font-bold text-label-sm text-secondary">40% Complete (4/10)</span>
          </div>
        </Card>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {['All Tracks', 'Escape Tactics', 'Situational Awareness', 'Night Travel', 'Public Transport'].map((cat, i) => (
            <Chip key={cat} color={i === 0 ? 'primary' : 'outline'} className="cursor-pointer whitespace-nowrap">
              {cat}
            </Chip>
          ))}
        </div>

        {/* Lesson Grid */}
        <section className="space-y-3">
          <h3 className="font-jakarta font-semibold text-title-md text-on-surface">Featured Lessons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lessons.map((lesson) => (
              <Card
                key={lesson.id}
                onClick={() => { impact('light'); alert(`Starting video lesson: "${lesson.title}"`); }}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="relative h-44 bg-surface-container overflow-hidden">
                  <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary shadow-lg group-hover:scale-110 transition-transform">
                      <Icon name="play_arrow" fill size={32} />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white font-inter text-[11px] font-semibold px-2 py-1 rounded">
                    {lesson.duration}
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-inter text-label-sm text-secondary font-semibold uppercase tracking-wider">{lesson.category}</span>
                    <Chip size="sm" color="outline">{lesson.level}</Chip>
                  </div>
                  <h4 className="font-jakarta font-bold text-title-md text-on-surface group-hover:text-primary transition-colors">{lesson.title}</h4>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
