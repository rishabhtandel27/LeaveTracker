"use client";

// Renders leave balance cards styled like the provided design
export default function LeaveBox({ leaveBalance = [] }) {
  return (
    <div className="flex flex-wrap gap-4 sm:gap-6">
      {leaveBalance.map((leave) => {
        const available = leave.balance;
        const taken = leave.taken ?? 0; // fallback until data includes taken

        return (
          <div
            key={leave.leaveType}
            className="rounded-3xl border  px-6 py-6 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.45)] text-center text-white backdrop-blur"
          >
            <h3 className="text-lg font-semibold text-indigo-600">
              {toTitleCase(leave.leaveType)}
            </h3>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
              <span className="text-2xl" role="img" aria-label="calendar alert">
                📅
              </span>
            </div>

            <p className="text-xl font-semibold text-black">
              {available} days available
            </p>
            <p className="text-sm text-black mt-2">{taken} days taken</p>
          </div>
        );
      })}
    </div>
  );
}

function toTitleCase(key) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
