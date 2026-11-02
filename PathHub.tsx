import { useMemo, useState } from "react";

type Level = "A0" | "A1" | "A2" | "B1" | "B2" | "C1";

type Lesson = {
  id: string;
  level: Level;
  title: string;
  category: string;
  minutes: number;
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
  const [openLevel, setOpenLevel] = useState<Level | null>(userLevel);

  const byLevel = useMemo(() => {
    const map: Record<Level, Lesson[]> = {
      A0: [],
      A1: [],
      A2: [],
      B1: [],
      B2: [],
      C1: [],
    };
    for (const lesson of lessons) {
      if (map[lesson.level]) map[lesson.level].push(lesson);
    }
    return map;
  }, [lessons]);

  return (
    <div dir="rtl">
      <div className="page-heading">
        <div>
          <span className="eyebrow">نقشهٔ راه تو</span>
          <h1>دوره‌ها و درس‌ها</h1>
          <p>سطح خودت را باز کن و درس بعدی را شروع کن.</p>
        </div>
        <span className="level-pill">سطح فعلی: {userLevel}</span>
      </div>

      <div className="path-overview panel">
        <div>
          <span>پیشرفت دوره</span>
          <strong>{progress}٪</strong>
        </div>
        <div className="mini-progress">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p>
          {completedCount} درس از {lessons.length} درس تکمیل شده است.
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
            <p>فقط یک سطح باز است. روی سطح بزن تا درس‌ها را ببینی.</p>
          </div>
        </div>

        {LEVELS.map((level) => {
          const group = byLevel[level];
          const done = group.filter((l) => completedLessons.includes(l.id)).length;
          const isOpen = openLevel === level;
          const isCurrent = level === userLevel;

          return (
            <div key={level} className="path-level-group" style={{ marginBottom: 10 }}>
              <button
                type="button"
                className="button button-ghost"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: isCurrent ? "1px solid #cbbdff" : "1px solid #eeedf6",
                  background: isCurrent ? "#f7f4ff" : "#fbfbfe",
                }}
                onClick={() => setOpenLevel(isOpen ? null : level)}
                aria-expanded={isOpen}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700 }}>
                  <span>{isOpen ? "▾" : "▸"}</span>
                  سطح {level}
                  {isCurrent && (
                    <span className="level-pill" style={{ fontSize: 11 }}>
                      سطح تو
                    </span>
                  )}
                </span>
                <span style={{ color: "#85859b", fontSize: 13 }}>
                  {done}/{group.length} درس
                </span>
              </button>

              {isOpen && (
                <div className="path-list" style={{ marginTop: 10 }}>
                  {group.map((lesson, lessonIndex) => {
                    const finished = completedLessons.includes(lesson.id);
                    return (
                      <article
                        className={`path-lesson panel ${finished ? "completed" : ""}`}
                        key={lesson.id}
                      >
                        <div className="path-step">
                          {finished ? "✓" : String(lessonIndex + 1).padStart(2, "0")}
                        </div>
                        <div className="path-lesson-info">
                          <div className="path-meta">
                            <span>{lesson.level}</span>
                            <span>{lesson.minutes} دقیقه</span>
                            {finished && <span className="done-label">تکمیل‌شده</span>}
                          </div>
                          <h3>{lesson.title}</h3>
                          <p>{lesson.category} · آموزش، مثال و تمرین</p>
                        </div>
                        <button
                          className={finished ? "button button-ghost" : "button button-primary"}
                          onClick={() => onStartLesson(lesson.id)}
                        >
                          {finished ? "مرور درس" : "شروع درس"} ←
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
