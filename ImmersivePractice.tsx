import { useMemo, useState } from "react";
import "./ImmersivePractice.css";

type Props = { title: string; category: string; example: string; translation: string };

const distractors = [
  "من هر روز به مدرسه می‌روم.",
  "او یک فنجان چای می‌خواهد.",
  "دیروز هوا بارانی بود.",
  "آن‌ها در خانه هستند.",
  "من هنوز این فیلم را ندیده‌ام.",
];

function sceneFor(title: string, category: string) {
  const value = (title + " " + category).toLowerCase();
  if (/سلام|معرفی|name|greet/.test(value)) return { emoji: "👋 🧑", label: "A first conversation" };
  if (/غذا|کافه|خرید|food|cafe|shop|restaurant/.test(value)) return { emoji: "☕ 🥪 🛍️", label: "Everyday life" };
  if (/خانواده|دوست|family|friend/.test(value)) return { emoji: "👨‍👩‍👧‍👦 💬", label: "People and relationships" };
  if (/مسیر|سفر|راه|travel|direction/.test(value)) return { emoji: "🗺️ 🚶", label: "Out in the world" };
  if (/زمان|روزانه|عادت|time|daily|present/.test(value)) return { emoji: "⏰ 🏃", label: "A daily routine" };
  if (/کار|شغل|job|work|meeting/.test(value)) return { emoji: "💼 🗣️", label: "At work" };
  if (/احساس|حال|صفت|feel|emotion/.test(value)) return { emoji: "🙂 💭", label: "Feelings and descriptions" };
  return { emoji: "🌍 💬", label: "English in context" };
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim();
}

export default function ImmersivePractice({ title, category, example, translation }: Props) {
  const scene = useMemo(() => sceneFor(title, category), [title, category]);
  const words = useMemo(() => {
    const list = example.trim().split(/\s+/);
    if (list.length < 2) return list;
    const rotated = [...list.slice(1), list[0]];
    return rotated.every((word, i) => word === list[i]) ? [...list].reverse() : rotated;
  }, [example]);
  const choices = useMemo(() => {
    const options = [translation, ...distractors.filter((item) => item !== translation).slice(0, 3)];
    return options.sort((a, b) => a.localeCompare(b, "fa"));
  }, [translation]);
  const [chosen, setChosen] = useState("");
  const [matched, setMatched] = useState(false);
  const [built, setBuilt] = useState<string[]>([]);
  const [buildChecked, setBuildChecked] = useState(false);
  const [hint, setHint] = useState("");
  const [rate, setRate] = useState(0.82);

  const play = () => {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      setHint("مرورگر شما پخش گفتار را پشتیبانی نمی‌کند؛ متن انگلیسی را بخوان و با صدای بلند تکرار کن.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(example);
    utterance.lang = "en-US";
    utterance.rate = rate;
    const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("en-us"))
      || window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("en"));
    if (voice) utterance.voice = voice;
    utterance.onend = () => setHint("حالا جمله را بدون نگاه کردن تکرار کن؛ بعد یک بار دیگر گوش بده.");
    utterance.onerror = () => setHint("پخش صدا انجام نشد. می‌توانی جمله را بخوانی و تکرار کنی.");
    window.speechSynthesis.speak(utterance);
    setHint("گوش بده و سعی کن معنی را از موقعیت و جمله بفهمی.");
  };

  const addWord = (word: string, index: number) => {
    if (buildChecked) return;
    setBuilt((current) => [...current, word]);
    setHint("");
  };
  const builtCorrectly = normalize(built.join(" ")) === normalize(example);
  const reset = () => {
    setChosen(""); setMatched(false); setBuilt([]); setBuildChecked(false); setHint("");
  };

  return <section className="immersive-practice panel" aria-label="تمرین غوطه‌ورانه">
    <div className="immersive-header">
      <span className="eyebrow">VAZHENO METHOD · LEARN IN CONTEXT</span>
      <h3>اول ببین، گوش بده، معنی را کشف کن</h3>
      <p>به‌جای حفظ کردنِ تنها، جمله را در یک موقعیت به کار ببر؛ پاسخ را بررسی کن و سپس خودت جمله را بساز.</p>
    </div>
    <div className="immersive-scene">
      <div className="immersive-illustration" aria-hidden="true">{scene.emoji}</div>
      <div><span>{scene.label}</span><h4>{title}</h4><p>مرحلهٔ ۱ از ۳ · به جمله گوش بده</p></div>
      <button className="button button-primary" onClick={play}>▶ گوش دادن</button>
      <label className="immersive-speed">سرعت <select value={rate} onChange={(event) => setRate(Number(event.target.value))}><option value={0.65}>خیلی آرام</option><option value={0.82}>آرام</option><option value={1}>عادی</option></select></label>
    </div>
    {hint && <p className="immersive-hint" role="status">{hint}</p>}
    <div className="immersive-stage">
      <span className="immersive-step">۰۱ · فهم از بافت</span>
      <h4>کدام معنی با جمله‌ای که شنیدی هماهنگ است؟</h4>
      <div className="immersive-choices">{choices.map((option) => <button key={option} disabled={matched} className={matched && option === translation ? "is-correct" : matched && option === chosen ? "is-wrong" : chosen === option ? "is-selected" : ""} onClick={() => setChosen(option)}>{option}</button>)}</div>
      <button className="button button-ghost" disabled={!chosen || matched} onClick={() => setMatched(true)}>بررسی معنی</button>
      {matched && <p className={chosen === translation ? "immersive-result good" : "immersive-result"}>{chosen === translation ? "درست است! معنی را از جمله تشخیص دادی." : "این بار معنی درست را ببین و جملهٔ انگلیسی را دوباره گوش بده."} <strong>{translation}</strong></p>}
    </div>
    <div className="immersive-stage">
      <span className="immersive-step">۰۲ · ساختن فعال</span>
      <h4>کلمه‌ها را به ترتیب درست بچین</h4>
      <p className="immersive-muted">هر کلمه را انتخاب کن؛ برای حذف کلمه از جملهٔ ساخته‌شده روی آن بزن.</p>
      <div className="immersive-built" dir="ltr">{built.length ? built.map((word, index) => <button key={index} onClick={() => { if (!buildChecked) setBuilt((current) => current.filter((_, i) => i !== index)); }}>{word} ×</button>) : <span>جمله را اینجا بساز…</span>}</div>
      <div className="immersive-word-bank" dir="ltr">{words.map((word, index) => <button key={index} disabled={buildChecked} onClick={() => addWord(word, index)}>{word}</button>)}</div>
      <div className="immersive-actions"><button className="button button-primary" disabled={!built.length || buildChecked} onClick={() => setBuildChecked(true)}>بررسی جمله</button><button className="button button-ghost" onClick={reset}>شروع دوباره</button></div>
      {buildChecked && <p className={builtCorrectly ? "immersive-result good" : "immersive-result"}>{builtCorrectly ? "عالی! جمله را درست ساختی." : "ترتیب هنوز درست نیست. یک بار دیگر گوش بده و دوباره بساز."} <strong dir="ltr">{example}</strong></p>}
    </div>
    <div className="immersive-stage immersive-speak">
      <span className="immersive-step">۰۳ · خروجی گفتاری</span>
      <h4>حالا بدون نگاه کردن بگو</h4>
      <p>جمله را با صدای بلند تکرار کن. برای سنجش گفتار با تشخیص گفتار مرورگر، بخش «بازخورد گفتار» را باز کن.</p>
    </div>
  </section>;
}
