import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ホームディレクトリ側の無関係な package-lock.json を誤って
  // ワークスペースルートとして検出しないよう明示的に固定する。
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
