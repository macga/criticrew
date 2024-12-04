import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 아바타 배경색 목록
export const avatarColors = [
  "bg-red-500", // red
  "bg-orange-500", // orange
  "bg-emerald-500", // green
  "bg-blue-500", // blue
  "bg-violet-500", // purple
];

// 로그인 전 아바타 색상
export const guestAvatarColor = "bg-zinc-900"; // black

// 문자열로부터 일관된 색상 인덱스를 생성
export function getAvatarColor(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
}
