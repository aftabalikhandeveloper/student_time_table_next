"use client";
import React from 'react';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main>

    <div className="min-h-screen bg-[#18171c] flex items-center justify-center p-6">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
        * {
          font-family: 'Rajdhani', sans-serif;
        }
      `}</style>
      
      <div className="max-w-4xl w-full text-center">
        {/* Floating Icons */}
        <div className="relative mb-12">
          <div className="absolute -top-8 left-1/4 animate-bounce">
            <Clock className="w-8 h-8 text-[#f97316] opacity-60" />
          </div>
          <div className="absolute -top-4 right-1/3 animate-bounce delay-75">
            <Calendar className="w-10 h-10 text-[#f97316] opacity-40" />
          </div>
          <div className="absolute top-0 right-1/4 animate-pulse">
            <Sparkles className="w-6 h-6 text-[#f97316]" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#232326] border-2 border-[#f97316] rounded-full">
            <div className="w-2 h-2 bg-[#f97316] rounded-full animate-pulse"></div>
            <span className="text-[#f97316] text-sm font-semibold tracking-wider">
              COMING SOON
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-bold text-[#ffffff] leading-tight">
            Something
            <span className="block text-[#f97316] mt-2">Revolutionary</span>
            <span className="block text-[#ffffff] mt-2">Is Coming</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-[#ffffff] opacity-70 max-w-2xl mx-auto font-light">
            Experience a whole new way to manage your schedule. 
            The future of time management is almost here.
          </p>

           {/* Countdown or Progress Indicator */}
          <div className="pt-12 space-y-4">
            <p className="text-[#f97316] font-semibold text-sm tracking-widest">
              LAUNCHING PROGRESS
            </p>
            <div className="max-w-md mx-auto bg-[#232326] rounded-full h-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#f97316] to-[#ffffff] w-3/4 rounded-full animate-pulse"></div>
            </div>
            <p className="text-[#ffffff] opacity-50 text-sm">
              75% Complete
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <Link href="/time-table">
            <button className="group relative px-8 py-4 bg-[#f97316] text-[#18171c] font-bold text-lg rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#f97316]/50">
              <span className="relative z-10 flex items-center gap-2">
                Visit Timetable Page
                {/* <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" /> */}
              </span>
            </button>
           </Link>
          </div>

         
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-[#f97316] opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#f97316] opacity-5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>

    </main>
  );
}
