export default function ResultPage({
  params,
}: {
  params: { code: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-bold">결과</h1>
        <p className="text-muted-foreground">코드: {params.code}</p>
        <p className="text-sm text-muted-foreground">
          랭킹은 Sprint 5에서 구현됩니다.
        </p>
      </div>
    </main>
  );
}
