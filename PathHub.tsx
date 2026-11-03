import { useMemo, useState } from "react";

type Level = "A0" | "A1" | "A2" | "B1" | "B2" | "C1";
type LevelFilter = Level | "all";

type Lesson = {
  id: string;
  level?: string;
  title?: string;
  category?: string;
  minutes?: number;
};

type Props = {
  lessons: Lesson[];
  completedLessons: string[];
  userLevel: Level;
  progress: number;
  completedCount: number;
  onStartLesson: (id: string) => void;
  onOpenDaily: () => void;
  onOpenAlphabet: () => void;
};

const LEVELS: Level[] = ["A0", "A1", "A2", "B1", "B2", "C1"];

const LEVEL_META: Record<Level, string> = {
  A0: "صفر مطلق · الفبا و جمله‌های خیلی ساده",
  A1: "مبتدی · معرفی خود و موقعیت‌های روزمره",
  A2: "مبتدی پلاس · خرید، کار ساده، سفر کوتاه",
  B1: "متوسط · کار، سفر و علایق",
  B2: "متوسط بالا · بحث عمومی و متن‌های طولانی‌تر",
  C1: "پیشرفته · متن و گفتار پیچیده",
};

function normalizeLevel(raw: unknown): Level | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim().toUpperCase();
  if ((LEVELS as string[]).includes(v)) return v as Level;
  return null;
}

function isLessonUnlocked(group: Lesson[], index: number, completedLessons: string[]) {
  if (index <= 0) return true;
  for (let i = 0; i < index; i++) {
    const id = group[i]?.id;
    if (!id || !completedLessons.includes(id)) return false;
  }
  return true;
}

