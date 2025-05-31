'use client'
import { Card, CardContent, CardHeader, CardTitle  } from '@/components/ui/card';
import React from 'react';
import Pasay from '@/../public/images/pasay.jpg';
import Makati from '@/../public/images/makati.jpg';
import Taguig from '../../../../public/images/taguig-BGC.png';
import Image from 'next/image';

export default function Locations(){
    const locations = [
        { name: 'Pasay City', image: Pasay },
        { name: 'Makati City', image: Makati },
        { name: 'Taguig City', image: Taguig }
    ];


    return (
        <div className="container">
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4  py-10 w-full'>
                {locations.map((location, index) => (
                    <Card key={index} className="relative mb-4">
                        <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white p-2 size-full rounded-br-lg rounded-tl-lg">
                            <CardHeader>
                            
                                <CardTitle className='font-sans text-xl font-black'>{location.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>ManilaPro operates in {location.name}.</p>
                            </CardContent>
                        </div>
                    
                        <Image src={location.image} alt={location.name} className="object-cover h-40 w-full"/>
                    </Card>
                ))}
            </div>
        </div>
    );
};