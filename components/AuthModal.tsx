"use client";
import React, { useEffect, useState } from "react";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import useAuthModal from "@/hooks/useAuthModal";
import Modal from "./ui/Modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Input from "./ui/Input";
import Button from "./ui/Button";

const AuthModal = () => {
  const { session } = useSessionContext();
  const router = useRouter();
  const { onClose, isOpen } = useAuthModal();
  const [isLoading, setIsLoading] = useState(false);
  const supabaseClient = useSupabaseClient();
  const [type, setType] = useState<"login" | "register">("login");

  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
    }
  }, [session, router, onClose]);

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      if (type === "register") {
        const { data, error } = await supabaseClient.auth.signUp({
          email: values.email,
          password: values.password,
        });
        if (error && !data) return toast.error(error.message);
        toast.success("Account created, check your email to verify");
      } else {
        const { error, data } = await supabaseClient.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) return toast.error(error.message);
        toast.success("Logged in");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      reset();
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Welcome"
      description={
        type === "login" ? "Login to your account." : "Create your account."
      }
      isOpen={isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="email"
          disabled={isLoading}
          {...register("email", { required: true })}
          placeholder="Email"
        />
        <Input
          id="password"
          type="password"
          disabled={isLoading}
          {...register("password", { required: true })}
          placeholder="Password"
        />

        <Button disabled={isLoading} type="submit">
          {type === "login" ? "Sign in" : "Sign Up"}
        </Button>
        {type === "login" ? (
          <div
            className="flex gap-2 justify-center text-sm"
            onClick={() => setType("register")}
          >
            <p>dont have an account?</p>
            <p className="text-blue-500 underline hover:text-blue-400 cursor-pointer">
              Sign up
            </p>
          </div>
        ) : (
          <div
            className="flex gap-2 justify-center text-sm"
            onClick={() => setType("login")}
          >
            <p>alredy have an account?</p>
            <p className="text-blue-500 underline hover:text-blue-400 cursor-pointer">
              Sign in
            </p>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default AuthModal;
