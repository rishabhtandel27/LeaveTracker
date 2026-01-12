"use client";
import { useRouter } from "next/navigation";
import { FaUserTie } from "react-icons/fa6";
import { VscSignOut } from "react-icons/vsc";
import { toast } from "react-toastify";

export default function Button({ user }) {
  const router = useRouter();

  function handleSignOut() {
    toast.success("Logged out successfully");
    localStorage.removeItem("currentuser");
    setTimeout(() => {
      router.push("/auth/login");
    }, 600);
  }
  return (
    <>
      <div className="bg-linear-to-r from-purple-600 to-indigo-600 text-white w-full flex justify-between items-center px-6 sm:px-10 py-2 shadow-lg border-b border-slate-700 ">
        <div className="flex items-center gap-2">
          {/* <Image
            src="/logo.png"
            alt="leave tracker logo"
            width={50}
            height={50}
          /> */}

          <div>
            <h1 className="font-bold text-xl">Leave Tracker</h1>
            <p className="text-m text-slate-200">
              Track your leave efficiently
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4  px-4 py-2 rounded-lg">
          <div className="text-lg sm:text-xl p-2 rounded-full bg-white/20">
            <FaUserTie />
          </div>
          <p className="font-semibold text-white text-sm sm:text-base">
            {user?.username || user?.name || "User"}
          </p>
          <div
            className=" ml-4 text-3xl cursor-pointer hover:text-slate-200 "
            onClick={() => handleSignOut()}
          >
            <VscSignOut />
          </div>
        </div>
      </div>
    </>
  );
}
