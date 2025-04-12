import { useState } from "react";
import { Link } from "wouter";
import { 
  Menu, 
  X, 
  ChevronDown, 
  User,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { UserWithSubscription } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavbarProps = {
  user: UserWithSubscription | null;
  setUser?: (user: UserWithSubscription | null) => void;
  transparent?: boolean;
};

export default function Navbar({ user, setUser, transparent = false }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      if (setUser) {
        setUser(null);
      }
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was a problem logging you out",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className={`${transparent ? 'bg-transparent' : 'bg-white shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <div className="text-secondary font-bold text-xl flex items-center">
                  <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
                    <path d="M9.5 8.5c0 .83-.67 1.5-1.5 1.5S6.5 9.33 6.5 8.5 7.17 7 8 7s1.5.67 1.5 1.5zm6 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S13.17 7 14 7s1.5.67 1.5 1.5zM12 12c-2.33 0-4.31 1.46-5.11 3.5h10.22c-.8-2.04-2.78-3.5-5.11-3.5z" fill="currentColor"/>
                  </svg>
                  CanMonkey
                </div>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Home
              </Link>
              <Link href="/pricing" className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Pricing
              </Link>
              <Link href="/on-demand" className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  OnDemand
              </Link>
              {user && (
                <Link href="/dashboard">
                  <a className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Dashboard
                  </a>
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User size={16} /> {user.firstName}
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <a className="w-full cursor-pointer">
                        Dashboard
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <a className="text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium">
                    Login
                  </a>
                </Link>
                <Link href="/contact">
                  <a className="text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium">
                    Contact
                  </a>
                </Link>
                <Link href="/signup">
                  <a className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium">
                    Try Free
                  </a>
                </Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white shadow-md">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/">
              <a className="text-gray-500 hover:text-primary block px-3 py-2 text-base font-medium">
                Home
              </a>
            </Link>
            <Link href="/pricing">
              <a className="text-gray-500 hover:text-primary block px-3 py-2 text-base font-medium">
                Pricing
              </a>
            </Link>
            <Link href="/on-demand">
              <a className="text-gray-500 hover:text-primary block px-3 py-2 text-base font-medium">
                OnDemand
              </a>
            </Link>
            {user && (
              <Link href="/dashboard">
                <a className="text-gray-500 hover:text-primary block px-3 py-2 text-base font-medium">
                  Dashboard
                </a>
              </Link>
            )}
            {user ? (
              <>
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="px-4 flex items-center">
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-gray-500 hover:text-primary block px-3 py-2 text-base font-medium"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <a className="text-gray-500 hover:text-primary block px-3 py-2 text-base font-medium">
                    Login
                  </a>
                </Link>
                <Link href="/contact">
                  <a className="text-gray-500 hover:text-primary block px-3 py-2 text-base font-medium">
                    Contact
                  </a>
                </Link>
                <Link href="/signup">
                  <a className="bg-primary text-white block px-3 py-2 text-base font-medium">
                    Try Free
                  </a>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
