import { Activity, ShieldAlert, User } from "lucide-react";

interface FooterProps {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
}

export function Footer({ isAdmin, setIsAdmin }: FooterProps) {
  return (
    <footer className="w-full bg-white border-t border-[#d0d4e4] mt-12 py-10">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-7 h-7 text-[#00c875] stroke-[3]" />
              <span className="text-[20px] font-black text-[#323338] tracking-tight font-sans">
                DAEWOONG
              </span>
            </div>
            <p className="text-[13px] font-medium text-[#676879] font-sans mt-1">
              Copyright © 2026 Daewoong, Inc. All rights reserved.
            </p>
          </div>

          {/* Admin Toggle Button */}
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-bold transition-colors ${
              isAdmin
                ? "bg-[#e2445c]/10 text-[#e2445c] hover:bg-[#e2445c]/20"
                : "bg-[#0073ea]/10 text-[#0073ea] hover:bg-[#0073ea]/20"
            }`}
          >
            {isAdmin ? (
              <>
                <ShieldAlert className="w-4 h-4" />
                관리자 로그아웃
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                관리자 로그인
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
}
