"use client";
import React from 'react';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function TimeTableHero() {
  return (
    <div className="min-h-[100vh] bg-gradient-to-br from-[#18171c] via-[#232326] to-[#18171c] flex items-center justify-center p-6 relative overflow-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
        * {
          font-family: 'Rajdhani', sans-serif;
        }
      `}</style>

      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 gap-4 h-full">
          {[...Array(64)].map((_, i) => (
            <div
              key={i}
              className="border border-[#f97316] animate-pulse"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '3s'
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl w-full text-center relative z-10">
        {/* Stats Bar */}
        <div className="flex justify-center gap-8 mb-12 flex-wrap">
          {[
            { icon: BookOpen, label: 'Classes', value: '4+' },
            { icon: Clock, label: 'Hours/Week', value: '28' },
            { icon: TrendingUp, label: 'Efficiency', value: '95%' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#232326] border border-[#f97316]/30 rounded-lg px-6 py-3 flex items-center gap-3 hover:border-[#f97316] transition-all duration-300 hover:scale-105">
              <stat.icon className="w-6 h-6 text-[#f97316]" />
              <div className="text-left">
                <p className="text-[#ffffff] text-2xl font-bold">{stat.value}</p>
                <p className="text-[#ffffff] opacity-60 text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Title */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold text-[#ffffff] leading-tight">
            Your Schedule,
            <span className="block text-[#f97316] mt-2">Perfectly Organized</span>
          </h1>
          
          <p className="text-xl text-[#ffffff] opacity-70 max-w-2xl mx-auto font-light">
            Plan your day, track your classes, and never miss a lecture again with our intelligent timetable system.
          </p>

          {/* Quick Actions */}
          <div className="flex justify-center gap-4 pt-6 flex-wrap">
            <Link href="/today-classes">
            <button className="px-6 py-3 bg-[#f97316] text-[#18171c] font-bold rounded-lg hover:bg-[#ffffff] transition-all duration-300 hover:scale-105">
              Today&apos;s Classes
            </button>
            </Link>
            <Link href="/weekly-time-table">
            <button className="px-6 py-3 bg-transparent border-2 border-[#f97316] text-[#f97316] font-bold rounded-lg hover:bg-[#f97316] hover:text-[#18171c] transition-all duration-300">
              View Full Schedule
            </button>
            </Link>
          </div>
        </div>

        {/* Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#f97316] opacity-5 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
}