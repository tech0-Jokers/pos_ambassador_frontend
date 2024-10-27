// src/components/LoginStatus.tsx

"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginStatus() {
  const { data: session } = useSession();

  return (
    <div className="mb-4">
      {session ? (
        <>
          <p>ようこそ、{session.user?.name}さん！</p>
          <button onClick={() => signOut()}>ログアウト</button>
        </>
      ) : (
        <>
          <p>ログインしていません。</p>
          <button onClick={() => signIn()}>ログイン</button>
        </>
      )}
    </div>
  );
}
