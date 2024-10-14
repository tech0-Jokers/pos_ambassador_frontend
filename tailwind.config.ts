import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4A90E2", // デフォルトの青色
        "primary-foreground": "#FFFFFF", // テキスト色
        destructive: "#E53E3E", // 赤色
        "destructive-foreground": "#FFFFFF",
        secondary: "#D69E2E", // ゴールド色
        "secondary-foreground": "#FFFFFF",
        background: "#F7FAFC", // ページ背景
        accent: "#EDF2F7", // ホバー時のアクセント
        ring: "#90CDF4", // フォーカスリング

        // カスタムグレー色の追加
        grayButton: "#E0E0E0", // グレーのボタン背景色
        grayButtonHover: "#BDBDBD", // ホバー時のグレー色
        "gray-foreground": "#333333", // グレー色のテキスト
      },
    },
  },
  plugins: [],
};

export default config;
