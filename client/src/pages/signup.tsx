import { UserWithSubscription } from "@/lib/types";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import SignupForm from "@/components/auth/signup-form";
import { Link } from "wouter";

type SignupProps = {
  setUser: (user: UserWithSubscription) => void;
};

export default function Signup({ setUser }: SignupProps) {
  return (
    <>
      <Navbar user={null} />
      
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-secondary">Start Your 15-Day Free Trial</h1>
            <p className="text-gray-600 mt-2">
              Already have an account? 
              <Link href="/login">
                <a className="text-primary hover:underline ml-2">Sign in</a>
              </Link>
            </p>
          </div>
          
          <SignupForm setUser={setUser} />
        </div>
      </main>
      
      <Footer />
    </>
  );
}
