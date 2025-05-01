import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface ScoreDisplayProps {
  user: { user_id: string};
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ user }) => {
  const [totalScore, setTotalScore] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);

useEffect(() => {
  const fetchScores = async () => {
    try {
      const res = await axios.get(`https://headoutbackend-1-vwgp.onrender.com/api/game/scores/${user.user_id}`);
      console.log("Fetched scores:", res.data); // Optional: for debugging
      setTotalScore(res.data.total_score);
      setSessionScore(res.data.current_score);
    } catch (err) {
      console.error('Failed to load scores:', err);
    }
  };

  if (user?.user_id) {
    fetchScores();
  }
  const interval = setInterval(fetchScores, 3000); // every 3 seconds
  return () => clearInterval(interval);
}, [user?.user_id]); 
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
