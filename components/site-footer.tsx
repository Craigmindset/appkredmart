import Link from "next/link"

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Track Order", href: "/track-order" },
    { name: "Returns", href: "/returns" },
    { name: "Shipping Info", href: "/shipping" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Refund Policy", href: "/refunds" },
  ],
}

export default function SiteFooter() {
  return (
    <footer className="bg-black text-white">
      {/* Balanced content width */}
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:pl-24 py-10">
        {/* 12-col grid keeps left/right visually even */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-8">
          {/* Brand */}
          <div className="lg:col-span-3">
            <Link href="/" className="text-2xl font-bold">KredMart</Link>
            <p className="mt-3 text-gray-300 text-sm">
              Your trusted marketplace for electronics, gadgets, and more. Shop with confidence and get the best deals.
            </p>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-9">
            {/* Always single row; tighter gaps on small screens */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {/* Company */}
              <div className="min-w-0">
                <h3 className="text-white font-semibold mb-1.5 text-[11px] sm:text-xs md:text-sm lg:text-base">Company</h3>
                <ul className="space-y-1">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-gray-300 hover:text-white transition-colors text-[11px] sm:text-xs md:text-sm">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div className="min-w-0">
                <h3 className="text-white font-semibold mb-1.5 text-[11px] sm:text-xs md:text-sm lg:text-base">Support</h3>
                <ul className="space-y-1">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-gray-300 hover:text-white transition-colors text-[11px] sm:text-xs md:text-sm">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div className="min-w-0">
                <h3 className="text-white font-semibold mb-1.5 text-[11px] sm:text-xs md:text-sm lg:text-base">Legal</h3>
                <ul className="space-y-1">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-gray-300 hover:text-white transition-colors text-[11px] sm:text-xs md:text-sm">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar — same balanced wrapper */}
        <div className="mt-10 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} KredMart. All rights reserved.
            </p>
          
          </div>
        </div>
      </div>
    </footer>
  )
}
