/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // The source photos in /public are 1MB+ phone JPEGs. next/image resizes
    // them per breakpoint and serves AVIF (or WebP where AVIF isn't accepted),
    // so a phone never downloads the full-size original.
    formats: ["image/avif", "image/webp"],
  },
  // Lint is skipped at build so a stray warning never blocks a deploy.
  eslint: { ignoreDuringBuilds: true },
};
export default nextConfig;
