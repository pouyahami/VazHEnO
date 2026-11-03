import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { spanishLessons } from "./SpanishLessons";
import AchievementBadges from "./AchievementBadges";
import PathHub from "./PathHub";
import type { Level, Lesson, SavedState, TargetLang } from "./types";
import { LEVELS, STORAGE_KEY, PROGRESS_VERSION } from "./types";
import { loadCloudProgress, mergeProgress, saveCloudProgress } from "./services/progressSync";

type Page =
  | "home" | "dashboard" | "placement" | "path" | "lesson"
  | "practice" | "review" | "skills" | "settings" | "assessment"
  | "listening" | "speaking" | "daily" | "alphabet" | "ielts";

const LEVEL_META: Record<Level, { title: string; desc: string }> = {
  A0: { title: "صفر مطلق", desc: "هیچ چیز بلد نیستم؛ از الفبا و سلام شروع می‌کنم." },
  A1: { title: "مبتدی", desc: "چند کلمه و جملهٔ خیلی ساده بلدم." },
  A2: { title: "مبتدی پلاس", desc: "خرید و کار روزمره را کم‌وبیش می‌فهمم." },
  B1: { title: "متوسط", desc: "دربارهٔ سفر و علایق حرف می‌زنم." },
  B2: { title: "متوسط بالا", desc: "متن و بحث عمومی را دنبال می‌کنم." },
  C1: { title: "پیشرفته", desc: "متن و گفتار پیچیده را می‌فهمم." },
};

const emptyState: SavedState = {
  userName: "دوست زبان‌آموز",
  dailyGoal: "۱۵ دقیقه",
  completedLessons: [],
  reviewedWords: [],
  reviewDates: {},
  currentLessonId: "a0-1",
  level: "A0",
  placementHistory: [],
  placementResult: null,
  lastStudyDate: "",
  studiedToday: 0,
  skillProgress: { reading: 0, listening: 0, speaking: 0, writing: 0 },
  studyStreak: 0,
  fontScale: "normal",
  targetLang: "en",
  version: PROGRESS_VERSION,
  updatedAt: Date.now(),
};

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function speakText(text: string, lang: TargetLang = "en") {
  try {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "es" ? "es-ES" : "en-US";
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  } catch {}
}

const englishLessons: Lesson[] = [...(baseLessons as Lesson[]), ...(expandedLessons as Lesson[]), ...(extraLessons as Lesson[])].filter(
  (lesson): lesson is Lesson => !!lesson && !!lesson.id && !!lesson.level,
);
const spanishPack: Lesson[] = (spanishLessons as Lesson[]).filter(
  (lesson): lesson is Lesson => !!lesson && !!lesson.id && !!lesson.level,
);

