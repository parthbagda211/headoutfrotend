import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { API } from '../api/api.ts';

const Invite: React.FC = () => {
  const { inviteId } = useParams<{ inviteId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [inviter, setInviter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvite = async () => {
    try {
      const res = await API.get(`/invite/${inviteId}`);
      console.log("Invite data:", res);
      setInviter(res);
      localStorage.setItem('user', JSON.stringify(res)); // optional, in case needed later
      setLoading(false);

      // ✅ Auto-redirect after a brief pause
      setTimeout(() => navigate('/'), 2000);
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

  useEffect(() => {
    fetchInvite();
  }, [inviteId]);

  if (loading) {
    return (
      <div className="container max-w-md py-12">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-quiz-primary/10 to-quiz-secondary/10">
            <CardTitle className="text-2xl font-bold">Loading Invitation</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
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

        <CardContent className="p-6 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-quiz-primary/10 p-3 mb-4">
            <Mail className="h-6 w-6 text-quiz-primary" />
          </div>
          <h2 className="text-xl font-semibold">
            <span className="text-quiz-primary">{inviter?.inviter_username}</span> invites you to play and has scored <span className="text-quiz-primary">{inviter?.score}</span> points!
          </h2>
          <p className="text-muted-foreground mt-2">Joining now…</p>

          {inviter?.message && (
            <Card className={cn("mt-6 bg-muted/50 border-0", "animate-fade-in")}>
              <CardContent className="p-4">
                <p className="text-sm italic">"{inviter.message}"</p>
              </CardContent>
            </Card>
          )}
        </CardContent>

        <CardFooter className="bg-muted/30 px-6 py-4 flex justify-center">
          <p className="text-sm text-muted-foreground">
            Redirecting you to the quiz...
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Invite;
