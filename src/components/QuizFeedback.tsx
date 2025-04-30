import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizFeedbackProps {
  feedback: {
    correct: boolean;
    fun_fact: string;
    updated_score: number;
  };
  onNext: () => void;
}

const QuizFeedback: React.FC<QuizFeedbackProps> = ({ feedback, onNext }) => {
  return (
    <Card className={cn(
      "w-full mt-8 overflow-hidden border-2 animate-bounce-in",
      feedback.correct ? "border-quiz-correct" : "border-quiz-incorrect"
    )}>
      <div className={cn(
        "py-3 px-4 text-white font-medium text-center",
        feedback.correct ? "bg-quiz-correct" : "bg-quiz-incorrect"
      )}>
        <div className="flex items-center justify-center gap-2">
          {feedback.correct ? (
            <Check className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
          <span className="text-lg">
            {feedback.correct ? 'Correct Answer!' : 'Incorrect Answer!'}
          </span>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-muted-foreground mb-1">Fun Fact</h4>
          <p className="text-lg">{feedback.fun_fact}</p>
        </div>

        <div className="bg-muted/30 rounded-lg p-3 inline-block">
          <h4 className="text-sm font-semibold text-muted-foreground">Your Score</h4>
          <p className="text-2xl font-bold text-primary">{feedback.updated_score}</p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={onNext}
          className="w-full bg-quiz-primary hover:bg-quiz-primary/90"
        >
          <span>Next Question</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizFeedback;
