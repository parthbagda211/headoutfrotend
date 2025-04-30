
import React from 'react';
import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  totalScore: number;
  sessionScore?: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ totalScore, sessionScore = 0 }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Card className="bg-gradient-to-r from-quiz-primary to-quiz-primary/80 text-white p-3 flex items-center gap-2 shine-effect">
        <Trophy className="h-5 w-5" />
        <div>
          <p className="text-sm opacity-90">Total Score</p>
          <p className="font-bold text-xl">{totalScore}</p>
        </div>
      </Card>
      
      {sessionScore > 0 && (
        <Card className={cn(
          "bg-gradient-to-r from-quiz-secondary to-quiz-secondary/80 text-white p-3 flex items-center gap-2",
          "animate-pulse-scale"
        )}>
          <div className="rounded-full bg-white/20 p-1">
            <span className="text-white font-bold">+</span>
          </div>
          <div>
            <p className="text-sm opacity-90">This Session</p>
            <p className="font-bold text-xl">+{sessionScore}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ScoreDisplay;
