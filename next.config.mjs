/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["res.cloudinary.com", "via.placeholder.com", "www.meiji.co.jp"], // 必要なホスト名を追加
  },
  // キャッシュを完全に無効化
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ];
  },
  experimental: {
    // Next.jsビルド時のインクリメンタルキャッシュを無効化
    incrementalCacheHandlerPath: false,
  },
};

export default nextConfig;
