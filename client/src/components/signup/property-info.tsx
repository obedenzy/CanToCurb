import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const daysOfWeek = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" }
];

const canCounts = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" }
];

const formSchema = z.object({
  trashDay: z.string().min(1, "Please select your trash day"),
  recycleDay: z.string().optional(),
  trashCanCount: z.coerce.number().min(1).max(6),
  recycleCanCount: z.coerce.number().min(0).max(6),
  alternatingRecycle: z.boolean().default(false),
});

type PropertyInfoProps = {
  trashDay: string;
  recycleDay: string;
  trashCanCount: number;
  recycleCanCount: number;
  alternatingRecycle: boolean;
  updateFields: (fields: Partial<PropertyInfoProps>) => void;
};

export default function PropertyInfo({
  trashDay,
  recycleDay,
  trashCanCount,
  recycleCanCount,
  alternatingRecycle,
  updateFields,
}: PropertyInfoProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trashDay,
      recycleDay,
      trashCanCount,
      recycleCanCount,
      alternatingRecycle,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFields(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Property Information</h3>
        
        <div className="space-y-4">
          <h4 className="font-medium">Trash and Recycle Day</h4>
          <FormDescription>
            Separate trash and recycle days? Select the Premium or Business Plan.
          </FormDescription>
          
          <FormField
            control={form.control}
            name="trashDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trash Day</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {daysOfWeek.map(day => (
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
            name="recycleDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recycle Day (optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Same as trash day</SelectItem>
                    {daysOfWeek.map(day => (
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
        </div>
        
        <FormField
          control={form.control}
          name="alternatingRecycle"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Alternating recycle weeks</FormLabel>
                <FormDescription>
                  Recycling is collected every other week
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="trashCanCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Trash Cans</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select count" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {canCounts.map(count => (
                      <SelectItem key={count.value} value={count.value}>
                        {count.label}
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
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select count" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    {canCounts.map(count => (
                      <SelectItem key={count.value} value={count.value}>
                        {count.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="pt-4 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => history.back()}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white"
          >
            CONTINUE
          </Button>
        </div>
      </form>
    </Form>
  );
}
