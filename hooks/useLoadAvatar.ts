import { UserDetails } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadAvatar = (user: UserDetails) => {
  const supabaseClient = useSupabaseClient();

  if (!user) return null;

  const { data: imageData } = supabaseClient.storage
    .from("images")
    .getPublicUrl(user.avatar_url as string);

  return imageData.publicUrl;
};

export default useLoadAvatar;
