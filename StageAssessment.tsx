
import { useMemo, useState } from "react";

type Level = "A0" | "A1" | "A2" | "B1";

type Question = {
  id: string;
  level: Level;
  skill: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

type Result = {
  level: Level;
  score: number;
  total: number;
  percentage: number;
  weakSkills: string[];
  date: string;
};

type StageAssessmentProps = {
  onBack?: () => void;
};

const LEVELS: { value: Level; label: string }[] = [
  { value: "A0", label: "شروع از صفر" },
  { value: "A1", label: "مقدماتی" },
  { value: "A2", label: "پیش‌مقدماتی" },
  { value: "B1", label: "متوسط" },
];

const QUESTIONS: Question[] = [
  {
    id: "a0-1",
    level: "A0",
    skill: "واژگان",
    question: "معنی کلمهٔ Book چیست؟",
    options: ["خانه", "کتاب", "آب", "مدرسه"],
    answer: "کتاب",
    explanation: "Book یعنی کتاب.",
  },
  {
    id: "a0-2",
    level: "A0",
    skill: "گرامر",
    question: "جمله را کامل کن: I ___ happy.",
    options: ["is", "are", "am", "be"],
    answer: "am",
    explanation: "با فاعل I از am استفاده می‌کنیم.",
  },
  {
    id: "a0-3",
    level: "A0",
    skill: "کاربرد",
    question: "کدام جمله برای معرفی خود درست است؟",
    options: [
      "My name Pouya.",
      "I name is Pouya.",
      "My name is Pouya.",
      "My names Pouya.",
    ],
    answer: "My name is Pouya.",
    explanation: "ساختار رایج معرفی نام My name is ... است.",
  },
  {
    id: "a1-1",
    level: "A1",
    skill: "گرامر",
    question: "She ___ English every day.",
    options: ["study", "studies", "studying", "are study"],
    answer: "studies",
    explanation: "در حال ساده با she، فعل معمولاً s یا es می‌گیرد.",
  },
  {
    id: "a1-2",
    level: "A1",
    skill: "واژگان",
    question: "معنی tired چیست؟",
    options: ["خسته", "گرسنه", "خوشحال", "سریع"],
    answer: "خسته",
    explanation: "Tired یعنی خسته.",
  },
  {
    id: "a1-3",
    level: "A1",
    skill: "کاربرد",
    question: "کدام سؤال درست است؟",
    options: [
      "Where you live?",
      "Where do you live?",
      "Where does you live?",
      "Where are live?",
    ],
    answer: "Where do you live?",
    explanation: "برای سؤال حال ساده با you از do استفاده می‌کنیم.",
  },
  {
    id: "a2-1",
    level: "A2",
    skill: "گرامر",
    question: "Yesterday, I ___ football.",
    options: ["play", "played", "playing", "plays"],
    answer: "played",
    explanation: "Yesterday معمولاً به گذشته اشاره دارد؛ شکل گذشتهٔ play برابر played است.",
  },
  {
    id: "a2-2",
    level: "A2",
    skill: "واژگان",
    question: "معنی although چیست؟",
    options: ["زیرا", "اگرچه", "بنابراین", "قبل از"],
    answer: "اگرچه",
    explanation: "Although برای بیان تضاد به معنی «اگرچه» است.",
  },
  {
    id: "a2-3",
    level: "A2",
    skill: "کاربرد",
    question: "کدام جمله درست است؟",
    options: [
      "I have seen this film.",
      "I has seen this film.",
      "I have saw this film.",
      "I am seen this film.",
    ],
    answer: "I have seen this film.",
    explanation: "حال کامل از have/has و قسمت سوم فعل ساخته می‌شود.",
  },
  {
    id: "b1-1",
    level: "B1",
    skill: "گرامر",
    question: "If I had more time, I ___ more books.",
    options: ["will read", "would read", "readed", "would reading"],
    answer: "would read",
    explanation: "در شرطی نوع دوم از would به همراه شکل پایهٔ فعل استفاده می‌کنیم.",
  },
  {
    id: "b1-2",
    level: "B1",
    skill: "واژگان",
    question: "معنی reliable چیست؟",
    options: ["قابل اعتماد", "خطرناک", "خسته‌کننده", "ناشناخته"],
    answer: "قابل اعتماد",
    explanation: "Reliable یعنی قابل اعتماد.",
  },
  {
    id: "b1-3",
    level: "B1",
    skill: "کاربرد",
    question: "کدام جمله درست است؟",
    options: [
      "I look forward to meet you.",
      "I look forward meeting you.",
      "I look forward to meeting you.",
      "I looking forward to meet you.",
    ],
    answer: "I look forward to meeting you.",
    explanation: "در عبارت look forward to، فعل بعدی به شکل ing می‌آید.",
  },
];

const HISTORY_KEY = "vazheno-stage-assessment-history-v1";

const cardStyle = {
  background: "var(--panel-bg, #17172b)",
  border: "1px solid rgba(167, 139, 250, 0.22)",
  borderRadius: 20,
  padding: 24,
  marginBottom: 20,
} as const;

const buttonStyle = {
  border: "1px solid rgba(167, 139, 250, 0.35)",
  borderRadius: 12,
  padding: "11px 16px",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
} as const;

const primaryStyle = {
  ...buttonStyle,
  background: "linear-gradient(120deg, #7c3aed, #6366f1)",
  border: 0,
  color: "#fff",
  fontWeight: 700,
} as const;

function readHistory(): Result[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as Result[]) : [];
  } catch {
    return [];
  }
}

