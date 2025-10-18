"use client";
import React, { useState } from 'react';
import { Clock, BookOpen, User } from 'lucide-react';
import { timetable } from '@/data/timetabledata';

export default function FullWeekTimeTable() {
  // ...existing code...
  type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

  // In your component:
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

  // Assuming `timetable` and `selectedDay` are defined
  const classesForDay = timetable[selectedDay].filter((cls): cls is NonNullable<typeof cls> => cls !== null)

  // 1 class = 1.5 hours → total hours = count * 1.5
  const totalClasses = classesForDay.length;
  const totalHours = totalClasses * 1.5;

  // Unique subjects
  const totalSubjects = new Set(classesForDay.map(cls => cls.subject)).size;

  // Unique teachers
  const totalTeachers = new Set(classesForDay.map(cls => cls.teacher)).size;



  return (
    <div className="min-h-screen bg-[#18171c] p-6">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
        * {
          font-family: 'Rajdhani', sans-serif;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#ffffff] mb-2">Weekly Timetable</h1>
          <p className="text-[#ffffff] opacity-70">View your complete schedule for the week</p>
        </div>

        {/* Day Selector */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`
                flex-shrink-0 px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300
                ${selectedDay === day
                  ? 'bg-[#f97316] text-[#18171c] scale-105 shadow-lg shadow-[#f97316]/50'
                  : 'bg-[#232326] text-[#ffffff] hover:bg-[#232326] hover:border-[#f97316] border-2 border-transparent'}
              `}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Timetable Grid */}
        <div className="grid gap-4">



          {timetable[selectedDay].map((cls, index) => (
            <div
              key={index}
              className="bg-[#232326] border-2 border-[#232326] hover:border-[#f97316] rounded-xl p-6 transition-all duration-300 hover:scale-102"
            >
              {/* if have null mean no class */}
              {cls === null ? (
                <p className="text-[#ffffff] opacity-60 text-center">No Class Scheduled</p>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Time */}
                  <div className="flex items-center gap-3 md:w-48">
                    <div className="bg-[#f97316] p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-[#18171c]" />
                    </div>
                    <div>
                      <p className="text-[#f97316] font-bold text-lg">{cls.from_to}</p>
                      <p className="text-[#ffffff] opacity-50 text-sm">90 minutes</p>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="flex items-center gap-3 md:flex-1">
                    <BookOpen className="w-5 h-5 text-[#f97316]" />
                    <div>
                      <p className="text-[#ffffff] font-bold text-xl">{cls.subject.toUpperCase()}</p>
                      <p className="text-[#ffffff] opacity-60 text-sm">Core Subject</p>
                    </div>
                  </div>

                  {/* Teacher */}
                  <div className="flex items-center gap-3 md:w-64">
                    <User className="w-5 h-5 text-[#f97316]" />
                    <div>
                      <p className="text-[#ffffff] font-semibold">{cls.teacher}</p>
                      <p className="text-[#ffffff] opacity-60 text-sm">Room {cls.room}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  {/* <button className="bg-[#f97316] hover:bg-[#ffffff] text-[#18171c] font-bold px-4 py-2 rounded-lg transition-all duration-300 md:w-32">
                  Details
                </button> */}
                </div>
              )}
            </div>

          ))}
        </div>

        {/* Weekly Summary */}
        <div className="mt-8 bg-gradient-to-r from-[#232326] to-[#18171c] border-2 border-[#f97316]/30 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-[#ffffff] mb-4">
            Summary for {selectedDay}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Classes */}
            <div className="bg-[#18171c] p-4 rounded-lg text-center">
              <p className="text-4xl font-bold text-[#f97316] mb-1">{totalClasses}</p>
              <p className="text-[#ffffff] opacity-70 text-sm">Total Classes</p>
            </div>

            {/* Total Hours */}
            <div className="bg-[#18171c] p-4 rounded-lg text-center">
              <p className="text-4xl font-bold text-[#f97316] mb-1">{totalHours}</p>
              <p className="text-[#ffffff] opacity-70 text-sm">Hours</p>
            </div>

            {/* Total Subjects */}
            <div className="bg-[#18171c] p-4 rounded-lg text-center">
              <p className="text-4xl font-bold text-[#f97316] mb-1">{totalSubjects}</p>
              <p className="text-[#ffffff] opacity-70 text-sm">Subjects</p>
            </div>

            {/* Total Teachers */}
            <div className="bg-[#18171c] p-4 rounded-lg text-center">
              <p className="text-4xl font-bold text-[#f97316] mb-1">{totalTeachers}</p>
              <p className="text-[#ffffff] opacity-70 text-sm">Teachers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}