import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  socialMediaLink: z.string().url({ message: "Please enter a valid URL." }),
  reason: z.string().min(20, {
    message: "Reason must be at least 20 characters.",
  }),
});

export function HostVerification() {
  const requestHostVerification = useMutation(api.users.requestHostVerification);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      socialMediaLink: "",
      reason: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await requestHostVerification(values);
      toast.success("Host verification request submitted successfully!");
      form.reset();
    } catch (error) {
      console.error("Error submitting host verification request:", error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }

  return (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">Apply for Host Verification</h3>
        <p className="text-sm text-muted-foreground">
            Complete the form below to apply to become a verified host. This will allow you to create and manage matches.
        </p>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
            control={form.control}
            name="socialMediaLink"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Social Media / Portfolio Link</FormLabel>
                <FormControl>
                    <Input placeholder="https://your-profile.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Why do you want to be a host?</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="Tell us about your experience in hosting tournaments or why you'd be a good host."
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
        </form>
        </Form>
    </div>
  );
}