import jwt from "jsonwebtoken";

interface JWTPayload {
  userId: string;
  email: string;
  nickname: string;
  iat: number;
  exp: number;
}

export function getTokenFromLocalStorage(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    console.log("Decoding token:", token);
    const decoded = jwt.decode(token);
    console.log("Decoded token:", decoded);
    return decoded as JWTPayload;
  } catch (error) {
    console.error("토큰 디코딩 실패:", error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  return decoded.exp * 1000 < Date.now();
}

export function clearToken() {
  localStorage.removeItem("token");
}
