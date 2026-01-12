"use client";

import { useState, useEffect } from "react";

export default function LeaveForm({ onClose, onSubmit, leaveBalance = [] }) {
  const [form, setForm] = useState({
    leaveType: "Sick Leave",
    days: "",
    reason: "",
    status: "Pending",
    fromDate: "",
    toDate: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(""); // Clear error when user changes form
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Auto-calculate days when dates change
  useEffect(() => {
    if (form.fromDate && form.toDate) {
      const from = new Date(form.fromDate);
      const to = new Date(form.toDate);
      const diffTime = Math.abs(to - from);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days

      // Update days through state
      // queueMicrotask(() => {
      setForm((prev) => ({ ...prev, days: String(diffDays) }));
      // });
    }
  }, [form.fromDate, form.toDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Get available balance for selected leave type
    const selectedLeave = leaveBalance.find(
      (leave) =>
        leave.leaveType.toLowerCase().replace(/\s+/g, "") ===
        form.leaveType.toLowerCase().replace(/\s+/g, "")
    );

    const availableDays = selectedLeave
      ? selectedLeave.balance - (selectedLeave.taken || 0)
      : 0;
    const requestedDays = Number(form.days) || 0;

    // Validation: check if requesting more days than available
    if (requestedDays > availableDays) {
      setError(
        `❌ Insufficient balance! You only have ${availableDays} days available for ${form.leaveType}. You requested ${requestedDays} days.`
      );
      return;
    }

    if (onSubmit) {
      onSubmit(form);
      setError("");
    }
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-start ">
      {/* Modal container */}
      <div className="bg-white w-full max-w-xl mt-16 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-linear-to-r from-purple-600 to-indigo-600 text-white">
          <h2 className="text-lg font-semibold">Add Upcoming Leave</h2>
          <button
            onClick={onClose}
            className="text-xl font-semibold text-white hover:text-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Form body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-300 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">
                Leave type
              </label>
              <select
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Sick Leave</option>
                <option>Casual Leave</option>
                <option>Paid Leave</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Days{" "}
                <span className="text-gray-500 text-xs">(Auto-calculated)</span>
              </label>
              <input
                type="number"
                name="days"
                min="1"
                value={form.days}
                readOnly
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                placeholder="Select dates to calculate"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  From date
                </label>
                <input
                  type="date"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  To date
                </label>
                <input
                  type="date"
                  name="toDate"
                  value={form.toDate}
                  onChange={handleChange}
                  min={form.fromDate}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <textarea
                name="reason"
                rows="3"
                value={form.reason}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add a short note"
                required
              />
            </div>

            <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
              💡 Status: <span className="font-semibold">Pending</span> (will be
              reviewed by admin)
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow hover:from-purple-700 hover:to-indigo-700"
              >
                Add Leave
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
