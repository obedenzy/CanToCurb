import { Star } from "lucide-react";

const testimonials = [
  {
    content: "I can't believe I used to waste time every week taking the trash cans out. TrashMonkey has been a game-changer for me and my family.",
    author: "Sarah Johnson",
    role: "Homeowner",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    content: "As a property manager with multiple rentals, TrashMonkey has simplified our operations and improved our guest experience. Highly recommend!",
    author: "Michael Thompson",
    role: "Property Manager",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    content: "For my vacation rental, having TrashMonkey handle the bins is essential. My guests love that they don't have to figure out trash day, and I never worry about missed pickups.",
    author: "Emily Rodriguez",
    role: "Vacation Rental Owner",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
  }
];

function RatingStars() {
  return (
    <div className="flex items-center mb-4">
      {[1, 2, 3, 4, 5].map((_, index) => (
        <Star key={index} className="text-primary h-5 w-5 fill-current" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-16 bg-neutral">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary">What our customers say</h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">Join thousands of satisfied customers who have taken trash day off their to-do list.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <RatingStars />
              <blockquote className="text-gray-600 mb-4">
                "{testimonial.content}"
              </blockquote>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="h-10 w-10 rounded-full object-cover mr-3"
                />
                <div>
                  <p className="font-medium text-secondary">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
