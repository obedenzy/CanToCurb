import { Link } from "wouter";
import { Instagram, Facebook, Youtube, Linkedin } from "lucide-react";
import { FOOTER_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase mb-4">Products</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.products.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <a className="text-gray-400 hover:text-white transition-colors">{link.label}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase mb-4">Resources</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.resources.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <a className="text-gray-400 hover:text-white transition-colors">{link.label}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <a className="text-gray-400 hover:text-white transition-colors">{link.label}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <a className="text-gray-400 hover:text-white transition-colors">{link.label}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase mb-4">HQ</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <span className="mr-2">📞</span>
                (480) 405-4595
              </li>
              <li className="flex items-start text-gray-400">
                <span className="mr-2 mt-1">📍</span>
                <div>
                  528 South Mill Ave<br />
                  Suite 201<br />
                  Tempe, AZ 85281
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center py-4">
          <p className="text-gray-400">Need Help? <Link href="/contact"><a className="text-primary hover:underline">Contact Us</a></Link></p>
        </div>
        
        <div className="text-center">
          <h2 className="text-6xl md:text-8xl font-bold mb-8">CanMonkey</h2>
        </div>
        
        <div className="border-t border-gray-700 pt-6 mt-6">
          <div className="flex flex-col-reverse md:flex-row justify-between items-center">
            <div className="mt-4 md:mt-0">
              <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Can Monkey LLC</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
