"use server";

import { auth, signIn } from "@/app/_lib/auth";
import { signOut } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { revalidatePath } from "next/cache";
import { getBookings } from "./data-service";

export const updateGuest = async (formData) => {
  const session = await auth();
  if (!session) throw new Error("please first loged in app");

  console.log(formData);

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[A-Za-z0-9]{4,20}$/.test(nationalID))
    throw new Error("please write currect natioal ID");

  const { data, error } = await supabase
    .from("Guests")
    .update({ nationalID, countryFlag, nationality })
    .eq("id", session.user.id);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }

  // in new next version setting cache update, and app works without the need for the bottom line
  revalidatePath("/account/profile");
};

export const deleteReservation = async (bookingId) => {
  const session = await auth();
  if (!session) throw new Error("please first loged in app");

  const guestBookings = await getBookings(session.user.id);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("you not allowed delete this cabin");

  const { error } = await supabase
    .from("Bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservation");
};

export const signInAction = async () => {
  await signIn("google", { redirectTo: "/account" });
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/" });
};
