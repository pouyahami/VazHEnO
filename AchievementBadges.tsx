import { useEffect, useMemo, useRef, useState } from "react";
import "./AchievementBadges.css";

type Level = "A0" | "A1" | "A2" | "B1" | "B2" | "C1";

type Props = {
  completedLessons: number;
  totalLessons: number;
  studiedToday: number;
  level: Level;
  reviewedWords: number;
  skillProgress: Record<string, number>;
  totalMinutes: number;
  studyStreak?: number;
};

type Badge = {
  id: string;
  icon: string;
  title: string;
  description: string;
  earned: boolean;
  progress?: string;
};

const LEVEL_ORDER: Level[] = ["A0", "A1", "A2", "B1", "B2", "C1"];
const SEEN_KEY = "vazheno-badges-seen-v1";

function loadSeen(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSeen(ids: string[]) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export default function AchievementBadges({
  completedLessons,
  totalLessons,
  studiedToday,
  level,
  reviewedWords,
  skillProgress,
  totalMinutes,
  studyStreak = 0,
}: Props) {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeLabel =
    hours > 0 ? `${hours} ساعت و ${mins} دقیقه` : `${totalMinutes} دقیقه`;

  const skillsActive = Object.values(skillProgress ?? {}).filter((v) => v > 0)
    .length;

  const badges: Badge[] = useMemo(() => {
    const levelIndex = LEVEL_ORDER.indexOf(level);

    return [
      {
        id: "first-step",
        icon: "🌱",
        title: "اولین قدم",
        description: "اولین درس را تمام کردی",
        earned: completedLessons >= 1,
        progress: completedLessons >= 1 ? undefined : `۰ از ۱ درس`,
      },
      {
        id: "five-lessons",
        icon: "📘",
        title: "۵ درس کامل",
        description: "۵ درس را با موفقیت تمام کردی",
        earned: completedLessons >= 5,
        progress:
          completedLessons >= 5 ? undefined : `${completedLessons} از ۵ درس`,
      },
      {
        id: "ten-lessons",
        icon: "📗",
        title: "۱۰ درس کامل",
        description: "۱۰ درس را تمام کردی؛ مسیرت جدی شده",
        earned: completedLessons >= 10,
        progress:
          completedLessons >= 10 ? undefined : `${completedLessons} از ۱۰ درس`,
      },
      {
        id: "twenty-five",
        icon: "🏅",
        title: "۲۵ درس",
        description: "۲۵ درس؛ نشان پشتکار",
        earned: completedLessons >= 25,
        progress:
          completedLessons >= 25 ? undefined : `${completedLessons} از ۲۵ درس`,
      },
      {
        id: "half-path",
        icon: "🎯",
        title: "نیمهٔ مسیر",
        description: "حداقل نیمی از درس‌ها را تمام کردی",
        earned: totalLessons > 0 && completedLessons >= totalLessons / 2,
        progress:
          totalLessons > 0 && completedLessons >= totalLessons / 2
            ? undefined
            : `${completedLessons} از ${Math.ceil(totalLessons / 2)} درس`,
      },
      {
        id: "one-hour",
        icon: "⏱️",
        title: "۱ ساعت مطالعه",
        description: `در مجموع حدود ${timeLabel} یاد گرفته‌ای`,
        earned: totalMinutes >= 60,
        progress:
          totalMinutes >= 60 ? undefined : `${totalMinutes} از ۶۰ دقیقه`,
      },
      {
        id: "three-hours",
        icon: "⏰",
        title: "۳ ساعت مطالعه",
        description: "۳ ساعت یادگیری متمرکز",
        earned: totalMinutes >= 180,
        progress:
          totalMinutes >= 180 ? undefined : `${totalMinutes} از ۱۸۰ دقیقه`,
      },
      {
        id: "today-goal",
        icon: "☀️",
        title: "هدف امروز",
        description: "امروز حداقل ۱۵ دقیقه مطالعه کردی",
        earned: studiedToday >= 15,
        progress:
          studiedToday >= 15 ? undefined : `${studiedToday} از ۱۵ دقیقه امروز`,
      },
      {
        id: "streak-3",
        icon: "🔥",
        title: "۳ روز پیاپی",
        description: "سه روز پشت‌سرهم مطالعه کردی",
        earned: studyStreak >= 3,
        progress:
          studyStreak >= 3 ? undefined : `${studyStreak} از ۳ روز پیاپی`,
      },
      {
        id: "streak-7",
        icon: "⚡",
        title: "۷ روز پیاپی",
        description: "یک هفته بدون وقفه؛ عادت ساخته شد",
        earned: studyStreak >= 7,
        progress:
          studyStreak >= 7 ? undefined : `${studyStreak} از ۷ روز پیاپی`,
      },
      {
        id: "level-a1",
        icon: "🅰️",
        title: "سطح A1",
        description: "به سطح مبتدی پیشرفته رسیدی",
        earned: levelIndex >= LEVEL_ORDER.indexOf("A1"),
      },
      {
        id: "level-a2",
        icon: "🚀",
        title: "سطح A2",
        description: "از سطح مقدماتی عبور کردی",
        earned: levelIndex >= LEVEL_ORDER.indexOf("A2"),
      },
      {
        id: "level-b1",
        icon: "💎",
        title: "سطح B1",
        description: "سطح متوسط؛ افتخار بزرگ",
        earned: levelIndex >= LEVEL_ORDER.indexOf("B1"),
      },
      {
        id: "reviewer",
        icon: "🔄",
        title: "مرورگر هوشمند",
        description: "حداقل ۲۰ واژه را مرور کردی",
        earned: reviewedWords >= 20,
        progress:
          reviewedWords >= 20 ? undefined : `${reviewedWords} از ۲۰ واژه`,
      },
      {
        id: "four-skills",
        icon: "🎧",
        title: "چهار مهارت",
        description: "در هر چهار مهارت تمرین ثبت کردی",
        earned: skillsActive >= 4,
        progress:
          skillsActive >= 4 ? undefined : `${skillsActive} از ۴ مهارت`,
      },
      {
        id: "centurion",
        icon: "👑",
        title: "۱۰۰ درس",
        description: "افسانهٔ واژه‌نو؛ ۱۰۰ درس کامل",
        earned: completedLessons >= 100,
        progress:
          completedLessons >= 100
            ? undefined
            : `${completedLessons} از ۱۰۰ درس`,
      },
    ];
  }, [
    completedLessons,
    totalLessons,
    studiedToday,
    level,
    reviewedWords,
    skillsActive,
    totalMinutes,
    timeLabel,
    studyStreak,
  ]);

  const earnedCount = badges.filter((b) => b.earned).length;
  const [toast, setToast] = useState<Badge | null>(null);
  const ready = useRef(false);

  useEffect(() => {
    const earnedIds = badges.filter((b) => b.earned).map((b) => b.id);
    const seen = loadSeen();
    const fresh = earnedIds.filter((id) => !seen.includes(id));

    if (!ready.current) {
      // First mount: mark current earned as seen so we don't spam old badges
      saveSeen([...new Set([...seen, ...earnedIds])]);
      ready.current = true;
      return;
    }

    if (fresh.length > 0) {
      const next = badges.find((b) => b.id === fresh[0]) ?? null;
      setToast(next);
      saveSeen([...new Set([...seen, ...earnedIds])]);
      const timer = window.setTimeout(() => setToast(null), 4200);
      return () => window.clearTimeout(timer);
    }
  }, [badges]);

  return (
    <section className="achievements-panel panel" dir="rtl">
      <div className="panel-heading">
        <div>
          <h3>نشان‌های افتخار</h3>
          <p>
            {earnedCount} از {badges.length} نشان را گرفته‌ای · مجموع مطالعه:{" "}
            {timeLabel}
            {studyStreak > 0 ? ` · 🔥 ${studyStreak} روز پیاپی` : ""}
          </p>
        </div>
        <span className="level-pill">🏆 {earnedCount}</span>
      </div>

      <div className="achievements-grid">
        {badges.map((badge) => (
          <article
            key={badge.id}
            className={`achievement-card ${badge.earned ? "is-earned" : "is-locked"}`}
            title={badge.description}
          >
            <div className="achievement-icon" aria-hidden="true">
              {badge.earned ? badge.icon : "🔒"}
            </div>
            <div className="achievement-body">
              <strong>{badge.title}</strong>
              <span>{badge.description}</span>
              {!badge.earned && badge.progress && (
                <small className="achievement-progress">{badge.progress}</small>
              )}
              {badge.earned && (
                <small className="achievement-earned-label">گرفته شد ✓</small>
              )}
            </div>
          </article>
        ))}
      </div>

      {toast && (
        <div className="badge-toast" role="status">
          <span className="badge-toast-icon">{toast.icon}</span>
          <div>
            <strong>نشان جدید!</strong>
            <span>
              {toast.title} — {toast.description}
            </span>
          </div>
          <button type="button" onClick={() => setToast(null)} aria-label="بستن">
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
