import React from 'react'
import { Mail, } from 'lucide-react';
import { FaFacebookMessenger, FaTiktok } from 'react-icons/fa';
import Link from 'next/link';

function FooterComponent() {
  return (
      <footer className="bg-brand-dark text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="font-bold text-xl mb-4">
                <span className="text-primary">Manila</span>
                <span className="text-white">Pro</span>
              </div>
              <p className="text-gray-400">Your trusted partner in finding the perfect property in the Philippines.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Properties
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Agents
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Locations</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Makati
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Pasay
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Taguig
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    All Locations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@manilapro.com</li>
                <li>Phone: +63 2 8123 4567</li>
                <li>Address: Makati City, Philippines</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 ManilaPro. All rights reserved.</p>
          </div>
        </div>
    </footer>
  )
}

export default FooterComponent
