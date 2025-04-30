import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { User, ArrowRight } from "lucide-react";
import axios from 'axios';

interface UsernameFormProps {
  setUser: (user: any) => void;
}

const UsernameForm: React.FC<UsernameFormProps> = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
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

      // Ensure the API endpoint matches your backend route
      const res = await axios.post('http://localhost:5000/api/user', { username });

      setUser(res.data);

      toast({
        title: "Welcome!",
        description: "Get ready to start playing.",
      });
    } catch (err) {
      console.error('Error creating user:', err);
      toast({
        title: "Error",
        description: "Could not create user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container max-w-md py-12">
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-quiz-primary/10 to-quiz-secondary/10">
          <CardTitle className="text-2xl font-bold">Quiz Clue Champ</CardTitle>
        </CardHeader>

        <CardContent className="p-6 pt-8">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-quiz-primary/10 p-3 mb-4">
              <User className="h-6 w-6 text-quiz-primary" />
            </div>
            <h2 className="text-xl font-semibold">Choose Your Username</h2>
            <p className="text-muted-foreground mt-1">Get ready to play the ultimate quiz game!</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
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
                  autoFocus
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
                  <span className="animate-pulse">Creating User</span>
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
              Join the fun and test your knowledge!
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UsernameForm;
