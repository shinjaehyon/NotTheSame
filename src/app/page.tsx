import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const errorMessage =
    searchParams.error === "nickname"
      ? "닉네임을 입력해주세요"
      : searchParams.error === "server"
        ? "오류가 발생했습니다. 다시 시도해주세요."
        : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">상호이해도 게임</h1>
          <p className="text-sm text-muted-foreground">
            친구가 나를 얼마나 아는지 확인해보세요
          </p>
        </div>

        <form
          action="/api/auth/register"
          method="POST"
          className="space-y-3"
        >
          <Input name="nickname" placeholder="닉네임을 입력하세요" />
          {errorMessage && (
            <p className="text-sm text-destructive text-left">{errorMessage}</p>
          )}
          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              name="intent"
              value="host"
              size="lg"
              className="w-full"
            >
              방 만들기
            </Button>
            <Button
              type="submit"
              name="intent"
              value="guest"
              size="lg"
              variant="outline"
              className="w-full"
            >
              참여하기
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
