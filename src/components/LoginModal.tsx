import { useState, useEffect } from "react";
import { X, Delete } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PIN_LENGTH = 6;

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPin("");
      setError(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      const correct = import.meta.env.VITE_ADMIN_PIN;
      if (pin === correct) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 200);
      } else {
        setShake(true);
        setError(true);
        setTimeout(() => {
          setPin("");
          setError(false);
          setShake(false);
        }, 600);
      }
    }
  }, [pin, onSuccess, onClose]);

  if (!isOpen) return null;

  function handleNumber(n: string) {
    if (pin.length < PIN_LENGTH) setPin((prev) => prev + n);
  }

  function handleDelete() {
    setPin((prev) => prev.slice(0, -1));
  }

  const PAD = ["1","2","3","4","5","6","7","8","9","","0","del"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#323338]/40 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-8 w-[320px] flex flex-col items-center gap-6">
        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f6f8] text-[#676879] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 타이틀 */}
        <div className="text-center">
          <p className="text-[18px] font-semibold text-[#323338]">관리자 로그인</p>
          <p className="text-[13px] text-[#676879] mt-1">6자리 PIN을 입력하세요</p>
        </div>

        {/* PIN 도트 */}
        <div className={`flex gap-3 ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-150 ${
                i < pin.length
                  ? error
                    ? "bg-[#e2445c] scale-110"
                    : "bg-[#0073ea] scale-110"
                  : "bg-[#d0d4e4]"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-[13px] text-[#e2445c] font-medium -mt-2 animate-in fade-in duration-150">
            PIN이 올바르지 않습니다
          </p>
        )}

        {/* 숫자 패드 */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {PAD.map((key, i) => {
            if (key === "") return <div key={i} />;
            if (key === "del") {
              return (
                <button
                  key={i}
                  onClick={handleDelete}
                  disabled={pin.length === 0}
                  className="h-14 flex items-center justify-center rounded-2xl bg-[#f5f6f8] text-[#676879] hover:bg-[#e6e9ef] active:scale-95 transition-all disabled:opacity-30"
                >
                  <Delete className="w-5 h-5" />
                </button>
              );
            }
            return (
              <button
                key={i}
                onClick={() => handleNumber(key)}
                className="h-14 flex items-center justify-center rounded-2xl bg-[#f5f6f8] text-[#323338] text-[20px] font-semibold hover:bg-[#e6e9ef] active:scale-95 transition-all"
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
