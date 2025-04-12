import { PARTNERS } from "@/lib/constants";

export default function TrustedBy() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-secondary mb-4">Trusted by more than 10,000+ properties</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {PARTNERS.map((partner, index) => (
            <div key={index} className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <div className="h-6 text-gray-800 font-bold">{partner.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
