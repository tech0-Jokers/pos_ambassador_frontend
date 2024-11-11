/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["res.cloudinary.com", "via.placeholder.com", "www.meiji.co.jp"], // 必要なホスト名を追加
  },
  // 他の必要な設定はここに残す
};

export default nextConfig;
