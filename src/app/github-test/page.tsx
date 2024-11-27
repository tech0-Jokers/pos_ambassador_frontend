"use client";

import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

type OrganizationResponse = {
  organization_id: number;
  detail?: string;
};

export default function GithubTestPage() {
  const { data: session } = useSession(); // Github認証情報を取得
  const [githubId, setGithubId] = useState<string | null>(null);
  const [githubUsername, setGithubUsername] = useState<
    string | null | undefined
  >(null);
  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // DBからデータを取得する関数
  const fetchOrganizationData = async () => {
    if (!session?.user) {
      alert("ログインしてください");
      return;
    }

    const githubId = session.user.id;
    const githubUsername = session.user.name;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/organization/${githubId}?github_username=${githubUsername}`
      );

      const data: OrganizationResponse = await response.json();

      if (response.ok) {
        setGithubId(githubId);
        setGithubUsername(githubUsername);
        setOrganizationId(data.organization_id);
        setError(null);
      } else {
        setError(data.detail || "エラーが発生しました");
        setGithubId(githubId);
        setGithubUsername(githubUsername);
        setOrganizationId(404);
      }
    } catch (err: unknown) {
      console.error("通信エラーが発生しました", err);
      setError("通信エラーが発生しました");
      setGithubId(null);
      setGithubUsername(null);
      setOrganizationId(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Github 認証テストページ</h1>
        {session ? (
          <div>
            <p>
              <strong>ログイン中:</strong> {session.user.name}
            </p>
            <button
              onClick={fetchOrganizationData}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              DBから組織情報を取得
            </button>
            <button
              onClick={() => signOut()}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
            >
              ログアウト
            </button>
            {githubId && (
              <div className="mt-4 text-left">
                <p>
                  <strong>Github ID:</strong> {githubId}
                </p>
                <p>
                  <strong>Github ユーザー名:</strong> {githubUsername}
                </p>
                <p>
                  <strong>組織ID:</strong> {organizationId}
                </p>
              </div>
            )}
            {error && (
              <p className="mt-4 text-red-500">
                <strong>エラー:</strong> {error}
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className="mb-4">ログインしてください</p>
            <button
              onClick={() => signIn("github")}
              className="bg-green-500 text-white px-4 py-2 rounded w-full"
            >
              Githubでログイン
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
