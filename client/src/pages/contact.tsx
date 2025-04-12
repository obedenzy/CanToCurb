import { UserWithSubscription } from "@/lib/types";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ContactForm from "@/components/contact/contact-form";
import TrustedBy from "@/components/home/trusted-by";
import { PARTNERS } from "@/lib/constants";

type ContactProps = {
  user: UserWithSubscription | null;
};

export default function Contact({ user }: ContactProps) {
  return (
    <>
      <Navbar user={user} />
      
      <main>
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 p-8 md:p-12">
                  <h2 className="text-3xl font-bold text-secondary mb-4">Contact CanMonkey</h2>
                  <p className="text-gray-600 mb-6">
                    Send your questions or feedback through our online form for the quickest 
                    response from our support team. We're here to ensure you have a great 
                    experience with CanMonkey!
                  </p>
                  
                  <h3 className="text-xl font-semibold text-secondary mb-4">
                    Trusted by more than 10,000+ properties to handle trash day.
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                    {PARTNERS.slice(0, 6).map((partner, index) => (
                      <div key={index} className="flex items-center text-gray-800 font-bold">
                        {partner.name}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="font-semibold text-secondary mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <p>📞 (480) 405-4595</p>
                      <p>📍 528 South Mill Ave, Suite 201<br />Tempe, AZ 85281</p>
                      <p>⏱️ Monday - Friday: 9am - 5pm MST</p>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 p-8 md:p-12 bg-white">
                  <h3 className="text-lg font-semibold text-secondary mb-4">
                    Fill out the form to connect with us. It's easier than sending smoke signals.
                  </h3>
                  
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Map section - would be implemented with a real map integration in production */}
        <section className="py-12 bg-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-secondary mb-4">Where We Serve</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                We're rapidly expanding to new areas. Enter your address during signup 
                to check if we service your location, or contact us for more information.
              </p>
            </div>
            
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
              <div className="text-gray-600">
                Interactive service area map would be displayed here with Google Maps or similar integration
              </div>
            </div>
          </div>
        </section>
        
        <TrustedBy />
      </main>
      
      <Footer />
    </>
  );
}
