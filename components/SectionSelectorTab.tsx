"use client";
import React, { useState } from 'react';
import { Users, BookOpen } from 'lucide-react';

export default function SectionSelectorTab() {
  const [activeSection, setActiveSection] = useState('A');
  
  const sections = [
    { id: 'A', name: 'Section A', students: 45, color: '#f97316' },
    { id: 'B', name: 'Section B', students: 42, color: '#f97316' },
    { id: 'C', name: 'Section C', students: 48, color: '#f97316' },
    { id: 'D', name: 'Section D', students: 40, color: '#f97316' }
  ];

  return (
    <div className="bg-[#18171c] p-6 rounded-xl">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
        * {
          font-family: 'Rajdhani', sans-serif;
        }
      `}</style>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#ffffff] mb-2">Select Your Section</h2>
        <p className="text-[#ffffff] opacity-60">Choose a section to view the timetable</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`
              relative flex-shrink-0 px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-300
              ${activeSection === section.id 
                ? 'bg-[#f97316] text-[#18171c] scale-105 shadow-lg shadow-[#f97316]/50' 
                : 'bg-[#232326] text-[#ffffff] hover:bg-[#232326] hover:border-[#f97316] border-2 border-transparent'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5" />
              <div className="text-left">
                <div className="font-bold">{section.name}</div>
                <div className={`text-xs flex items-center gap-1 ${activeSection === section.id ? 'text-[#18171c] opacity-80' : 'text-[#ffffff] opacity-60'}`}>
                  <Users className="w-3 h-3" />
                  {section.students} students
                </div>
              </div>
            </div>
            
            {/* Active Indicator */}
            {activeSection === section.id && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-[#18171c] rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Section Info Card */}
      <div className="bg-[#232326] border-2 border-[#f97316]/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#ffffff] mb-2">
              {sections.find(s => s.id === activeSection)?.name}
            </h3>
            <p className="text-[#ffffff] opacity-70">
              Timetable for the current semester
            </p>
          </div>
          <div className="bg-[#f97316] text-[#18171c] font-bold text-4xl w-16 h-16 rounded-full flex items-center justify-center">
            {activeSection}
          </div>
        </div>
      </div>
    </div>
  );
}