export const metadata = {
  title: "CritiCrew - 콘텐츠 리뷰 플랫폼",
  description: "전문가들의 통찰력 있는 콘텐츠 리뷰를 만나보세요",
};

export default function HomePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-4">
        크리티크루에 오신 것을 환영합니다
      </h1>
      <p className="text-lg text-muted-foreground">
        영화와 드라마에 대한 당신의 생각을 공유해보세요.
      </p>
    </div>
  );
}
