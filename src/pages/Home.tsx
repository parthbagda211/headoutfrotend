
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ScoreDisplay from "@/components/ScoreDisplay";

// Mock API for development purposes
const mockAPI = {
  post: async (url: string, data: any) => {
    console.log(`POST request to ${url}`, data);
    
    if (url === '/invite') {
      return { data: { invite_id: "mock-invite-123" } };
    }
    
    return { data: {} };
  }
};

// Use this for development, will be replaced with real API in production
const API = mockAPI;

interface HomeProps {
  user: {
    user_id: string;
    username: string;
    score?: number;
  };
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const createInvite = async () => {
    try {
      const res = await API.post('/invite', { inviter_id: user.user_id });
      const link = `${window.location.origin}/invite/${res.data.invite_id}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(link).then(() => {
        toast({
          title: "Link copied!",
          description: "Share it with your friends to challenge them.",
        });
      });
      
      // Open sharing options if available
      if (navigator.share) {
        navigator.share({
          title: 'Join my Quiz Clue Champ game!',
          text: `I've scored ${user.score || 0} points. Can you beat me?`,
          url: link,
        }).catch(err => console.log('Error sharing', err));
      } else {
        window.open(`https://wa.me/?text=Join my Quiz Clue Champ game! ${link}`, '_blank');
      }
    } catch (err) {
      console.error('Error creating invite:', err);
      toast({
        title: "Error",
        description: "Could not create invite. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card className="border-0 shadow-lg mb-8">
        <CardHeader className="bg-gradient-to-r from-quiz-primary/10 to-quiz-secondary/10">
          <CardTitle className="text-2xl font-bold">
            Welcome, {user.username}!
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <ScoreDisplay totalScore={user.score || 0} />
          </div>
          
          <Button 
            onClick={createInvite}
            className="w-full bg-quiz-secondary hover:bg-quiz-secondary/90 text-white"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Challenge a Friend
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
