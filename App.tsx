
import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import FirebaseAccount from "./FirebaseAccount";
import "./App.css";
import StageAssessment from "./StageAssessment";
import ListeningPractice from "./ListeningPractice";
import SpeakingPractice from "./SpeakingPractice";
import DailyLearning from "./DailyLearning";
import AlphabetCourse from "./AlphabetCourse";
import IeltsCourse from "./IeltsCourse";
import SmartLearning from "./SmartLearning";
import { expandedLessons } from "./ExpandedLessons";
import { extraLessons } from "./ExtraLessons";
import { baseLessons } from "./BaseLessons";
import AchievementBadges from "./AchievementBadges";
import PathHub from "./PathHub";

type Level = "A0" | "A1" | "A2" | "B1" | "B2" | "C1";
type Page =
  | "home" | "dashboard" | "placement" | "path" | "lesson"
  | "practice" | "review" | "skills" | "settings" | "assessment"
  | "listening" | "speaking" | "daily" | "alphabet" | "ielts";

type Lesson = {
  id: string; level: Level; title: string; category: string; minutes: number;
  explanation: string; example: string; translation: string; tip: string;
  question: string; options: string[]; answer: string; feedback: string;
  words: { word: string; meaning: string; example: string }[];
};

type SavedState = {
  userName: string; dailyGoal: string; completedLessons: string[];
  reviewedWords: string[]; reviewDates: Record<string, number>;
  currentLessonId: string; level: Level; placementHistory: string[][];
  placementResult: Level | null; lastStudyDate: string; studiedToday: number;
  skillProgress: Record<string, number>;
};

const STORAGE_KEY = "vazheno-progress-v3";
const LEVELS: Level[] = ["A0", "A1", "A2", "B1", "B2", "C1"];

const emptyState: SavedState = {
  userName: "دوست زبان‌آموز", dailyGoal: "۱۵ دقیقه", completedLessons: [],
  reviewedWords: [], reviewDates: {}, currentLessonId: "a0-1", level: "A0",
  placementHistory: [], placementResult: null, lastStudyDate: "", studiedToday: 0,
  skillProgress: { reading: 0, listening: 0, speaking: 0, writing: 0 },
};

function loadSaved(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as Partial<SavedState>;
    return {
      ...emptyState, ...parsed,
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      reviewedWords: Array.isArray(parsed.reviewedWords) ? parsed.reviewedWords : [],
      reviewDates: parsed.reviewDates ?? {},
      placementHistory: Array.isArray(parsed.placementHistory) ? parsed.placementHistory : [],
    };
  } catch {
    return emptyState;
  }
}

const lessons: Lesson[] = [...(baseLessons as Lesson[]), ...(expandedLessons as Lesson[]), ...(extraLessons as Lesson[])];

