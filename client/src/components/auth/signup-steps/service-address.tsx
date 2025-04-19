import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceAddressSchema } from "@/lib/validations";
import { SignupFormData } from "@/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type ServiceAddressProps = {
  defaultValues: Partial<SignupFormData>;
  onSubmit: (data: Partial<SignupFormData>) => void;
  onBack: () => void;
};

export default function ServiceAddress({ defaultValues, onSubmit, onBack }: ServiceAddressProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<Partial<SignupFormData>>({
    resolver: zodResolver(serviceAddressSchema),
    defaultValues: {
      address1: defaultValues.address1 || "",
      address2: defaultValues.address2 || "",
      city: defaultValues.city || "",
      state: defaultValues.state || "",
      zip: defaultValues.zip || "",
      country: defaultValues.country || "US",
      sameBillingAddress: defaultValues.sameBillingAddress ?? true,
    },
  });

  const handleSubmit = async (data: Partial<SignupFormData>) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Service Address</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="address1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address 1</FormLabel>
                <FormControl>
                  <Input placeholder="Street Address" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address 2</FormLabel>
                <FormControl>
                  <Input placeholder="Apt, Suite, etc. (optional)" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP</FormLabel>
                  <FormControl>
                    <Input placeholder="ZIP Code" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input value="US" {...field} disabled={true} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h3 className="text-lg font-semibold mb-4 mt-6">Billing Address</h3>
          <FormField
            control={form.control}
            name="sameBillingAddress"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Same as service address?</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {!form.watch("sameBillingAddress") && (
            <div className="space-y-4 p-4 border border-gray-200 rounded-md mt-4">
              <p className="text-gray-500">Please enter your billing address details.</p>
              {/* Billing address fields would go here if needed */}
              <p className="text-gray-500 italic">Additional billing address fields will be collected later.</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
              BACK
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  CONTINUING...
                </>
              ) : (
                "CONTINUE"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
