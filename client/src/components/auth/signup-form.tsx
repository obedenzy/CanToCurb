import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactInfoSchema, serviceAddressSchema, propertyInfoSchema, paymentInfoSchema } from "@/lib/validations";
import { SignupFormData, UserWithSubscription } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import ContactInformation from "./signup-steps/contact-information";
import ServiceAddress from "./signup-steps/service-address";
import PropertyInformation from "./signup-steps/property-information";
import PaymentInformation from "./signup-steps/payment-information";

type SignupFormProps = {
  setUser: (user: UserWithSubscription) => void;
};

export default function SignupForm({ setUser }: SignupFormProps) {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // State to store data from each step
  const [formData, setFormData] = useState<Partial<SignupFormData>>({
    sameBillingAddress: true,
    smsNotifications: false,
    isBusinessAccount: false,
    alternatingRecycle: false,
    trashCanCount: 1,
    recycleCanCount: 1,
    country: "US",
    isMonthlyBilling: true,
    termsAgreement: false,
  });

  // Progress calculation
  const progress = ((step - 1) / 3) * 100;

  // Step 1: Contact Information
  const handleContactInfoSubmit = async (data: Partial<SignupFormData>) => {
    try {
      const response = await apiRequest("POST", "/api/signup/contact-info", data);
      if (response.ok) {
        setFormData({ ...formData, ...data });
        setStep(2);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "There was an error submitting your information.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your information.",
        variant: "destructive",
      });
    }
  };

  // Step 2: Service Address
  const handleServiceAddressSubmit = async (data: Partial<SignupFormData>) => {
    try {
      const response = await apiRequest("POST", "/api/signup/service-address", data);
      if (response.ok) {
        setFormData({ ...formData, ...data });
        setStep(3);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "There was an error submitting your address.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your address.",
        variant: "destructive",
      });
    }
  };

  // Step 3: Property Information
  const handlePropertyInfoSubmit = async (data: Partial<SignupFormData>) => {
    try {
      const response = await apiRequest("POST", "/api/signup/property-info", data);
      if (response.ok) {
        setFormData({ ...formData, ...data });
        setStep(4);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "There was an error submitting your property information.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your property information.",
        variant: "destructive",
      });
    }
  };

  // Step 4: Payment Information (Complete Signup)
  const handlePaymentInfoSubmit = async (data: Partial<SignupFormData>) => {
    try {
      const completeFormData = { ...formData, ...data };
      const response = await apiRequest("POST", "/api/signup/complete", completeFormData);
      
      if (response.ok) {
        const result = await response.json();
        
        toast({
          title: "Success!",
          description: "Your account has been created and your 15-day free trial has started.",
        });
        
        setUser(result.user);
        navigate("/dashboard");
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "There was an error creating your account.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating your account.",
        variant: "destructive",
      });
    }
  };

  // Handle going back to the previous step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-secondary mb-2 text-center">15 Day Risk-Free Trial</h2>
          <p className="text-center text-gray-600 mb-8">
            Enjoy two weeks of free service to see if CanMonkey is the right fit for you, no strings attached! If you choose to continue enjoying our service after your free trial ends, you will automatically be charged your monthly plan fee.
          </p>
          
          {/* Progress indicators */}
          <div className="mb-4">
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} rounded-full`}>
                1
              </div>
              <div className={`ml-2 text-sm font-medium ${step >= 1 ? 'text-primary' : 'text-gray-500'}`}>Contact Information</div>
            </div>
            <div className="w-16 h-1 bg-gray-200 mx-2">
              <div className="h-1 bg-primary" style={{ width: step > 1 ? '100%' : '0%' }}></div>
            </div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} rounded-full`}>
                2
              </div>
              <div className={`ml-2 text-sm font-medium ${step >= 2 ? 'text-primary' : 'text-gray-500'}`}>Service Address</div>
            </div>
            <div className="w-16 h-1 bg-gray-200 mx-2">
              <div className="h-1 bg-primary" style={{ width: step > 2 ? '100%' : '0%' }}></div>
            </div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} rounded-full`}>
                3
              </div>
              <div className={`ml-2 text-sm font-medium ${step >= 3 ? 'text-primary' : 'text-gray-500'}`}>Property Information</div>
            </div>
            <div className="w-16 h-1 bg-gray-200 mx-2">
              <div className="h-1 bg-primary" style={{ width: step > 3 ? '100%' : '0%' }}></div>
            </div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 ${step >= 4 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} rounded-full`}>
                4
              </div>
              <div className={`ml-2 text-sm font-medium ${step >= 4 ? 'text-primary' : 'text-gray-500'}`}>Payment</div>
            </div>
          </div>
        </div>
        
        {/* Step 1: Contact Information */}
        {step === 1 && (
          <ContactInformation 
            defaultValues={formData}
            onSubmit={handleContactInfoSubmit}
          />
        )}
        
        {/* Step 2: Service Address */}
        {step === 2 && (
          <ServiceAddress
            defaultValues={formData}
            onSubmit={handleServiceAddressSubmit}
            onBack={handleBack}
          />
        )}
        
        {/* Step 3: Property Information */}
        {step === 3 && (
          <PropertyInformation
            defaultValues={formData}
            onSubmit={handlePropertyInfoSubmit}
            onBack={handleBack}
          />
        )}
        
        {/* Step 4: Payment Information */}
        {step === 4 && (
          <PaymentInformation
            defaultValues={formData}
            onSubmit={handlePaymentInfoSubmit}
            onBack={handleBack}
          />
        )}
      </CardContent>
    </Card>
  );
}
