import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  GamepadIcon, 
  Trophy,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";

export function MyMatches() {
  const { user } = useAuth();
  const matches = useQuery(api.matches.getByUser);
  const games = useQuery(api.games.list);
  const declareWinner = useMutation(api.matches.declareWinner);
  
  const [isDeclaringWinner, setIsDeclaringWinner] = useState(false);

  const getGameName = (gameId: string) => {
    return games?.find(g => g._id === gameId)?.name || "Unknown Game";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-500";
      case "live": return "bg-green-500";
      case "completed": return "bg-gray-500";
      case "disputed": return "bg-red-500";
      case "cancelled": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <Clock className="h-4 w-4" />;
      case "live": return <Play className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "disputed": return <AlertTriangle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatStartTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date > now) {
      return `Starts ${formatDistanceToNow(date, { addSuffix: true })}`;
    } else {
      return "Started";
    }
  };

  const handleDeclareWinner = async (matchId: string, winnerId: string) => {
    setIsDeclaringWinner(true);
    try {
      await declareWinner({
        matchId: matchId as any,
        winnerId: winnerId as any,
      });
      toast.success("Winner declared successfully!");
    } catch (error) {
      toast.error("Failed to declare winner");
    } finally {
      setIsDeclaringWinner(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <GamepadIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Please sign in</h3>
          <p className="text-muted-foreground">
            Sign in to view your matches
          </p>
        </div>
      </div>
    );
  }

  if (!matches) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your matches...</p>
        </div>
      </div>
    );
  }

  const activeMatches = matches.filter((match: any) => 
    match.status === "open" || match.status === "live"
  );
  const completedMatches = matches.filter((match: any) => 
    match.status === "completed"
  );
  const disputedMatches = matches.filter((match: any) => 
    match.status === "disputed"
  );

  const MatchCard = ({ match }: { match: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <GamepadIcon className="h-5 w-5" />
            <span>{match.title}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {getGameName(match.gameId)}
            </Badge>
            <Badge className={`${getStatusColor(match.status)} text-white`}>
              <div className="flex items-center space-x-1">
                {getStatusIcon(match.status)}
                <span className="capitalize">{match.status}</span>
              </div>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
        </div>

        {/* Host Actions */}
        {match.hostId === user._id && match.status === "live" && match.player1Id && match.player2Id && (
          <div className="flex space-x-2 mb-4">
            <Button
              size="sm"
              onClick={() => handleDeclareWinner(match._id, match.player1Id)}
              disabled={isDeclaringWinner}
              className="flex-1"
            >
              Player 1 Wins
            </Button>
            <Button
              size="sm"
              onClick={() => handleDeclareWinner(match._id, match.player2Id)}
              disabled={isDeclaringWinner}
              className="flex-1"
            >
              Player 2 Wins
            </Button>
          </div>
        )}

        {match.winnerId && (
          <div className="flex items-center space-x-2 mb-4">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">
              Winner: {match.winnerId === user._id ? "You" : "Opponent"}
            </span>
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1">
            View Details
          </Button>
          {match.streamUrl && (
            <Button variant="outline">
              Watch Stream
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Matches</h1>
        <p className="text-muted-foreground">
          Track your gaming progress and earnings
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <GamepadIcon className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{user.totalMatches || 0}</p>
                <p className="text-sm text-muted-foreground">Total Matches</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{user.totalWins || 0}</p>
                <p className="text-sm text-muted-foreground">Wins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">₹{(user.totalEarnings || 0).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">
                  {user.totalMatches ? Math.round((user.totalWins || 0) / user.totalMatches * 100) : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Win Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Matches Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active ({activeMatches.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedMatches.length})
          </TabsTrigger>
          <TabsTrigger value="disputed">
            Disputed ({disputedMatches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="space-y-4">
            {activeMatches.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <GamepadIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Active Matches</h3>
                  <p className="text-muted-foreground">
                    Join a match to start playing!
                  </p>
                </CardContent>
              </Card>
            ) : (
              activeMatches.map((match: any) => (
                <MatchCard key={match._id} match={match} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="space-y-4">
            {completedMatches.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Completed Matches</h3>
                  <p className="text-muted-foreground">
                    Your completed matches will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              completedMatches.map((match: any) => (
                <MatchCard key={match._id} match={match} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="disputed">
          <div className="space-y-4">
            {disputedMatches.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Disputed Matches</h3>
                  <p className="text-muted-foreground">
                    Any disputed matches will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              disputedMatches.map((match: any) => (
                <MatchCard key={match._id} match={match} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}