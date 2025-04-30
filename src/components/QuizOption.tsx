
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuizOptionProps {
  option: string;
  onSelect: () => void;
  disabled: boolean;
  index: number;
  feedback?: { correct: boolean; selected: string } | null;
}

const QuizOption: React.FC<QuizOptionProps> = ({ 
  option, 
  onSelect, 
  disabled, 
  index,
  feedback 
}) => {
  const isSelected = feedback && feedback.selected === option;
  const isCorrect = feedback && feedback.correct && isSelected;
  const isIncorrect = feedback && !feedback.correct && isSelected;

  return (
    <Button
      variant="outline"
      className={cn(
        "quiz-option-btn w-full h-16 text-left p-4 justify-start text-lg font-medium mb-3",
        "border-2 hover:bg-primary/10 hover:border-primary/50 animate-fade-in",
        isCorrect && "bg-quiz-correct/10 border-quiz-correct hover:bg-quiz-correct/20",
        isIncorrect && "bg-quiz-incorrect/10 border-quiz-incorrect hover:bg-quiz-incorrect/20",
        !feedback && "hover:bg-primary/10"
      )}
      disabled={disabled}
      onClick={onSelect}
      style={{ animationDelay: `${0.3 + (index * 0.1)}s` }}
    >
      <div className="flex items-center gap-3 w-full">
        <div className={cn(
          "flex-shrink-0 rounded-full p-2 w-8 h-8 flex items-center justify-center",
          isCorrect ? "bg-quiz-correct text-white" : 
          isIncorrect ? "bg-quiz-incorrect text-white" :
          "bg-primary/10 text-primary"
        )}>
          {String.fromCharCode(65 + index)}
        </div>
        <span className="truncate">{option}</span>
      </div>
    </Button>
  );
};

export default QuizOption;
