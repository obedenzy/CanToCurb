import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function OnDemandRequest() {
  return (
    <>
      <Helmet>
        <title>Schedule OnDemand Service | CanMonkey</title>
      </Helmet>

      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-secondary">Schedule Your OnDemand Service</h1>
            <p className="mt-2 text-gray-600">Choose a convenient time for your service</p>
          </div>

          {/* Add your custom scheduling form or component here */}
        </div>
      </main>

      <Footer />
    </>
  );
}
