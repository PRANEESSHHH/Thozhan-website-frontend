import React from 'react';
import { Hammer, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Shield, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section with logo and brief description */}
        <div className="py-12 flex flex-col items-center text-center border-b border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <div className='bg-blue-600 h-10 w-10 rounded-lg flex items-center justify-center shadow-md'>
              <Hammer className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-900'>THOZHAN</h2>
              <span className='text-xs text-blue-600 font-medium tracking-wider -mt-1 block'>BLUE COLLAR JOB PORTAL</span>
            </div>
          </div>
          <p className="text-gray-600 max-w-xl text-center mb-6">
            India's premier blue-collar job platform connecting skilled workers with quality employers across construction, manufacturing, logistics, and service industries.
          </p>
          <div className="flex space-x-5">
            <a href="https://facebook.com" className="bg-white p-2 rounded-full shadow-sm text-gray-500 hover:text-blue-600 hover:shadow-md transition-all" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" className="bg-white p-2 rounded-full shadow-sm text-gray-500 hover:text-blue-600 hover:shadow-md transition-all" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" className="bg-white p-2 rounded-full shadow-sm text-gray-500 hover:text-blue-600 hover:shadow-md transition-all" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" className="bg-white p-2 rounded-full shadow-sm text-gray-500 hover:text-blue-600 hover:shadow-md transition-all" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        {/* Middle section with links */}
        <div className="py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
              <span className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                <Shield className="w-3 h-3 text-blue-600" />
              </span>
              For Workers
            </h3>
            <ul className="space-y-3">
              <li><Link to="/jobs" className="text-gray-600 hover:text-blue-600 text-sm hover:translate-x-1 transition-transform inline-block">Find Jobs</Link></li>
              <li><Link to="/profile" className="text-gray-600 hover:text-blue-600 text-sm hover:translate-x-1 transition-transform inline-block">My Profile</Link></li>
              <li><Link to="/profile#applications" className="text-gray-600 hover:text-blue-600 text-sm hover:translate-x-1 transition-transform inline-block">My Applications</Link></li>
              <li><Link to="/jobs?saved=true" className="text-gray-600 hover:text-blue-600 text-sm hover:translate-x-1 transition-transform inline-block">Saved Jobs</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
              <span className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                <Hammer className="w-3 h-3 text-blue-600" />
              </span>
              Job Categories
            </h3>
            <ul className="space-y-3">
              <li><Link to="/jobs?category=construction" className="text-gray-600 hover:text-blue-600 text-sm hover:translate-x-1 transition-transform inline-block">Construction</Link></li>
              <li><Link to="/jobs?category=manufacturing" className="text-gray-600 hover:text-blue-600 text-sm hover:translate-x-1 transition-transform inline-block">Manufacturing</Link></li>
              <li><Link to="/jobs?category=logistics" className="text-gray-600 hover:text-blue-600 text-sm hover:translate-x-1 transition-transform inline-block">Logistics</Link></li>
              <li><Link to="/jobs?category=service" className="text-gray-600 hover:text-blue-600 text-sm hover:translate-x-1 transition-transform inline-block">Service Industry</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
              <span className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                <Briefcase className="w-3 h-3 text-blue-600" />
              </span>
              For Employers
            </h3>
            <ul className="space-y-3">
              <li><Link to="/admin/companies" className="text-gray-600 hover:text-blue-600 text-sm hover:translate-x-1 transition-transform inline-block">Manage Companies</Link></li>
              <li><Link to="/admin/jobs" className="text-gray-600 hover:text-blue-600 text-sm hover:translate-x-1 transition-transform inline-block">Manage Jobs</Link></li>
              <li><Link to="/admin/jobs/create" className="text-gray-600 hover:text-blue-600 text-sm hover:translate-x-1 transition-transform inline-block">Post New Job</Link></li>
              <li><Link to="/signup?role=employer" className="text-gray-600 hover:text-blue-600 text-sm hover:translate-x-1 transition-transform inline-block">Register as Employer</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
              <span className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                <Mail className="w-3 h-3 text-blue-600" />
              </span>
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start text-gray-600 text-sm">
                <Mail className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                <a href="mailto:contact@thozhan.com" className="hover:text-blue-600">contact@thozhan.com</a>
              </li>
              <li className="flex items-start text-gray-600 text-sm">
                <Phone className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-blue-600">+91 98765 43210</a>
              </li>
              <li className="flex items-start text-gray-600 text-sm">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                <span>123 Business Park,<br />Chennai, Tamil Nadu 600001</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section with copyright */}
        <div className="py-6 border-t border-blue-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">© 2024 THOZHAN Blue Collar Job Portal. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-blue-600">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-sm text-gray-500 hover:text-blue-600">Terms of Service</Link>
            <Link to="/contact-us" className="text-sm text-gray-500 hover:text-blue-600">Contact Us</Link>
            <Link to="/about-us" className="text-sm text-gray-500 hover:text-blue-600">About Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;