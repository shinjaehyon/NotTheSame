import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            상호이해도 게임
          </h1>
          <p className="text-sm text-muted-foreground">
            친구가 나를 얼마나 아는지 확인해보세요
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full">
            방 만들기
          </Button>
          <Button size="lg" variant="outline" className="w-full">
            참여하기
          </Button>
        </div>
      </div>
    </main>
  );
}
