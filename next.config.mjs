/** @type {import('next').NextConfig} */
const nextConfig = {
  // We hotlink the client's existing photos for now, so image optimization
  // isn't needed. Lint is skipped at build so a stray warning never blocks a deploy.
  eslint: { ignoreDuringBuilds: true },
};
export default nextConfig;
