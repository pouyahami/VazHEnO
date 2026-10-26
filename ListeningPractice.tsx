import { useEffect, useMemo, useState } from "react";
import "./ListeningPractice.css";

type Level = "A0" | "A1" | "A2" | "B1";
type Exercise = {
  id: string;
  level: Level;
  title: string;
  audioText: string;
  translation: string;
  question: string;
  options: string[];
  answer: string;
  hint: string;
};

const EXERCISES: Exercise[] = [
  { id: "a0-1", level: "A0", title: "سلام و احوال‌پرسی", audioText: "Hello! My name is Anna. What is your name?", translation: "سلام! اسم من آناست. اسم تو چیست؟", question: "اسم گوینده چیست؟", options: ["Emma", "Anna", "Sara", "Mary"], answer: "Anna", hint: "به جملهٔ اول و عبارت My name is گوش کن." },
  { id: "a0-2", level: "A0", title: "معرفی خود", audioText: "I am twenty years old. I live in London.", translation: "من بیست سال دارم. در لندن زندگی می‌کنم.", question: "گوینده کجا زندگی می‌کند؟", options: ["London", "Paris", "Rome", "Berlin"], answer: "London", hint: "به جملهٔ دوم توجه کن." },
  { id: "a0-3", level: "A0", title: "چیزهای روزمره", audioText: "I like apples, but I don't like bananas.", translation: "من سیب دوست دارم، اما موز دوست ندارم.", question: "گوینده چه چیزی را دوست دارد؟", options: ["Bananas", "Oranges", "Apples", "Grapes"], answer: "Apples", hint: "به کلمهٔ بعد از I like گوش بده." },
  { id: "a1-1", level: "A1", title: "برنامهٔ روزانه", audioText: "I usually get up at seven. I have breakfast, and then I walk to school.", translation: "من معمولاً ساعت هفت بیدار می‌شوم. صبحانه می‌خورم و بعد پیاده به مدرسه می‌روم.", question: "او معمولاً چه ساعتی بیدار می‌شود؟", options: ["At six", "At seven", "At eight", "At nine"], answer: "At seven", hint: "زمان را در جملهٔ اول می‌گوید." },
  { id: "a1-2", level: "A1", title: "در کافه", audioText: "Good morning. Can I have a cup of tea and a cheese sandwich, please?", translation: "صبح بخیر. ممکن است یک فنجان چای و یک ساندویچ پنیر داشته باشم؟", question: "گوینده چه نوشیدنی‌ای سفارش می‌دهد؟", options: ["Coffee", "Water", "Juice", "Tea"], answer: "Tea", hint: "به چیزی که بعد از a cup of می‌آید دقت کن." },
  { id: "a1-3", level: "A1", title: "آخر هفته", audioText: "On Saturday, I visit my grandparents. We cook lunch and watch a movie together.", translation: "شنبه به دیدن پدربزرگ و مادربزرگم می‌روم. با هم ناهار می‌پزیم و فیلم می‌بینیم.", question: "گوینده روز شنبه چه کسانی را می‌بیند؟", options: ["Friends", "Teachers", "Grandparents", "Neighbours"], answer: "Grandparents", hint: "به بخش visit my ... گوش کن." },
  { id: "a2-1", level: "A2", title: "قرار ملاقات", audioText: "Hi Tom, our meeting has moved from ten thirty to eleven fifteen because the manager is late.", translation: "سلام تام، جلسهٔ ما از ساعت ده‌ونیم به یازده‌وپانزده منتقل شده، چون مدیر دیر می‌رسد.", question: "جلسه در چه ساعتی برگزار می‌شود؟", options: ["10:15", "10:30", "11:00", "11:15"], answer: "11:15", hint: "زمان جدید بعد از عبارت moved to می‌آید." },
  { id: "a2-2", level: "A2", title: "مسیر پرسیدن", audioText: "Go straight ahead for two blocks, then turn left at the pharmacy. The station is next to the bank.", translation: "دو بلوک مستقیم برو، سپس کنار داروخانه به چپ بپیچ. ایستگاه کنار بانک است.", question: "ایستگاه کنار کجاست؟", options: ["The school", "The bank", "The park", "The hotel"], answer: "The bank", hint: "به جملهٔ آخر گوش کن." },
  { id: "a2-3", level: "A2", title: "خرید لباس", audioText: "I tried on the blue jacket, but it was too expensive. The black one was cheaper, so I bought it.", translation: "کاپشن آبی را پرو کردم، اما خیلی گران بود. مدل مشکی ارزان‌تر بود، پس آن را خریدم.", question: "گوینده کدام کاپشن را خرید؟", options: ["The blue one", "The black one", "Both jackets", "Neither jacket"], answer: "The black one", hint: "به چیزی که بعد از so I bought it می‌آید توجه کن." },
  { id: "b1-1", level: "B1", title: "تغییر برنامه", audioText: "I was planning to take the train, but heavy rain has delayed several services. I'll drive instead, although parking may be difficult.", translation: "قصد داشتم با قطار بروم، اما باران شدید چند سرویس را به تأخیر انداخته است. در عوض با ماشین می‌روم، هرچند پارک کردن ممکن است دشوار باشد.", question: "چرا گوینده تصمیم گرفته با ماشین برود؟", options: ["The train is too expensive", "The weather has delayed trains", "The car is faster every day", "The station is closed"], answer: "The weather has delayed trains", hint: "دلیل تغییر برنامه را بعد از but می‌شنوی." },
  { id: "b1-2", level: "B1", title: "یادگیری زبان", audioText: "When I started learning English, I tried to memorize every word. I made faster progress after I began reading short stories and using new words in conversation.", translation: "وقتی یادگیری انگلیسی را شروع کردم، سعی می‌کردم همهٔ واژه‌ها را حفظ کنم. بعد از شروع خواندن داستان‌های کوتاه و استفاده از واژه‌های جدید در مکالمه، سریع‌تر پیشرفت کردم.", question: "چه چیزی به پیشرفت سریع‌تر گوینده کمک کرد؟", options: ["Memorizing longer lists", "Taking fewer lessons", "Reading stories and using words", "Watching films without subtitles"], answer: "Reading stories and using words", hint: "به کاری که بعد از after انجام داده گوش کن." },
  { id: "b1-3", level: "B1", title: "پیشنهاد کاری", audioText: "The position offers flexible hours and an opportunity to work from home twice a week. However, applicants must have at least three years of experience.", translation: "این موقعیت ساعات کاری منعطف و امکان دورکاری دو روز در هفته را فراهم می‌کند. بااین‌حال، متقاضیان باید دست‌کم سه سال سابقه داشته باشند.", question: "کدام شرط برای متقاضیان لازم است؟", options: ["A university degree in design", "Five years of experience", "Three years of experience", "Working every weekend"], answer: "Three years of experience", hint: "شرط لازم در جملهٔ دوم آمده است." },
];

