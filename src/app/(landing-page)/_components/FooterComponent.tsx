'use client'
import { useFilterStore } from '@/app/properties/store/useFilter'
import Link from 'next/link'
import React from 'react'

function FooterComponent() {
    const {location, transactionType, unitType, setLocation, setTransactionType, setUnitType} = useFilterStore()
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
                  <Link href="/" className="text-gray-400 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/properties" className="text-gray-400 hover:text-white">
                    Properties
                  </Link>
                </li>
                <li>
                  <Link href="/properties/agents" className="text-gray-400 hover:text-white">
                    Agents
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Locations</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/properties" onClick={()=> setLocation('makati')} className="text-gray-400 hover:text-white">
                    Makati
                  </Link>
                </li>
                <li>
                  <Link href="/properties" onClick={()=> setLocation('pasay')} className="text-gray-400 hover:text-white">
                    Pasay
                  </Link>
                </li>
                <li>
                  <Link href="/properties" onClick={()=> setLocation('taguig')} className="text-gray-400 hover:text-white">
                    Taguig
                  </Link>
                </li>
                <li>
                  <Link href="/properties" className="text-gray-400 hover:text-white">
                    All Locations
                  </Link>
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
