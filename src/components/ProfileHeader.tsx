import { Button } from "@/components/ui/button";
import { Camera, Pencil, BadgeCheck, Plus, Send } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import type { ProfileData } from "@/data/profile";

interface ProfileHeaderProps {
  isAdmin?: boolean;
  profile: ProfileData | null;
  loading?: boolean;
}

export function ProfileHeader({ isAdmin = false, profile, loading = false }: ProfileHeaderProps) {
  if (loading) {
    return (
      <div className="w-full bg-white rounded-[24px] overflow-hidden border border-gray-100 pb-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)] animate-pulse">
        <div className="h-[200px] bg-[#f5f6f8]" />
        <div className="px-8 pt-4 space-y-3">
          <div className="w-[152px] h-[152px] rounded-full bg-[#f5f6f8] -mt-[112px]" />
          <div className="h-6 bg-[#f5f6f8] rounded w-1/3" />
          <div className="h-4 bg-[#f5f6f8] rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-[24px] overflow-hidden border border-gray-100 pb-6 relative shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
      {/* Cover Photo */}
      <div className="relative h-[200px] w-full bg-[#e6e9ef]">
        {profile?.coverImage && (
          <ImageWithFallback
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        {isAdmin && (
          <button className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all hover:scale-105">
            <Camera className="w-5 h-5 text-[#323338]" />
          </button>
        )}
      </div>

      <div className="px-8 relative">
        <div className="flex justify-between items-start">
          {/* Avatar */}
          <div className="relative -mt-[112px]">
            <div className="w-[152px] h-[152px] rounded-full border-[5px] border-white bg-[#f5f6f8] shadow-md overflow-hidden">
              {profile?.profileImage && (
                <ImageWithFallback
                  src={profile.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {isAdmin && (
              <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full border border-gray-200 hover:bg-[#f5f6f8] transition-all shadow-sm z-10 hover:scale-105 text-[#323338]">
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>
          {isAdmin && (
            <button className="mt-4 p-2.5 rounded-full bg-[#f5f6f8] hover:bg-[#e6e9ef] transition-colors text-[#676879] hover:text-[#323338]">
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:justify-between gap-4 mt-2">
          {/* Left: Personal Info */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-1.5">
              <h1 className="text-[28px] font-semibold text-[#323338] tracking-tight leading-none">
                {profile?.name ?? "—"}
              </h1>
              <BadgeCheck className="w-6 h-6 text-[#00c875] mt-0.5" aria-label="인증됨" />
            </div>
            <p className="text-[16px] font-medium text-[#676879] mt-1.5 leading-snug">
              {profile?.role ?? ""}
            </p>
            <div className="flex items-center gap-2 mt-2 text-[13px] text-[#676879] font-medium">
              {profile?.location && <span>{profile.location}</span>}
              <span className="w-1 h-1 rounded-full bg-[#d0d4e4]" />
              <a href="#" className="text-[#0073ea] hover:underline font-medium">연락처 정보</a>
              <span className="w-1 h-1 rounded-full bg-[#d0d4e4]" />
              <a href="#" className="text-[#0073ea] hover:underline font-medium">500+ 1촌</a>
            </div>
          </div>

          {/* Right: Company & Education */}
          {(profile?.company || profile?.university) && (
            <div className="flex flex-col gap-2 min-w-[220px]">
              {profile.company && (
                <a href="#" className="flex items-center gap-2.5 hover:bg-[#f5f6f8] p-1 -ml-1 rounded-lg transition-colors group">
                  {profile.company.logoUrl && (
                    <ImageWithFallback
                      src={profile.company.logoUrl}
                      alt="Company"
                      className="w-8 h-8 object-cover rounded-md shadow-sm border border-gray-100"
                    />
                  )}
                  <span className="text-[13px] font-medium text-[#323338] group-hover:text-[#0073ea]">
                    {profile.company.name}
                  </span>
                </a>
              )}
              {profile.university && (
                <a href="#" className="flex items-center gap-2.5 hover:bg-[#f5f6f8] p-1 -ml-1 rounded-lg transition-colors group">
                  {profile.university.logoUrl && (
                    <ImageWithFallback
                      src={profile.university.logoUrl}
                      alt="University"
                      className="w-8 h-8 object-cover rounded-md shadow-sm border border-gray-100"
                    />
                  )}
                  <span className="text-[13px] font-medium text-[#323338] group-hover:text-[#0073ea]">
                    {profile.university.name}
                  </span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2.5 mt-5">
          {isAdmin ? (
            <>
              <Button className="bg-[#0073ea] hover:bg-[#0060c2] text-white rounded-xl px-5 py-2 h-auto text-[14px] font-medium transition-all shadow-[0_4px_12px_rgba(0,115,234,0.3)] hover:-translate-y-0.5">
                오픈 프로필
              </Button>
              <Button variant="outline" className="border-[#d0d4e4] text-[#323338] hover:bg-[#f5f6f8] hover:border-[#c5c9d6] rounded-xl px-5 py-2 h-auto text-[14px] font-medium transition-all">
                프로필 섹션 추가
              </Button>
            </>
          ) : (
            <>
              <Button className="bg-[#0073ea] hover:bg-[#0060c2] text-white rounded-xl px-5 py-2 h-auto text-[14px] font-medium transition-all shadow-[0_4px_12px_rgba(0,115,234,0.3)] hover:-translate-y-0.5 flex items-center gap-1.5">
                <Plus className="w-[16px] h-[16px]" />
                1촌 맺기
              </Button>
              <Button variant="outline" className="border-[#d0d4e4] text-[#323338] hover:bg-[#f5f6f8] hover:border-[#c5c9d6] rounded-xl px-5 py-2 h-auto text-[14px] font-medium transition-all flex items-center gap-1.5">
                <Send className="w-[16px] h-[16px]" />
                메시지 보내기
              </Button>
            </>
          )}
          <Button variant="outline" className="border-[#d0d4e4] text-[#676879] hover:bg-[#f5f6f8] hover:text-[#323338] hover:border-[#c5c9d6] rounded-xl px-5 py-2 h-auto text-[14px] font-medium transition-all">
            더 보기
          </Button>
        </div>
      </div>
    </div>
  );
}
