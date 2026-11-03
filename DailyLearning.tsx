import { useMemo, useState } from "react";
import "./DailyLearning.css";

type LessonWord = { word: string; meaning: string; example: string };
type LessonData = {
  id: string; level: string; title: string; category: string; minutes: number;
  example: string; translation: string; question: string; options: string[]; answer: string;
  words: LessonWord[];
};
type Props = {
  lessons: LessonData[];
  level: string;
  completedLessonIds: string[];
  onOpenLesson: (id: string) => void;
};

type Task = { id: string; kind: "meaning" | "sentence" | "vocabulary"; prompt: string; answer: string; options: string[]; note: string };

function dailySeed(date: string, completed: number, level: string) {
  return [...date + level].reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, completed + 17);
}
function shuffled<T>(items: T[], seed: number): T[] {
  const output = [...items];
  let value = seed || 1;
  for (let i = output.length - 1; i > 0; i--) {
    value = (value * 1664525 + 1013904223) >>> 0;
    const j = value % (i + 1);
    [output[i], output[j]] = [output[j], output[i]];
  }
  return output;
}
function clean(value: string) {
  return value.toLowerCase().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim();
}

export default function DailyLearning({ lessons, level, completedLessonIds, onOpenLesson }: Props) {
  const today = new Date().toLocaleDateString("en-CA");
  const eligible = useMemo<LessonData[]>(() => {
    const atLevel = lessons.filter((lesson) => lesson.level === level);
    const learned = lessons.filter((lesson) => completedLessonIds.includes(lesson.id));
    const source = [...learned, ...atLevel, ...lessons.filter((lesson) => lesson.level !== level)];
    return source.length ? source : lessons;
  }, [lessons, level, completedLessonIds]);
  const tasks = useMemo(() => {
    const seed = dailySeed(today, completedLessonIds.length, level);
    const pool = shuffled<LessonData>(eligible, seed).slice(0, Math.min(12, eligible.length));
    const sentencePool: string[] = [...new Set(pool.map((lesson) => lesson.example).filter(Boolean))];
    const meanings: string[] = [...new Set(pool.map((lesson) => lesson.translation).filter(Boolean))];
    const wordPool: LessonWord[] = pool.flatMap((lesson) => lesson.words || []).filter((word) => word.word && word.meaning);
    const selected: Task[] = [];
    const makeOptions = (correct: string, all: string[], taskSeed: number) =>
      shuffled([...new Set([correct, ...all.filter((item) => item !== correct)])], taskSeed).slice(0, 4);
    pool.slice(0, 3).forEach((lesson, index) => {
      const otherMeanings = meanings.filter((item) => item !== lesson.translation);
      selected.push({
        id: "meaning-" + lesson.id, kind: "meaning", prompt: lesson.example,
        answer: lesson.translation, options: makeOptions(lesson.translation, shuffled(otherMeanings, seed + index).slice(0, 3), seed + index + 9),
        note: "معنی را از خود جمله حدس بزن؛ لازم نیست اول ترجمهٔ فارسی را ببینی."
      });
    });
    const sentence = sentencePool[Math.abs(seed) % Math.max(1, sentencePool.length)];
    if (sentence) selected.push({
      id: "sentence-" + seed, kind: "sentence", prompt: "کلمه‌ها را به ترتیب درست مرتب کن.",
      answer: sentence, options: shuffled(sentence.split(/\s+/), seed + 41),
      note: "کلمات را به ترتیب جمله انتخاب کن. نشانه‌گذاری پایانی هم مهم نیست."
    });
    const word = wordPool[Math.abs(seed + 3) % Math.max(1, wordPool.length)];
    if (word) selected.push({
      id: "vocab-" + word.word, kind: "vocabulary", prompt: word.word,
      answer: word.meaning, options: makeOptions(word.meaning, wordPool.filter((item) => item.meaning !== word.meaning).map((item) => item.meaning), seed + 22),
      note: "این واژه را در مثال خودش هم ببین تا فقط ترجمه‌اش را حفظ نکنی."
    });
    return shuffled(selected, seed + completedLessonIds.length).slice(0, 5);
  }, [eligible, today, completedLessonIds.length, level]);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const correctCount = tasks.filter((task) => checked[task.id] && clean(answers[task.id] || "") === clean(task.answer)).length;
  const doneCount = tasks.filter((task) => checked[task.id]).length;
  const speak = (text: string) => {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  };
  const restart = () => { setAnswers({}); setChecked({}); setFinished(false); setShowHelp(false); };

  return <section className="daily-learning panel">
    <div className="daily-learning-head">
      <div><span className="eyebrow">A DAILY PATH THAT KEEPS GOING</span><h2>تمرین روزانهٔ هوشمند</h2><p>هر روز ترکیب تازه‌ای از جمله‌ها و واژگان درس‌ها؛ با پیشرفت تو تمرین‌ها تغییر می‌کنند.</p></div>
      <div className="daily-streak"><strong>{completedLessonIds.length}</strong><span>درس تکمیل‌شده</span></div>
    </div>
    <div className="daily-progress"><span style={{ width: (tasks.length ? doneCount / tasks.length * 100 : 0) + "%" }} /></div>
    <p className="daily-progress-label">{doneCount} از {tasks.length} تمرین بررسی شده · {level} · حدود ۵ دقیقه</p>
    {tasks.map((task, index) => <article className="daily-task" key={task.id}>
      <div className="daily-task-top"><span>تمرین {index + 1}</span><span>{task.kind === "meaning" ? "فهم معنی" : task.kind === "sentence" ? "ساخت جمله" : "واژگان"}</span></div>
      <h3 dir={task.kind === "meaning" || task.kind === "vocabulary" ? "ltr" : "auto"}>{task.prompt}</h3>
      {task.kind === "meaning" && <button className="button button-ghost daily-audio" onClick={() => speak(task.prompt)}>▶ گوش دادن به جمله</button>}
      {task.kind === "sentence" ? <>
        <p className="daily-muted">کلمه‌ها را به ترتیب انتخاب کن. با زدن روی کلمهٔ انتخاب‌شده آن را حذف می‌کنی.</p>
        <div className="daily-built" dir="ltr">{(answers[task.id] || "").split(" ").filter(Boolean).map((word, i) => <button key={i} disabled={!!checked[task.id]} onClick={() => setAnswers((current) => ({ ...current, [task.id]: (current[task.id] || "").split(" ").filter((_, j) => i !== j).join(" ") }))}>{word} ×</button>)}</div>
        <div className="daily-word-bank" dir="ltr">{task.options.map((word, i) => <button key={i} disabled={!!checked[task.id]} onClick={() => setAnswers((current) => ({ ...current, [task.id]: ((current[task.id] || "") + " " + word).trim() }))}>{word}</button>)}</div>
      </> : <div className="daily-options">{task.options.map((option) => <button key={option} disabled={!!checked[task.id]} className={checked[task.id] && clean(option) === clean(task.answer) ? "daily-right" : answers[task.id] === option ? "daily-selected" : ""} onClick={() => setAnswers((current) => ({ ...current, [task.id]: option }))}>{option}</button>)}</div>}
      {!checked[task.id] ? <button className="button button-primary" disabled={!answers[task.id]} onClick={() => setChecked((current) => ({ ...current, [task.id]: true }))}>بررسی پاسخ</button>
        : <div className={"daily-feedback " + (clean(answers[task.id] || "") === clean(task.answer) ? "correct" : "incorrect")}>
          <strong>{clean(answers[task.id] || "") === clean(task.answer) ? "درست است! ادامه بده." : "هنوز نه؛ پاسخ درست را ببین."}</strong>
          <span dir="auto">{task.answer}</span><p>{task.note}</p>
          {task.kind === "meaning" && <button className="text-button" onClick={() => speak(task.prompt)}>دوباره گوش بده 🔊</button>}
        </div>}
    </article>)}
    {doneCount === tasks.length && <div className="daily-finish"><h3>تمرین امروز تمام شد؛ مسیر یادگیری ادامه دارد.</h3><p>نتیجهٔ این دور: {correctCount} از {tasks.length} پاسخ درست. می‌توانی تمرین را دوباره انجام بدهی یا یکی از درس‌ها را عمیق‌تر کار کنی.</p><button className="button button-primary" onClick={restart}>تمرین دوباره</button><button className="button button-ghost" onClick={() => setShowHelp((value) => !value)}>ادامه از یک درس</button>{showHelp && <div className="daily-next-lesson">{lessons.find((lesson) => !completedLessonIds.includes(lesson.id)) ? <><p>پیشنهاد بعدی: {lessons.find((lesson) => !completedLessonIds.includes(lesson.id))?.title}</p><button className="button button-primary" onClick={() => onOpenLesson(lessons.find((lesson) => !completedLessonIds.includes(lesson.id))!.id)}>شروع درس پیشنهادی ←</button></> : <p>همهٔ درس‌های موجود را گذرانده‌ای؛ تمرین روزانه و مرور واژگان همچنان برای حفظ و تقویت زبان ادامه دارد.</p>}</div>}</div>}
  </section>;
}
