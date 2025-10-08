import type { FunEmojiEyes, FunEmojiMouth } from "@/shared/types/avatar.types";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

export const useAuth = () => {
  const { register, login, logout, user, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    const success = await login(email, password);

    if (success) {
      toast.success("Logged in successfully");
      navigate("/");
    } else {
      toast.error("Invalid email or password");
    }
  }

  const signUp = async (formData: FormData, avatarSelection: { eyes: FunEmojiEyes; mouth: FunEmojiMouth }) => {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const data = {
      name: formData.get("full-name") as string,
      email: formData.get("email") as string,
      password: password,
      avatar: `https://api.dicebear.com/9.x/fun-emoji/svg?eyes=${avatarSelection.eyes}&mouth=${avatarSelection.mouth}&size=144&seed=${formData.get("full-name")}`,
    };

    const success = await register(data);

    if (success) {
      toast.success("Account created successfully");
      navigate("/login", { replace: true });
    } else {
      toast.error("Error creating account");
    }
  }

  const logOut = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  }

  return {
    handleLogin,
    signUp,
    logOut,
    user,
    loading,
    error,
  }

}