export const MONDAY_COLORS = [
  "bg-[#e2445c] text-white",
  "bg-[#00c875] text-white",
  "bg-[#fdab3d] text-white",
  "bg-[#579bfc] text-white",
  "bg-[#a25ddc] text-white",
  "bg-[#0086c0] text-white",
  "bg-[#eec300] text-[#333333]",
  "bg-[#ff642e] text-white",
  "bg-[#ff158a] text-white",
  "bg-[#7f5347] text-white",
];

export function getTagColor(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return MONDAY_COLORS[Math.abs(hash) % MONDAY_COLORS.length];
}