const LEVELS: { value: Level; label: string }[] = [
  { value: "A0", label: "شروع از صفر" },
  { value: "A1", label: "مقدماتی" },
  { value: "A2", label: "پیش‌مقدماتی" },
  { value: "B1", label: "متوسط" },
];

type Props = { onBack?: () => void };

export default function ListeningPractice({ onBack }: Props) {
  const [level, setLevel] = useState<Level>("A0");
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState("");
  const [checked, setChecked] = useState(false);
  const [showText, setShowText] = useState(false);
  const [rate, setRate] = useState(0.85);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("vazheno-listening-completed") || "[]"); }
    catch { return []; }
  });
  const [score, setScore] = useState(0);
  const [voiceMessage, setVoiceMessage] = useState("");
  const exercises = useMemo(() => EXERCISES.filter((item) => item.level === level), [level]);
  const exercise = exercises[index] ?? exercises[0];

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const playAudio = () => {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      setVoiceMessage("مرورگر شما پخش گفتار را پشتیبانی نمی‌کند. می‌توانی متن انگلیسی را از بخش «نمایش متن» ببینی.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(exercise.audioText);
    utterance.lang = "en-US";
    utterance.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("en-us")) || voices.find((voice) => voice.lang.toLowerCase().startsWith("en"));
    if (englishVoice) utterance.voice = englishVoice;
    utterance.onstart = () => setVoiceMessage(englishVoice ? "در حال پخش با صدای انگلیسی مرورگر…" : "در حال پخش؛ صدای در دسترس مرورگر استفاده می‌شود.");
    utterance.onerror = () => setVoiceMessage("پخش صدا انجام نشد. دوباره تلاش کن یا متن را ببین.");
    utterance.onend = () => setVoiceMessage("پخش تمام شد؛ دوباره گوش بده یا به سؤال پاسخ بده.");
    window.speechSynthesis.speak(utterance);
  };

  const changeLevel = (next: Level) => {
    window.speechSynthesis?.cancel();
    setLevel(next); setIndex(0); setChoice(""); setChecked(false); setShowText(false); setVoiceMessage("");
  };

  const checkAnswer = () => {
    if (!choice || checked) return;
    setChecked(true);
    const correct = choice === exercise.answer;
    if (correct) setScore((value) => value + 1);
    const nextCompleted = completed.includes(exercise.id) ? completed : [...completed, exercise.id];
    setCompleted(nextCompleted);
    try { localStorage.setItem("vazheno-listening-completed", JSON.stringify(nextCompleted)); } catch { /* storage is optional */ }
  };

  const nextExercise = () => {
    setIndex((value) => (value + 1) % exercises.length);
    setChoice(""); setChecked(false); setShowText(false); setVoiceMessage("");
  };

  return (
    <div className="listening-page" dir="rtl">
      <div className="listening-heading">
        <div><span className="listening-eyebrow">مهارت شنیداری · Listening</span><h1>گوش کن، بفهم، پیشرفت کن 🎧</h1><p>اول به انگلیسی گوش بده، بعد به سؤال جواب بده. متن و ترجمه را می‌توانی در پایان بررسی کنی.</p></div>
        {onBack && <button className="listening-back" onClick={onBack}>← بازگشت به مهارت‌ها</button>}
      </div>

      <div className="listening-stats">
        <div><span>تمرین‌های این سطح</span><strong>{exercises.length}</strong></div>
        <div><span>تمرین‌های انجام‌شده</span><strong>{exercises.filter((item) => completed.includes(item.id)).length} / {exercises.length}</strong></div>
        <div><span>پاسخ درست در این نشست</span><strong>{score}</strong></div>
      </div>

      <section className="listening-panel">
        <div className="listening-level-row"><div><span className="listening-label">سطح تمرین</span><div className="listening-levels">{LEVELS.map((item) => <button key={item.value} className={level === item.value ? "active" : ""} onClick={() => changeLevel(item.value)}>{item.value}<small>{item.label}</small></button>)}</div></div><span className="listening-count">تمرین {index + 1} از {exercises.length}</span></div>
        <div className="listening-progress"><span style={{ width: `${((index + 1) / exercises.length) * 100}%` }} /></div>
        <div className="listening-exercise-title"><span className="listening-sound-icon">♫</span><div><span className="listening-label">تمرین شنیداری</span><h2>{exercise.title}</h2></div></div>
        <p className="listening-instruction">تا جایی که می‌توانی بدون دیدن متن گوش بده. برای فهم بهتر می‌توانی چند بار پخش کنی.</p>
        <div className="listening-player">
          <button className="listening-play" onClick={playAudio}><span>▶</span> پخش صدا</button>
          <button className="listening-replay" onClick={playAudio}>↻ پخش دوباره</button>
          <label>سرعت پخش <select value={rate} onChange={(event) => setRate(Number(event.target.value))}><option value={0.65}>خیلی آرام</option><option value={0.85}>آرام</option><option value={1}>عادی</option><option value={1.15}>کمی سریع‌تر</option></select></label>
        </div>
        {voiceMessage && <p className="listening-voice-message" role="status">{voiceMessage}</p>}
        <div className="listening-text-actions"><button onClick={() => setShowText((value) => !value)}>{showText ? "پنهان کردن متن" : "نمایش متن و ترجمه"}</button><span>پیشنهاد: اول گوش بده، بعد متن را باز کن.</span></div>
        {showText && <div className="listening-transcript"><span>متن انگلیسی</span><p dir="ltr">{exercise.audioText}</p><span>ترجمهٔ فارسی</span><p>{exercise.translation}</p></div>}
        <div className="listening-question"><span className="listening-label">درک مطلب</span><h3>{exercise.question}</h3><div className="listening-options">{exercise.options.map((option) => <button key={option} disabled={checked} className={checked && option === exercise.answer ? "correct" : checked && option === choice ? "incorrect" : choice === option ? "selected" : ""} onClick={() => setChoice(option)}>{option}{checked && option === exercise.answer && <span> ✓</span>}</button>)}</div>
          {checked && <div className={choice === exercise.answer ? "listening-feedback correct-feedback" : "listening-feedback wrong-feedback"}><strong>{choice === exercise.answer ? "آفرین! پاسخ درست است." : `پاسخ درست: ${exercise.answer}`}</strong><p>{exercise.hint}</p></div>}
          <div className="listening-footer-actions"><button className="listening-check" onClick={checkAnswer} disabled={!choice || checked}>بررسی پاسخ</button><button className="listening-next" onClick={nextExercise}>{checked ? "تمرین بعدی ←" : "رد شدن از این تمرین ←"}</button></div>
        </div>
      </section>
      <p className="listening-disclaimer">نکته: فعلاً صدا به‌صورت گفتار مصنوعی مرورگر ساخته می‌شود، نه فایل ضبط‌شدهٔ گویندهٔ بومی. کیفیت و صدای انگلیسی به مرورگر و صداهای نصب‌شده روی دستگاه بستگی دارد.</p>
    </div>
  );
}
