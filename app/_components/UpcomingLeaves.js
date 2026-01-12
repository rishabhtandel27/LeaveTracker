"use client";

import { MdCalendarMonth } from "react-icons/md";

export default function UpcommingLeaves({
  upcomingLeaves,
  onAddClick,
  onDelete,
  onCalendarClick,
  onClearAll,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.45)] border border-gray-200">
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Leaves</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCalendarClick}
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <MdCalendarMonth className="text-lg" />
            Calendar
          </button>
          {upcomingLeaves && upcomingLeaves.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-red-500 to-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:from-red-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              🗑️ Clear All
            </button>
          )}
          <button
            type="button"
            onClick={onAddClick}
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            + Add Leave
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-linear-to-r from-purple-600 to-indigo-600 border-b border-gray-200">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-semibold text-white">
                Leave Type
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-white">
                Dates
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-white">
                Days
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-white">
                Reason
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-white">
                Status
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-white">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {(upcomingLeaves || []).map((leave) => (
              <tr
                key={leave.id}
                className="border-t border-gray-200 transition-colors"
              >
                <td className="px-4 py-4 font-medium text-gray-900 capitalize">
                  {leave.leaveType}
                </td>

                <td className="px-4 py-4 text-gray-700">
                  {leave.period || "-"}
                </td>

                <td className="px-4 py-4 text-gray-700">{leave.days} days</td>

                <td className="px-4 py-4 text-gray-700">{leave.reason}</td>

                <td className="px-4 py-4">
                  <span
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full uppercase
                    ${
                      leave.status === "Approved"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : leave.status === "Rejected"
                        ? "bg-red-100 text-red-700 border border-red-300"
                        : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>

                <td className="px-4 py-4">
                  {leave.status === "Pending" && (
                    <button
                      onClick={() =>
                        onDelete(leave.id, leave.leaveType, leave.days)
                      }
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 border border-red-300  transition-color"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {(!upcomingLeaves || upcomingLeaves.length === 0) && (
              <tr className="border-t border-gray-200">
                <td
                  colSpan="6"
                  className="px-4 py-6 text-center text-gray-500 font-medium"
                >
                  No upcoming leaves scheduled.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
