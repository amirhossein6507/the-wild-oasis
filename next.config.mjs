/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uxhczqoegciwbfusrlsq.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/Cabins/**",
      },
    ],
  },
};

export default nextConfig;

// 'uxhczqoegciwbfusrlsq.supabase.co/storage/v1/object/public/Cabins/0.5718777365612725-cabin-003.jpg'
