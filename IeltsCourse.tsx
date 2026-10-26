import { useMemo, useState } from "react";
import "./IeltsCourse.css";

type Skill = "reading" | "listening" | "writing" | "speaking";
const skills: { id: Skill; title: string; subtitle: string; icon: string }[] = [
  { id: "reading", title: "Reading", subtitle: "درک مطلب و استنباط", icon: "📖" },
  { id: "listening", title: "Listening", subtitle: "شنیدن جزئیات و اصلاح پاسخ", icon: "🎧" },
  { id: "writing", title: "Writing", subtitle: "ساختار، انسجام و دقت", icon: "✍️" },
  { id: "speaking", title: "Speaking", subtitle: "پاسخ روان و بسط ایده", icon: "🗣️" },
];
const tasks: Record<Skill, { title: string; instruction: string; prompt: string; options?: string[]; answer?: string; feedback: string; sample?: string }> = {
  reading: {
    title: "تشخیص ادعای متن", instruction: "متن کوتاه را بخوان و فقط بر اساس اطلاعات آن پاسخ بده.",
    prompt: "The city introduced a bike-sharing scheme in 2022. Although usage increased in the first year, a lack of safe lanes has limited further growth. What is the main point?",
    options: ["The scheme was cancelled in 2022.", "Usage grew, but safety issues restrict further growth.", "All residents prefer cycling.", "The city has built enough bike lanes."],
    answer: "Usage grew, but safety issues restrict further growth.",
    feedback: "گزینهٔ درست هم رشد اولیه و هم مانع ادامهٔ رشد را پوشش می‌دهد؛ گزینه‌های دیگر در متن پشتیبانی نمی‌شوند."
  },
  listening: {
    title: "گرفتن جزئیات از شنیدن", instruction: "متن را با دکمهٔ پخش گوش بده. اگر پخش صدا در دسترس نیست، متن را بخوان و تمرین را ادامه بده.",
    prompt: "The lecture begins at quarter past ten, not ten o'clock, and will take place in Room 204.",
    options: ["10:00 in Room 204", "10:15 in Room 204", "10:15 in Room 240", "10:45 in Room 204"],
    answer: "10:15 in Room 204",
    feedback: "quarter past ten یعنی ۱۰:۱۵. به اصلاح «not ten o'clock» توجه کن."
  },
  writing: {
    title: "ساختار پاراگراف", instruction: "یک ساختار مناسب برای نوشتن آکادمیک انتخاب کن.",
    prompt: "برای پاسخ به این پرسش، «Should cities invest more in public transport?»، کدام طرح برای یک بند بدنه مناسب‌تر است؟",
    options: ["یک ایدهٔ مرکزی، توضیح دلیل و مثال مرتبط", "فهرستی از واژه‌های دشوار بدون ارتباط", "چند ادعای متناقض بدون توضیح", "تکرار عین سؤال در تمام بند"],
    answer: "یک ایدهٔ مرکزی، توضیح دلیل و مثال مرتبط",
    feedback: "بند مؤثر یک ایده را توسعه می‌دهد و توضیح و مثال را به همان ایده وصل می‌کند.",
    sample: "Cities should invest more in public transport because reliable services can reduce congestion. For example, frequent buses may encourage commuters to leave their cars at home."
  },
  speaking: {
    title: "گسترش پاسخ Speaking", instruction: "پاسخ را با صدای بلند بگو و سپس نمونه را با پاسخ خود مقایسه کن.",
    prompt: "Describe a skill you would like to learn. Explain why you want to learn it and how you would practise.",
    feedback: "برای پاسخ منسجم، مهارت را نام ببر، دلیل شخصی بده و دو روش تمرین مشخص کن. این ابزار خودارزیابی رسمی آیلتس یا نمره‌دهی خودکار تلفظ نیست.",
    sample: "I'd like to learn photography because I enjoy capturing everyday moments. I'd start by learning how light works, then practise taking pictures outdoors and ask experienced photographers for feedback."
  }
};
const KEY = "vazheno-ielts-practice-v1";
export default function IeltsCourse() {
  const [skill, setSkill] = useState<Skill>("reading");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showSample, setShowSample] = useState(false);
  const task = tasks[skill];
  const key = skill + "-1";
  const stored = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}") as Record<string, { completed?: boolean; note?: string }>; }
    catch { return {}; }
  }, [skill, checked[skill], notes[skill]]);
  const speak = () => {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(task.prompt);
    utterance.lang = "en-US"; utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  };
  const save = (complete: boolean, note = notes[skill] || "") => {
    const next = { ...stored, [skill]: { completed: complete, note } };
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage may be unavailable */ }
    setChecked((old) => ({ ...old, [skill]: complete }));
    setNotes((old) => ({ ...old, [skill]: note }));
  };
  const isCorrect = !!task.answer && answers[skill] === task.answer;
  return <section className="ielts-course panel">
    <div className="ielts-head"><div><span className="eyebrow">EXAM SKILLS · IELTS</span><h2>کارگاه آمادگی آیلتس</h2><p>تمرین‌های مهارت‌محور با توضیح پاسخ و نمونه. این بخش فعلاً یک کارگاه آموزشی اولیه است و نمرهٔ رسمی آیلتس صادر نمی‌کند.</p></div><span className="ielts-mark">IELTS</span></div>
    <div className="ielts-skills">{skills.map((item) => <button key={item.id} className={skill === item.id ? "ielts-skill active" : "ielts-skill"} onClick={() => { setSkill(item.id); setShowSample(false); }}><span>{item.icon}</span><strong>{item.title}</strong><small>{item.subtitle}</small><em>{stored[item.id]?.completed ? "تمرین انجام شد ✓" : "تمرین نمونه"}</em></button>)}</div>
    <article className="ielts-task">
      <div className="ielts-task-top"><span>{skill.toUpperCase()} · PRACTICE 01</span><span>سطح پیشنهادی: B1–B2</span></div>
      <h3>{task.title}</h3><p>{task.instruction}</p>
      <blockquote dir="auto">{task.prompt}</blockquote>
      {skill === "listening" && <button className="button button-ghost" onClick={speak}>▶ پخش متن شنیداری</button>}
      {task.options && <div className="ielts-options">{task.options.map((option) => <button key={option} disabled={!!checked[skill]} className={checked[skill] && option === task.answer ? "correct" : checked[skill] && option === answers[skill] ? "incorrect" : answers[skill] === option ? "selected" : ""} onClick={() => setAnswers((old) => ({ ...old, [skill]: option }))}>{option}</button>)}</div>}
      {!task.options && <label className="ielts-writing-label">یادداشت یا پاسخ خودت<textarea rows={4} value={notes[skill] || ""} onChange={(event) => setNotes((old) => ({ ...old, [skill]: event.target.value }))} placeholder={skill === "writing" ? "ایدهٔ اصلی، دلیل و مثال را بنویس…" : "با صدای بلند پاسخ بده و چند نکتهٔ کلیدی یادداشت کن…"} /></label>}
      <div className="ielts-actions"><button className="button button-primary" onClick={() => save(true)} disabled={!!checked[skill] || (!!task.options && !answers[skill])}>بررسی / ثبت تمرین</button><button className="button button-ghost" onClick={() => { setChecked((old) => ({ ...old, [skill]: false })); setAnswers((old) => ({ ...old, [skill]: "" })); setShowSample(false); }}>تلاش دوباره</button></div>
      {checked[skill] && <div className={task.answer ? (isCorrect ? "ielts-feedback good" : "ielts-feedback") : "ielts-feedback"}><strong>{task.answer ? (isCorrect ? "پاسخ درست است" : "پاسخ نمونه را بررسی کن") : "تمرین ثبت شد"}</strong><p>{task.answer && !isCorrect ? "پاسخ مناسب: " + task.answer + " — " : ""}{task.feedback}</p></div>}
      {task.sample && <><button className="text-button" onClick={() => setShowSample((value) => !value)}>{showSample ? "پنهان کردن نمونه" : "دیدن نمونهٔ پاسخ"}</button>{showSample && <blockquote className="ielts-sample">{task.sample}</blockquote>}</>}
    </article>
    <p className="ielts-disclaimer">نکته: در این نسخه، Reading و برخی تمرین‌ها پاسخ قابل‌بررسی دارند؛ Speaking و Writing هنوز ارزیابی خودکار بر اساس معیارهای رسمی و تشخیص دقیق تلفظ ندارند.</p>
  </section>;
}
