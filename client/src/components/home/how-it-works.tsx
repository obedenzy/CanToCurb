import { ListTodo, Trash2, Undo2 } from "lucide-react";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

export default function HowItWorks() {
  // Map of step icon names to actual components
  const iconMap: Record<string, React.ReactNode> = {
    ListTodo: <ListTodo className="h-6 w-6" />,
    Trash2: <Trash2 className="h-6 w-6" />,
    Undo2: <Undo2 className="h-6 w-6" />,
  };

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary mb-4">How it works</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">You sign up online and never have to worry about taking out the trash again. It's that simple!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-light rounded-lg p-6 mb-4 inline-flex items-center justify-center w-16 h-16 mx-auto text-primary">
                {iconMap[step.icon]}
              </div>
              <h3 className="text-xl font-bold mb-3">{index + 1}. {step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
