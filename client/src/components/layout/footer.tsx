import { Link } from "wouter";
import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
import logo from "@/assets/logo.svg";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Products</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/pricing" className="text-gray-300 hover:text-white text-sm">Pricing</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Vacation Rentals</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Sure Home Warranty</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">OnDemand</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Can Cleaning</a></li>
              <li><Link href="/login" className="text-gray-300 hover:text-white text-sm">Client Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm">Contact</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Talk to Sales</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Coverage Area</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">About</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Earn CanRunning</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Affiliates</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Merch</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Terms & Conditions</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">CanRunner Terms</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Do Not Sell My Information</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">HQ</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-300 text-sm">
                <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (480) 405-4595
              </li>
              <li className="flex items-start text-gray-300 text-sm mt-2">
                <svg className="h-4 w-4 mr-2 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  528 South Mill Ave<br />
                  Suite 201<br />
                  Tempe, AZ 85281
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex items-center justify-between flex-col md:flex-row">
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            
            <div className="mt-6 md:mt-0">
              <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} TrashMonkey LLC. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-black py-4">
        <div className="container mx-auto px-4 text-center text-gray-300">
          <div className="text-6xl font-bold">TrashMonkey</div>
          <div className="mt-2 text-sm">Never take the trash out again.</div>
        </div>
      </div>
    </footer>
  );
}