export default function PathHub({
  lessons,
  completedLessons,
  userLevel,
  progress,
  completedCount,
  onStartLesson,
  onOpenDaily,
  onOpenAlphabet,
}: Props) {
  const safeLessons = useMemo(
    () =>
      (lessons || []).filter(
        (lesson): lesson is Lesson & { id: string; level: string } =>
          !!lesson && typeof lesson.id === "string" && !!lesson.id && !!normalizeLevel(lesson.level),
      ),
    [lessons],
  );

  const [openLevel, setOpenLevel] = useState<Level | null>(userLevel || "A0");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");

  const byLevel = useMemo(() => {
    const map: Record<Level, Lesson[]> = {
      A0: [],
      A1: [],
      A2: [],
      B1: [],
      B2: [],
      C1: [],
    };
    for (const lesson of safeLessons) {
      const lv = normalizeLevel(lesson.level);
      if (lv) map[lv].push(lesson);
    }
    return map;
  }, [safeLessons]);

  const visibleLevels = levelFilter === "all" ? LEVELS : LEVELS.filter((l) => l === levelFilter);

  return (
    <div dir="rtl">
      <div className="page-heading">
        <div>
          <span className="eyebrow">نقشهٔ راه تو · CEFR</span>
          <h1>دوره‌ها و درس‌ها</h1>
          <p>درس‌ها به ترتیب باز می‌شوند؛ اول هر درس را تمام کن تا بعدی آزاد شود.</p>
        </div>
        <span className="level-pill">سطح فعلی: {userLevel}</span>
      </div>

      <div className="path-overview panel">
        <div>
          <span>پیشرفت کل دوره</span>
          <strong>{progress}٪</strong>
        </div>
        <div className="mini-progress">
          <span style={{ width: `${Math.max(0, Math.min(100, progress || 0))}%` }} />
        </div>
        <p>
          {completedCount} درس از {safeLessons.length} درس تکمیل شده است.
        </p>
      </div>

      <div
        className="content-grid"
        style={{ marginBottom: 20, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
      >
        <button className="panel" type="button" onClick={onOpenDaily} style={{ textAlign: "right", cursor: "pointer" }}>
          <span className="eyebrow">هر روز</span>
          <h3 style={{ margin: "8px 0 4px" }}>تمرین روزانه</h3>
          <p style={{ margin: 0, color: "#6e6e84", fontSize: 13 }}>واژه و جمله · چند دقیقه در روز</p>
        </button>
        <button className="panel" type="button" onClick={onOpenAlphabet} style={{ textAlign: "right", cursor: "pointer" }}>
          <span className="eyebrow">شروع از صفر</span>
          <h3 style={{ margin: "8px 0 4px" }}>آموزش الفبا</h3>
          <p style={{ margin: 0, color: "#6e6e84", fontSize: 13 }}>حروف انگلیسی قدم‌به‌قدم</p>
        </button>
      </div>

      <div className="panel" style={{ marginBottom: 12 }}>
        <div className="panel-heading">
          <div>
            <h3>درس‌های سطح‌بندی‌شده</h3>
            <p>فیلتر سطح را انتخاب کن یا همه را ببین. درس قفل‌شده بعد از تکمیل قبلی باز می‌شود.</p>
          </div>
        </div>

        <div className="level-filter" role="group" aria-label="فیلتر سطح CEFR">
          <button
            type="button"
            className={`level-filter-chip ${levelFilter === "all" ? "is-active" : ""}`}
            onClick={() => setLevelFilter("all")}
          >
            همه
          </button>
          {LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              className={`level-filter-chip ${levelFilter === level ? "is-active" : ""}`}
              onClick={() => {
                setLevelFilter(level);
                setOpenLevel(level);
              }}
            >
              <span className="cefr-tag" data-level={level}>
                {level}
              </span>
            </button>
          ))}
        </div>

        {visibleLevels.map((level) => {
          const group = byLevel[level] || [];
          const done = group.filter((l) => l.id && completedLessons.includes(l.id)).length;
          const levelPct = group.length ? Math.round((done / group.length) * 100) : 0;
          const isOpen = openLevel === level;
          const isCurrent = level === userLevel;

          return (
            <div key={level} className="path-level-group" style={{ marginBottom: 14 }}>
              <button
                type="button"
                className="button button-ghost"
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: 10,
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: isCurrent ? "1px solid #cbbdff" : "1px solid #eeedf6",
                  background: isCurrent ? "#f7f4ff" : "#fbfbfe",
                  textAlign: "right",
                }}
                onClick={() => setOpenLevel(isOpen ? null : level)}
                aria-expanded={isOpen}
              >
                <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700 }}>
                      <span>{isOpen ? "▾" : "▸"}</span>
                      <span className="cefr-tag" data-level={level}>
                        {level}
                      </span>
                      {isCurrent && (
                        <span className="level-pill" style={{ fontSize: 11 }}>
                          سطح تو
                        </span>
                      )}
                    </span>
                    <span style={{ color: "#85859b", fontSize: 12, fontWeight: 400, paddingRight: 22 }}>
                      {LEVEL_META[level]}
                    </span>
                  </span>
                  <span style={{ color: "#85859b", fontSize: 13, whiteSpace: "nowrap" }}>
                    {done}/{group.length} · {levelPct}٪
                  </span>
                </span>
                <span
                  className="mini-progress"
                  style={{
                    display: "block",
                    height: 8,
                    borderRadius: 999,
                    background: "#eeedf6",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      height: "100%",
                      width: `${levelPct}%`,
                      background: isCurrent ? "#7c5cbf" : "#a78bfa",
                      borderRadius: 999,
                      transition: "width 0.3s ease",
                    }}
                  />
                </span>
              </button>

              {isOpen && (
                <div className="path-list" style={{ marginTop: 10 }}>
                  {group.length === 0 && (
                    <p style={{ color: "#6e6e84", padding: "8px 4px" }}>هنوز درسی در این سطح ثبت نشده.</p>
                  )}
                  {group.map((lesson, lessonIndex) => {
                    const finished = !!(lesson.id && completedLessons.includes(lesson.id));
                    const unlocked = isLessonUnlocked(group, lessonIndex, completedLessons);
                    const locked = !unlocked && !finished;
                    const lv = normalizeLevel(lesson.level) || level;

                    return (
                      <article
                        className={`path-lesson panel ${finished ? "completed" : ""} ${locked ? "locked" : ""}`}
                        key={lesson.id}
                        style={locked ? { opacity: 0.72 } : undefined}
                      >
                        <div className="path-step">
                          {finished ? "✓" : locked ? "🔒" : String(lessonIndex + 1).padStart(2, "0")}
                        </div>
                        <div className="path-lesson-info">
                          <div className="path-meta">
                            <span className="cefr-tag" data-level={lv}>
                              {lv}
                            </span>
                            <span>{lesson.minutes || 8} دقیقه</span>
                            {finished && <span className="done-label">تکمیل‌شده</span>}
                            {locked && (
                              <span className="done-label" style={{ background: "#f3f0ff", color: "#6e6e84" }}>
                                قفل
                              </span>
                            )}
                          </div>
                          <h3>{lesson.title || "درس"}</h3>
                          <p>
                            {locked
                              ? "اول درس قبلی را تمام کن تا این درس باز شود."
                              : `${lesson.category || "عمومی"} · آموزش، مثال و تمرین`}
                          </p>
                        </div>
                        <button
                          className={
                            finished ? "button button-ghost" : locked ? "button button-ghost" : "button button-primary"
                          }
                          disabled={locked}
                          onClick={() => {
                            if (!locked && lesson.id) onStartLesson(lesson.id);
                          }}
                          title={locked ? "درس قبلی را تکمیل کن" : undefined}
                        >
                          {finished ? "مرور درس" : locked ? "قفل است" : "شروع درس"} {locked ? "" : "←"}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
