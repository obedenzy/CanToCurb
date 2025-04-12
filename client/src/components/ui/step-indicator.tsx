import { cn } from "@/lib/utils";
import { Fragment } from "react";

type Step = {
  id: number;
  name: string;
};

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((step, index) => (
        <Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                currentStep >= step.id
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-600"
              )}
            >
              {step.id}
            </div>
            <span className="text-xs mt-2 text-gray-600">{step.name}</span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-1 mx-2",
                currentStep > step.id ? "bg-primary" : "bg-gray-300"
              )}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}
