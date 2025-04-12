import { Calendar, Bell, CreditCard, Recycle, Shield } from "lucide-react";
import { FEATURES, PARTNERS } from "@/lib/constants";

export default function Features() {
  // Map of feature icon names to actual components
  const iconMap: Record<string, React.ReactNode> = {
    Calendar: <Calendar className="h-6 w-6" />,
    Bell: <Bell className="h-6 w-6" />,
    CreditCard: <CreditCard className="h-6 w-6" />,
    Recycle: <Recycle className="h-6 w-6" />,
    Shield: <Shield className="h-6 w-6" />,
  };

  return (
    <section className="py-12 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary mb-4">Welcome to the future of trash day</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">CanMonkey handles all your trash and recycling needs so you don't have to worry about it.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
          {FEATURES.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                {iconMap[feature.icon]}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-8">
            <svg 
              className="w-full max-w-4xl h-auto rounded-lg shadow-md"
              viewBox="0 0 1200 300" 
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
            >
              <rect width="1200" height="300" fill="#E5E7EB" rx="8" />
              <rect x="100" y="180" width="80" height="120" fill="#333" rx="4" />
              <rect x="200" y="180" width="80" height="120" fill="#444" rx="4" />
              <rect x="300" y="180" width="80" height="120" fill="#555" rx="4" />
              <rect x="400" y="180" width="80" height="120" fill="#444" rx="4" />
              <rect x="500" y="180" width="80" height="120" fill="#333" rx="4" />
              <rect x="600" y="180" width="80" height="120" fill="#FF7A59" rx="4" />
              <rect x="700" y="180" width="80" height="120" fill="#333" rx="4" />
              <rect x="800" y="180" width="80" height="120" fill="#444" rx="4" />
              <rect x="900" y="180" width="80" height="120" fill="#555" rx="4" />
              <rect x="1000" y="180" width="80" height="120" fill="#444" rx="4" />
              <path d="M0 300 H1200" stroke="#777" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary mb-4">Trusted by more than 10,000+ properties</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mt-8">
            {PARTNERS.map((partner, index) => (
              <div key={index} className="flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <div className="h-8 text-gray-800 font-bold">{partner.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
