import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { StepIndicator } from "@/components/ui/step-indicator";
import PersonalInfo from "./personal-info";
import AddressInfo from "./address-info";
import PropertyInfo from "./property-info";
import PaymentInfo from "./payment-info";
import { useMultiStepForm } from "@/hooks/use-multi-step-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

const steps = [
  { id: 1, name: "Contact" },
  { id: 2, name: "Address" },
  { id: 3, name: "Property" },
  { id: 4, name: "Payment" },
];

export default function SignupForm() {
  const [userData, setUserData] = useState({
    // Personal info
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    smsOptIn: false,
    
    // Address info
    street: "",
    city: "",
    state: "",
    zip: "",
    isBilling: true,
    
    // Property info
    trashDay: "",
    recycleDay: "",
    trashCanCount: 1,
    recycleCanCount: 1,
    alternatingRecycle: false,
    
    // Plan info
    planId: "",
    billingCycle: "monthly",
  });
  
  const queryParams = new URLSearchParams(window.location.search);
  const selectedPlanId = queryParams.get("plan");
  const selectedCycle = queryParams.get("cycle");
  
  useEffect(() => {
    if (selectedPlanId) {
      setUserData(prev => ({ ...prev, planId: selectedPlanId }));
    }
    if (selectedCycle && (selectedCycle === "monthly" || selectedCycle === "quarterly")) {
      setUserData(prev => ({ ...prev, billingCycle: selectedCycle }));
    }
  }, [selectedPlanId, selectedCycle]);
  
  const [addressId, setAddressId] = useState<number | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const updateFields = (fields: Partial<typeof userData>) => {
    setUserData(prev => ({ ...prev, ...fields }));
  };
  
  const {
    currentStepIndex,
    step,
    isFirstStep,
    isLastStep,
    back,
    next,
    goTo
  } = useMultiStepForm([
    <PersonalInfo key="personal" {...userData} updateFields={updateFields} />,
    <AddressInfo key="address" {...userData} updateFields={updateFields} />,
    <PropertyInfo key="property" {...userData} updateFields={updateFields} />,
    <PaymentInfo key="payment" {...userData} updateFields={updateFields} />
  ]);
  
  const handleSubmitPersonalInfo = async () => {
    try {
      // Register user
      await apiRequest("POST", "/api/register", {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        smsOptIn: userData.smsOptIn
      });
      
      // Authenticated by server after registration
      await queryClient.invalidateQueries({ queryKey: ['/api/auth-status'] });
      
      next();
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmitAddressInfo = async () => {
    try {
      const response = await apiRequest("POST", "/api/address", {
        street: userData.street,
        city: userData.city,
        state: userData.state,
        zip: userData.zip,
        isBilling: userData.isBilling,
        isService: true
      });
      
      const data = await response.json();
      setAddressId(data.address.id);
      
      next();
    } catch (error: any) {
      toast({
        title: "Failed to Save Address",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmitPropertyInfo = async () => {
    if (!addressId) {
      toast({
        title: "Error",
        description: "Address information is missing. Please go back and try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await apiRequest("POST", "/api/property", {
        addressId: addressId,
        trashDay: userData.trashDay,
        recycleDay: userData.recycleDay,
        trashCanCount: userData.trashCanCount,
        recycleCanCount: userData.recycleCanCount,
        alternatingRecycle: userData.alternatingRecycle
      });
      
      next();
    } catch (error: any) {
      toast({
        title: "Failed to Save Property Details",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmitPaymentInfo = async () => {
    // Handled in PaymentInfo component via Stripe
    toast({
      title: "Success!",
      description: "Your account has been created and your subscription is active.",
    });
    
    navigate("/dashboard");
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLastStep) {
      handleSubmitPaymentInfo();
    } else if (currentStepIndex === 0) {
      handleSubmitPersonalInfo();
    } else if (currentStepIndex === 1) {
      handleSubmitAddressInfo();
    } else if (currentStepIndex === 2) {
      handleSubmitPropertyInfo();
    }
  };
  
  return (
    <section id="signup" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-neutral rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-secondary">Start your free trial</h2>
              <p className="mt-2 text-gray-600">15 days risk-free, no commitment required</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <StepIndicator steps={steps} currentStep={currentStepIndex + 1} />
              
              <form onSubmit={handleSubmit}>
                {step}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
