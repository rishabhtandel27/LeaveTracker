"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./_components/Navbar";
import LeaveBox from "./_components/LeaveBox";
import UpcomingLeaves from "./_components/UpcomingLeaves";
import LeaveForm from "./_components/Form";
import LeaveCalendar from "./_components/LeaveCalendar";
import LandingPage from "./_components/LandingPage";
import { leaveBalance as initialLeaveBalance } from "./data/data";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [upcomingLeaves, setUpcomingLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [leaveBalance, setLeaveBalance] = useState(initialLeaveBalance);

  const handleAddLeave = (payload) => {
    const period =
      payload.fromDate && payload.toDate
        ? `${payload.fromDate} - ${payload.toDate}`
        : "";

    const newLeave = {
      id: Date.now(),
      leaveType: payload.leaveType,
      days: Number(payload.days) || 0,
      reason: payload.reason,
      status: "Pending",
      period,
      fromDate: payload.fromDate,
      toDate: payload.toDate,
    };

    // Update leave balance
    const daysToDeduct = Number(payload.days) || 0;
    const updatedBalance = leaveBalance.map((leave) => {
      const leaveTypeMatch =
        leave.leaveType.toLowerCase().replace(/\s+/g, "") ===
        payload.leaveType.toLowerCase().replace(/\s+/g, "");

      if (leaveTypeMatch) {
        const newTaken = (leave.taken || 0) + daysToDeduct;
        const newBalance = Math.max(0, leave.balance - daysToDeduct);
        return { ...leave, taken: newTaken, balance: newBalance };
      }
      return leave;
    });
    setLeaveBalance(updatedBalance);
    localStorage.setItem("leaveBalance", JSON.stringify(updatedBalance));

    // Save to localStorage for admin access
    const storedUsers = localStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const updatedUsers = users.map((u) => {
      if (u.email === user.email) {
        return {
          ...u,
          leaveRequests: [...(u.leaveRequests || []), newLeave],
          leaveBalance: updatedBalance,
        };
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setUpcomingLeaves((prev) => [...prev, newLeave]);
    setShowForm(false);
  };

  const handleDeleteLeave = (leaveId, leaveType, days) => {
    // Confirm deletion
    if (!confirm("Are you sure you want to delete this leave request?")) {
      return;
    }

    // Restore leave balance
    const updatedBalance = leaveBalance.map((leave) => {
      const leaveTypeMatch =
        leave.leaveType.toLowerCase().replace(/\s+/g, "") ===
        leaveType.toLowerCase().replace(/\s+/g, "");

      if (leaveTypeMatch) {
        const newTaken = Math.max(0, (leave.taken || 0) - days);
        const newBalance = leave.balance + days;
        return { ...leave, taken: newTaken, balance: newBalance };
      }
      return leave;
    });
    setLeaveBalance(updatedBalance);
    localStorage.setItem("leaveBalance", JSON.stringify(updatedBalance));

    // Update localStorage
    const storedUsers = localStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const updatedUsers = users.map((u) => {
      if (u.email === user.email) {
        return {
          ...u,
          leaveRequests: (u.leaveRequests || []).filter(
            (req) => req.id !== leaveId
          ),
          leaveBalance: updatedBalance,
        };
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Remove from state
    setUpcomingLeaves((prev) => prev.filter((leave) => leave.id !== leaveId));
  };

  const handleClearAllLeaves = () => {
    // Confirm before clearing
    if (
      !confirm(
        "Are you sure you want to clear all leave records and reset your balance? This cannot be undone."
      )
    ) {
      return;
    }

    // Reset to initial balance
    setLeaveBalance(initialLeaveBalance);
    setUpcomingLeaves([]);

    // Update localStorage
    const storedUsers = localStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const updatedUsers = users.map((u) => {
      if (u.email === user.email) {
        return {
          ...u,
          leaveRequests: [],
          leaveBalance: initialLeaveBalance,
        };
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Update currentuser
    const updatedCurrentUser = updatedUsers.find((u) => u.email === user.email);
    if (updatedCurrentUser) {
      localStorage.setItem("currentuser", JSON.stringify(updatedCurrentUser));
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("currentuser");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (!parsedUser) {
      router.push("/auth/login");
      return;
    }

    if (parsedUser.role === "admin") {
      router.push("/dashboard/admin");
      return;
    }

    // Initialize user data in one batch
    const initializeUserData = () => {
      const lastResetMonth = localStorage.getItem("lastResetMonth");
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const resetKey = `${currentYear}-${currentMonth}`;

      if (lastResetMonth !== resetKey) {
        // Reset for new month
        localStorage.setItem(
          "leaveBalance",
          JSON.stringify(initialLeaveBalance)
        );
        localStorage.setItem("lastResetMonth", resetKey);

        const storedUsers = localStorage.getItem("users");
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        const updatedUsers = users.map((u) => {
          if (u.email === parsedUser.email) {
            return {
              ...u,
              leaveRequests: [],
              leaveBalance: initialLeaveBalance,
            };
          }
          return u;
        });
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        return {
          user: parsedUser,
          leaves: [],
          balance: initialLeaveBalance,
        };
      } else {
        // Load existing data
        const storedUsers = localStorage.getItem("users");
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        const currentUser = users.find((u) => u.email === parsedUser.email);

        // Include all upcoming leaves regardless of status so status updates remain visible
        const allLeaves = currentUser?.leaveRequests || [];

        // Use the current user's leaveBalance (updated by admin) instead of global storage
        const balance = currentUser?.leaveBalance || initialLeaveBalance;

        return {
          user: parsedUser,
          leaves: allLeaves,
          balance: balance,
        };
      }
    };

    const { user: userData, leaves, balance } = initializeUserData();

    queueMicrotask(() => {
      setUser(userData);
      setUpcomingLeaves(leaves);
      setLeaveBalance(balance);
    });
  }, [router]);

  // Listen for storage changes (when admin updates user data) and refresh balance
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "currentuser") {
        const updatedUser = e.newValue ? JSON.parse(e.newValue) : null;
        if (updatedUser && updatedUser.email === user?.email) {
          // Update the leave balance from the modified user object
          setLeaveBalance(updatedUser.leaveBalance || initialLeaveBalance);
          setUpcomingLeaves(updatedUser.leaveRequests || []);
        }
      } else if (e.key === "users") {
        // If users array changes, sync current user's data
        const users = e.newValue ? JSON.parse(e.newValue) : [];
        const currentUser = users.find((u) => u.email === user?.email);
        if (currentUser) {
          setLeaveBalance(currentUser.leaveBalance || initialLeaveBalance);
          setUpcomingLeaves(currentUser.leaveRequests || []);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user?.email]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <section className="pt-10 w-full mx-auto max-w-7xl px-6">
        <LeaveBox leaveBalance={leaveBalance} />
      </section>
      <section className="pt-10 w-full mx-auto max-w-7xl px-6">
        <UpcomingLeaves
          upcomingLeaves={upcomingLeaves}
          onAddClick={() => setShowForm(true)}
          onDelete={handleDeleteLeave}
          onCalendarClick={() => setShowCalendar(true)}
          onClearAll={handleClearAllLeaves}
        />
      </section>

      {showForm && (
        <LeaveForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddLeave}
          leaveBalance={leaveBalance}
        />
      )}

      {showCalendar && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center backdrop-blur-sm p-4"
          onClick={() => setShowCalendar(false)}
        >
          <div
            className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 bg-linear-to-r from-purple-600 to-indigo-600 text-white">
              <h2 className="text-lg font-semibold">Leave Calendar</h2>
              <button
                onClick={() => setShowCalendar(false)}
                className="text-xl font-semibold text-white hover:text-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="p-3">
              <LeaveCalendar upcomingLeaves={upcomingLeaves} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
