import { useMemo, useState } from "react";
import type { Level } from "./types";

type Item = { level: Level; question: string; options: string[]; answer: string; note: string };

const ITEMS: Item[] = [
  { level: "A0", question: "What is the meaning of “apple”?", options: ["سیب", "کتاب", "آب", "خانه"], answer: "سیب", note: "apple یعنی سیب." },
  { level: "A0", question: "Choose the correct sentence.", options: ["I am a student.", "I is a student.", "I are student.", "I be student."], answer: "I am a student.", note: "با I از am استفاده می‌کنیم." },
  { level: "A1", question: "She ___ to work every day.", options: ["go", "goes", "going", "is go"], answer: "goes", note: "در حال ساده با she به فعل s یا es اضافه می‌شود." },
  { level: "A1", question: "Choose the correct question.", options: ["Where you live?", "Where do you live?", "Where does you live?", "Where are live?"], answer: "Where do you live?", note: "برای سؤال حال ساده با you از do استفاده می‌شود." },
  { level: "A2", question: "We ___ the museum last weekend.", options: ["visit", "have visit", "visited", "visiting"], answer: "visited", note: "last weekend زمان گذشتهٔ تمام‌شده است." },
  { level: "A2", question: "I have lived here ___ 2020.", options: ["for", "since", "during", "from"], answer: "since", note: "since نقطهٔ شروع زمان را نشان می‌دهد." },
  { level: "B1", question: "If I ___ more time, I would learn another language.", options: ["have", "will have", "had", "would have"], answer: "had", note: "در شرطی نوع دوم، if + گذشتهٔ ساده می‌آید." },
  { level: "B1", question: "I look forward to ___ from you.", options: ["hear", "hearing", "heard", "be hear"], answer: "hearing", note: "در look forward to، واژهٔ to حرف اضافه است و بعدش ing می‌آید." },
  { level: "B2", question: "The report, ___ was published yesterday, has been widely discussed.", options: ["that", "which", "what", "who"], answer: "which", note: "در بند موصولی توضیحی با ویرگول از which استفاده می‌کنیم." },
  { level: "B2", question: "Which sentence expresses a cautious conclusion?", options: ["This proves the theory in all cases.", "The findings may indicate a correlation.", "There is no doubt whatsoever.", "Everyone must accept this result."], answer: "The findings may indicate a correlation.", note: "may indicate ادعا را متناسب با قطعیت شواهد محدود می‌کند." },
  { level: "C1", question: "Rarely ___ such a convincing argument.", options: ["I have heard", "have I heard", "I heard have", "heard I have"], answer: "have I heard", note: "پس از قید منفی در ابتدای جمله، وارونگی فعل کمکی و فاعل رخ می‌دهد." },
  { level: "C1", question: "Which phrase means “defensible” in an academic argument?", options: ["untenable", "tenable", "incidental", "ambiguous"], answer: "tenable", note: "tenable یعنی قابل دفاع یا قابل پشتیبانی با دلیل." },
];

const LEVELS: Level[] = ["A0", "A1", "A2", "B1", "B2", "C1"];

type Props = { onComplete: (level: Level) => void };

export default function PlacementTest({ onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [index, setIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const current = ITEMS[index];
  const score = useMemo(() => ITEMS.filter((item, i) => answers[i] === item.answer).length, [answers]);
  const suggestedLevel = useMemo(() => {
    let result: Level = "A0";
    for (const level of LEVELS.slice(1)) {
      const group = ITEMS.filter((item) => item.level === level);
      const correct = group.filter((item) => answers[ITEMS.indexOf(item)] === item.answer).length;
      if (correct === group.length) result = level;
      else break;
    }
    return result;
  }, [answers]);

  const choose = (option: string) => {
    if (showFeedback) return;
    setAnswers((old) => ({ ...old, [index]: option }));
  };
  const check = () => {
    if (!answers[index]) return;
    setShowFeedback(true);
  };
  const next = () => {
    if (index === ITEMS.length - 1) {
      setShowResult(true);
      return;
    }
    setIndex((old) => old + 1);
    setShowFeedback(false);
  };
  const restart = () => {
    setAnswers({});
    setIndex(0);
    setShowFeedback(false);
    setShowResult(false);
  };

  if (showResult) {
    return <div className="panel" style={{ maxWidth: 620, margin: "0 auto" }}>
      <span className="eyebrow">نتیجهٔ تعیین سطح آزمایشی</span>
      <h1>سطح پیشنهادی تو: {suggestedLevel}</h1>
      <p>از {ITEMS.length} سؤال، {score} پاسخ درست دادی. سطح پیشنهادی بر اساس پاسخ‌های درست در بخش‌های پی‌درپی تعیین شده است.</p>
      <p style={{ color: "#6e6e84", lineHeight: 1.8 }}>این آزمون کوتاه، تخمین اولیه است و جای آزمون استاندارد CEFR یا ارزیابی مهارت شنیدن و صحبت‌کردن را نمی‌گیرد. اگر نتیجه پایین‌تر از سطح واقعی‌ات بود، می‌توانی بعداً از تنظیمات تعیین سطح را تکرار کنی.</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="button button-primary" onClick={() => onComplete(suggestedLevel)}>شروع در سطح {suggestedLevel} ←</button>
        <button className="button button-ghost" onClick={restart}>تکرار آزمون</button>
      </div>
    </div>;
  }

  return <div className="panel" style={{ maxWidth: 620, margin: "0 auto" }}>
    <span className="eyebrow">گام ۲ از ۲ · تعیین سطح انگلیسی</span>
    <h1 style={{ marginTop: 8 }}>چند سؤال کوتاه برای پیدا کردن نقطهٔ شروع</h1>
    <p style={{ color: "#6e6e84" }}>از سؤال‌های ساده شروع می‌شود و به‌تدریج دشوارتر می‌شود. پاسخ‌هایت را با دقت انتخاب کن.</p>
    <div style={{ display: "flex", justifyContent: "space-between", margin: "18px 0 8px" }}>
      <strong>{current.level}</strong><span>سؤال {index + 1} از {ITEMS.length}</span>
    </div>
    <div className="mini-progress" style={{ height: 8, marginBottom: 20 }}><span style={{ width: ((index + 1) / ITEMS.length * 100) + "%" }} /></div>
    <h2 style={{ fontSize: "1.1rem" }}>{current.question}</h2>
    <div style={{ display: "grid", gap: 9, marginTop: 16 }}>
      {current.options.map((option) => <button key={option} type="button" className={`quiz-option ${showFeedback && option === current.answer ? "is-correct" : ""} ${showFeedback && answers[index] === option && option !== current.answer ? "is-wrong" : ""}`} disabled={showFeedback} onClick={() => choose(option)} aria-pressed={answers[index] === option}>{option}</button>)}
    </div>
    {showFeedback && <p role="status" style={{ marginTop: 14 }}>{answers[index] === current.answer ? "پاسخ درست است ✓" : "پاسخ درست: " + current.answer} — {current.note}</p>}
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 22 }}>
      <button type="button" className="button button-ghost" onClick={restart}>شروع دوباره</button>
      {!showFeedback ? <button type="button" className="button button-primary" disabled={!answers[index]} onClick={check}>بررسی پاسخ</button> : <button type="button" className="button button-primary" onClick={next}>{index === ITEMS.length - 1 ? "دیدن نتیجه" : "سؤال بعدی ←"}</button>}
    </div>
  </div>;
}
