"use server";

import { signIn } from "@/app/_lib/auth";
import { signOut } from "@/app/_lib/auth";

export const signInAction = async () => {
  await signIn("google", { redirectTo: "/account" });
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/" });
};
