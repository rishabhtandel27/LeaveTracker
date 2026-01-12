"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VscSignOut } from "react-icons/vsc";
import {
  MdDashboard,
  MdPendingActions,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { toast } from "react-toastify";
import { leaveBalance as initialLeaveBalance } from "../../data/data";
export default function AdminDashboard() {
  const router = useRouter();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState({});
  const [user, setUser] = useState(null);

  const handleResetAllLeaves = () => {
    if (
      !confirm(
        "Are you sure you want to reset ALL employees' leave data? This will clear all requests and restore initial balances."
      )
    ) {
      return;
    }

    const storedUsers = localStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    // Reset all users' leave data
    const updatedUsers = users.map((user) => ({
      ...user,
      leaveRequests: [],
      leaveBalance: initialLeaveBalance,
    }));

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Clear current user if they're an employee
    const currentUserStr = localStorage.getItem("currentuser");
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      const updatedCurrentUser = updatedUsers.find(
        (u) => u.email === currentUser.email
      );
      if (updatedCurrentUser) {
        localStorage.setItem("currentuser", JSON.stringify(updatedCurrentUser));
      }
    }

    toast.success("All employee leave data has been reset");
    loadLeaveRequests();
  };

  const handleResetEmployeeLeaves = (username) => {
    if (
      !confirm(
        `Are you sure you want to reset ${username}'s leave data? This will clear all their requests and restore initial balance.`
      )
    ) {
      return;
    }

    const storedUsers = localStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const updatedUsers = users.map((user) => {
      if (user.username === username) {
        return {
          ...user,
          leaveRequests: [],
          leaveBalance: initialLeaveBalance,
        };
      }
      return user;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Update currentuser if it matches
    const currentUserStr = localStorage.getItem("currentuser");
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser.username === username) {
        const updatedCurrentUser = updatedUsers.find(
          (u) => u.username === username
        );
        if (updatedCurrentUser) {
          localStorage.setItem(
            "currentuser",
            JSON.stringify(updatedCurrentUser)
          );
        }
      }
    }

    toast.success(`${username}'s leave data has been reset`);
    loadLeaveRequests();
  };

  const DEFAULT_LEAVE_BALANCE = {
    sick: 8,
    casual: 10,
    earned: 13,
  };

  const resetLeavesOnce = () => {
    const alreadyReset = localStorage.getItem("leaveResetDone");

    if (alreadyReset) {
      alert("Reset already done once");
      return;
    }

    // Clear ALL leave requests
    setLeaveRequests([]);

    // Reset balance
    setLeaveBalance(DEFAULT_LEAVE_BALANCE);

    // Sync localStorage
    localStorage.setItem("leaveBalance", JSON.stringify(DEFAULT_LEAVE_BALANCE));
    localStorage.removeItem("leaveRequests");

    // Mark reset as done
    localStorage.setItem("leaveResetDone", "true");

    alert("Leave balance reset successfully");
  };

  const loadLeaveRequests = () => {
    // Get all users and their leave requests
    const storedUsers = localStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const allRequests = [];
    users.forEach((user) => {
      if (user.leaveRequests && user.leaveRequests.length > 0) {
        user.leaveRequests.forEach((request) => {
          allRequests.push({
            ...request,
            username: user.username,
            userEmail: user.email,
          });
        });
      }
    });

    setLeaveRequests(allRequests);
  };

  useEffect(() => {
    // Check if user is logged in and is admin
    const storedUser = localStorage.getItem("currentuser");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (!parsedUser) {
      router.push("/auth/login");
    } else if (parsedUser.role !== "admin") {
      router.push("/"); // Redirect non-admin users
    } else {
      queueMicrotask(() => {
        setUser(parsedUser);
        loadLeaveRequests();
      });
    }
  }, [router]);

  const handleApprove = (requestId, username) => {
    updateRequestStatus(requestId, username, "Approved");
  };

  const handleReject = (id, username) => {
    updateRequestStatus(id, username, "Rejected");
  };

  const updateRequestStatus = (requestId, username, newStatus) => {
    const storedUsers = localStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    let updatedUsers = users.map((user) => {
      if (user.username === username) {
        const leaveRequest = user.leaveRequests.find(
          (req) => req.id === requestId
        );

        // If rejecting, restore leave balance
        if (newStatus === "Rejected" && leaveRequest) {
          const updatedLeaveBalance = (user.leaveBalance || []).map((leave) => {
            if (
              leave.leaveType.toLowerCase().replace(/\s+/g, "") ===
              leaveRequest.leaveType.toLowerCase().replace(/\s+/g, "")
            ) {
              return {
                ...leave,
                balance: leave.balance + leaveRequest.days,
                taken: Math.max(0, (leave.taken || 0) - leaveRequest.days),
              };
            }
            return leave;
          });

          return {
            ...user,
            leaveBalance: updatedLeaveBalance,
            leaveRequests: user.leaveRequests.map((req) =>
              req.id === requestId ? { ...req, status: newStatus } : req
            ),
          };
        }

        return {
          ...user,
          leaveRequests: user.leaveRequests.map((req) =>
            req.id === requestId ? { ...req, status: newStatus } : req
          ),
        };
      }
      return user;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Update currentuser if it matches
    const currentUserStr = localStorage.getItem("currentuser");
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser.username === username) {
        const updatedCurrentUser = updatedUsers.find(
          (u) => u.username === username
        );
        if (updatedCurrentUser) {
          localStorage.setItem(
            "currentuser",
            JSON.stringify(updatedCurrentUser)
          );
        }
      }
    }

    // Show toast notification for feedback
    if (newStatus === "Approved") {
      toast.success(`Leave request approved for ${username}`);
    } else if (newStatus === "Rejected") {
      toast.info(`Leave request rejected for ${username}. Balance restored.`);
    }

    queueMicrotask(() => {
      loadLeaveRequests();
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("currentuser");
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 shadow-lg">
        <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8">
          Admin
        </h1>

        <nav className="space-y-3">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow">
            <MdDashboard className="text-xl" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <VscSignOut className="text-xl" />
            <span className="font-medium">Log Out</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header with Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Admin!
          </h2>
          <p className="text-gray-600">
            Manage and review all employee leave requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <FaUserTie className="text-3xl opacity-80" />
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                TOTAL
              </span>
            </div>
            <p className="text-4xl font-bold">{leaveRequests.length}</p>
            <p className="text-blue-100 text-sm mt-1">All Requests</p>
          </div>

          <div className="bg-linear-to-br from-yellow-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <MdPendingActions className="text-3xl opacity-80" />
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                PENDING
              </span>
            </div>
            <p className="text-4xl font-bold">
              {leaveRequests.filter((r) => r.status === "Pending").length}
            </p>
            <p className="text-yellow-100 text-sm mt-1">Awaiting Review</p>
          </div>

          <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <MdCheckCircle className="text-3xl opacity-80" />
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                APPROVED
              </span>
            </div>
            <p className="text-4xl font-bold">
              {leaveRequests.filter((r) => r.status === "Approved").length}
            </p>
            <p className="text-green-100 text-sm mt-1">Approved Leaves</p>
          </div>

          <div className="bg-linear-to-br from-red-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <MdCancel className="text-3xl opacity-80" />
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                REJECTED
              </span>
            </div>
            <p className="text-4xl font-bold">
              {leaveRequests.filter((r) => r.status === "Rejected").length}
            </p>
            <p className="text-red-100 text-sm mt-1">Declined Requests</p>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-linear-to-r from-slate-700 to-slate-800">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <MdDashboard className="text-2xl" />
              Leave Requests Management
            </h3>
            {/* <button
              onClick={handleResetAllLeaves}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              🗑️ Reset All Employees
            </button> */}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b-2 border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Employee & Request Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Employee Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {leaveRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-8 text-center text-gray-500 font-medium"
                    >
                      No leave requests found
                    </td>
                  </tr>
                ) : (
                  leaveRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-gray-100 hover:bg-blue-50/50 transition-all"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {request.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-gray-900 font-bold text-base">
                                {request.username}
                              </span>
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                                {request.leaveType}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                              <span className="font-medium">📅</span>
                              {request.period ||
                                `${request.fromDate} to ${request.toDate}`}
                              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                                {request.days} days
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 italic">
                              "{request.reason}"
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg uppercase shadow-sm ${
                            request.status === "Approved"
                              ? "bg-green-500 text-white"
                              : request.status === "Rejected"
                              ? "bg-red-500 text-white"
                              : "bg-yellow-500 text-white"
                          }`}
                        >
                          {request.status === "Approved" && (
                            <MdCheckCircle className="text-base" />
                          )}
                          {request.status === "Rejected" && (
                            <MdCancel className="text-base" />
                          )}
                          {request.status === "Pending" && (
                            <MdPendingActions className="text-base" />
                          )}
                          {request.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {request.status === "Pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleApprove(request.id, request.username)
                              }
                              className="flex items-center gap-1.5 px-4 py-2.5 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                              <MdCheckCircle className="text-base" />
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleReject(request.id, request.username)
                              }
                              className="flex items-center gap-1.5 px-4 py-2.5 bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                              <MdCancel className="text-base" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg">
                            {request.status === "Approved"
                              ? "✓ Processed"
                              : "✗ Declined"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
