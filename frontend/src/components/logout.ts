"use client";
import { useRouter } from "next/navigation";

export const logout = (router: ReturnType<typeof useRouter>) => {
  localStorage.removeItem("authToken");
  router.push("/");
};
