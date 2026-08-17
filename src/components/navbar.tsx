import React from "react";
import Image from "next/image"; 

export default function Navbar() {
  return (
    <nav className="bg-slate-800 text-white shadow-md px-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Image 
              src="/image/apf-logo.png" 
              alt="APF logo" 
              width={150} 
              height={30} 
              className="object-contain"
            />
          </div>
          <div className="text-sm bg-slate-900 px-3 py-1.5 rounded-full border border-indigo-500 font-medium">
            Status: Active Session
          </div>
        </div>
      </div>
    </nav>
  );
}
