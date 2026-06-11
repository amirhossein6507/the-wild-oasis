import { unstable_noStore as noStore } from "next/cache";
import React from "react";
import { getCabins } from "@/app/_lib/data-service";
import CabinCard from "@/app/_components/CabinCard";

async function CabinList({ filter }) {
  noStore();

  const cabins = await getCabins();

  let displayedCabin;

  if (filter == "small")
    displayedCabin = cabins.filter((cabin) => cabin.maxCapacity <= 3);
  if (filter == "medium")
    displayedCabin = cabins.filter(
      (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7,
    );
  if (filter == "large")
    displayedCabin = cabins.filter((cabin) => cabin.maxCapacity >= 8);
  if (filter == "all") displayedCabin = cabins;

  return (
    <>
      {displayedCabin.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:gap-12 xl:gap-14">
          {displayedCabin.map((cabin) => (
            <CabinCard cabin={cabin} key={cabin.id} />
          ))}
        </div>
      )}
    </>
  );
}

export default CabinList;
