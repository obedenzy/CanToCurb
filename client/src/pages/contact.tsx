import React from "react";
import ContactForm from "@/components/contact/contact-form";
import { Helmet } from "react-helmet";

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Us - TrashMonkey</title>
        <meta name="description" content="Get in touch with TrashMonkey for questions about our trash and recycling can-to-curb service. We're here to help!" />
      </Helmet>
      
      <section id="contact" className="py-16 bg-neutral">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl font-bold text-secondary mb-6">Contact TrashMonkey</h1>
              <p className="text-lg text-gray-600 mb-8">
                Send your questions or feedback through our online form for the quickest response from our support team. We're here to ensure you have a great experience with TrashMonkey!
              </p>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-secondary mb-4">Trusted by more than 10,000+ properties to handle trash day.</h2>
                <div className="flex flex-wrap gap-8 items-center opacity-70">
                  <div className="h-7 text-gray-400">HOMES & VILLAS</div>
                  <div className="h-7 text-gray-400">ILOVEVACATIONS</div>
                  <div className="h-7 text-gray-400">AVANTSTAY</div>
                  <div className="h-7 text-gray-400">GoodNight</div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h3 className="font-semibold text-secondary mb-2">Our Office</h3>
                <p className="text-gray-600">
                  528 South Mill Ave<br />
                  Suite 201<br />
                  Tempe, AZ 85281
                </p>
                <p className="text-gray-600 mt-2">
                  Phone: (480) 405-4595<br />
                  Email: support@trashmonkey.com
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-secondary mb-2">Hours of Operation</h3>
                <p className="text-gray-600">
                  Monday - Friday: 8:00 AM - 6:00 PM MST<br />
                  Saturday: 9:00 AM - 2:00 PM MST<br />
                  Sunday: Closed
                </p>
                <p className="text-gray-600 mt-2">
                  Emergency support available 24/7 for existing customers.
                </p>
              </div>
            </div>
            
            <ContactForm />
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
            <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Map view of our office location</p>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            TrashMonkey Headquarters - Tempe, Arizona
          </p>
        </div>
      </section>
    </>
  );
}
