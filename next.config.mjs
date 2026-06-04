import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Redirect the problematic internal segment-explorer-node component to our mock component
      'next/dist/next-devtools/userspace/app/segment-explorer-node': path.resolve(__dirname, 'src/components/SegmentExplorerMock.js'),
    };
    return config;
  },
};

export default nextConfig;