function App() {
  const [page, setPage] = useState<Page>("home");
  const [saved, setSaved] = useState<SavedState>(() => loadSaved());
  const [mobileMenu, setMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lessonIndex, setLessonIndex] = useState(0);

  const go = (next: Page) => {
    setPage(next);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateSaved = useCallback((patch: Partial<SavedState>) => {
    setSaved((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const startLesson = (id: string) => {
    const index = lessons.findIndex((lesson) => lesson.id === id);
    if (index < 0) return;
    setLessonIndex(index);
    updateSaved({ currentLessonId: id });
    go("lesson");
  };

  const startLearning = () => {
    if (!saved.placementResult) {
      go("placement");
      return;
    }
    const level = saved.placementResult ?? saved.level;
    const nextId =
      saved.currentLessonId ||
      lessons.find((l) => l.level === level && !saved.completedLessons.includes(l.id))?.id ||
      lessons.find((l) => l.level === level)?.id ||
      lessons[0]?.id;
    if (nextId) startLesson(nextId);
    else go("dashboard");
  };

  const completedCount = saved.completedLessons.length;
  const progress = Math.round((completedCount / Math.max(1, lessons.length)) * 100);
  const currentLesson = lessons[lessonIndex] ?? lessons[0];
  const handleUserChange = (_u: User | null) => {};

  return (
    <div className={`app-shell ${darkMode ? "dark-mode" : ""}`} dir="rtl" lang="fa">
      <header className="topbar">
        <div className="topbar-inner">
          <button className="brand" onClick={() => go("home")}>
            <span className="brand-mark">و</span>
            <span className="brand-name">واژه‌نو</span>
          </button>
          <button className="mobile-menu-button" onClick={() => setMobileMenu(!mobileMenu)}>☰</button>
          <nav className={`top-links ${mobileMenu ? "is-open" : ""}`}>
            <button onClick={startLearning}>شروع یادگیری</button>
            <button onClick={() => go("path")}>دوره‌ها</button>
            <button onClick={() => go("dashboard")}>پیشرفت من</button>
            <button onClick={() => go("review")}>مرور</button>
            <button onClick={() => go("skills")}>مهارت‌ها</button>
          </nav>
          <div className="top-actions">
            <button className="button button-ghost small-button theme-toggle" onClick={() => setDarkMode((d) => !d)}>
              <span>{darkMode ? "☀️" : "🌙"}</span>
            </button>
            <button className="button button-primary small-button" onClick={startLearning}>شروع یادگیری</button>
            <FirebaseAccount onUserChange={handleUserChange} />
          </div>
        </div>
      </header>

      {page === "home" && (
        <main>
          <section className="hero section-container">
            <div className="hero-copy">
              <span className="eyebrow"><span className="eyebrow-dot" /> یادگیری اصولی، قدم‌به‌قدم</span>
              <h1>انگلیسی را<br /><span className="gradient-text">واقعاً یاد بگیر.</span></h1>
              <p>از اولین جمله‌ها تا درک متن‌های پیشرفته؛ با آموزش فارسی، تمرین فعال و مسیر متناسب با سطح خودت.</p>
              <div className="hero-actions">
                <button className="button button-primary button-large" onClick={startLearning}>شروع یادگیری ←</button>
                <button className="button button-ghost button-large" onClick={() => go("path")}>دیدن دوره‌ها</button>
              </div>
            </div>
          </section>
        </main>
      )}

      {page !== "home" && (
        <div className="workspace section-container">
          <aside className={`sidebar ${mobileMenu ? "is-open" : ""}`}>
            <div className="sidebar-user">
              <div className="avatar">{(saved.userName || "و").slice(0, 1)}</div>
              <div><strong>{saved.userName}</strong><span>سطح {saved.placementResult ?? saved.level}</span></div>
            </div>
            <button className="button button-primary" style={{ width: "100%", marginBottom: 12 }} onClick={startLearning}>ادامه یادگیری ←</button>
            {([
              ["dashboard", "داشبورد", "▦"],
              ["path", "دوره‌ها", "⌁"],
              ["review", "مرور", "↻"],
              ["skills", "مهارت‌ها", "◉"],
              ["settings", "تنظیمات", "⚙"],
            ] as [Page, string, string][]).map(([id, label, icon]) => (
              <button key={id} className={`sidebar-link ${page === id ? "active" : ""}`} onClick={() => go(id)}>
                <span className="sidebar-link-icon">{icon}</span>{label}
              </button>
            ))}
            <button className="sidebar-home" onClick={() => go("home")}>← صفحهٔ اصلی</button>
          </aside>

          <section className="workspace-content">
            {page === "path" && (
              <PathHub
                lessons={lessons}
                completedLessons={saved.completedLessons}
                userLevel={saved.placementResult ?? saved.level}
                progress={progress}
                completedCount={completedCount}
                onStartLesson={startLesson}
                onOpenDaily={() => go("daily")}
                onOpenAlphabet={() => go("alphabet")}
              />
            )}

            {page === "daily" && (
              <>
                <div className="page-heading">
                  <div><span className="eyebrow">تمرین کوتاه</span><h1>تمرین روزانه</h1></div>
                  <button className="button button-ghost" onClick={() => go("path")}>← بازگشت</button>
                </div>
                <DailyLearning lessons={lessons as any} level={saved.placementResult ?? saved.level} completedLessonIds={saved.completedLessons} onOpenLesson={startLesson} />
              </>
            )}

            {page === "alphabet" && (
              <>
                <div className="page-heading">
                  <div><span className="eyebrow">مبتدی</span><h1>آموزش الفبا</h1></div>
                  <button className="button button-ghost" onClick={() => go("path")}>← بازگشت</button>
                </div>
                <AlphabetCourse />
              </>
            )}

            {page === "ielts" && (
              <>
                <div className="page-heading">
                  <div><span className="eyebrow">آزمون</span><h1>آمادگی IELTS</h1></div>
                  <button className="button button-ghost" onClick={() => go("skills")}>← مهارت‌ها</button>
                </div>
                <IeltsCourse />
              </>
            )}

            {page === "dashboard" && (
              <>
                <div className="page-heading">
                  <div><span className="eyebrow">فضای شخصی</span><h1>خوش برگشتی، {saved.userName}</h1></div>
                  <button className="button button-primary" onClick={startLearning}>ادامه یادگیری ←</button>
                </div>
                <div className="metric-grid">
                  <div className="metric-card"><span>پیشرفت</span><strong>{progress}%</strong></div>
                  <div className="metric-card"><span>درس‌های تکمیل‌شده</span><strong>{completedCount}</strong></div>
                </div>
                <AchievementBadges
                  completedLessons={completedCount}
                  totalLessons={lessons.length}
                  studiedToday={saved.studiedToday}
                  level={saved.placementResult ?? saved.level}
                  reviewedWords={saved.reviewedWords.length}
                  skillProgress={saved.skillProgress}
                  totalMinutes={saved.studiedToday}
                  studyStreak={0}
                />
              </>
            )}

            {page === "skills" && (
              <>
                <div className="page-heading"><div><span className="eyebrow">مهارت‌ها</span><h1>مهارت‌های زبان</h1></div></div>
                <div className="panel" style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <strong>آمادگی IELTS</strong>
                    <p style={{ margin: "4px 0 0", color: "#6e6e84", fontSize: 13 }}>جدا از مسیر اصلی دوره‌ها</p>
                  </div>
                  <button className="button button-ghost" onClick={() => go("ielts")}>ورود به IELTS ←</button>
                </div>
                <div className="skill-cards-grid">
                  <article className="panel skill-card"><h3>خواندن</h3><button className="button button-primary" onClick={() => go("lesson")}>تمرین</button></article>
                  <article className="panel skill-card"><h3>شنیدن</h3><button className="button button-primary" onClick={() => go("listening")}>تمرین</button></article>
                  <article className="panel skill-card"><h3>صحبت</h3><button className="button button-primary" onClick={() => go("speaking")}>تمرین</button></article>
                  <article className="panel skill-card"><h3>نوشتن</h3><button className="button button-primary" onClick={() => go("practice")}>تمرین</button></article>
                </div>
              </>
            )}

            {page === "listening" && <ListeningPractice onBack={() => go("skills")} />}
            {page === "speaking" && <SpeakingPractice onBack={() => go("skills")} />}
            {page === "assessment" && <StageAssessment onBack={() => go("dashboard")} />}

            {page === "lesson" && currentLesson && (
              <div className="lesson-wrap">
                <div className="page-heading">
                  <div>
                    <span className="eyebrow">{currentLesson.level} · {currentLesson.category}</span>
                    <h1>{currentLesson.title}</h1>
                  </div>
                  <button className="button button-ghost" onClick={() => go("path")}>← دوره‌ها</button>
                </div>
                <div className="panel">
                  <p>{currentLesson.explanation}</p>
                  <blockquote dir="ltr">{currentLesson.example}</blockquote>
                  <p>{currentLesson.translation}</p>
                  <p><strong>نکته:</strong> {currentLesson.tip}</p>
                  <button
                    className="button button-primary"
                    onClick={() => {
                      if (!saved.completedLessons.includes(currentLesson.id)) {
                        updateSaved({
                          completedLessons: [...saved.completedLessons, currentLesson.id],
                          studiedToday: saved.studiedToday + (currentLesson.minutes || 10),
                        });
                      }
                      go("path");
                    }}
                  >
                    تکمیل درس ←
                  </button>
                </div>
              </div>
            )}

            {page === "review" && (
              <>
                <div className="page-heading"><div><span className="eyebrow">مرور</span><h1>مرور هوشمند</h1></div></div>
                <SmartLearning />
              </>
            )}

            {page === "settings" && (
              <>
                <div className="page-heading"><div><span className="eyebrow">تنظیمات</span><h1>تنظیمات</h1></div></div>
                <div className="panel">
                  <label>نام نمایشی
                    <input value={saved.userName} onChange={(e) => updateSaved({ userName: e.target.value })} />
                  </label>
                </div>
              </>
            )}

            {page === "placement" && (
              <div className="quiz-wrap">
                <div className="page-heading">
                  <div><span className="eyebrow">تعیین سطح</span><h1>شروع با سطح مناسب</h1></div>
                  <button className="button button-ghost" onClick={() => go("home")}>← بازگشت</button>
                </div>
                <div className="panel">
                  <p>سطح خودت را انتخاب کن:</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {LEVELS.map((level) => (
                      <button
                        key={level}
                        className="button button-primary"
                        onClick={() => {
                          updateSaved({
                            placementResult: level,
                            level,
                            currentLessonId: lessons.find((l) => l.level === level)?.id ?? "a0-1",
                          });
                          const id = lessons.find((l) => l.level === level)?.id;
                          if (id) startLesson(id);
                          else go("path");
                        }}
                      >
                        سطح {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {page === "practice" && (
              <>
                <div className="page-heading"><div><h1>جمله‌سازی</h1></div><button className="button button-ghost" onClick={() => go("skills")}>← بازگشت</button></div>
                <div className="panel"><p>از درس‌ها برای تمرین جمله استفاده کن.</p><button className="button button-primary" onClick={() => go("path")}>رفتن به درس‌ها</button></div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
