import React from 'react'
import { Mail, } from 'lucide-react';
import { FaFacebookMessenger, FaTiktok } from 'react-icons/fa';
import Link from 'next/link';

function FooterComponent() {
  return (
    <div className='grid grid-cols-12 gap-10 items-center bg-black text-white shadow-black shadow-xl p-10'>
        <div className="col-span-12 md:col-span-3 text-center">
        <Link href={'/'}>Manila<span className="text-orange-500 text-xl font-semibold ">Pro</span></Link>
        </div>
        <div className="col-span-12 md:col-span-6 flex justify-evenly">
            {["About Us","Contact Us", "FAQ", "Terms", "Privacy",].map((label)=>(
                <h3 key={label} className='text-xs font-semibold hover:cursor-pointer'>{label}</h3>
            ))}
        </div>
        <div className="col-span-12 md:col-span-3">
            <div className="flex justify-center gap-x-5">
                <FaFacebookMessenger size={16} />
                <FaTiktok size={16} />
                <Mail size={16} />
            </div>
        </div>
       
    </div>
  )
}

export default FooterComponent
