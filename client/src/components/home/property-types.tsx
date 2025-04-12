import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const propertyTypes = [
  {
    title: "Home Owners",
    description: "Perfect for single-family homes. Never worry about taking the trash out again.",
    imageUrl: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Vacation Rentals",
    description: "Keep your short-term rental looking pristine for guests by ensuring bins are properly managed.",
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Property Managers",
    description: "Manage multiple properties under one account with our scalable enterprise solutions.",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const additionalProperties = [
  {
    title: "Apartments & Condos",
    description: "Perfect for multi-unit buildings where bin management can be a challenge.",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "HOAs & Communities",
    description: "Coordinated trash service for entire neighborhoods and communities.",
    imageUrl: "https://images.unsplash.com/photo-1448630360428-65456885c650?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Small Businesses",
    description: "Commercial trash solutions for offices, retail spaces, and restaurants.",
    imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

function PropertyCard({ title, description, imageUrl }: { title: string; description: string; imageUrl: string }) {
  return (
    <div className="bg-neutral rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-secondary mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link href="/signup" className="text-primary font-medium flex items-center">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
      <div className="h-40 bg-gray-200">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default function PropertyTypes() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary">Use one app to run one or all of your properties</h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">Whether you have a single home or manage multiple properties, our service scales with your needs.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {propertyTypes.map((property, index) => (
            <PropertyCard
              key={index}
              title={property.title}
              description={property.description}
              imageUrl={property.imageUrl}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {additionalProperties.map((property, index) => (
            <PropertyCard
              key={index}
              title={property.title}
              description={property.description}
              imageUrl={property.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
