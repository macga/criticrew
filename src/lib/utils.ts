import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 아바타 배경색 목록
export const avatarColors = [
  "bg-[#DC2626]", // red
  "bg-[#F97316]", // orange
  "bg-[#16A34A]", // green
  "bg-[#2563EB]", // blue
  "bg-[#7C3AED]", // purple
];

// 로그인 전 아바타 색상
export const guestAvatarColor = "bg-[#000000]"; // black

// 문자열로부터 일관된 색상 인덱스를 생성
export function getAvatarColor(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
}
