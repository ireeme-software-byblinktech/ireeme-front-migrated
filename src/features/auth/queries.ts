import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./api";
import { LoginDto, RegisterDto } from "./types";
import { useRouter } from "next/navigation";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: (response) => {
      localStorage.setItem("accessToken", response.accessToken);
      
      // Basic JWT decoding for redirect
      try {
        const payload = JSON.parse(atob(response.accessToken.split('.')[1]));
        const role = payload.roles?.[0];
        
        // Invalidate me query to refetch with new token
        queryClient.invalidateQueries({ queryKey: authKeys.me() });
        
        if (role === "SUPER_ADMIN") router.push("/admin");
        else if (role === "SCHOOL_ADMIN") router.push("/admin");
        else if (role === "TEACHER") router.push("/teacher");
        else if (role === "STUDENT") router.push("/student");
        else router.push("/admin");
      } catch (e) {
        router.push("/admin");
      }
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: (response) => {
      localStorage.setItem("accessToken", response.accessToken);
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
      router.push("/setup");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      localStorage.removeItem("accessToken");
      queryClient.setQueryData(authKeys.me(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
      router.push("/login");
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authApi.getMe(),
    retry: 1,
    staleTime: Infinity,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
  });
}
