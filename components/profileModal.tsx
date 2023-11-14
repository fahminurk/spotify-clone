/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import Modal from "./ui/Modal";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import useProfileModal from "@/hooks/useProfileModal";
import useLoadAvatar from "@/hooks/useLoadAvatar";

const ProfileModal = () => {
  const profileModal = useProfileModal();
  const [isLoading, setIsLoading] = useState(false);
  const { user, userDetails } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const avatarPath = useLoadAvatar(userDetails!);

  const { register, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      avatar_url: "",
      full_name: userDetails?.full_name ?? "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      const imageFile = values.avatar_url[0];
      const uniqueID = uniqid();

      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from("images")
          .upload(`image-${values.full_name}-${uniqueID}`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

      if (userDetails?.avatar_url) {
        await supabaseClient.storage
          .from("images")
          .remove([userDetails?.avatar_url]);
      }

      if (imageError) {
        setIsLoading(false);
        console.log(imageError);
        return toast.error("failed to upload image");
      }

      const { data, error } = await supabaseClient
        .from("users")
        .update({
          avatar_url: imageData?.path,
          full_name: values.full_name,
        })
        .eq("id", user?.id);

      if (error) return toast.error(error.message);
      toast.success("Profile updated");
      profileModal.onClose();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (open: boolean) => {
    if (!open) {
      profileModal.onClose();
    }
  };

  console.log(avatarPath);

  return (
    <Modal
      title="My Profile"
      description=""
      isOpen={profileModal.isOpen}
      onChange={onChange}
    >
      <div className="flex justify-center mb-4">
        {avatarPath?.includes("null") ? (
          <img
            src="/images/liked.png"
            className="h-52 w-52 rounded-full object-cover"
            alt="avatar"
          />
        ) : (
          <img
            src={avatarPath!}
            className="h-52 w-52 rounded-full object-cover"
            alt="avatar"
          />
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="full_name"
          disabled={isLoading}
          {...register("full_name", { required: true })}
          placeholder="fullname"
        />
        <div>
          <div className="pb-1">Photo profile</div>
          <Input
            id="avatar_url"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register("avatar_url", { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Update
        </Button>
      </form>
    </Modal>
  );
};

export default ProfileModal;
