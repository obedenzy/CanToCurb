import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  interest: z.string().min(1, "Please select an interest"),
  cities: z.string().optional(),
  properties: z.string().optional(),
  message: z.string().optional(),
  smsAgreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to receive text messages",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const interestOptions = [
  { value: "can-to-curb", label: "Can-to-Curb Service" },
  { value: "enterprise", label: "Enterprise Plan" },
  { value: "partnership", label: "Partnership Opportunity" },
  { value: "support", label: "Customer Support" },
  { value: "other", label: "Other" },
];

const propertyOptions = [
  { value: "none", label: "Select..." },
  { value: "1", label: "1 property" },
  { value: "2-5", label: "2-5 properties" },
  { value: "6-10", label: "6-10 properties" },
  { value: "11-20", label: "11-20 properties" },
  { value: "20+", label: "20+ properties" },
];

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interest: "",
      cities: "",
      properties: "",
      message: "",
      smsAgreement: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/contact", values);
      toast({
        title: "Success!",
        description: "Your message has been sent. We'll get back to you shortly.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        Fill out the form to connect with us. It's easier than sending smoke signals.
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="jane@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 555-5555" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest <span className="text-red-500">*</span></FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {interestOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="cities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Cities</FormLabel>
                  <FormControl>
                    <Input placeholder="Phoenix, Dallas..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="properties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Properties</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {propertyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="How can we help?"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="smsAgreement"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    By checking this box, you agree to receive text messages from TrashMonkey. Message frequency varies. Msg & data rates may apply. Reply HELP for assistance, STOP to opt out.
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>

          <p className="text-xs text-gray-500">
            SMS Sharing Disclosure: We will never share your mobile information with third parties or affiliates for marketing or promotional purposes at any time.
          </p>
        </form>
      </Form>
    </div>
  );
}
