import { ClipboardList, Sparkles, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: <ClipboardList className="h-8 w-8" />,
    number: 1,
    title: "Choose a Plan",
    description: "Choose a plan, answer a few simple questions, and we'll create your account with all necessary property information."
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    number: 2,
    title: "We Take Out",
    description: "We show up at your home the day prior to collection day and move your cans out to the curb for you."
  },
  {
    icon: <BookOpen className="h-8 w-8" />,
    number: 3,
    title: "We Return",
    description: "After your trash is collected, we return the cans to your designated location, so you never have to worry."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-neutral">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary">How it works</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">You sign up online and never have to worry about taking out the trash again. It's that simple!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary-light text-white mx-auto">
                {step.icon}
                <div className="absolute -top-2 -right-2 bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white font-bold">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-6">Take on a route and earn CanRunning.</p>
          <div className="flex items-center justify-center space-x-6 flex-wrap">
            <Link href="#">
              <Button className="bg-black hover:bg-black/80 text-white">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10s10-4.477 10-10C20 4.477 15.523 0 10 0zm3.707 14.293a1 1 0 01-1.414 0L10 12l-2.293 2.293a1 1 0 01-1.414-1.414l2.293-2.293L6.293 8.293a1 1 0 011.414-1.414L10 9.172l2.293-2.293a1 1 0 011.414 1.414L11.414 10l2.293 2.293a1 1 0 010 1.414z"></path>
                </svg>
                App Store
              </Button>
            </Link>
            <Link href="#">
              <Button className="bg-black hover:bg-black/80 text-white">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10s10-4.477 10-10C20 4.477 15.523 0 10 0zm3.707 14.293a1 1 0 01-1.414 0L10 12l-2.293 2.293a1 1 0 01-1.414-1.414l2.293-2.293L6.293 8.293a1 1 0 011.414-1.414L10 9.172l2.293-2.293a1 1 0 011.414 1.414L11.414 10l2.293 2.293a1 1 0 010 1.414z"></path>
                </svg>
                Google Play
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
