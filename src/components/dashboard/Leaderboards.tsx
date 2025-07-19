import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Star, Crown } from "lucide-react";
import { useQuery } from "convex/react";

export function Leaderboards() {
  const topEarners = useQuery(api.users.getTopEarners);
  const topWinRate = useQuery(api.users.getTopWinRate);
  const topHosts = useQuery(api.users.getTopHosts);

  const LeaderboardCard = ({ 
    user, 
    rank, 
    metric, 
    value 
  }: { 
    user: any; 
    rank: number; 
    metric: string; 
    value: string | number;
  }) => {
    const getRankIcon = (rank: number) => {
      switch (rank) {
        case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
        case 2: return <Trophy className="h-5 w-5 text-gray-400" />;
        case 3: return <Trophy className="h-5 w-5 text-amber-600" />;
        default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: rank * 0.1 }}
      >
        <Card className={`${rank <= 3 ? 'border-primary/50 bg-primary/5' : ''}`}>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12">
                {getRankIcon(rank)}
              </div>
              
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.image} />
                <AvatarFallback>
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="font-semibold">{user.name || 'Anonymous'}</h3>
                <p className="text-sm text-muted-foreground">{metric}</p>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{value}</p>
                {rank <= 3 && (
                  <Badge variant="secondary" className="text-xs">
                    Top {rank}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Leaderboards</h1>
        <p className="text-muted-foreground">
          See who's dominating the gaming arena
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">₹2,45,670</p>
                <p className="text-sm text-muted-foreground">Total Payouts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Matches Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">Active Players</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="earners" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="earners">Top Earners</TabsTrigger>
          <TabsTrigger value="winrate">Win Rate</TabsTrigger>
          <TabsTrigger value="hosts">Top Hosts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="earners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Top Earners This Month</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topEarners?.map((user, index) => (
                <LeaderboardCard
                  key={user._id}
                  user={user}
                  rank={index + 1}
                  metric="Total Earnings"
                  value={`₹${user.totalEarnings || 0}`}
                />
              )) || (
                <p className="text-center text-muted-foreground py-8">
                  No earnings data available yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="winrate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Highest Win Rate (Min. 20 matches)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topWinRate?.map((user, index) => {
                const winRate = user.totalMatches ? Math.round((user.totalWins || 0) / user.totalMatches * 100) : 0;
                return (
                  <LeaderboardCard
                    key={user._id}
                    user={user}
                    rank={index + 1}
                    metric={`${user.totalWins}/${user.totalMatches} matches`}
                    value={`${winRate}%`}
                  />
                );
              }) || (
                <p className="text-center text-muted-foreground py-8">
                  No win rate data available yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hosts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Top Rated Hosts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topHosts?.map((user, index) => (
                <LeaderboardCard
                  key={user._id}
                  user={user}
                  rank={index + 1}
                  metric="Host Rating"
                  value={`${user.hostRating || 0}/5 ⭐`}
                />
              )) || (
                <p className="text-center text-muted-foreground py-8">
                  No host data available yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}