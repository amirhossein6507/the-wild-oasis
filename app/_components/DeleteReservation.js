"use client";

import { TrashIcon } from "@heroicons/react/24/solid";
import { deleteReservation } from "@/app/_lib/actions";
import { useTransition } from "react";
import SpinnerMini from "./SpinnerMini";

function DeleteReservation({ bookingId, onDelete }) {
  // use server action in component
  // async function deleteReservation() {
  //   "use server"; // important
  //   // code
  // }

  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("are you sure for delete reservation?"))
      startTransition(() => deleteReservation(bookingId));
    onDelete(bookingId);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="group text-primary-300 hover:bg-accent-600 hover:text-primary-900 flex grow items-center gap-2 px-3 text-xs font-bold uppercase transition-colors"
    >
      {!isPending ? (
        <>
          <TrashIcon className="text-primary-600 group-hover:text-primary-800 h-5 w-5 transition-colors" />
          <span className="mt-1">Delete</span>
        </>
      ) : (
        <span className="mx-auto">
          <SpinnerMini />
        </span>
      )}
    </button>
  );
}

export default DeleteReservation;
