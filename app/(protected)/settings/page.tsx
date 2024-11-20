import { auth, signOut } from "@/auth"; // next-auth 라이브러리의 auth와 signOut 함수 가져오기

// SettingsPage 컴포넌트 정의
const SettingsPage = async () => {
  const session = await auth(); // 사용자 세션 정보 가져오기
  if (!session) {
    return <div>로그인이 필요합니다!</div>;
  }
  return (
    <div>
      {JSON.stringify(session)} {/* 세션 정보를 JSON 문자열로 출력 */}
      <form
        action={async () => {
          "use server"; // 서버 측에서 실행되는 코드임을 지정
          await signOut(); // 사용자 로그아웃
        }}
      >
        <button type="submit">로그아웃</button>
      </form>
      <div className="container">
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    </div>
  );
};

export default SettingsPage;
