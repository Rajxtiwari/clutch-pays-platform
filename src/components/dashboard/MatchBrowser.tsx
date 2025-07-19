import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Calendar, Clock, DollarSign, GamepadIcon, Users, Video } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export function MatchBrowser() {
  const matches = useQuery(api.matches.listOpen);
  const games = useQuery(api.games.list);
  const { user } = useAuth();
  const joinMatch = useMutation(api.matches.joinMatch);

  const getGameName = (gameId: string) => {
    return games?.find(g => g._id === gameId)?.name || "Unknown Game";
  };

  const formatStartTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date > now) {
      return `Starts ${formatDistanceToNow(date, { addSuffix: true })}`;
    } else {
      return "Starting now";
    }
  };

  const handleJoinMatch = async (matchId: string, entryFee: number) => {
    if (!user) {
      toast.error("Please sign in to join matches");
      return;
    }

    if ((user.walletBalance || 0) < entryFee) {
      toast.error("Insufficient wallet balance");
      return;
    }

    try {
      await joinMatch({ matchId });
      toast.success("Successfully joined the match!");
    } catch (error: any) {
      toast.error(error.message || "Failed to join match");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Match Browser</h1>
        <p className="text-muted-foreground">
          Join live matches and compete with other players
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <GamepadIcon className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{matches?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Open Matches</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Active Players</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">₹45,230</p>
                <p className="text-sm text-muted-foreground">Total Prize Pool</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Match List */}
      <div className="space-y-4">
        {matches?.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <GamepadIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Open Matches</h3>
              <p className="text-muted-foreground">
                Check back later or create your own match if you're a host!
              </p>
            </CardContent>
          </Card>
        ) : (
          matches?.map((match) => (
            <motion.div
              key={match._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <GamepadIcon className="h-5 w-5" />
                      <span>{match.title}</span>
                    </CardTitle>
                    <Badge variant="secondary">
                      {getGameName(match.gameId)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">₹{match.entryFee}</span>
                      <span className="text-sm text-muted-foreground">entry</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatStartTime(match.startTime)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {(match.player1Id ? 1 : 0) + (match.player2Id ? 1 : 0)}/2 players
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Live Stream</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handleJoinMatch(match._id, match.entryFee)}
                      disabled={!user || (user.walletBalance || 0) < match.entryFee}
                    >
                      Join Match (₹{match.entryFee})
                    </Button>
                    <Button variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}