import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Pricing from "@/pages/pricing";
import OnDemand from "@/pages/on-demand";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Contact from "@/pages/contact";
import Dashboard from "@/pages/dashboard";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { UserWithSubscription } from "@/lib/types";

function App() {
  const [user, setUser] = useState<UserWithSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiRequest("GET", "/api/auth/me");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        // Not authenticated, that's okay
        console.log("User not authenticated");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={() => <Home user={user} />} />
        <Route path="/pricing" component={() => <Pricing user={user} />} />
        <Route path="/on-demand" component={() => <OnDemand user={user} />} />
        <Route path="/login" component={() => <Login setUser={setUser} />} />
        <Route path="/signup" component={() => <Signup setUser={setUser} />} />
        <Route path="/contact" component={() => <Contact user={user} />} />
        <Route path="/dashboard" component={() => <Dashboard user={user} />} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
