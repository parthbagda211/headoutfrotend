
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuizClueProps {
  clue: string;
  index: number;
}

const QuizClue: React.FC<QuizClueProps> = ({ clue, index }) => {
  return (
    <Card 
      className={cn(
        "clue-card w-full mb-4 border-2 border-primary/20 animate-fade-in",
        "hover:shadow-lg transition-shadow duration-300"
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 rounded-full bg-quiz-primary/10 p-2 w-10 h-10 flex items-center justify-center">
            <span className="text-quiz-primary font-bold">
              {index + 1}
            </span>
          </div>
          <p className="text-lg pt-1">{clue}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizClue;
