import { UserWithSubscription } from "@/lib/types";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import LoginForm from "@/components/auth/login-form";
import { Link } from "wouter";

type LoginProps = {
  setUser: (user: UserWithSubscription) => void;
};

export default function Login({ setUser }: LoginProps) {
  return (
    <>
      <Navbar user={null} />
      
      <main className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-secondary">Welcome Back</h1>
            <p className="text-gray-600 mt-2">
              Don't have an account yet? 
              <Link href="/signup">
                <a className="text-primary hover:underline ml-2">Sign up for a free trial</a>
              </Link>
            </p>
          </div>
          
          <LoginForm setUser={setUser} />
        </div>
      </main>
      
      <Footer />
    </>
  );
}
