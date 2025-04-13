import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import Home from "./pages/home";
import Pricing from "./pages/pricing";
import Contact from "./pages/contact";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Checkout from "./pages/checkout";
import CheckoutSuccess from "./pages/checkout-success";
import Subscribe from "@/pages/subscribe";
import SubscribeSuccess from "@/pages/subscribe-success";
import OnDemand from "./pages/on-demand";
import AdminDashboard from "./pages/admin/dashboard";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { UserWithSubscription } from "./lib/types";
import OnDemandRequest from "@/pages/ondemand-request"; // Added import


// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

function Router() {
  const [user, setUser] = useState<UserWithSubscription | null>(null);

  // Fetch auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth-status');
        const data = await response.json();

        if (data.authenticated && data.user) {
          setUser(data.user as UserWithSubscription);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to check auth status:", error);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} setUser={setUser} />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/contact" component={Contact} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />

          {/* New payment routes */}
          <Route path="/checkout">
            {() => <Checkout />}
          </Route>
          <Route path="/checkout/success">
            {() => <CheckoutSuccess />}
          </Route>
          <Route path="/subscribe">
            {() => <Subscribe />}
          </Route>
          <Route path="/subscribe/success">
            {() => <SubscribeSuccess />}
          </Route>

          {/* On-demand service route */}
          <Route path="/on-demand">
            {() => <OnDemand user={user} />}
          </Route>
          <Route path="/ondemand-request" component={OnDemandRequest} /> {/* Added route for OnDemandRequest */}

          {/* Admin dashboard route */}
          <Route path="/admin/dashboard" component={AdminDashboard} />

          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Elements stripe={stripePromise}>
        <Router />
        <Toaster />
      </Elements>
    </QueryClientProvider>
  );
}

export default App;