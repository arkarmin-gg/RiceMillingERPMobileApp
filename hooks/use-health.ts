import { checkHealth } from "@/services/health";
import { useQuery } from "@tanstack/react-query";

export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: checkHealth,
    retry: 1,
    refetchOnWindowFocus: true,
  });
}
