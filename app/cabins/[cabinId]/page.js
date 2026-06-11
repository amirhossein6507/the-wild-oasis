import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import TextExpander from "@/app/_components/TextExpander";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { EyeSlashIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { Suspense } from "react";

// export const metadata = {
//   title: "Cabin",
// };

export const generateMetadata = async ({ params }) => {
  const { cabinId } = await params;
  const { name } = await getCabin(cabinId);

  return {
    title: `Cabin ${name}`,
  };
};

export const generateStaticParams = async () => {
  const cabins = await getCabins();

  const ids = cabins.map((cabin) => {
    return { cabinId: String(cabin.id) };
  });

  return ids;
};

export default async function Page({ params }) {
  const { cabinId } = await params;
  const cabin = await getCabin(cabinId);

  const {
    id,
    name,
    maxCapacity,
    regularPrice,
    discount,
    imageCabin,
    description,
  } = cabin;

  return (
    <div className="mx-auto mt-8 max-w-6xl">
      <div className="border-primary-800 mb-24 grid grid-cols-[3fr_4fr] gap-20 border px-10 py-3">
        <div className="relative -translate-x-3 scale-[1.15]">
          <Image
            fill
            className="object-cover"
            src={imageCabin}
            alt={`Cabin ${name}`}
          />
        </div>

        <div>
          <h3 className="text-accent-100 bg-primary-950 mb-5 w-[150%] -translate-x-63.5 p-6 pb-1 text-7xl font-black">
            Cabin {name}
          </h3>

          <p className="text-primary-300 mb-10 text-lg">
            <TextExpander>{description}</TextExpander>
          </p>

          <ul className="mb-7 flex flex-col gap-4">
            <li className="flex items-center gap-3">
              <UsersIcon className="text-primary-600 h-5 w-5" />
              <span className="text-lg">
                For up to <span className="font-bold">{maxCapacity}</span>{" "}
                guests
              </span>
            </li>
            <li className="flex items-center gap-3">
              <MapPinIcon className="text-primary-600 h-5 w-5" />
              <span className="text-lg">
                Located in the heart of the{" "}
                <span className="font-bold">Dolomites</span> (Italy)
              </span>
            </li>
            <li className="flex items-center gap-3">
              <EyeSlashIcon className="text-primary-600 h-5 w-5" />
              <span className="text-lg">
                Privacy <span className="font-bold">100%</span> guaranteed
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h2 className="text-accent-400 mb-8 text-center text-5xl font-semibold">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>

        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
