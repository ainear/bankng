import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@bankng/ui", "@bankng/analytics", "@bankng/shared-types"],
  outputFileTracingRoot: path.join(__dirname, '../../'),
  // Fix: Copy Prisma Query Engine binary vào Vercel serverless output
  // See: https://pris.ly/d/engine-not-found-nextjs
  outputFileTracingIncludes: {
    "/**": [
      "../../node_modules/.prisma/client/*.node",
      "../../node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/*.node",
      "../../node_modules/.pnpm/prisma@*/node_modules/prisma/",
    ],
  },
  serverExternalPackages: ["@prisma/client", "prisma"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.vietqr.io',
      },
    ],
  },
};

export default nextConfig;


