
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { User, Mail, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import ScoreDisplay from "@/components/ScoreDisplay";

// Mock API for development purposes (similar to the one in Index.tsx)
const mockAPI = {
  get: async (url: string) => {
    console.log(`GET request to ${url}`);
    
    // Mock invite response
    if (url.includes('/invite/')) {
      return { 
        data: {
          inviter_username: "QuizMaster42",
          score: 350,
          message: "Join me in this awesome quiz game!"
        }
      };
    }
    
    return { data: {} };
  },
  
  post: async (url: string, data: any) => {
    console.log(`POST request to ${url}`, data);
    
    // Mock user creation
    if (url === '/user') {
      return { 
        data: {
          user_id: "new-user-123",
          username: data.username,
          score: 0
        }
      };
    }
    
    return { data: {} };
  }
};

// Use this for development, will be replaced with real API in production
const API = mockAPI;

const Invite: React.FC = () => {
  const { inviteId } = useParams<{inviteId: string}>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inviter, setInviter] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const res = await API.get(`/invite/${inviteId}`);
        setInviter(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching invite:', err);
        setError('Could not load invite information. The invite might not exist or has expired.');
        setLoading(false);
        toast({
          title: "Error",
          description: "Could not load invite information.",
          variant: "destructive",
        });
      }
    };
    
    fetchInvite();
  }, [inviteId, toast]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      const res = await API.post('/user', { username, invite_id: inviteId });
      
      // Show success message
      toast({
        title: "Success!",
        description: `Welcome ${username}! Get ready to play.`,
      });
      
      // Redirect to the main game page
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error('Error joining game:', err);
      toast({
        title: "Error",
        description: "Could not join the game. Please try again.",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-md py-12">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-quiz-primary/10 to-quiz-secondary/10">
            <CardTitle className="text-2xl font-bold">Loading Invitation</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-md py-12">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-quiz-primary/10 to-quiz-secondary/10">
            <CardTitle className="text-2xl font-bold text-destructive">Invite Not Found</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Alert className="border-l-4 border-destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Button onClick={() => navigate('/')}>
                Go to Home Page
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md py-12">
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-quiz-primary/10 to-quiz-secondary/10 pb-6">
          <CardTitle className="text-2xl font-bold">You're Invited!</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-quiz-primary/10 p-3 mb-4">
              <Mail className="h-6 w-6 text-quiz-primary" />
            </div>
            <h2 className="text-xl font-semibold">
              <span className="text-quiz-primary">{inviter?.inviter_username}</span> invites you to play
            </h2>
            <p className="text-muted-foreground mt-1">Join the quiz and challenge their score!</p>
          </div>

          {inviter && (
            <div className="mb-6">
              <ScoreDisplay totalScore={inviter.score} />
            </div>
          )}
          
          {inviter?.message && (
            <Card className={cn(
              "mb-6 bg-muted/50 border-0",
              "animate-fade-in"
            )}>
              <CardContent className="p-4">
                <p className="text-sm italic">"{inviter.message}"</p>
              </CardContent>
            </Card>
          )}
          
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Choose Your Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="username"
                  className="pl-9"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={submitting}
                  required
                  maxLength={30}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-quiz-primary hover:bg-quiz-primary/90"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="animate-pulse">Joining</span>
                  <span className="ml-2 inline-block animate-pulse">...</span>
                </>
              ) : (
                <>
                  Start Playing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="bg-muted/30 px-6 py-4 flex justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account? <a href="/" className="text-quiz-primary hover:underline">Sign in</a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Invite;
