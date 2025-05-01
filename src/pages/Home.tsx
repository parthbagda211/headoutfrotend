
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ScoreDisplay from "@/components/ScoreDisplay";
import { API } from '../api/api.ts';



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
    if (!user?.user_id) {
      toast({
        title: "Error",
        description: "User not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      const res = await API.post('/invite', { inviter_id: user.user_id });
  
      const inviteId = res?.invite_id || res?.data?.invite_id;
      if (!inviteId) throw new Error("Invalid invite response");
  
      const link = `${window.location.origin}/invite/${inviteId}`;
      console.log("Invite link:", link);
  
      // Try to copy to clipboard
      try {
        await navigator.clipboard.writeText(link);
        toast({
          title: "Link copied!",
          description: "Share it with your friends to challenge them.",
        });
      } catch (clipboardErr) {
        console.warn("Clipboard write failed:", clipboardErr);
      }
  
      // Attempt to share using native share API
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Join my Ultimate Travel Guessing Game!',
            text: `I've scored ${user.score || 0} points. Can you beat me?`,
            url: link,
          });
        } catch (shareErr) {
          console.warn("Share failed:", shareErr);
        }
      } else {
        // Fallback to WhatsApp sharing
        const encodedMsg = encodeURIComponent(`Join my Ultimate Travel Guessing Game! ${link}`);
        window.open(`https://wa.me/?text=${encodedMsg}`, '_blank');
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
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-quiz-primary/10 to-quiz-secondary/10">
        <CardTitle className="text-2xl font-bold">
          Welcome, {user.username}!
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <ScoreDisplay user={user} />
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