function App() {
  const [page, setPage] = useState<Page>("home");
  const [saved, setSaved] = useState<SavedState>(emptyState);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authSignal, setAuthSignal] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem("vazheno-dark") === "1"; } catch { return false; }
  });
  const [searchQ, setSearchQ] = useState("");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState<string | null>(null);
  const [quizDone, setQuizDone] = useState(false);
  const cloudUserRef = useRef<User | null>(null);
  const saveTimer = useRef<number | null>(null);

  const targetLang: TargetLang = saved.targetLang === "es" ? "es" : "en";
  const lessons = useMemo(() => (targetLang === "es" ? spanishPack : englishLessons), [targetLang]);
  const langLabel = targetLang === "es" ? "اسپانیایی" : "انگلیسی";
  const isLoggedIn = !!authUser;

  useEffect(() => {
    try { localStorage.setItem("vazheno-dark", darkMode ? "1" : "0"); } catch {}
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  useEffect(() => {
    try {
      document.title = page === "home" ? `واژه‌نو | یادگیری ${langLabel}` : `واژه‌نو | ${langLabel}`;
    } catch {}
  }, [page, langLabel]);

  const cacheLocal = useCallback((next: SavedState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const clearLocalProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const updateSaved = useCallback((patch: Partial<SavedState>) => {
    setSaved((prev) => {
      const next: SavedState = { ...prev, ...patch, updatedAt: Date.now(), version: PROGRESS_VERSION };
      if (cloudUserRef.current) {
        cacheLocal(next);
        if (saveTimer.current) window.clearTimeout(saveTimer.current);
        saveTimer.current = window.setTimeout(() => {
          void saveCloudProgress(cloudUserRef.current!, next);
        }, 500);
      }
      return next;
    });
  }, [cacheLocal]);

  const requireAuth = useCallback((): boolean => {
    if (cloudUserRef.current) return true;
    setAuthSignal((n) => n + 1);
    return false;
  }, []);

  const handleUserChange = useCallback(async (user: User | null) => {
    cloudUserRef.current = user;
    setAuthUser(user);
    setAuthReady(true);
    if (!user) {
      clearLocalProgress();
      setSaved({ ...emptyState, updatedAt: Date.now() });
      setPage("home");
      return;
    }
    const cloud = await loadCloudProgress(user);
    let next: SavedState;
    if (cloud && (cloud.completedLessons?.length || cloud.placementResult || cloud.currentLessonId)) {
      next = mergeProgress({ ...emptyState }, cloud);
    } else {
      next = {
        ...emptyState,
        userName: user.displayName || emptyState.userName,
        updatedAt: Date.now(),
        version: PROGRESS_VERSION,
      };
    }
    if (user.displayName) next = { ...next, userName: user.displayName };
    setSaved(next);
    cacheLocal(next);
    void saveCloudProgress(user, next);
  }, [cacheLocal, clearLocalProgress]);

  const go = (next: Page) => {
    setPage(next);
    setMobileMenu(false);
    setQuizChoice(null);
    setQuizDone(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goProtected = (next: Page) => {
    if (!requireAuth()) return;
    go(next);
  };

  const switchLang = (next: TargetLang) => {
    if (!requireAuth()) return;
    const pack = next === "es" ? spanishPack : englishLessons;
    const first = pack.find((l) => l.level === "A0") || pack[0];
    updateSaved({
      targetLang: next,
      currentLessonId: first?.id || (next === "es" ? "es-a0-1" : "a0-1"),
      placementResult: null,
      level: "A0",
    });
    setLessonIndex(0);
    setPage("home");
  };

  const startLesson = (id: string) => {
    if (!requireAuth()) return;
    const index = lessons.findIndex((lesson) => lesson.id === id);
    if (index < 0) return;
    setLessonIndex(index);
    setQuizChoice(null);
    setQuizDone(false);
    updateSaved({ currentLessonId: id });
    go("lesson");
  };

  const startLearning = () => {
    if (!requireAuth()) return;
    if (!saved.placementResult) {
      go("placement");
      return;
    }
    const level = saved.placementResult ?? "A0";
    const nextId =
      lessons.find((l) => l.level === level && !saved.completedLessons.includes(l.id))?.id ||
      lessons.find((l) => l.level === level)?.id ||
      lessons[0]?.id;
    if (nextId) startLesson(nextId);
    else go("dashboard");
  };

  const completeLesson = (lesson: Lesson) => {
    const today = todayKey();
    let streak = saved.studyStreak || 0;
    if (saved.lastStudyDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
      streak = saved.lastStudyDate === yKey ? streak + 1 : 1;
    }
    const already = saved.completedLessons.includes(lesson.id);
    const completed = already ? saved.completedLessons : [...saved.completedLessons, lesson.id];
    updateSaved({
      completedLessons: completed,
      studiedToday: already
        ? saved.studiedToday
        : saved.lastStudyDate === today
          ? saved.studiedToday + (lesson.minutes || 8)
          : lesson.minutes || 8,
      lastStudyDate: today,
      studyStreak: streak,
      currentLessonId: lesson.id,
    });
  };

  const goNextLesson = (lesson: Lesson) => {
    completeLesson(lesson);
    const sameLevel = lessons.filter((l) => l.level === lesson.level);
    const idx = sameLevel.findIndex((l) => l.id === lesson.id);
    const next = sameLevel[idx + 1] || lessons.find((l) => !saved.completedLessons.includes(l.id) && l.id !== lesson.id);
    if (next) startLesson(next.id);
    else go("path");
  };

  const completedCount = saved.completedLessons.filter((id) => lessons.some((l) => l.id === id)).length;
  const progress = Math.round((completedCount / Math.max(1, lessons.length)) * 100);
  const currentLesson = lessons[lessonIndex] ?? lessons[0];
  const userLevel = saved.placementResult ?? saved.level;

  const searchResults = useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    if (q.length < 2) return [];
    return lessons
      .filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q) ||
          l.example.toLowerCase().includes(q) ||
          (l.words || []).some((w) => w.word.toLowerCase().includes(q) || (w.meaning || "").includes(q)),
      )
      .slice(0, 8);
  }, [searchQ, lessons]);

  const shellClass = `app-shell ${darkMode ? "dark-mode" : ""} font-${saved.fontScale || "normal"}`;

  return (
    <div className={shellClass} dir="rtl" lang="fa">
      <a href="#main-content" className="skip-link">پرش به محتوای اصلی</a>
      <header className="topbar sticky-header">
        <div className="topbar-inner">
          <button className="brand" onClick={() => go("home")}>
            <span className="brand-mark">و</span>
            <span className="brand-name">واژه‌نو</span>
          </button>
          <button className="mobile-menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="منو">☰</button>
          <nav className={`top-links ${mobileMenu ? "is-open" : ""`}>
            <button onClick={startLearning}>شروع یادگیری</button>
            <button onClick={() => goProtected("path")}>دوره‌ها</button>
            <button onClick={() => goProtected("dashboard")}>پیشرفت من</button>
            <button onClick={() => goProtected("review")}>مرور</button>
            <button onClick={() => goProtected("skills")}>مهارت‌ها</button>
          </nav>
          <div className="top-actions a11y-actions">
            <div className="a11y-controls" role="group" aria-label="دسترسی و زبان">
              <button type="button" className="button button-ghost small-button theme-toggle" onClick={() => setDarkMode((d) => !d)}>{darkMode ? "☀️" : "🌙"}</button>
              <button type="button" className="button button-ghost small-button lang-toggle" title="زبان هدف" onClick={() => switchLang(targetLang === "es" ? "en" : "es")}>
                {targetLang === "es" ? "ES" : "EN"}
              </button>
            </div>
            <button className="button button-primary small-button" onClick={startLearning}>شروع یادگیری</button>
            <FirebaseAccount
              onUserChange={handleUserChange}
              openSignal={authSignal}
              preferredMode="register"
            />
          </div>
        </div>
      </header>

      {page === "home" && (
        <main id="main-content">
          <section className="hero section-container home-minimal">
            <div className="hero-copy">
              <span className="eyebrow"><span className="eyebrow-dot" /> از صفر مطلق تا پیشرفته</span>
              <h1>{langLabel} را<br /><span className="gradient-text">قدم‌به‌قدم یاد بگیر.</span></h1>
              <p>
                مسیر از سطح A0 (صفر) شروع می‌شود. پیشرفت فقط روی حساب کاربری ذخیره می‌شود تا در موبایل و کامپیوتر یکی باشد.
              </p>
              <div className="hero-actions">
                <button className="button button-primary button-large" onClick={startLearning}>
                  {isLoggedIn ? (saved.placementResult ? "ادامه یادگیری ←" : "شروع از صفر ←") : "ثبت‌نام و شروع ←"}
                </button>
                <button className="button button-ghost button-large" onClick={() => goProtected("path")}>دیدن دوره‌ها</button>
              </div>
              {!isLoggedIn && (
                <p style={{ marginTop: 12, color: "#6e6e84", fontSize: 14 }}>
                  برای یادگیری باید وارد شوی یا حساب بسازی — پیشرفت در مرورگر مهمان نگه داشته نمی‌شود.
                </p>
              )}
              <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" className={targetLang === "en" ? "button button-primary small-button" : "button button-ghost small-button"} onClick={() => switchLang("en")}>🇬🇧 انگلیسی</button>
                <button type="button" className={targetLang === "es" ? "button button-primary small-button" : "button button-ghost small-button"} onClick={() => switchLang("es")}>🇪🇸 اسپانیایی</button>
              </div>
            </div>
          </section>

          {isLoggedIn && (
            <section className="section-container" style={{ marginTop: 12 }}>
              <div className="panel search-panel">
                <label className="search-label" htmlFor="home-search">جست‌وجوی سریع</label>
                <input id="home-search" className="search-input" type="search" placeholder={targetLang === "es" ? "hola، ser..." : "hello، travel..."} value={searchQ} onChange={(e) => setSearchQ(e.target.value)} />
                {searchResults.length > 0 && (
                  <ul className="search-results">
                    {searchResults.map((l) => (
                      <li key={l.id}><button type="button" onClick={() => startLesson(l.id)}><span className="cefr-tag" data-level={l.level}>{l.level}</span> {l.title}</button></li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          )}

          {isLoggedIn && saved.placementResult && (
            <section className="section-container" style={{ marginTop: 12 }}>
              <div className="panel today-card home-continue">
                <div>
                  <span className="eyebrow">{langLabel} · حساب همگام</span>
                  <h2 style={{ margin: "6px 0" }}>سطح {userLevel} · {progress}٪</h2>
                  <p style={{ margin: 0, color: "#6e6e84" }}>{saved.studiedToday} دقیقه امروز · روی حسابت ذخیره می‌شود</p>
                </div>
                <button className="button button-primary" onClick={startLearning}>ادامه یادگیری ←</button>
              </div>
            </section>
          )}

          <section className="section-container" style={{ marginTop: 20, marginBottom: 40 }}>
            <div className="home-nav-grid">
              <button type="button" className="panel home-nav-card" onClick={() => goProtected("path")}><strong>مسیر از صفر</strong><span>A0 → C1 · {langLabel}</span></button>
              <button type="button" className="panel home-nav-card" onClick={() => goProtected("review")}><strong>مرور هوشمند</strong><span>نیاز به ورود</span></button>
              <button type="button" className="panel home-nav-card" onClick={() => goProtected("skills")}><strong>مهارت‌ها</strong><span>شنیدن · صحبت</span></button>
              <button type="button" className="panel home-nav-card" onClick={() => goProtected("assessment")}><strong>تعیین سطح</strong><span>یا شروع از A0</span></button>
            </div>
          </section>
        </main>
      )}

      {page !== "home" && isLoggedIn && (
        <div id="main-content" className="workspace section-container">
          <aside className={`sidebar ${mobileMenu ? "is-open" : ""}`}>
            <div className="sidebar-user">
              <div className="avatar">{(saved.userName || "و").slice(0, 1)}</div>
              <div><strong>{saved.userName}</strong><span>{langLabel} · {userLevel}</span></div>
            </div>
            <button className="button button-primary" style={{ width: "100%", marginBottom: 12 }} onClick={startLearning}>ادامه یادگیری ←</button>
            {([["dashboard", "داشبورد", "▦"], ["path", "دوره‌ها", "⌁"], ["review", "مرور", "↻"], ["skills", "مهارت‌ها", "◉"], ["assessment", "تعیین سطح", "?"], ["settings", "تنظیمات", "⚙"]] as [Page, string, string][]).map(([id, label, icon]) => (
              <button key={id} className={`sidebar-link ${page === id ? "active" : ""}`} onClick={() => go(id)}><span className="sidebar-link-icon">{icon}</span>{label}</button>
            ))}
            <button className="sidebar-home" onClick={() => go("home")}>← صفحهٔ اصلی</button>
          </aside>

          <section className="workspace-content">
            {page === "path" && (
              <PathHub lessons={lessons} completedLessons={saved.completedLessons} userLevel={userLevel} progress={progress} completedCount={completedCount} onStartLesson={startLesson} onOpenDaily={() => go("daily")} onOpenAlphabet={() => go("alphabet")} />
            )}
            {page === "daily" && (<><div className="page-heading"><div><h1>تمرین روزانه</h1></div><button className="button button-ghost" onClick={() => go("path")}>←</button></div><DailyLearning lessons={lessons as any} level={userLevel} completedLessonIds={saved.completedLessons} onOpenLesson={startLesson} /></>)}
            {page === "alphabet" && (<><div className="page-heading"><div><h1>آموزش الفبا</h1></div><button className="button button-ghost" onClick={() => go("path")}>←</button></div>{targetLang === "es" ? <div className="panel"><p>برای اسپانیایی از درس‌های A0 شروع کن.</p><button className="button button-primary" onClick={() => startLesson("es-a0-1")}>شروع A0</button></div> : <AlphabetCourse />}</>)}
            {page === "ielts" && (<><div className="page-heading"><div><h1>IELTS</h1></div><button className="button button-ghost" onClick={() => go("skills")}>←</button></div>{targetLang === "es" ? <div className="panel"><p>IELTS مخصوص انگلیسی است.</p></div> : <IeltsCourse />}</>)}
            {page === "dashboard" && (<>
              <div className="page-heading"><div><span className="eyebrow">همگام با حساب</span><h1>{saved.userName}</h1></div><button className="button button-primary" onClick={startLearning}>ادامه ←</button></div>
              <div className="metric-grid">
                <div className="metric-card"><span>پیشرفت</span><strong>{progress}%</strong></div>
                <div className="metric-card"><span>درس</span><strong>{completedCount}/{lessons.length}</strong></div>
                <div className="metric-card"><span>زبان</span><strong>{langLabel}</strong></div>
                <div className="metric-card"><span>رشته</span><strong>{saved.studyStreak || 0}</strong></div>
              </div>
              <AchievementBadges completedLessons={completedCount} totalLessons={lessons.length} studiedToday={saved.studiedToday} level={userLevel} reviewedWords={saved.reviewedWords.length} skillProgress={saved.skillProgress} totalMinutes={saved.studiedToday} studyStreak={saved.studyStreak || 0} />
            </>)}
            {page === "skills" && (<>
              <div className="page-heading"><div><h1>مهارت‌ها</h1></div></div>
              <div className="skill-cards-grid">
                <article className="panel skill-card"><h3>خواندن</h3><button className="button button-primary" onClick={() => go("path")}>تمرین</button></article>
                <article className="panel skill-card"><h3>شنیدن</h3><button className="button button-primary" onClick={() => go("listening")}>تمرین</button></article>
                <article className="panel skill-card"><h3>صحبت</h3><button className="button button-primary" onClick={() => go("speaking")}>تمرین</button></article>
                <article className="panel skill-card"><h3>نوشتن</h3><button className="button button-primary" onClick={() => go("practice")}>تمرین</button></article>
              </div>
            </>)}
            {page === "listening" && <ListeningPractice onBack={() => go("skills")} />}
            {page === "speaking" && <SpeakingPractice onBack={() => go("skills")} />}
            {page === "assessment" && <StageAssessment onBack={() => go("dashboard")} />}
            {page === "lesson" && currentLesson && (
              <div className="lesson-wrap">
                <div className="page-heading">
                  <div>
                    <span className="eyebrow"><span className="cefr-tag" data-level={currentLesson.level}>{currentLesson.level}</span> · {langLabel}</span>
                    <h1>{currentLesson.title}</h1>
                  </div>
                  <button className="button button-ghost" onClick={() => go("path")}>← دوره‌ها</button>
                </div>
                <div className="panel">
                  <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>توضیح</h2>
                  <p>{currentLesson.explanation}</p>
                  <h2 style={{ fontSize: "1.05rem" }}>مثال</h2>
                  <div className="lesson-example">{currentLesson.example}</div>
                  <p>{currentLesson.translation}</p>
                  <button type="button" className="button button-ghost" onClick={() => speakText(currentLesson.example, targetLang)}>🔊 شنیدن</button>
                  {currentLesson.tip && <p><strong>نکته:</strong> {currentLesson.tip}</p>}
                  {currentLesson.words?.length > 0 && (
                    <div className="word-chip-row" style={{ marginTop: 12 }}>
                      {currentLesson.words.slice(0, 8).map((w, wi) => (
                        <button key={w?.word || wi} type="button" className="word-chip" onClick={() => speakText(w?.word || "", targetLang)}>{w?.word} — {w?.meaning}</button>
                      ))}
                    </div>
                  )}
                  {currentLesson.question && currentLesson.options?.length > 0 && (
                    <div style={{ marginTop: 18 }}>
                      <h2 style={{ fontSize: "1.05rem" }}>تمرین</h2>
                      <p>{currentLesson.question}</p>
                      {currentLesson.options.map((opt) => {
                        let cls = "quiz-option";
                        if (quizDone || quizChoice) {
                          if (opt === currentLesson.answer) cls += " is-correct";
                          else if (opt === quizChoice) cls += " is-wrong";
                        }
                        return <button key={opt} type="button" className={cls} disabled={!!quizChoice} onClick={() => { setQuizChoice(opt); setQuizDone(true); }}>{opt}</button>;
                      })}
                      {quizDone && <p style={{ marginTop: 10 }}>{quizChoice === currentLesson.answer ? "درست." : "بازبینی کن."} {currentLesson.feedback || ""}</p>}
                    </div>
                  )}
                  <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button className="button button-primary" onClick={() => goNextLesson(currentLesson)}>تکمیل و بعدی ←</button>
                    <button className="button button-ghost" onClick={() => { completeLesson(currentLesson); go("path"); }}>فقط تکمیل</button>
                  </div>
                </div>
              </div>
            )}
            {page === "review" && (<><div className="page-heading"><div><h1>مرور</h1></div></div><SmartLearning lessons={lessons as any} currentLevel={userLevel} onLevelChange={(level) => updateSaved({ level, placementResult: level })} /></>)}
            {page === "settings" && (<><div className="page-heading"><div><h1>تنظیمات</h1></div></div>
              <div className="panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <p style={{ margin: 0, color: "#6e6e84" }}>پیشرفت روی حساب Firebase ذخیره می‌شود و بین دستگاه‌ها همگام است.</p>
                <div>
                  <div style={{ marginBottom: 8 }}>زبان هدف</div>
                  <button type="button" className={targetLang === "en" ? "button button-primary" : "button button-ghost"} onClick={() => switchLang("en")}>انگلیسی</button>{" "}
                  <button type="button" className={targetLang === "es" ? "button button-primary" : "button button-ghost"} onClick={() => switchLang("es")}>اسپانیایی</button>
                </div>
                <button type="button" className="button button-ghost" onClick={() => setDarkMode((d) => !d)}>{darkMode ? "حالت روشن" : "حالت تاریک"}</button>
              </div></>)}
            {page === "placement" && (
              <div className="quiz-wrap">
                <div className="page-heading"><div><span className="eyebrow">{langLabel}</span><h1>از کجا شروع کنیم؟</h1></div><button className="button button-ghost" onClick={() => go("home")}>←</button></div>
                <div className="panel">
                  <p style={{ marginTop: 0 }}>
                    اگر هیچ چیز بلد نیستی، <strong>A0 — صفر مطلق</strong> را انتخاب کن. اول الفبا و سلام، بعد جمله.
                  </p>
                  <div className="level-choice">
                    {LEVELS.map((level) => (
                      <button
                        key={level}
                        type="button"
                        className="level-choice-btn"
                        style={level === "A0" ? { borderColor: "#7c5cff", boxShadow: "0 0 0 2px rgba(124,92,255,.15)" } : undefined}
                        onClick={() => {
                          const first = lessons.find((l) => l.level === level);
                          updateSaved({ placementResult: level, level, currentLessonId: first?.id ?? lessons[0]?.id });
                          if (first) startLesson(first.id);
                          else go("path");
                        }}
                      >
                        <strong>{level} — {LEVEL_META[level].title}</strong>
                        <span>{LEVEL_META[level].desc}</span>
                      </button>
                    ))}
                  </div>
                  {targetLang === "en" && (
                    <p style={{ marginTop: 16, fontSize: 13, color: "#6e6e84" }}>
                      مسیر پیشنهادی صفر مطلق: الفبا → درس A0-1 «سلام و معرفی» → ادامهٔ همان سطح.
                    </p>
                  )}
                </div>
              </div>
            )}
            {page === "practice" && (<><div className="page-heading"><div><h1>جمله‌سازی</h1></div><button className="button button-ghost" onClick={() => go("skills")}>←</button></div>
              <div className="panel"><button className="button button-primary" onClick={() => go("path")}>رفتن به درس‌ها</button></div></>)}
          </section>
        </div>
      )}

      {page !== "home" && !isLoggedIn && authReady && (
        <main className="section-container" style={{ padding: "48px 16px", textAlign: "center" }}>
          <div className="panel" style={{ maxWidth: 420, margin: "0 auto" }}>
            <h1 style={{ marginTop: 0 }}>برای ادامه وارد شو</h1>
            <p>درس‌ها و پیشرفت فقط بعد از ورود روی حسابت ذخیره می‌شوند.</p>
            <button className="button button-primary" onClick={() => setAuthSignal((n) => n + 1)}>ثبت‌نام / ورود</button>
            <button className="button button-ghost" style={{ marginTop: 8 }} onClick={() => go("home")}>بازگشت</button>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