export default function StageAssessment({
  onBack,
}: StageAssessmentProps) {
  const [level, setLevel] = useState<Level>("A0");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState<Result[]>(readHistory);

  const stageQuestions = useMemo(
    () => QUESTIONS.filter((question) => question.level === level),
    [level],
  );

  const currentQuestion = stageQuestions[index];

  const score = stageQuestions.filter(
    (question) => answers[question.id] === question.answer,
  ).length;

  const percentage = stageQuestions.length
    ? Math.round((score / stageQuestions.length) * 100)
    : 0;

  const weakSkills = ["گرامر", "واژگان", "کاربرد"].filter((skill) => {
    const group = stageQuestions.filter((question) => question.skill === skill);

    if (group.length === 0) return false;

    const correct = group.filter(
      (question) => answers[question.id] === question.answer,
    ).length;

    return correct / group.length < 0.67;
  });

  function restart(nextLevel: Level = level) {
    setLevel(nextLevel);
    setAnswers({});
    setIndex(0);
    setRevealed(false);
    setFinished(false);
  }

  function selectLevel(nextLevel: Level) {
    restart(nextLevel);
  }

  function submitAnswer() {
    if (!currentQuestion || !answers[currentQuestion.id]) return;

    if (!revealed) {
      setRevealed(true);
      return;
    }

    if (index < stageQuestions.length - 1) {
      setIndex((previous) => previous + 1);
      setRevealed(false);
      return;
    }

    const finalScore = stageQuestions.filter(
      (question) => answers[question.id] === question.answer,
    ).length;

    const finalWeakSkills = ["گرامر", "واژگان", "کاربرد"].filter((skill) => {
      const group = stageQuestions.filter((question) => question.skill === skill);
      if (!group.length) return false;

      const correct = group.filter(
        (question) => answers[question.id] === question.answer,
      ).length;

      return correct / group.length < 0.67;
    });

    const result: Result = {
      level,
      score: finalScore,
      total: stageQuestions.length,
      percentage: Math.round((finalScore / stageQuestions.length) * 100),
      weakSkills: finalWeakSkills,
      date: new Date().toISOString(),
    };

    const nextHistory = [result, ...history].slice(0, 30);

    setHistory(nextHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
    setFinished(true);
  }

  return (
    <div className="stage-assessment" dir="rtl">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ارزیابی یادگیری</span>
          <h1>آزمون پایان مرحله</h1>
          <p>سطح موردنظر را انتخاب کن، به سؤال‌ها پاسخ بده و نتیجه را بررسی کن.</p>
        </div>

        {onBack && (
          <button style={buttonStyle} onClick={onBack}>
            ← بازگشت
          </button>
        )}
      </div>

      <section style={cardStyle}>
        <h3>انتخاب سطح آزمون</h3>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 14,
          }}
        >
          {LEVELS.map((item) => (
            <button
              key={item.value}
              style={level === item.value ? primaryStyle : buttonStyle}
              onClick={() => selectLevel(item.value)}
              aria-pressed={level === item.value}
            >
              {item.value} · {item.label}
            </button>
          ))}
        </div>
      </section>

      {!finished ? (
        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <strong>{level} · {currentQuestion?.skill}</strong>
            <span>سؤال {index + 1} از {stageQuestions.length}</span>
          </div>

          <div
            style={{
              height: 7,
              background: "rgba(167,139,250,.15)",
              borderRadius: 20,
              overflow: "hidden",
              margin: "16px 0 24px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${((index + 1) / stageQuestions.length) * 100}%`,
                background: "linear-gradient(90deg,#7c3aed,#6366f1)",
                transition: "width .2s ease",
              }}
            />
          </div>

          <h2>{currentQuestion?.question}</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 10,
              marginTop: 20,
            }}
          >
            {currentQuestion?.options.map((option) => {
              const selected = answers[currentQuestion.id] === option;
              const isCorrect = option === currentQuestion.answer;

              let background = "transparent";
              let border = "1px solid rgba(167,139,250,.3)";

              if (revealed && isCorrect) {
                background = "rgba(16,185,129,.12)";
                border = "1px solid #10b981";
              } else if (revealed && selected && !isCorrect) {
                background = "rgba(244,63,94,.12)";
                border = "1px solid #f43f5e";
              } else if (selected) {
                background = "rgba(124,58,237,.15)";
                border = "1px solid #8b5cf6";
              }

              return (
                <button
                  key={option}
                  disabled={revealed}
                  onClick={() =>
                    setAnswers((previous) => ({
                      ...previous,
                      [currentQuestion.id]: option,
                    }))
                  }
                  style={{
                    ...buttonStyle,
                    background,
                    border,
                    textAlign: "right",
                    minHeight: 48,
                    opacity: revealed && !isCorrect && !selected ? 0.7 : 1,
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {revealed && currentQuestion && (
            <div
              className="example-box"
              style={{ marginTop: 20, padding: 16, borderRadius: 12 }}
            >
              <strong>
                {answers[currentQuestion.id] === currentQuestion.answer
                  ? "پاسخ درست است ✓"
                  : `پاسخ درست: ${currentQuestion.answer}`}
              </strong>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 24,
            }}
          >
            <button
              style={buttonStyle}
              onClick={() => restart()}
            >
              شروع دوباره
            </button>

            <button
              style={primaryStyle}
              disabled={!answers[currentQuestion?.id ?? ""]}
              onClick={submitAnswer}
            >
              {!revealed
                ? "بررسی پاسخ"
                : index === stageQuestions.length - 1
                  ? "مشاهدهٔ نتیجه"
                  : "سؤال بعدی"}{" "}
              →
            </button>
          </div>
        </section>
      ) : (
        <section style={cardStyle}>
          <span className="eyebrow">نتیجهٔ آزمون</span>
          <h2>آزمون {level} تمام شد</h2>

          <div style={{ fontSize: 44, fontWeight: 800, margin: "18px 0" }}>
            {percentage}٪
          </div>

          <p>
            {score} پاسخ درست از {stageQuestions.length} سؤال
          </p>

          <div
            style={{
              height: 8,
              background: "rgba(167,139,250,.15)",
              borderRadius: 20,
              overflow: "hidden",
              margin: "16px 0 24px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${percentage}%`,
                background: "linear-gradient(90deg,#7c3aed,#6366f1)",
              }}
            />
          </div>

          <div
            className="example-box"
            style={{ padding: 16, borderRadius: 12, marginBottom: 20 }}
          >
            <h3>پیشنهاد برای ادامهٔ یادگیری</h3>
            {weakSkills.length > 0 ? (
              <p>
                بهتر است این بخش‌ها را دوباره تمرین کنی:{" "}
                <strong>{weakSkills.join("، ")}</strong>.
              </p>
            ) : (
              <p>
                در این آزمون کوتاه ضعف مشخصی ثبت نشد. برای اطمینان، آموخته‌هایت
                را در جمله‌سازی و خواندن هم تمرین کن.
              </p>
            )}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button style={primaryStyle} onClick={() => restart()}>
              تکرار همین آزمون
            </button>
            <button style={buttonStyle} onClick={() => restart("A1")}>
              تمرین سطح A1
            </button>
          </div>
        </section>
      )}

      <section style={cardStyle}>
        <h3>سوابق آزمون</h3>

        {history.length === 0 ? (
          <p>پس از پایان اولین آزمون، نتیجه‌ات اینجا ذخیره می‌شود.</p>
        ) : (
          history.slice(0, 8).map((result, index) => (
            <div
              key={`${result.date}-${index}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                padding: "14px 0",
                borderBottom: "1px solid rgba(167,139,250,.15)",
              }}
            >
              <div>
                <strong>{result.level}</strong>
                <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>
                  {new Date(result.date).toLocaleDateString("fa-IR")}
                </div>
              </div>
              <strong>
                {result.score}/{result.total} · {result.percentage}٪
              </strong>
            </div>
          ))
        )}
      </section>

      <p className="quiz-footnote">
        این آزمون آموزشی کوتاه است و مدرک رسمی یا تعیین سطح استاندارد CEFR صادر
        نمی‌کند. سوابق فقط در همین مرورگر ذخیره می‌شوند.
      </p>
    </div>
  );
}
