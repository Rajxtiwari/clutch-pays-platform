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
import { useForm, zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  gameId: z.string().nonempty(),
  title: z.string().nonempty(),
  entryFee: z.number().min(10).max(10000),
  startTime: z.string().nonempty(),
  streamUrl: z.string().url(),
});

export default function CreateMatch() {
  const { user } = useAuth();
  const games = useQuery(api.games.list);
  const createMatch = useMutation(api.matches.create);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameId: "",
      title: "",
      entryFee: 50,
      startTime: "",
      streamUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || user.verificationLevel !== "host") {
      toast.error("Only verified hosts can create matches");
      return;
    }

    setIsLoading(true);
    try {
      const startTimeMs = new Date(values.startTime).getTime();
      
      await createMatch({
        gameId: values.gameId as any,
        title: values.title,
        entryFee: values.entryFee,
        startTime: startTimeMs,
        streamUrl: values.streamUrl,
      });

      toast.success("Match created successfully!");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to create match");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">Please sign in to create matches</p>
        </div>
      </div>
    );
  }

  if (user.verificationLevel !== "host") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Host Verification Required</h2>
          <p className="text-muted-foreground mb-4">
            Only verified hosts can create matches. Please apply for host verification.
          </p>
          <Button onClick={() => window.location.href = "/settings"}>
            Apply for Host Verification
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Match</h1>
        <p className="text-muted-foreground">
          Set up a new match for players to join
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Match Details</span>
          </CardTitle>
          <CardDescription>
            Configure your match settings and stream details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="gameId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a game" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {games?.map((game) => (
                          <SelectItem key={game._id} value={game._id}>
                            {game.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Match Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter match title" {...field} />
                    </FormControl>
                    <FormDescription>
                      Give your match a descriptive title
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="entryFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Fee (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="10"
                        max="10000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Entry fee between ₹10 and ₹10,000
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </FormControl>
                    <FormDescription>
                      When should the match start?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="streamUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stream URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://youtube.com/watch?v=..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a live stream URL for transparency
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Match...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Match
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}