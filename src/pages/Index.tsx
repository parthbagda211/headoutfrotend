
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

// Mock API for development purposes
const mockAPI = {
  get: async (url: string) => {
    console.log(`GET request to ${url}`);
    
    // Mock question response
    if (url === '/game/question') {
      return { 
        data: {
          answer_id: 'Paris', 
          clues: ['This city is known as the "City of Light"'],
          options: ['London', 'Paris', 'Berlin', 'Rome']
        }
      };
    }
    
    // Mock scores response
    if (url.includes('/game/scores/')) {
      return { data: { total_score: 120, current_score: 10 } };
    }
    
    return { data: {} };
  },
  
  post: async (url: string, data: any) => {
    console.log(`POST request to ${url}`, data);
    
    // Mock guess response
    if (url === '/game/guess') {
      const correct = data.selected === data.answer;
      return { 
        data: {
          correct,
          already_answered: false,
          fun_fact: correct 
            ? "Paris has 37 bridges across the Seine River!" 
            : "Paris actually became known as the City of Light because it was an early adopter of street lighting.",
          updated_score: correct ? 130 : 120,
          extra_clue: !correct ? "This city hosted the 1900 Summer Olympics." : null
        }
      };
    }
    
    return { data: {} };
  }
};

// Use this for development, will be replaced with real API in production
const API = mockAPI;

const Index = () => {
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

  const fetchScores = async () => {
    try {
      // Replace with actual user ID in production
      const userId = "123"; 
      const res = await API.get(`/game/scores/${userId}`);
      setTotalScore(res.data.total_score);
      setSessionScore(res.data.current_score);
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
      setQuestion(res.data);
      setClues([res.data.clues[0]]); // Start with 1 clue
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
      // Replace with actual user ID in production
      const userId = "123";
      const res = await API.post('/game/guess', {
        selected: option,
        answer: question.answer_id,
        user_id: userId,
      });

      if (res.data.correct && !res.data.already_answered) {
        // Launch confetti on correct answer
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // Show extra clue if the guess was wrong and not previously answered
      if (!res.data.correct && res.data.extra_clue && !secondClueShown) {
        if (res.data.extra_clue && !clues.includes(res.data.extra_clue)) {
          setClues((prevClues) => [...prevClues, res.data.extra_clue]);
        }
        setSecondClueShown(true);
        setShowEncouragement(true);
        await fetchScores();
        return;
      }

      setFeedback(res.data);
      setDisabled(true);
      await fetchScores(); // Update score on every guess
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
  }, []);

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
    <div className="container max-w-2xl py-8">
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
          <ScoreDisplay totalScore={totalScore} sessionScore={sessionScore} />
          
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
            <QuizFeedback 
              feedback={feedback} 
              onNext={fetchQuestion} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
