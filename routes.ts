//사용자 상태에 따른 경로 지정
/**
 * 해당 경로에서 대중이 액세스할 수 있는 다양한 경로는 활성 인증이 필요하지 않습니다.
 *@type {string[]}
 */
export const publicRoutes = ["/"];

/**
 * 해당 경로에서 활성 인증에 사용되는 일련의 경로는 로그인한 사용자를 /setting으로 리디렉션합니다.
 *@type {string[]}
 */

export const authRoutes = ["/auth/login", "/auth/register"];

/**
 * API 인증 경로
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * 로그인 후 기본 리다이렉트 경로
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
