import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import houseTrashSvg from "@/assets/house-trash.svg";

export default function Hero() {
  return (
    <section className="bg-white py-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="max-w-lg">
            <h1 className="text-4xl sm:text-5xl font-bold text-secondary tracking-tight mb-4">
              Never take the trash out again.
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              TrashMonkey's Can-to-Curb service takes your bins to the curb on trash day and returns them after collection. One less thing to worry about.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative h-64 sm:h-72 md:h-80 lg:h-96">
              <img
                src={houseTrashSvg}
                alt="Modern house with trash bins at the curb"
                className="rounded-lg shadow-lg object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
