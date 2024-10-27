// `import NextAuth from "next-auth";` 行を削除
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
  }
}
