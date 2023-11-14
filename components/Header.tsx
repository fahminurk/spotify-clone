/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import Button from "./ui/Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";
import useProfileModal from "@/hooks/useProfileModal";
import useLoadAvatar from "@/hooks/useLoadAvatar";

type HeaderProps = {
  children: React.ReactNode;
  className?: string;
};

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
  const profileModal = useProfileModal();
  const supabaseClient = useSupabaseClient();
  const { user, userDetails } = useUser();
  const avatarPath = useLoadAvatar(userDetails!);
  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    router.refresh();
    if (error) {
      toast.error(error.message);
      console.log(error);
    } else {
      toast.success("Logged out");
    }
  };

  const onClick = () => {
    if (!user) return authModal.onOpen();

    return uploadModal.onOpen();
  };

  return (
    <div
      className={twMerge(
        `h-fit bg-gradient-to-b from-emerald-800 p-6`,
        className
      )}
    >
      <div className="flex items-center justify-between w-full mb-4">
        <div className="hidden md:flex gap-x-2 items-center">
          <button
            onClick={() => router.back()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretLeft className="text-white" size={35} />
          </button>
          <button
            onClick={() => router.forward()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretRight className="text-white" size={35} />
          </button>
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button
            onClick={() => router.push("/")}
            className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-50 transition"
          >
            <HiHome className="text-black" size={20} />
          </button>
          <button
            onClick={() => router.push("/search")}
            className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-50 transition"
          >
            <BiSearch className="text-black" size={20} />
          </button>
          <button
            onClick={onClick}
            className="rounded-full hover:bg-slate-300/50 flex items-center justify-center hover:opacity-75 transition"
          >
            <AiOutlinePlus className="text-white" size={35} />
          </button>
        </div>
        <div className="flex justify-between items-center gap-x-4">
          {user ? (
            <div className="flex items-center gap-x-4">
              <Button onClick={handleLogout} className="bg-white px-6 py-2">
                Logout
              </Button>
              {userDetails?.avatar_url ? (
                <img
                  src={avatarPath!}
                  className="w-screen max-w-[40px] h-screen max-h-[40px] rounded-full object-cover cursor-pointer"
                  alt="avatar"
                  onClick={profileModal.onOpen}
                />
              ) : (
                <Button onClick={profileModal.onOpen} className="bg-white">
                  <FaUserAlt />
                </Button>
              )}
            </div>
          ) : (
            <>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className="bg-white px-6 py-2"
                >
                  Login
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
