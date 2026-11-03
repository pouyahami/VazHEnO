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
import { curatedLessons } from "./CuratedLessons";
import { spanishLessons } from "./SpanishLessons";
import AchievementBadges from "./AchievementBadges";
import PathHub from "./PathHub";
import type { Level, Lesson, PlacementMap, SavedState, TargetLang } from "./types";
import { LEVELS, STORAGE_KEY, PROGRESS_VERSION } from "./types";
import { loadCloudProgress, mergeProgress, saveCloudProgress } from "./services/progressSync";
import { firebaseEnabled } from "./firebase";

type Page =
  | "home" | "choose-lang" | "dashboard" | "placement" | "path" | "lesson"
  | "practice" | "review" | "skills" | "settings" | "assessment"
  | "listening" | "speaking" | "daily" | "alphabet" | "ielts";

const LEVEL_META: Record<Level, { title: string; desc: string }> = {
  A0: { title: "صفر مطلق", desc: "هیچ چیز بلد نیستم؛ از سلام و الفبا شروع می‌کنم." },
  A1: { title: "مبتدی", desc: "چند کلمه و جملهٔ خیلی ساده بلدم." },
  A2: { title: "مبتدی پلاس", desc: "خرید و کار روزمره را کم‌وبیش می‌فهمم." },
  B1: { title: "متوسط", desc: "دربارهٔ سفر و علایق حرف می‌زنم." },
  B2: { title: "متوسط بالا", desc: "متن و بحث عمومی را دنبال می‌کنم." },
  C1: { title: "پیشرفته", desc: "متن و گفتار پیچیده را می‌فهمم." },
};

const emptyPlacement: PlacementMap = { en: null, es: null };

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
  placementByLang: { en: null, es: null },
  langChosen: false,
  lastStudyDate: "",
  studiedToday: 0,
  skillProgress: { reading: 0, listening: 0, speaking: 0, writing: 0 },
  studyStreak: 0,
  fontScale: "normal",
  targetLang: "en",
  version: PROGRESS_VERSION,
  updatedAt: Date.now(),
};

function normalizeState(raw: Partial<SavedState> | null | undefined): SavedState {
  const base = { ...emptyState, ...(raw || {}) };
  const by = raw?.placementByLang;
  const placementByLang: PlacementMap = {
    en: by?.en ?? (raw?.targetLang !== "es" ? raw?.placementResult ?? null : null) ?? null,
    es: by?.es ?? (raw?.targetLang === "es" ? raw?.placementResult ?? null : null) ?? null,
  };
  const targetLang: TargetLang = raw?.targetLang === "es" ? "es" : "en";
  const placementResult = placementByLang[targetLang] ?? raw?.placementResult ?? null;
  return {
    ...emptyState,
    ...base,
    completedLessons: Array.isArray(raw?.completedLessons) ? raw!.completedLessons! : [],
    reviewedWords: Array.isArray(raw?.reviewedWords) ? raw!.reviewedWords! : [],
    reviewDates: raw?.reviewDates ?? {},
    placementByLang,
    placementResult,
    langChosen: Boolean(raw?.langChosen || placementResult || by?.en || by?.es),
    targetLang,
    level: placementResult || raw?.level || "A0",
    version: PROGRESS_VERSION,
    updatedAt: Date.now(),
  };
}

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

function packFor(lang: TargetLang): Lesson[] {
  return lang === "es" ? spanishPack : englishLessons;
}

