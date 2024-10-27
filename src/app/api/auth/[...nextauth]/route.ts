import NextAuth, { AuthOptions, Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID || "", // 修正: AUTH_GITHUB_IDに変更
      clientSecret: process.env.AUTH_GITHUB_SECRET || "", // 修正: AUTH_GITHUB_SECRETに変更
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.sub || ""; // `sub`が`undefined`の場合は空文字列を使用
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
