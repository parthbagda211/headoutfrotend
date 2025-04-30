import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CountQuestionDisplayProps {
  correctCount: number;
  totalAttempts: number;
}

const CountQuestionDisplay: React.FC<CountQuestionDisplayProps> = ({
  correctCount,
  totalAttempts,
}) => {
  const incorrectCount = totalAttempts - correctCount;

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <Card className={cn(
        "bg-gradient-to-r from-green-400 to-green-500 text-white p-3 flex-1 flex items-center gap-3",
        "rounded-2xl shadow-md"
      )}>
        <div>
          <p className="text-sm opacity-90">Correct Answers</p>
          <p className="font-bold text-xl">{correctCount}</p>
        </div>
      </Card>

      <Card className={cn(
        "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-3 flex-1 flex items-center gap-3",
        "rounded-2xl shadow-md"
      )}>
        <div>
          <p className="text-sm opacity-90">Total Attempted</p>
          <p className="font-bold text-xl">{totalAttempts}</p>
        </div>
      </Card>

      <Card className={cn(
        "bg-gradient-to-r from-red-400 to-red-500 text-white p-3 flex-1 flex items-center gap-3",
        "rounded-2xl shadow-md"
      )}>
        <div>
          <p className="text-sm opacity-90">Incorrect Answers</p>
          <p className="font-bold text-xl">{incorrectCount}</p>
        </div>
      </Card>
    </div>
  );
};

export default CountQuestionDisplay;
