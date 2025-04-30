import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Info, RefreshCw } from "lucide-react";
import confetti from 'canvas-confetti';
import QuizClue from "@/components/QuizClue";
import QuizOption from "@/components/QuizOption";
import ScoreDisplay from "@/components/ScoreDisplay";
import QuizFeedback from "@/components/QuizFeedback";
import { cn } from "@/lib/utils";
import axios from 'axios';
import { API } from '@/api/api';
import CountQuestionDisplay from '@/components/CountQuestionDisplay';

interface IndexProps {
  user: {
    user_id: string;
    username: string;
    score?: number;
  };
}

const Index: React.FC<IndexProps> = ({ user }) => {
  const [question, setQuestion] = useState<any>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [disabled, setDisabled] = useState(false);
  const [clues, setClues] = useState<string[]>([]);
  const [secondClueShown, setSecondClueShown] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const { toast } = useToast();
  const [correctQuestions, setCorrectQuestions] = useState<number[]>([]);
  const [incorrectQuestions, setIncorrectQuestions] = useState<number[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);



  const fetchScores = async () => {
    try {
      const res = await API.get(`/game/scores/${user.user_id}`);
      console.log("Fetched scores:", res); // ✅ Log to confirm
  
      setTotalScore(res.total_score);
      setSessionScore(res.current_score);
    } catch (err) {
      console.error('Error fetching scores:', err);
      toast({
        title: "Error",
        description: "Could not fetch your scores. Please try again.",
        variant: "destructive",
      });
    }
  };
  

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const res = await API.get('/game/question');
      console.log("Fetched question:", res); // ✅ Correct: no .data
  
      if (!res?.clues || !Array.isArray(res.clues)) {
        throw new Error("Invalid clue format");
      }
  
      setQuestion(res);
      setClues([res.clues[0]]);
      setFeedback(null);
      setDisabled(false);
      setSecondClueShown(false);
      setShowEncouragement(false);
    } catch (err) {
      console.error('Error fetching question:', err);
      toast({
        title: "Error",
        description: "Could not fetch the next question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  

 const guess = async (option: string) => {
  if (disabled) return;

  try {
    const wasSecondClueShown = secondClueShown; // capture BEFORE server response

    const res = await API.post('/game/guess', {
      selected: option,
      answer: question.answer_id,
      user_id: user.user_id,
    });

    console.log("Guess response:", res);

    // Only count as an attempt if it's a new answer
    if (!res.already_answered) {
      setTotalAttempts((prev) => prev + 1);

      if (res.correct) {
        setCorrectCount((prev) => prev + 1);
        setCorrectQuestions((prev) => [...prev, question.answer_id]);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

      } else {
        // ❗ Only count as incorrect if this is AFTER second clue was already shown
        if (wasSecondClueShown) {
          setIncorrectQuestions((prev) => [...prev, question.answer_id]);
        }
      }
    }

    // Show second clue IF user guessed wrong and hasn’t seen it yet
    if (!res.correct && res.extra_clue && !secondClueShown) {
      if (!clues.includes(res.extra_clue)) {
        setClues((prev) => [...prev, res.extra_clue]);
      }
      setSecondClueShown(true);
      setShowEncouragement(true);
      await fetchScores();
      return; // do not show feedback yet — user gets second chance
    }

    // Only show feedback when second clue already shown or answer was correct
    setFeedback(res);
    setDisabled(true);
    await fetchScores();

  } catch (err) {
    console.error('Error submitting guess:', err);
    toast({
      title: "Error",
      description: "Could not submit your answer. Please try again.",
      variant: "destructive",
    });
  }
};

  

  useEffect(() => {
    fetchQuestion();
    fetchScores();
  }, [ user.user_id,]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-pulse-scale">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-auto mr-auto max-w-3xl px-4 py-12">
  <div className="mb-8 text-center">
    <h1 className="text-4xl font-bold text-quiz-primary mb-2 tracking-tight">Quiz Clue Champ</h1>
    <p className="text-muted-foreground">Guess the answer based on the clues!</p>
  </div>

  <Card className="border-0 shadow-lg">
    <CardHeader className="bg-gradient-to-r from-quiz-primary/10 to-quiz-secondary/10 px-6">
      <div className="flex justify-between items-start">
        <CardTitle className="text-2xl font-bold">Challenge Time</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchQuestion}
          className="h-8 w-8 rounded-full"
          title="Get a new question"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>

    <CardContent className="p-6">
      <CountQuestionDisplay correctCount={correctCount} totalAttempts={totalAttempts} />

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          <span>{clues.length > 1 ? 'Clues' : 'Clue'}</span>
        </h3>

        {clues.map((clue, index) => (
          <QuizClue key={index} clue={clue} index={index} />
        ))}
      </div>

      {showEncouragement && !feedback && (
        <Alert className="mb-6 animate-bounce-in border-l-4 border-quiz-primary">
          <AlertDescription className="flex items-center gap-2">
            <span className="text-lg">🔍</span>
            <span>Try again! Here's another clue to help you.</span>
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-3">Choose your answer:</h3>
        <div className={cn(feedback ? "opacity-80" : "")}>
          {question?.options.map((opt: string, idx: number) => (
            <QuizOption
              key={opt}
              option={opt}
              onSelect={() => guess(opt)}
              disabled={disabled}
              index={idx}
              feedback={feedback ? {
                correct: feedback.correct,
                selected: opt
              } : null}
            />
          ))}
        </div>
      </div>

      {feedback && (
        <QuizFeedback feedback={feedback} onNext={fetchQuestion} />
      )}
    </CardContent>
  </Card>
</div>

  );
};

export default Index;
