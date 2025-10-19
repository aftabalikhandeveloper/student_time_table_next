"use client";
import React, { useMemo } from "react";
import { Clock, MapPin, User, CheckCircle2, Circle } from "lucide-react";
import ClassNotificationScheduler from "./ClassNotificationScheduler";

// ===== IMPORT YOUR REAL TIMETABLE DATA =====
import { timetable } from "@/data/timetabledata" // adjust path if needed

export default function TodayClassesFlow() {
    const now = new Date();

    // Get today's name in PascalCase (matches your keys like 'Monday', 'Tuesday', etc.)
    const todayName = now.toLocaleDateString("en-US", { weekday: "long" }) as keyof typeof timetable;

    // Determine status of a class
    const getClassStatus = (startTime : Date, endTime : Date) => {
        const current = new Date();
        if (current < startTime) return "upcoming";
        if (current >= startTime && current <= endTime) return "ongoing";
        return "completed";
    };

    // Get today's classes from timetable (filter nulls)
    const classes = useMemo(() => {
        const data = timetable[todayName]?.filter((cls): cls is NonNullable<typeof cls> => cls !== null) || [];
        // Parse times into actual Date objects for logic
        return data.map((cls, index) => {
            const [startStr, endStr] = cls.from_to.split(" to ");
            const startTime = new Date();
            const endTime = new Date();
            
            const match1 = startStr.match(/(\d+):(\d+)\s(AM|PM)/);
            const match2 = endStr.match(/(\d+):(\d+)\s(AM|PM)/);
            
            if (!match1 || !match2) return null; // Handle invalid format
            
            const [, startH, startM, startP] = match1;
            const [, endH, endM, endP] = match2;

            startTime.setHours(
                (parseInt(startH) % 12) + (startP === "PM" ? 12 : 0),
                parseInt(startM),
                0
            );
            endTime.setHours(
                (parseInt(endH) % 12) + (endP === "PM" ? 12 : 0),
                parseInt(endM),
                0
            );

            return {
                ...cls,
                id: index,
                startTime,
                endTime
            };
        }).filter((cls): cls is NonNullable<typeof cls> => cls !== null); // Filter out nulls from map
    }, [todayName]);



    // Summary Stats
    const totalClasses = classes.length;
    const completedCount = classes.filter(
        (cls : { startTime: Date; endTime: Date; }) => getClassStatus(cls.startTime, cls.endTime) === "completed"
    ).length;
    const ongoingCount = classes.filter(
        (cls) => getClassStatus(cls.startTime, cls.endTime) === "ongoing"
    ).length;

    // Prepare class data for notification scheduler
    const classDataForNotifications = useMemo(() => {
        return timetable[todayName]?.filter((cls): cls is NonNullable<typeof cls> => cls !== null) || [];
    }, [todayName]);

    return (
        <div className="min-h-screen bg-[#18171c] p-6">
            {/* Schedule notifications for today's classes */}
            <ClassNotificationScheduler classes={classDataForNotifications} enabled={true} />
            
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
        * {
          font-family: 'Rajdhani', sans-serif;
        }
      `}</style>

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-8 h-8 text-[#f97316]" />
                        <h1 className="text-4xl font-bold text-[#ffffff]">Today&apos;s Schedule</h1>
                    </div>
                    <p className="text-[#ffffff] opacity-70 text-lg">
                        {todayName},{" "}
                        {now.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-1 bg-[#232326]" />

                    {classes.length === 0 && (
                        <p className="text-center text-[#ffffff]/70 text-lg mt-8">
                            No classes scheduled for today 🎉
                        </p>
                    )}

                    {classes.map((cls) => {
                        const status = getClassStatus(cls.startTime, cls.endTime);

                        return (
                            <div key={cls.id} className="relative mb-8 last:mb-0">
                                {/* Timeline Dot */}
                                <div
                                    className={`
                    absolute left-6 transform -translate-x-1/2 w-5 h-5 rounded-full border-4 z-10
                    ${status === "completed"
                                            ? "bg-[#f97316] border-[#18171c]"
                                            : status === "ongoing"
                                                ? "bg-[#f97316] border-[#18171c] animate-pulse"
                                                : "bg-[#232326] border-[#18171c]"
                                        }
                  `}
                                ></div>

                                {/* Class Card */}
                                <div
                                    className={`
                    ml-16 bg-[#232326] rounded-xl p-6 border-2 transition-all duration-300
                    ${status === "ongoing"
                                            ? "border-[#f97316] shadow-lg shadow-[#f97316]/30 scale-105"
                                            : status === "completed"
                                                ? "border-[#232326] opacity-60"
                                                : "border-[#232326] hover:border-[#f97316]/50"
                                        }
                  `}
                                >
                                    {/* Status Badge */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span
                                            className={`
                        inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold
                        ${status === "ongoing"
                                                    ? "bg-[#f97316] text-[#18171c]"
                                                    : status === "completed"
                                                        ? "bg-[#18171c] text-[#ffffff] border border-[#ffffff]/20"
                                                        : "bg-[#18171c] text-[#f97316] border border-[#f97316]"
                                                }
                      `}
                                        >
                                            {status === "completed" ? (
                                                <CheckCircle2 className="w-3 h-3" />
                                            ) : (
                                                <Circle className="w-3 h-3" />
                                            )}
                                            {status === "ongoing"
                                                ? "IN PROGRESS"
                                                : status === "completed"
                                                    ? "COMPLETED"
                                                    : "UPCOMING"}
                                        </span>
                                        <span className="text-[#ffffff] font-semibold text-sm bg-[#18171c] px-3 py-1 rounded-full">
                                            Lecture
                                        </span>
                                    </div>

                                    {/* Subject */}
                                    <h3 className="text-2xl font-bold text-[#ffffff] mb-3">
                                        {cls.subject.toUpperCase()}
                                    </h3>

                                    {/* Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="flex items-center gap-2 text-[#ffffff] opacity-80">
                                            <Clock className="w-4 h-4 text-[#f97316]" />
                                            <span className="text-sm">{cls.from_to}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#ffffff] opacity-80">
                                            <User className="w-4 h-4 text-[#f97316]" />
                                            <span className="text-sm">{cls.teacher}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#ffffff] opacity-80">
                                            <MapPin className="w-4 h-4 text-[#f97316]" />
                                            <span className="text-sm">{cls.room}</span>
                                        </div>
                                    </div>

                                    {/* Ongoing Progress Bar */}
                                    {/* {status === "ongoing" && (
                                        <div className="mt-4 pt-4 border-t border-[#f97316]/20">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[#ffffff] text-xs opacity-70">
                                                    Class Progress {progress} das
                                                </span>
                                                <span className="text-[#f97316] text-xs font-bold">
                                                    {progress.toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-[#18171c] rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-[#f97316] rounded-full transition-all duration-500"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )} */}

                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Summary */}
                <div className="mt-8 bg-[#232326] border-2 border-[#f97316]/30 rounded-xl p-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-3xl font-bold text-[#f97316]">
                                {totalClasses}
                            </p>
                            <p className="text-[#ffffff] opacity-70 text-sm">Total Classes</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[#f97316]">{ongoingCount}</p>
                            <p className="text-[#ffffff] opacity-70 text-sm">In Progress</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[#f97316]">
                                {completedCount}
                            </p>
                            <p className="text-[#ffffff] opacity-70 text-sm">Completed</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
