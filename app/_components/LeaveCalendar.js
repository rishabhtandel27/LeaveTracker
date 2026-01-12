"use client";

import { useMemo, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function LeaveCalendar({ upcomingLeaves = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const daysInMonth = useMemo(
    () => new Date(year, month + 1, 0).getDate(),
    [month, year]
  );

  const startingDayOfWeek = useMemo(
    () => new Date(year, month, 1).getDay(),
    [month, year]
  );

  const today = useMemo(() => new Date(), []);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const parseInputDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split("-").map(Number);
    if (parts.length === 3 && parts.every((p) => !Number.isNaN(p))) {
      return new Date(parts[0], parts[1] - 1, parts[2], 12);
    }
    const parsed = new Date(dateStr);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const isLeaveDay = (day) => {
    const targetDate = new Date(year, month, day, 12);

    return (upcomingLeaves || []).filter((leave) => {
      const start = parseInputDate(leave.fromDate);
      const end = parseInputDate(leave.toDate) || start;
      if (!start || !end) return false;
      return targetDate >= start && targetDate <= end;
    });
  };

  const getLeaveTypeColor = (leaveType) => {
    if (!leaveType) return "bg-purple-500";
    const type = leaveType.toLowerCase().replace(/\s+/g, "");
    if (type === "sickleave") return "bg-red-500";
    if (type === "casualleave") return "bg-blue-500";
    if (type === "paidleave") return "bg-green-500";
    return "bg-purple-500";
  };

  return (
    <div className="bg-linear-to-br from-purple-50 via-white to-indigo-50 rounded-xl shadow-lg p-3 border border-purple-100">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-1.5">
          <button
            onClick={previousMonth}
            className="p-1.5 bg-white hover:bg-purple-100 rounded-lg transition-all shadow-sm hover:shadow-md border border-purple-200 transform hover:scale-105"
            aria-label="Previous month"
          >
            <MdChevronLeft className="text-xl text-purple-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 bg-white hover:bg-purple-100 rounded-lg transition-all shadow-sm hover:shadow-md border border-purple-200 transform hover:scale-105"
            aria-label="Next month"
          >
            <MdChevronRight className="text-xl text-purple-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center font-bold text-purple-600 text-xs py-1 bg-white rounded-md shadow-sm"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const leavesOnDay = isLeaveDay(day);
          const hasLeave = leavesOnDay.length > 0;

          return (
            <div
              key={day}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 relative group cursor-pointer transform hover:scale-105 hover:shadow-lg ${
                isToday(day)
                  ? "border-purple-600 bg-linear-to-br from-purple-500 to-indigo-600 shadow-lg"
                  : hasLeave
                  ? "border-purple-300 shadow-md"
                  : "border-gray-200 bg-white hover:border-purple-300"
              }`}
              style={{
                backgroundColor:
                  !isToday(day) && hasLeave
                    ? leavesOnDay[0].status === "Approved"
                      ? "#dcfce7"
                      : leavesOnDay[0].status === "Rejected"
                      ? "#fee2e2"
                      : "#fef3c7"
                    : "",
              }}
            >
              <span
                className={`text-sm font-bold ${
                  isToday(day) ? "text-white text-lg" : "text-gray-700"
                }`}
              >
                {day}
              </span>

              {hasLeave && !isToday(day) && (
                <div className="flex gap-1 mt-1.5">
                  {leavesOnDay.slice(0, 3).map((leave, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full shadow-sm ${getLeaveTypeColor(
                        leave.leaveType
                      )}`}
                    />
                  ))}
                </div>
              )}

              {hasLeave && (
                <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 bg-linear-to-r from-purple-600 to-indigo-600 text-white text-xs rounded-xl px-4 py-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10 whitespace-nowrap shadow-2xl border-2 border-white">
                  {leavesOnDay.map((leave, idx) => (
                    <div
                      key={idx}
                      className="mb-1.5 last:mb-0 flex items-center gap-2"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${getLeaveTypeColor(
                          leave.leaveType
                        )}`}
                      />
                      <span className="font-semibold">{leave.leaveType}</span>
                      <span className="opacity-75">•</span>
                      <span className="font-medium">{leave.status}</span>
                    </div>
                  ))}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-indigo-600 rotate-45 border-r-2 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-purple-200">
        <h3 className="text-xs font-bold text-purple-600 mb-2">Legend:</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-1.5 bg-white rounded-md px-2 py-1 shadow-sm border border-purple-100">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm" />
            <span className="text-xs font-medium text-gray-700">Sick</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white rounded-md px-2 py-1 shadow-sm border border-purple-100">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
            <span className="text-xs font-medium text-gray-700">Casual</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white rounded-md px-2 py-1 shadow-sm border border-purple-100">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm" />
            <span className="text-xs font-medium text-gray-700">Paid</span>
          </div>
        </div>
      </div>
    </div>
  );
}
