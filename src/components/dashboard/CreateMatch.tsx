import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Calendar, Clock, DollarSign, GamepadIcon, Video } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function CreateMatch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const games = useQuery(api.games.list);
  const createMatch = useMutation(api.matches.create);

  const [formData, setFormData] = useState({
    gameId: "",
    title: "",
    entryFee: "",
    startTime: "",
    streamUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is a host
  if (user?.verificationLevel !== "host") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <GamepadIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Host Access Required</h3>
            <p className="text-muted-foreground mb-4">
              You need Host verification to create matches. Apply for Host status in your settings.
            </p>
            <Button onClick={() => navigate("/dashboard/settings")}>
              Go to Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const startTimeMs = new Date(formData.startTime).getTime();
      
      await createMatch({
        gameId: formData.gameId as any,
        title: formData.title,
        entryFee: parseFloat(formData.entryFee),
        startTime: startTimeMs,
        streamUrl: formData.streamUrl,
      });

      toast.success("Match created successfully!");
      navigate("/dashboard/my-matches");
    } catch (error) {
      toast.error("Failed to create match. Please try again.");
      console.error("Error creating match:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create a Match</h1>
        <p className="text-muted-foreground">
          Set up a new match for players to join and compete
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GamepadIcon className="h-5 w-5" />
            <span>Match Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Game Selection */}
            <div className="space-y-2">
              <Label htmlFor="game" className="flex items-center space-x-2">
                <GamepadIcon className="h-4 w-4" />
                <span>Game</span>
              </Label>
              <Select
                value={formData.gameId}
                onValueChange={(value) => handleInputChange("gameId", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a game" />
                </SelectTrigger>
                <SelectContent>
                  {games?.map((game) => (
                    <SelectItem key={game._id} value={game._id}>
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Match Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Match Name</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Pro Valorant 1v1 Championship"
                required
              />
            </div>

            {/* Entry Fee */}
            <div className="space-y-2">
              <Label htmlFor="entryFee" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Entry Fee (₹)</span>
              </Label>
              <Input
                id="entryFee"
                type="number"
                min="1"
                step="0.01"
                value={formData.entryFee}
                onChange={(e) => handleInputChange("entryFee", e.target.value)}
                placeholder="100.00"
                required
              />
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Start Time</span>
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>

            {/* Stream URL */}
            <div className="space-y-2">
              <Label htmlFor="streamUrl" className="flex items-center space-x-2">
                <Video className="h-4 w-4" />
                <span>Live Stream URL</span>
              </Label>
              <Input
                id="streamUrl"
                type="url"
                value={formData.streamUrl}
                onChange={(e) => handleInputChange("streamUrl", e.target.value)}
                placeholder="https://youtube.com/live/..."
                required
              />
              <p className="text-sm text-muted-foreground">
                Provide the URL where you'll be streaming the match live
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Creating..." : "Create Match"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Host Guidelines */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Host Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <p className="text-sm">
              Ensure your stream is live and stable before the match starts
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <p className="text-sm">
              Monitor both players fairly and declare the winner accurately
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <p className="text-sm">
              Be available for the entire duration of the match
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <p className="text-sm">
              Respond to any disputes or questions from players
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
