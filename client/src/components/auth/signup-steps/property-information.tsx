import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertyInfoSchema } from "@/lib/validations";
import { SignupFormData } from "@/lib/types";
import { WEEKDAYS, TRASH_CAN_OPTIONS } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type PropertyInformationProps = {
  defaultValues: Partial<SignupFormData>;
  onSubmit: (data: Partial<SignupFormData>) => void;
  onBack: () => void;
};

export default function PropertyInformation({ defaultValues, onSubmit, onBack }: PropertyInformationProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<Partial<SignupFormData>>({
    resolver: zodResolver(propertyInfoSchema),
    defaultValues: {
      trashDay: defaultValues.trashDay || "",
      recycleDay: defaultValues.recycleDay || "",
      alternatingRecycle: defaultValues.alternatingRecycle || false,
      trashCanCount: defaultValues.trashCanCount || 1,
      recycleCanCount: defaultValues.recycleCanCount || 1,
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
      <h3 className="text-lg font-semibold mb-4">Property Information</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="trashDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trash and Recycle Day</FormLabel>
                <p className="text-sm text-gray-500 mb-2">Separate trash and recycle days? Select the Premium or Business Plan.</p>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {WEEKDAYS.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
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
            name="alternatingRecycle"
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
                  <FormLabel>Alternating recycle weeks</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="trashCanCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Trash Cans</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    defaultValue={field.value?.toString()}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Count" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRASH_CAN_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
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
              name="recycleCanCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Recycle Cans</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    defaultValue={field.value?.toString()}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Count" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRASH_CAN_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
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

          <p className="text-sm text-gray-500 mb-6">
            After signing up, you'll have the option to provide additional details about your property, 
            such as can location, gate codes, photos, and other relevant information.
          </p>

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
