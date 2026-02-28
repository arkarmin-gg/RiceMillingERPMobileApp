import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/dashboard/home" />;
  }

  return <Redirect href="/auth/login" />;
}
