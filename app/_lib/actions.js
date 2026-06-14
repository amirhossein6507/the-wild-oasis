"use server";

import { auth, signIn } from "@/app/_lib/auth";
import { signOut } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { revalidatePath } from "next/cache";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

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

export const createReservation = async (bookingData, formData) => {
  const session = await auth();
  if (!session) throw new Error("please first loged in app");

  //Object.entries(formData.entries());
  const newBooking = {
    ...bookingData,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations"),
    guestId: session.user.id,
    extrasPrice: 0,
    status: "unconfirmed",
    hasBreakfast: false,
    isPaid: false,
  };

  const { error } = await supabase.from("Bookings").insert([newBooking]);
  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
};

export const updateReservation = async (formData) => {
  const session = await auth();
  if (!session) throw new Error("please first loged in app");

  const bookingId = formData.get("bookingId");

  const guestBookings = await getBookings(session.user.id);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(Number(bookingId)))
    throw new Error(`you not allowed edited this cabin (${bookingId})`);

  const updatedFields = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations"),
  };

  const { error } = await supabase
    .from("Bookings")
    .update(updatedFields)
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  redirect("/account/reservations");
};

export const deleteReservation = async (bookingId) => {
  // TEST OPTIMISTIC STATE
  // await new Promise((res) => setTimeout(res, 2000));
  // throw new Error();

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
