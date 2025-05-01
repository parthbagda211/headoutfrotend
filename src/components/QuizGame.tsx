import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QuizOption from './QuizOption';
import ScoreDisplay from './ScoreDisplay';
import QuizClue from './QuizClue';
import QuizFeedback from './QuizFeedback';
import { useToast } from '@/components/ui/use-toast';
import { API } from '../api/api.ts';

interface QuizQuestion {
  clues: string[];
  options: string[];
  answer_id: number;
}

interface QuizFeedback {
  correct: boolean;
  fun_fact: string;
  updated_score: number;
  already_answered: boolean;
  extra_clue?: string;
}

interface QuizGameProps {
  user: { user_id: string; username: string; score: number };
}

const QuizGame: React.FC<QuizGameProps> = ({ user }) => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<QuizFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState({ total_score: user.score, current_score: 0 });
  const [cluesShown, setCluesShown] = useState<string[]>([]);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const { toast } = useToast();


  const fetchScores = async () => {
    try {
      const res = await API.get(`/game/scores/${user.user_id}`);
      setScores(res.data);
    } catch {
      toast({ title: 'Error', description: 'Failed to load scores.', variant: 'destructive' });
    }
  };

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const res = await API.get('/game/question');
      setQuestion(res.data);
      setSelected(null);
      setFeedback(null);
      setCluesShown([res.data.clues[0]]); // Start with first clue only
      setWrongAttempt(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load question.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (selectedOption: string) => {
    if (!question) return;
    setSelected(selectedOption);
    try {
      const res = await API.post('/game/guess', {
        selected: selectedOption,
        answer: question.answer_id,
        user_id: user.user_id,
      });

      setFeedback(res.data);
      setScores(prev => ({
        ...prev,
        total_score: res.data.updated_score,
      }));

      // Only show second clue after wrong first attempt
      if (!res.data.correct && !res.data.already_answered) {
        if (!wrongAttempt) {
          setWrongAttempt(true); // mark this as the first wrong attempt
        } else if (res.data.extra_clue && !cluesShown.includes(res.data.extra_clue)) {
          setCluesShown(prev => [...prev, res.data.extra_clue]);
        }
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit answer.', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchScores();
    fetchQuestion();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <ScoreDisplay user={user} />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Where in the World?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {question ? (
            <>
              {cluesShown.map((clue, index) => (
                <QuizClue key={index} clue={clue} index={index} />
              ))}

              <div className="mt-4">
                {question.options.map((opt, i) => (
                  <QuizOption
                    key={opt}
                    option={opt}
                    onSelect={() => submitAnswer(opt)}
                    disabled={!!selected}
                    index={i}
                    feedback={selected ? {
                      correct: feedback?.correct ?? false,
                      selected
                    } : null}
                  />
                ))}
              </div>

              {feedback && (
                <QuizFeedback feedback={feedback} onNext={fetchQuestion} />
              )}
            </>
          ) : (
            <p>No question available.</p>
          )}

          {loading && <p>Loading...</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizGame;
