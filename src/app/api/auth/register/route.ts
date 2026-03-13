import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const nickname = formData.get("nickname")?.toString().trim();
  const intent = formData.get("intent")?.toString() || "host";

  if (!nickname) {
    return NextResponse.redirect(new URL("/?error=nickname", req.url), 303);
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("users")
    .insert({ nickname })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.redirect(new URL("/?error=server", req.url), 303);
  }

  const dest = intent === "host" ? "/quiz/create" : "/quiz/join";
  const response = NextResponse.redirect(new URL(dest, req.url), 303);

  response.cookies.set("user_id", data.id, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
