import { University, Facebook, Twitter, Linkedin, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-bank-navy text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <University className="text-2xl mr-3" />
              <span className="text-xl font-bold">Unity Banking</span>
            </div>
            <p className="text-gray-300 mb-4" data-testid="text-footer-description">
              Your trusted partner for all banking and financial services with over 25 years of excellence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="link-facebook">
                <Facebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="link-twitter">
                <Twitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="link-linkedin">
                <Linkedin className="text-xl" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="link-deposit-schemes">Deposit Schemes</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="link-loan-services">Loan Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="link-online-banking">Online Banking</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="link-mobile-banking">Mobile Banking</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="link-contact-us">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="link-faqs">FAQs</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="link-terms">Terms & Conditions</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="link-privacy">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center" data-testid="contact-phone">
                <Phone className="mr-2 w-4 h-4" />
                <span>+91-1234567890</span>
              </li>
              <li className="flex items-center" data-testid="contact-email">
                <Mail className="mr-2 w-4 h-4" />
                <span>info@unitybanking.com</span>
              </li>
              <li className="flex items-center" data-testid="contact-address">
                <MapPin className="mr-2 w-4 h-4" />
                <span>Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p data-testid="text-copyright">
            &copy; 2023 Unity Banking. All rights reserved. Licensed and regulated banking services.
          </p>
        </div>
      </div>
    </footer>
  );
}
