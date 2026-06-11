"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activity = searchParams.get("capasity") ?? "all";

  const handleFilter = (filter) => {
    const params = new URLSearchParams(searchParams);
    params.set("capasity", filter);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="border-primary-800 border">
      <Button activity={activity} handleFilter={handleFilter} filter="all">
        All Cabins
      </Button>
      <Button activity={activity} handleFilter={handleFilter} filter="small">
        0-2 guest
      </Button>
      <Button activity={activity} handleFilter={handleFilter} filter="medium">
        3-7 guest
      </Button>
      <Button activity={activity} handleFilter={handleFilter} filter="large">
        8-12 guest
      </Button>
    </div>
  );
}

function Button({ children, filter, handleFilter, activity }) {
  return (
    <button
      onClick={() => handleFilter(filter)}
      className={`hover:bg-primary-700 cursor-pointer px-5 py-2 ${activity === filter ? "bg-primary-700" : ""}`}
    >
      {children}
    </button>
  );
}

export default Filter;
