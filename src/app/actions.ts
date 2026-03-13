"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function registerUser(
  _prevState: { error: string },
  formData: FormData
): Promise<{ error: string }> {
  const nickname = formData.get("nickname")?.toString().trim();
  const intent = formData.get("intent")?.toString() || "host";

  if (!nickname) {
    return { error: "닉네임을 입력해주세요" };
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("users")
    .insert({ nickname })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "오류가 발생했습니다. 다시 시도해주세요." };
  }

  cookies().set("user_id", data.id, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(intent === "host" ? "/quiz/create" : "/quiz/join");
}
