import Link from "next/link";
import {
  Mail,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
} from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Stores", href: "/store" },
  { name: "Kredmart Deals", href: "/deals" },
  { name: "About Us", href: "/about" },
];

const supportLinks = [
  { name: "Feedback", href: "/feedback" },
  { name: "Warranty", href: "/warranty" },

  { name: "Privacy Policy", href: "/privacy-policy" },
];

const CONTACT_EMAIL = "support@kredmart.com";
const WHATSAPP_DISPLAY = "+2349057871672";
const WHATSAPP_LINK = "https://wa.me/2349057871672";

export default function SiteFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:pl-24 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-8">
          {/* Brand */}
          <div className="lg:col-span-3">
            <Link href="/" className="inline-flex items-center h-10">
              <img
                src="/Kredmart Logo-02.png"
                alt="Kredmart Logo"
                className="h-6 w-auto"
                style={{ maxWidth: 180 }}
              />
            </Link>
            <p className="mt-3 text-gray-300 text-sm leading-relaxed">
              Your credit-powered e-commerce platform. Access instant wallet
              loans and shop top products with the best deals.
            </p>

            {/* Contact Info - Shows on mobile after summary */}
            <div className="mt-4 lg:hidden">
              <h3 className="text-white font-semibold mb-2 text-sm">
                Contact Info
              </h3>
              <ul className="space-y-1.5 text-[13px]">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-gray-300 hover:text-white transition-colors whitespace-nowrap"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors whitespace-nowrap"
                  >
                    Chat us directly
                    <span className="sr-only">
                      {" "}
                      on WhatsApp {WHATSAPP_DISPLAY}
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-800 hover:border-gray-700 hover:bg-gray-900 transition"
              >
                <Facebook className="h-4 w-4 text-gray-300" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-800 hover:border-gray-700 hover:bg-gray-900 transition"
              >
                <Twitter className="h-4 w-4 text-gray-300" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-800 hover:border-gray-700 hover:bg-gray-900 transition"
              >
                <Instagram className="h-4 w-4 text-gray-300" />
              </a>
            </div>
          </div>

          {/* Links section */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {/* Quick Links */}
              <div className="min-w-0">
                <h3 className="text-white font-semibold mb-1 text-[12px] sm:text-sm md:text-base">
                  Quick Links
                </h3>
                <ul className="space-y-0.5">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors text-[12px] sm:text-[13px] md:text-sm break-words"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div className="min-w-0">
                <h3 className="text-white font-semibold mb-1 text-[12px] sm:text-sm md:text-base">
                  Support
                </h3>
                <ul className="space-y-0.5">
                  {supportLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors text-[12px] sm:text-[13px] md:text-sm whitespace-nowrap"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info - Shows on desktop */}
              <div className="hidden lg:block min-w-0">
                <h3 className="text-white font-semibold mb-1 text-[12px] sm:text-sm md:text-base">
                  Contact Info
                </h3>
                <ul className="space-y-1 text-[12px] sm:text-[13px] md:text-sm">
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-gray-300 hover:text-white transition-colors whitespace-nowrap"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors whitespace-nowrap"
                    >
                      Chat us directly
                      <span className="sr-only">
                        {" "}
                        on WhatsApp {WHATSAPP_DISPLAY}
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-gray-400 text-xs sm:text-sm">
              © {new Date().getFullYear()} KredMart. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