const englishLessons: Lesson[] = [...(baseLessons as Lesson[]), ...(expandedLessons as Lesson[]), ...(extraLessons as Lesson[]), ...(curatedLessons as Lesson[])].filter(
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
  const [guestMode, setGuestMode] = useState(false);
  const [authSignal, setAuthSignal] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem("vazheno-dark") === "1"; } catch { return false; }
  });
  const [lessonIndex, setLessonIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState<string | null>(null);
  const [quizDone, setQuizDone] = useState(false);
  const cloudUserRef = useRef<User | null>(null);
  const cloudReadyUidRef = useRef<string | null>(null);
  const saveTimer = useRef<number | null>(null);
  const authLoadSequence = useRef(0);

  const targetLang: TargetLang = saved.targetLang === "es" ? "es" : "en";
  const lessons = useMemo(() => packFor(targetLang), [targetLang]);
  const langLabel = targetLang === "es" ? "اسپانیایی" : "انگلیسی";
  const isLoggedIn = !!authUser || guestMode;
  const currentPlacement = saved.placementByLang?.[targetLang] ?? saved.placementResult;

  useEffect(() => {
    try { localStorage.setItem("vazheno-dark", darkMode ? "1" : "0"); } catch {}
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  useEffect(() => {
    try { document.title = `واژه‌نو | ${langLabel}`; } catch {}
  }, [langLabel]);

  const cacheLocal = useCallback((next: SavedState) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const clearLocalProgress = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const updateSaved = useCallback((patch: Partial<SavedState>) => {
    // Capture the owner at edit time; never let a delayed save follow a later account switch.
    const owner = cloudUserRef.current;
    setSaved((prev) => {
      const next = normalizeState({ ...prev, ...patch, updatedAt: Date.now() });
      if (owner) {
        cacheLocal(next);
        // Never write until this account's remote progress has been read successfully.
        if (cloudReadyUidRef.current === owner.uid) {
          if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
          saveTimer.current = window.setTimeout(() => {
            saveTimer.current = null;
            if (
              cloudUserRef.current?.uid !== owner.uid ||
              cloudReadyUidRef.current !== owner.uid
            ) return;
            void saveCloudProgress(owner, next);
          }, 500);
        }
      } else if (guestMode) {
        // Guest progress is deliberately local to this browser/device.
        cacheLocal(next);
      }
      return next;
    });
  }, [cacheLocal, guestMode]);

  const enterGuestMode = useCallback(() => {
    let local: Partial<SavedState> | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      local = raw ? (JSON.parse(raw) as Partial<SavedState>) : null;
    } catch {
      local = null;
    }
    const next = normalizeState(local);
    const placement = next.placementByLang?.[next.targetLang] ?? next.placementResult;
    setGuestMode(true);
    setSaved(next);
    setMobileMenu(false);
    if (!next.langChosen) setPage("choose-lang");
    else if (!placement) setPage("placement");
    else setPage("dashboard");
  }, []);

  const requireAuth = useCallback((): boolean => {
    if (cloudUserRef.current || guestMode) return true;
    // Preview deployments may not receive production-only Firebase secrets.
    // Keep the learning flow usable without pretending cloud registration succeeded.
    if (!firebaseEnabled) {
      enterGuestMode();
      return false;
    }
    setAuthSignal((n) => n + 1);
    return false;
  }, [enterGuestMode, guestMode]);

  useEffect(() => {
    if (!authReady) return;
    if (!authUser && !guestMode && page !== "home") {
      setPage("home");
      setMobileMenu(false);
    }
  }, [authUser, authReady, guestMode, page]);

  const handleUserChange = useCallback(async (user: User | null) => {
    const sequence = ++authLoadSequence.current;
    const previousUid = cloudUserRef.current?.uid ?? null;
    if (saveTimer.current !== null) {
      window.clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    cloudUserRef.current = user;
    cloudReadyUidRef.current = null;
    setGuestMode(false);
    setAuthUser(user);
    setAuthReady(true);

    if (!user) {
      clearLocalProgress();
      setSaved(normalizeState(emptyState));
      setPage("home");
      return;
    }

    // Do not briefly expose another account's cached progress while the new account loads.
    if (previousUid !== user.uid) {
      setSaved(normalizeState(emptyState));
      setPage("home");
    }

    let cloud: Partial<SavedState> | null;
    try {
      cloud = await loadCloudProgress(user);
    } catch (err) {
      // A failed read is not the same as a new account. Never overwrite cloud data with defaults.
      console.warn("Could not load cloud progress; leaving remote data untouched.", err);
      if (sequence === authLoadSequence.current && cloudUserRef.current?.uid === user.uid) {
        setSaved(normalizeState(emptyState));
        setPage("home");
      }
      return;
    }

    // Ignore late responses from an account that is no longer active.
    if (sequence !== authLoadSequence.current || cloudUserRef.current?.uid !== user.uid) return;

    const next = normalizeState({
      ...emptyState,
      ...(cloud || {}),
      userName: user.displayName || (cloud as SavedState)?.userName || emptyState.userName,
    });
    setSaved(next);
    cacheLocal(next);
    cloudReadyUidRef.current = user.uid;
    void saveCloudProgress(user, next);
    if (!next.langChosen) setPage("choose-lang");
    else if (!next.placementByLang[next.targetLang]) setPage("placement");
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
    if (!saved.langChosen) { go("choose-lang"); return; }
    if (!currentPlacement && next !== "placement" && next !== "choose-lang" && next !== "settings") {
      go("placement");
      return;
    }
    go(next);
  };

  const chooseLanguage = (lang: TargetLang) => {
    if (!requireAuth()) return;
    const pack = packFor(lang);
    const existing = saved.placementByLang?.[lang];
    const first = pack.find((l) => l.level === (existing || "A0")) || pack[0];
    updateSaved({
      targetLang: lang,
      langChosen: true,
      placementResult: existing ?? null,
      level: existing || "A0",
      currentLessonId: first?.id || (lang === "es" ? "es-a0-1" : "a0-1"),
    });
    setLessonIndex(0);
    if (existing) go("path");
    else go("placement");
  };

  const switchLang = (lang: TargetLang) => {
    if (!requireAuth()) return;
    chooseLanguage(lang);
  };

  const applyPlacement = (level: Level) => {
    const pack = lessons;
    const first = pack.find((l) => l.level === level) || pack[0];
    const placementByLang: PlacementMap = {
      ...(saved.placementByLang || emptyPlacement),
      [targetLang]: level,
    };
    updateSaved({
      placementByLang,
      placementResult: level,
      level,
      langChosen: true,
      currentLessonId: first?.id,
    });
    if (first) {
      const index = pack.findIndex((l) => l.id === first.id);
      setLessonIndex(index >= 0 ? index : 0);
      go("lesson");
    } else go("path");
  };

  const startLesson = (id: string) => {
    if (!requireAuth()) return;
    if (!saved.langChosen) { go("choose-lang"); return; }
    if (!currentPlacement) { go("placement"); return; }
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
    if (!saved.langChosen) { go("choose-lang"); return; }
    if (!currentPlacement) { go("placement"); return; }
    const level = currentPlacement;
    const nextId =
      lessons.find((l) => l.level === level && !saved.completedLessons.includes(l.id))?.id ||
      lessons.find((l) => l.level === level)?.id ||
      lessons[0]?.id;
    if (nextId) startLesson(nextId);
    else go("dashboard");
  };

  const canCompleteLesson = (lesson: Lesson) =>
    Boolean(lesson.question?.trim() && lesson.options && lesson.options.length >= 2 && lesson.answer?.trim() && lesson.options.includes(lesson.answer) && quizChoice === lesson.answer);

  const completeLesson = (lesson: Lesson) => {
    // A lesson with a quiz cannot be marked complete until the correct answer is selected.
    if (!canCompleteLesson(lesson)) return;
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
    if (!canCompleteLesson(lesson)) return;
    completeLesson(lesson);
    const sameLevel = lessons.filter((l) => l.level === lesson.level);
    const idx = sameLevel.findIndex((l) => l.id === lesson.id);
    // Do not silently jump into another CEFR level: the path hub unlocks it
    // only after every lesson in the current level has been completed.
    const next = sameLevel[idx + 1];
    if (next) startLesson(next.id);
    else go("path");
  };

  const completedCount = saved.completedLessons.filter((id) => lessons.some((l) => l.id === id)).length;
  const progress = Math.round((completedCount / Math.max(1, lessons.length)) * 100);
  const currentLesson = lessons[lessonIndex] ?? lessons[0];
  const userLevel = currentPlacement ?? saved.level;

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
          <nav className={`top-links ${mobileMenu ? "is-open" : ""}`}>
            {isLoggedIn ? (
              <>
                <button onClick={startLearning}>شروع یادگیری</button>
                <button onClick={() => goProtected("path")}>دوره‌ها</button>
                <button onClick={() => goProtected("dashboard")}>پیشرفت من</button>
                <button onClick={() => goProtected("review")}>مرور</button>
                <button onClick={() => goProtected("settings")}>تنظیمات</button>
              </>
            ) : (
              <button type="button" onClick={startLearning}>ثبت‌نام و شروع</button>
            )}
          </nav>
          <div className="top-actions a11y-actions">
            <button type="button" className="button button-ghost small-button theme-toggle" onClick={() => setDarkMode((d) => !d)}>{darkMode ? "☀️" : "🌙"}</button>
            <button className="button button-primary small-button" onClick={startLearning}>{isLoggedIn ? "شروع یادگیری" : "ثبت‌نام"}</button>
            {guestMode && <span role="status" style={{ fontSize: 12, color: "#6e6e84", whiteSpace: "nowrap" }}>حالت مهمان · ذخیره روی همین دستگاه</span>}
            <FirebaseAccount onUserChange={handleUserChange} openSignal={authSignal} preferredMode="register" />
          </div>
        </div>
      </header>

      {page === "home" && (
        <main id="main-content">
          <section className="hero section-container home-minimal">
            <div className="hero-copy">
              <span className="eyebrow"><span className="eyebrow-dot" /> انگلیسی و اسپانیایی · از صفر</span>
              <h1>زبان را<br /><span className="gradient-text">قدم‌به‌قدم یاد بگیر.</span></h1>
              <p>بعد از ساخت حساب: انتخاب زبان → تعیین سطح همان زبان → ورود به درس مناسب.</p>
              <div className="hero-actions">
                <button className="button button-primary button-large" onClick={startLearning}>
                  {!isLoggedIn ? "ثبت‌نام و شروع ←" : !saved.langChosen ? "انتخاب زبان ←" : !currentPlacement ? "تعیین سطح ←" : "ادامه یادگیری ←"}
                </button>
              </div>
              {!isLoggedIn && !firebaseEnabled && (
                <p style={{ marginTop: 12, color: "#6e6e84", fontSize: 14 }}>در این پیش‌نمایش ورود ابری فعال نیست؛ با شروع می‌توانی بدون حساب ادامه بدهی و پیشرفتت روی همین دستگاه ذخیره می‌شود.</p>
              )}
              {!isLoggedIn && firebaseEnabled && (
                <p style={{ marginTop: 12, color: "#6e6e84", fontSize: 14 }}>برای همگام‌سازی پیشرفت بین دستگاه‌ها حساب بساز یا وارد شو.</p>
              )}
            </div>
          </section>
          {isLoggedIn && currentPlacement && (
            <section className="section-container" style={{ marginTop: 12 }}>
              <div className="panel today-card home-continue">
                <div>
                  <span className="eyebrow">{langLabel}</span>
                  <h2 style={{ margin: "6px 0" }}>سطح {userLevel} · {progress}٪</h2>
                </div>
                <button className="button button-primary" onClick={startLearning}>ادامه ←</button>
              </div>
            </section>
          )}
        </main>
      )}

      {page === "choose-lang" && isLoggedIn && (
        <main id="main-content" className="section-container" style={{ paddingTop: 32, paddingBottom: 48 }}>
          <div className="panel" style={{ maxWidth: 520, margin: "0 auto" }}>
            <span className="eyebrow">گام ۱ از ۲</span>
            <h1 style={{ marginTop: 8 }}>کدام زبان را می‌خواهی یاد بگیری؟</h1>
            <p style={{ color: "#6e6e84" }}>بعد از انتخاب، برای همان زبان تعیین سطح می‌شوی.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
              <button type="button" className="button button-primary button-large" onClick={() => chooseLanguage("en")}>🇬🇧 انگلیسی</button>
              <button type="button" className="button button-ghost button-large" onClick={() => chooseLanguage("es")}>🇪🇸 اسپانیایی</button>
            </div>
          </div>
        </main>
      )}

      {page === "placement" && isLoggedIn && (
        <main id="main-content" className="section-container" style={{ paddingTop: 24, paddingBottom: 48 }}>
          <div className="panel" style={{ maxWidth: 560, margin: "0 auto" }}>
            <span className="eyebrow">گام ۲ از ۲ · {langLabel}</span>
            <h1 style={{ marginTop: 8 }}>تعیین سطح {langLabel}</h1>
            <p>اگر هیچ چیز بلد نیستی <strong>A0</strong> را بزن.</p>
            <div className="level-choice" style={{ marginTop: 16 }}>
              {LEVELS.map((level) => {
                const hasLessons = lessons.some((l) => l.level === level);
                return (
                  <button key={level} type="button" className="level-choice-btn" disabled={!hasLessons} style={level === "A0" ? { borderColor: "#7c5cff" } : undefined} onClick={() => applyPlacement(level)}>
                    <strong>{level} — {LEVEL_META[level].title}</strong>
                    <span>{hasLessons ? LEVEL_META[level].desc : "به‌زودی"}</span>
                  </button>
                );
              })}
            </div>
            <button type="button" className="button button-ghost" style={{ marginTop: 16 }} onClick={() => go("choose-lang")}>← تغییر زبان</button>
          </div>
        </main>
      )}

      {page !== "home" && page !== "choose-lang" && page !== "placement" && isLoggedIn && (
        <div id="main-content" className="workspace section-container">
          <aside className={`sidebar ${mobileMenu ? "is-open" : ""}`}>
            <div className="sidebar-user">
              <div className="avatar">{(saved.userName || "و").slice(0, 1)}</div>
              <div><strong>{saved.userName}</strong><span>{langLabel} · {userLevel}</span></div>
            </div>
            <button className="button button-primary" style={{ width: "100%", marginBottom: 12 }} onClick={startLearning}>ادامه یادگیری ←</button>
            {([["dashboard", "داشبورد", "▦"], ["path", "دوره‌ها", "⌁"], ["review", "مرور", "↻"], ["skills", "مهارت‌ها", "◉"], ["settings", "تنظیمات", "⚙"]] as [Page, string, string][]).map(([id, label, icon]) => (
              <button key={id} className={`sidebar-link ${page === id ? "active" : ""}`} onClick={() => goProtected(id)}>
                <span className="sidebar-link-icon">{icon}</span>{label}
              </button>
            ))}
            <button className="sidebar-home" onClick={() => go("home")}>← صفحهٔ اصلی</button>
          </aside>
          <section className="workspace-content">
            {page === "path" && (
              <PathHub lessons={lessons} completedLessons={saved.completedLessons} userLevel={userLevel} progress={progress} completedCount={completedCount} onStartLesson={startLesson} onOpenDaily={() => go("daily")} onOpenAlphabet={() => go("alphabet")} />
            )}
            {page === "daily" && (<><div className="page-heading"><div><h1>تمرین روزانه · {langLabel}</h1></div><button className="button button-ghost" onClick={() => go("path")}>←</button></div><DailyLearning lessons={lessons as any} level={userLevel} completedLessonIds={saved.completedLessons} onOpenLesson={startLesson} /></>)}
            {page === "alphabet" && (<><div className="page-heading"><div><h1>الفبا</h1></div><button className="button button-ghost" onClick={() => go("path")}>←</button></div>{targetLang === "es" ? <div className="panel"><button className="button button-primary" onClick={() => startLesson("es-a0-1")}>شروع A0</button></div> : <AlphabetCourse />}</>)}
            {page === "dashboard" && (<>
              <div className="page-heading"><div><span className="eyebrow">{langLabel}</span><h1>{saved.userName}</h1></div><button className="button button-primary" onClick={startLearning}>ادامه ←</button></div>
              <div className="metric-grid">
                <div className="metric-card"><span>پیشرفت</span><strong>{progress}%</strong></div>
                <div className="metric-card"><span>سطح</span><strong>{userLevel}</strong></div>
                <div className="metric-card"><span>زبان</span><strong>{langLabel}</strong></div>
                <div className="metric-card"><span>درس</span><strong>{completedCount}</strong></div>
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
                    <span className="eyebrow"><span className="cefr-tag" data-level={currentLesson.level}>{currentLesson.level}</span> · {langLabel}</span>
                    <h1>{currentLesson.title}</h1>
                  </div>
                  <button className="button button-ghost" onClick={() => go("path")}>← دوره‌ها</button>
                </div>
                <div className="panel">
                  <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>توضیح</h2>
                  <p style={{ whiteSpace: "pre-line", lineHeight: 1.85 }}>{currentLesson.explanation}</p>
                  <h2 style={{ fontSize: "1.05rem" }}>مثال</h2>
                  <div className="lesson-example" style={{ whiteSpace: "pre-line" }}>{currentLesson.example}</div>
                  <p style={{ whiteSpace: "pre-line", color: "#6e6e84" }}>{currentLesson.translation}</p>
                  <button type="button" className="button button-ghost" onClick={() => speakText(currentLesson.example, targetLang)}>🔊 شنیدن</button>
                  {currentLesson.tip && (
                    <p style={{ background: "rgba(124,92,255,0.08)", padding: "12px 14px", borderRadius: 12, lineHeight: 1.7, marginTop: 12 }}>
                      <strong>نکتهٔ معلم: </strong>{currentLesson.tip}
                    </p>
                  )}
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
                      {quizDone && (
                        <div style={{ marginTop: 10 }} role="status" aria-live="polite">
                          <p>{quizChoice === currentLesson.answer ? "آفرین! پاسخ درست است؛ حالا می‌توانی درس را تکمیل کنی." : "پاسخ درست نیست. دوباره تلاش کن؛ تا پاسخ صحیح ندهی درس تکمیل نمی‌شود."} {currentLesson.feedback || ""}</p>
                          {quizChoice !== currentLesson.answer && (
                            <button type="button" className="button button-ghost" onClick={() => { setQuizChoice(null); setQuizDone(false); }}>تلاش دوباره</button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button className="button button-primary" disabled={!canCompleteLesson(currentLesson)} onClick={() => goNextLesson(currentLesson)}>تکمیل و بعدی ←</button>
                    <button className="button button-ghost" disabled={!canCompleteLesson(currentLesson)} onClick={() => { if (!canCompleteLesson(currentLesson)) return; completeLesson(currentLesson); go("path"); }}>فقط تکمیل</button>
                  </div>
                </div>
              </div>
            )}
            {page === "review" && (<><div className="page-heading"><div><h1>مرور · {langLabel}</h1></div></div><SmartLearning lessons={lessons as any} currentLevel={userLevel} onLevelChange={(level) => applyPlacement(level)} /></>)}
            {page === "settings" && (
              <>
                <div className="page-heading"><div><h1>تنظیمات</h1></div></div>
                <div className="panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <div style={{ marginBottom: 8, fontWeight: 600 }}>زبان یادگیری</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button type="button" className={targetLang === "en" ? "button button-primary" : "button button-ghost"} onClick={() => switchLang("en")}>🇬🇧 انگلیسی{saved.placementByLang?.en ? ` · ${saved.placementByLang.en}` : ""}</button>
                      <button type="button" className={targetLang === "es" ? "button button-primary" : "button button-ghost"} onClick={() => switchLang("es")}>🇪🇸 اسپانیایی{saved.placementByLang?.es ? ` · ${saved.placementByLang.es}` : ""}</button>
                    </div>
                  </div>
                  <button type="button" className="button button-ghost" onClick={() => go("placement")}>تعیین سطح مجدد · {langLabel}</button>
                  <button type="button" className="button button-ghost" onClick={() => setDarkMode((d) => !d)}>{darkMode ? "حالت روشن" : "حالت تاریک"}</button>
                </div>
              </>
            )}
            {page === "practice" && (<><div className="page-heading"><div><h1>جمله‌سازی</h1></div><button className="button button-ghost" onClick={() => go("skills")}>←</button></div><div className="panel"><button className="button button-primary" onClick={() => go("path")}>درس‌ها</button></div></>)}
            {page === "ielts" && (<><div className="page-heading"><div><h1>IELTS</h1></div><button className="button button-ghost" onClick={() => go("skills")}>←</button></div>{targetLang === "es" ? <div className="panel"><p>مخصوص انگلیسی</p></div> : <IeltsCourse />}</>)}
          </section>
        </div>
      )}

      {page !== "home" && !isLoggedIn && authReady && (
        <main className="section-container" style={{ padding: "48px 16px", textAlign: "center" }}>
          <div className="panel" style={{ maxWidth: 420, margin: "0 auto" }}>
            <h1 style={{ marginTop: 0 }}>برای دیدن دوره‌ها وارد شو</h1>
            <p>درس‌ها و پیشرفت فقط بعد از ورود نمایش داده می‌شوند.</p>
            <button className="button button-primary" onClick={() => setAuthSignal((n) => n + 1)}>ثبت‌نام / ورود</button>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
