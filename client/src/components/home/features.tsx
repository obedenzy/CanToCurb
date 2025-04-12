import { Clock, CheckCircle, DollarSign, Zap, Phone } from "lucide-react";

const features = [
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "Never Miss Trash Day",
    description: "We remember so you don't have to."
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: "Reliable Service",
    description: "Rain or shine, we'll be there every week."
  },
  {
    icon: <DollarSign className="h-6 w-6 text-primary" />,
    title: "Affordable Plans",
    description: "Pricing options to fit any budget."
  },
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "Easy Setup",
    description: "Sign up and we handle the rest."
  },
  {
    icon: <Phone className="h-6 w-6 text-primary" />,
    title: "24/7 Support",
    description: "Help is always just a click away."
  }
];

const partnerLogos = [
  { name: "Sonder", logo: "https://res.cloudinary.com/a-name-not-already-taken/image/upload/v1/examples/partner-logos/sonder.svg" },
  { name: "Vrbo", logo: "https://res.cloudinary.com/a-name-not-already-taken/image/upload/v1/examples/partner-logos/vrbo.svg" },
  { name: "TripAdvisor", logo: "https://res.cloudinary.com/a-name-not-already-taken/image/upload/v1/examples/partner-logos/tripadvisor.svg" },
  { name: "Airbnb", logo: "https://res.cloudinary.com/a-name-not-already-taken/image/upload/v1/examples/partner-logos/airbnb.svg" },
  { name: "Booking.com", logo: "https://res.cloudinary.com/a-name-not-already-taken/image/upload/v1/examples/partner-logos/booking.svg" },
];

export default function Features() {
  return (
    <section className="py-16 bg-neutral">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary">Welcome to the future of trash day</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            We handle your bins so you don't have to. Sleep in, stay warm, or just enjoy one less chore on your to-do list.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-all duration-300"
            >
              <div className="bg-primary bg-opacity-10 rounded-full p-3 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium text-secondary mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center flex-wrap gap-8 items-center opacity-60">
          {partnerLogos.map((partner, index) => (
            <div key={index} className="h-8">
              <span className="text-gray-400 text-sm font-medium">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
