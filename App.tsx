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
import type { FontScale, Level, Lesson, SavedState, TargetLang } from "./types";
import { LEVELS, STORAGE_KEY, PROGRESS_VERSION } from "./types";
import { loadCloudProgress, mergeProgress, saveCloudProgress } from "./services/progressSync";

type Page =
  | "home" | "dashboard" | "placement" | "path" | "lesson"
  | "practice" | "review" | "skills" | "settings" | "assessment"
  | "listening" | "speaking" | "daily" | "alphabet" | "ielts";

const LEVEL_META: Record<Level, { title: string; desc: string }> = {
  A0: { title: "صفر مطلق", desc: "از صفر شروع می‌کنم." },
  A1: { title: "مبتدی", desc: "کلمه‌ها و جمله‌های ساده." },
  A2: { title: "مبتدی پلاس", desc: "کار روزمره و خرید." },
  B1: { title: "متوسط", desc: "سفر، کار و علایق." },
  B2: { title: "متوسط بالا", desc: "متن و بحث عمومی." },
  C1: { title: "پیشرفته", desc: "متن و گفتار پیچیده." },
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

function loadSaved(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as Partial<SavedState>;
    return {
      ...emptyState,
      ...parsed,
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      reviewedWords: Array.isArray(parsed.reviewedWords) ? parsed.reviewedWords : [],
      reviewDates: parsed.reviewDates ?? {},
      placementHistory: Array.isArray(parsed.placementHistory) ? parsed.placementHistory : [],
      fontScale: parsed.fontScale === "large" || parsed.fontScale === "xlarge" ? parsed.fontScale : "normal",
      studyStreak: typeof parsed.studyStreak === "number" ? parsed.studyStreak : 0,
      targetLang: parsed.targetLang === "es" ? "es" : "en",
      version: PROGRESS_VERSION,
    };
  } catch {
    return emptyState;
  }
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
  const [saved, setSaved] = useState<SavedState>(() => loadSaved());
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

  useEffect(() => {
    try { localStorage.setItem("vazheno-dark", darkMode ? "1" : "0"); } catch {}
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  useEffect(() => {
    try {
      document.title =
        page === "home"
          ? `واژه‌نو | یادگیری ${langLabel}`
          : `واژه‌نو | ${langLabel}`;
    } catch {}
  }, [page, langLabel]);

  const persistLocal = useCallback((next: SavedState) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const updateSaved = useCallback((patch: Partial<SavedState>) => {
    setSaved((prev) => {
      const next: SavedState = { ...prev, ...patch, updatedAt: Date.now(), version: PROGRESS_VERSION };
      persistLocal(next);
      if (cloudUserRef.current) {
        if (saveTimer.current) window.clearTimeout(saveTimer.current);
        saveTimer.current = window.setTimeout(() => {
          void saveCloudProgress(cloudUserRef.current!, next);
        }, 800);
      }
      return next;
    });
  }, [persistLocal]);

  const handleUserChange = useCallback(async (user: User | null) => {
    cloudUserRef.current = user;
    if (!user) return;
    const cloud = await loadCloudProgress(user);
    setSaved((local) => {
      const merged = mergeProgress(local, cloud);
      persistLocal(merged);
      void saveCloudProgress(user, merged);
      return merged;
    });
  }, [persistLocal]);

  const go = (next: Page) => {
    setPage(next);
    setMobileMenu(false);
    setQuizChoice(null);
    setQuizDone(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const switchLang = (next: TargetLang) => {
    const pack = next === "es" ? spanishPack : englishLessons;
    const first = pack.find((l) => l.level === (saved.placementResult ?? saved.level)) || pack[0];
    updateSaved({
      targetLang: next,
      currentLessonId: first?.id || (next === "es" ? "es-a0-1" : "a0-1"),
      placementResult: null,
    });
    setLessonIndex(0);
    setPage("home");
  };

  const startLesson = (id: string) => {
    const index = lessons.findIndex((lesson) => lesson.id === id);
    if (index < 0) return;
    setLessonIndex(index);
    setQuizChoice(null);
    setQuizDone(false);
    updateSaved({ currentLessonId: id });
    go("lesson");
  };

  const startLearning = () => {
    if (!saved.placementResult) { go("placement"); return; }
    const level = saved.placementResult ?? saved.level;
    const nextId =
      lessons.find((l) => l.level === level && !saved.completedLessons.includes(l.id))?.id ||
      saved.currentLessonId ||
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
      studiedToday: already ? saved.studiedToday : saved.lastStudyDate === today ? saved.studiedToday + (lesson.minutes || 8) : lesson.minutes || 8,
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
    return lessons.filter((l) =>
      l.title.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) ||
      l.example.toLowerCase().includes(q) ||
      (l.words || []).some((w) => w.word.toLowerCase().includes(q) || (w.meaning || "").includes(q)),
    ).slice(0, 8);
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
            <button onClick={() => go("path")}>دوره‌ها</button>
            <button onClick={() => go("dashboard")}>پیشرفت من</button>
            <button onClick={() => go("review")}>مرور</button>
            <button onClick={() => go("skills")}>مهارت‌ها</button>
          </nav>
          <div className="top-actions a11y-actions">
            <div className="a11y-controls" role="group" aria-label="دسترسی و زبان">
              <button type="button" className={`button button-ghost small-button font-toggle ${saved.fontScale === "normal" ? "is-active" : ""}`} onClick={() => updateSaved({ fontScale: "normal" })}>A</button>
              <button type="button" className={`button button-ghost small-button font-toggle ${saved.fontScale !== "normal" ? "is-active" : ""}`} onClick={() => updateSaved({ fontScale: saved.fontScale === "xlarge" ? "xlarge" : "large" })}><span style={{ fontSize: "1.15em", fontWeight: 700 }}>A</span></button>
              <button type="button" className="button button-ghost small-button theme-toggle" onClick={() => setDarkMode((d) => !d)}>{darkMode ? "☀️" : "🌙"}</button>
              <button type="button" className="button button-ghost small-button lang-toggle" title="زبان هدف" onClick={() => switchLang(targetLang === "es" ? "en" : "es")}>
                {targetLang === "es" ? "ES" : "EN"}
              </button>
              <label className="level-select-wrap">
                <span className="visually-hidden">سطح</span>
                <select className="level-select" value={userLevel} onChange={(e) => updateSaved({ level: e.target.value as Level, placementResult: e.target.value as Level })}>
                  {LEVELS.map((lv) => (<option key={lv} value={lv}>{lv}</option>))}
                </select>
              </label>
            </div>
            <button className="button button-primary small-button" onClick={startLearning}>شروع یادگیری</button>
            <FirebaseAccount onUserChange={handleUserChange} />
          </div>
        </div>
      </header>

      {page === "home" && (
        <main id="main-content">
          <section className="hero section-container home-minimal">
            <div className="hero-copy">
              <span className="eyebrow"><span className="eyebrow-dot" /> یادگیری {langLabel} با توضیح فارسی</span>
              <h1>{langLabel} را<br /><span className="gradient-text">قدم‌به‌قدم یاد بگیر.</span></h1>
              <p>مسیر CEFR · زبان فعال: {langLabel} · بدون ثبت‌نام اجباری.</p>
              <div className="hero-actions">
                <button className="button button-primary button-large" onClick={startLearning}>{saved.placementResult ? "ادامه یادگیری ←" : "شروع یادگیری ←"}</button>
                <button className="button button-ghost button-large" onClick={() => go("path")}>دیدن دوره‌ها</button>
              </div>
              <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" className={targetLang === "en" ? "button button-primary small-button" : "button button-ghost small-button"} onClick={() => switchLang("en")}>🇬🇧 انگلیسی</button>
                <button type="button" className={targetLang === "es" ? "button button-primary small-button" : "button button-ghost small-button"} onClick={() => switchLang("es")}>🇪🇸 اسپانیایی</button>
              </div>
            </div>
          </section>

          <section className="section-container" style={{ marginTop: 12 }}>
            <div className="panel search-panel">
              <label className="search-label" htmlFor="home-search">جست‌وجوی سریع</label>
              <input id="home-search" className="search-input" type="search" placeholder={targetLang === "es" ? "مثلاً: hola، ser، رستوران..." : "مثلاً: travel، خرید..."} value={searchQ} onChange={(e) => setSearchQ(e.target.value)} />
              {searchResults.length > 0 && (
                <ul className="search-results">
                  {searchResults.map((l) => (
                    <li key={l.id}><button type="button" onClick={() => startLesson(l.id)}><span className="cefr-tag" data-level={l.level}>{l.level}</span> {l.title}</button></li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {saved.placementResult && (
            <section className="section-container" style={{ marginTop: 12 }}>
              <div className="panel today-card home-continue">
                <div>
                  <span className="eyebrow">{langLabel} · ادامه مسیر</span>
                  <h2 style={{ margin: "6px 0" }}>سطح {userLevel} · {progress}٪</h2>
                  <p style={{ margin: 0, color: "#6e6e84" }}>{saved.studiedToday} دقیقه امروز</p>
                </div>
                <button className="button button-primary" onClick={startLearning}>ادامه یادگیری ←</button>
              </div>
            </section>
          )}

          <section className="section-container" style={{ marginTop: 20, marginBottom: 40 }}>
            <div className="home-nav-grid">
              <button type="button" className="panel home-nav-card" onClick={() => go("path")}><strong>مسیر درس‌ها</strong><span>{lessons.length} درس · {langLabel}</span></button>
              <button type="button" className="panel home-nav-card" onClick={() => go("review")}><strong>مرور هوشمند</strong><span>کارت‌های سررسید</span></button>
              <button type="button" className="panel home-nav-card" onClick={() => go("skills")}><strong>مهارت‌ها</strong><span>شنیدن · صحبت</span></button>
              <button type="button" className="panel home-nav-card" onClick={() => go("assessment")}><strong>تعیین سطح</strong><span>پیشنهاد مسیر</span></button>
            </div>
          </section>
        </main>
      )}

      {page !== "home" && (
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
            {page === "daily" && (<><div className="page-heading"><div><span className="eyebrow">{langLabel}</span><h1>تمرین روزانه</h1></div><button className="button button-ghost" onClick={() => go("path")}>← بازگشت</button></div><DailyLearning lessons={lessons as any} level={userLevel} completedLessonIds={saved.completedLessons} onOpenLesson={startLesson} /></>)}
            {page === "alphabet" && (<><div className="page-heading"><div><h1>آموزش الفبا</h1></div><button className="button button-ghost" onClick={() => go("path")}>← بازگشت</button></div>{targetLang === "es" ? <div className="panel"><p>الفبای اسپانیایی نزدیک لاتین است؛ روی درس‌های A0 تمرکز کن (Hola، Me llamo…).</p><button className="button button-primary" onClick={() => startLesson("es-a0-1")}>شروع A0 اسپانیایی</button></div> : <AlphabetCourse />}</>)}
            {page === "ielts" && (<><div className="page-heading"><div><h1>آمادگی IELTS</h1></div><button className="button button-ghost" onClick={() => go("skills")}>← بازگشت</button></div>{targetLang === "es" ? <div className="panel"><p>IELTS مخصوص انگلیسی است. برای اسپانیایی از مسیر درس‌ها استفاده کن.</p></div> : <IeltsCourse />}</>)}
            {page === "dashboard" && (<>
              <div className="page-heading"><div><span className="eyebrow">{langLabel}</span><h1>خوش برگشتی، {saved.userName}</h1></div><button className="button button-primary" onClick={startLearning}>ادامه ←</button></div>
              <div className="metric-grid">
                <div className="metric-card"><span>پیشرفت</span><strong>{progress}%</strong></div>
                <div className="metric-card"><span>درس‌ها</span><strong>{completedCount}/{lessons.length}</strong></div>
                <div className="metric-card"><span>زبان</span><strong>{langLabel}</strong></div>
                <div className="metric-card"><span>رشته</span><strong>{saved.studyStreak || 0}</strong></div>
              </div>
              <AchievementBadges completedLessons={completedCount} totalLessons={lessons.length} studiedToday={saved.studiedToday} level={userLevel} reviewedWords={saved.reviewedWords.length} skillProgress={saved.skillProgress} totalMinutes={saved.studiedToday} studyStreak={saved.studyStreak || 0} />
            </>)}
            {page === "skills" && (<>
              <div className="page-heading"><div><h1>مهارت‌ها · {langLabel}</h1></div></div>
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
                    <span className="eyebrow"><span className="cefr-tag" data-level={currentLesson.level}>{currentLesson.level}</span> · {langLabel} · {currentLesson.minutes || 8} دقیقه</span>
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
                  <button type="button" className="button button-ghost" onClick={() => speakText(currentLesson.example, targetLang)}>🔊 شنیدن تلفظ</button>
                  {currentLesson.tip && <p><strong>نکته:</strong> {currentLesson.tip}</p>}
                  {Array.isArray(currentLesson.words) && currentLesson.words.length > 0 && (<>
                    <h2 style={{ fontSize: "1.05rem" }}>واژه‌ها</h2>
                    <div className="word-chip-row">
                      {currentLesson.words.slice(0, 8).map((w, wi) => (
                        <button key={w?.word || wi} type="button" className="word-chip" onClick={() => speakText(w?.word || "", targetLang)}>{w?.word} — {w?.meaning}</button>
                      ))}
                    </div>
                  </>)}
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
                      {quizDone && <p style={{ marginTop: 10 }}>{quizChoice === currentLesson.answer ? "درست بود." : "بازبینی کن."} {currentLesson.feedback || ""}</p>}
                    </div>
                  )}
                  <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button className="button button-primary" onClick={() => goNextLesson(currentLesson)}>تکمیل و بعدی ←</button>
                    <button className="button button-ghost" onClick={() => { completeLesson(currentLesson); go("path"); }}>فقط تکمیل</button>
                  </div>
                </div>
              </div>
            )}
            {page === "review" && (<><div className="page-heading"><div><h1>مرور · {langLabel}</h1></div></div><SmartLearning lessons={lessons as any} currentLevel={userLevel} onLevelChange={(level) => updateSaved({ level, placementResult: level })} /></>)}
            {page === "settings" && (<><div className="page-heading"><div><h1>تنظیمات</h1></div></div>
              <div className="panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <label>نام<input value={saved.userName} onChange={(e) => updateSaved({ userName: e.target.value })} /></label>
                <div>
                  <div style={{ marginBottom: 8 }}>زبان هدف</div>
                  <button type="button" className={targetLang === "en" ? "button button-primary" : "button button-ghost"} onClick={() => switchLang("en")}>انگلیسی</button>{" "}
                  <button type="button" className={targetLang === "es" ? "button button-primary" : "button button-ghost"} onClick={() => switchLang("es")}>اسپانیایی</button>
                  <p style={{ color: "#6e6e84", fontSize: 13 }}>مسیر اسپانیایی فعلاً {spanishPack.length} درس پایه دارد و گسترش می‌یابد.</p>
                </div>
                <button type="button" className="button button-ghost" onClick={() => setDarkMode((d) => !d)}>{darkMode ? "حالت روشن" : "حالت تاریک"}</button>
              </div></>)}
            {page === "placement" && (
              <div className="quiz-wrap">
                <div className="page-heading"><div><span className="eyebrow">{langLabel}</span><h1>از کجا شروع کنیم؟</h1></div><button className="button button-ghost" onClick={() => go("home")}>← بازگشت</button></div>
                <div className="panel">
                  <div className="level-choice">
                    {LEVELS.map((level) => (
                      <button key={level} type="button" className="level-choice-btn" onClick={() => {
                        const first = lessons.find((l) => l.level === level);
                        updateSaved({ placementResult: level, level, currentLessonId: first?.id ?? lessons[0]?.id });
                        if (first) startLesson(first.id); else go("path");
                      }}>
                        <strong>{level} — {LEVEL_META[level].title}</strong><span>{LEVEL_META[level].desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {page === "practice" && (<><div className="page-heading"><div><h1>جمله‌سازی</h1></div><button className="button button-ghost" onClick={() => go("skills")}>← بازگشت</button></div>
              <div className="panel"><p>از مسیر درس‌ها تمرین کن.</p><button className="button button-primary" onClick={() => go("path")}>درس‌ها</button></div></>)}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
