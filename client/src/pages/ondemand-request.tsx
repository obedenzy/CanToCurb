
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function OnDemandRequest() {
  useEffect(() => {
    // Load Cal.com script and initialize
    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // Initialize Cal after script loads
      // @ts-ignore
      window.Cal?.("init", "30min", { origin: "https://cal.com" });
      // @ts-ignore
      window.Cal?.ns["30min"]("inline", {
        elementOrSelector: "#my-cal-inline",
        config: { layout: "month_view" },
        calLink: "obedenz/30min",
      });
      // @ts-ignore
      window.Cal?.ns["30min"]("ui", {
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Schedule OnDemand Service | CanMonkey</title>
      </Helmet>
      
      <Navbar user={null} />
      
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-secondary">Schedule Your OnDemand Service</h1>
            <p className="mt-2 text-gray-600">Choose a convenient time for your service</p>
          </div>
          
          <div className="w-full h-[800px] overflow-hidden rounded-lg shadow-lg">
            <div id="my-cal-inline" className="w-full h-full"></div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
