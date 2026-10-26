import { useEffect, useMemo, useState } from "react";
import "./SpeakingPractice.css";

type Prompt = { id: string; level: string; title: string; text: string; meaning: string; tip: string };
type RecognitionAlternative = { transcript: string; confidence?: number };
type RecognitionResult = { 0: RecognitionAlternative; isFinal: boolean };
type RecognitionEvent = { results: ArrayLike<RecognitionResult> };
type RecognitionErrorEvent = { error: string };
type RecognitionInstance = {
  lang: string; interimResults: boolean; maxAlternatives: number; continuous: boolean;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void; stop: () => void; abort: () => void;
};
type SpeechWindow = Window & { SpeechRecognition?: new () => RecognitionInstance; webkitSpeechRecognition?: new () => RecognitionInstance };

const PROMPTS: Prompt[] = [
  { id:"a0-1",level:"A0",title:"سلام کردن",text:"Hello, how are you?",meaning:"سلام، حالت چطور است؟",tip:"Hello را واضح بگو و روی کلمهٔ how تأکید ملایم داشته باش." },
  { id:"a0-2",level:"A0",title:"معرفی خود",text:"My name is Pouya.",meaning:"اسم من پویاست.",tip:"کلمات را به هم پیوسته و طبیعی بگو؛ لازم نیست بین هر کلمه مکث طولانی کنی." },
  { id:"a0-3",level:"A0",title:"علاقه‌ها",text:"I like football and music.",meaning:"من فوتبال و موسیقی را دوست دارم.",tip:"صدای پایانی کلمهٔ like را به ابتدای football پیوند بده." },
  { id:"a1-1",level:"A1",title:"برنامهٔ روزانه",text:"I usually get up at seven.",meaning:"من معمولاً ساعت هفت بیدار می‌شوم.",tip:"معمولاً در usually بخش اول واژه پررنگ‌تر است؛ ریتم جمله را حفظ کن." },
  { id:"a1-2",level:"A1",title:"درخواست مودبانه",text:"Could I have a cup of tea, please?",meaning:"ممکن است یک فنجان چای به من بدهید؟",tip:"Could I را روان و پیوسته ادا کن و please را در پایان واضح بگو." },
  { id:"a2-1",level:"A2",title:"برنامهٔ آخر هفته",text:"I'm going to visit my friends this weekend.",meaning:"این آخر هفته قرار است دوستانم را ببینم.",tip:"در گفتار طبیعی I'm going to معمولاً پیوسته شنیده می‌شود." },
  { id:"a2-2",level:"A2",title:"پرسیدن مسیر",text:"Could you tell me how to get to the station?",meaning:"می‌توانید بگویید چطور به ایستگاه بروم؟",tip:"در سؤال مودبانه، جمله را با آهنگ طبیعی و بدون جدا کردن تک‌تک کلمات بگو." },
  { id:"b1-1",level:"B1",title:"تجربهٔ یادگیری",text:"I've been learning English for a few months.",meaning:"چند ماه است که دارم انگلیسی یاد می‌گیرم.",tip:"I've been را پیوسته ادا کن و در پایان جمله آهنگ را طبیعی پایین بیاور." },
  { id:"b1-2",level:"B1",title:"بیان نظر",text:"I think practice is more important than perfection.",meaning:"فکر می‌کنم تمرین از بی‌نقص بودن مهم‌تر است.",tip:"روی واژه‌های مهم جمله تأکید کن و کلمات کوتاه را سبک‌تر بگو." },
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
}
function compareSpeech(target: string, spoken: string) {
  const a = normalize(target).split(" ").filter(Boolean);
  const b = normalize(spoken).split(" ").filter(Boolean);
  if (!a.length || !b.length) return { score: 0, matched: 0, total: a.length };
  const dp = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    dp[i][j] = Math.min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
  }
  const score = Math.max(0, Math.round((1 - dp[a.length][b.length] / Math.max(a.length, b.length)) * 100));
  const matched = a.filter((word, i) => b.includes(word) && b.indexOf(word) >= Math.max(0, i - 1)).length;
  return { score, matched: Math.min(matched, a.length), total: a.length };
}

export default function SpeakingPractice({ onBack }: { onBack?: () => void }) {
  const [level, setLevel] = useState("A0");
  const [index, setIndex] = useState(0);
  const [spoken, setSpoken] = useState("");
  const [status, setStatus] = useState<"idle"|"listening"|"done"|"error">("idle");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [showMeaning, setShowMeaning] = useState(false);
  const [rate, setRate] = useState(0.85);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [completed, setCompleted] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("vazheno-speaking-completed") || "[]"); } catch { return []; } });
  const prompts = useMemo(() => PROMPTS.filter((p) => p.level === level), [level]);
  const prompt = prompts[index] ?? prompts[0];

  useEffect(() => () => {
    const synth = window.speechSynthesis;
    if (synth) synth.cancel();
  }, []);

  const playModel = () => {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      setVoiceMessage("پخش گفتار در این مرورگر پشتیبانی نمی‌شود."); return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(prompt.text);
    utterance.lang = "en-US"; utterance.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.toLowerCase().startsWith("en-us")) || voices.find(v => v.lang.toLowerCase().startsWith("en"));
    if (voice) utterance.voice = voice;
    utterance.onerror = () => setVoiceMessage("پخش صدا ناموفق بود؛ دوباره امتحان کن.");
    utterance.onstart = () => setVoiceMessage("به تلفظ نمونه گوش بده و بعد خودت تکرار کن.");
    utterance.onend = () => setVoiceMessage("حالا نوبت توست؛ دکمهٔ میکروفون را بزن.");
    window.speechSynthesis.speak(utterance);
  };

  const stopRecognition = () => {
    const w = window as SpeechWindow;
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (Recognition) { /* active recognition is stopped through the ref below */ }
  };
  const [recognition, setRecognition] = useState<RecognitionInstance | null>(null);
  const startRecording = () => {
    const w = window as SpeechWindow;
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Recognition) {
      setStatus("error");
      setMessage("این مرورگر تشخیص گفتار را پشتیبانی نمی‌کند. برای این تمرین، آخرین نسخهٔ Google Chrome یا Microsoft Edge را امتحان کن.");
      return;
    }
    try {
      recognition?.abort();
      const instance = new Recognition();
      instance.lang = "en-US"; instance.interimResults = true; instance.maxAlternatives = 3; instance.continuous = false;
      instance.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) transcript += event.results[i][0].transcript + " ";
        setSpoken(transcript.trim());
      };
      instance.onerror = (event) => {
        setStatus("error");
        const errors: Record<string,string> = {
          "not-allowed":"دسترسی میکروفون مسدود است. روی آیکن قفل کنار نشانی سایت بزن و اجازهٔ Microphone را فعال کن.",
          "no-speech":"صدایی تشخیص داده نشد. میکروفون را نزدیک‌تر کن و دوباره امتحان کن.",
          "audio-capture":"میکروفونی پیدا نشد؛ اتصال میکروفون و تنظیمات ویندوز را بررسی کن.",
          "network":"سرویس تشخیص گفتار مرورگر در دسترس نیست. اتصال اینترنت را بررسی کن."
        };
        setMessage(errors[event.error] || `تشخیص گفتار با خطا روبه‌رو شد (${event.error}). دوباره امتحان کن.`);
      };
      instance.onend = () => {
        setStatus((current) => current === "error" ? current : "done");
        setRecognition(null);
      };
      setSpoken(""); setScore(null); setMessage("اگر مرورگر اجازه خواست، دسترسی میکروفون را تأیید کن و جمله را با صدای بلند بگو.");
      setStatus("listening"); setRecognition(instance); instance.start();
    } catch {
      setStatus("error"); setMessage("شروع میکروفون انجام نشد. مطمئن شو سایت با HTTPS باز شده و میکروفون در برنامهٔ دیگری مشغول نیست.");
    }
  };

  const evaluate = () => {
    if (!spoken.trim()) { setMessage("هنوز گفتاری تشخیص داده نشده؛ دوباره با میکروفون تلاش کن."); return; }
    const result = compareSpeech(prompt.text, spoken);
    setScore(result.score); setStatus("done");
    const next = completed.includes(prompt.id) ? completed : [...completed, prompt.id];
    setCompleted(next);
    try { localStorage.setItem("vazheno-speaking-completed", JSON.stringify(next)); } catch { /* storage optional */ }
    setMessage(result.score >= 85 ? "عالی بود! متن تشخیص‌داده‌شده به جملهٔ هدف خیلی نزدیک است." : result.score >= 60 ? "خوبه؛ چند کلمه متفاوت یا جا افتاده‌اند. دوباره گوش بده و تکرار کن." : "یک بار دیگر آهسته گوش بده و جمله را تکه‌تکه تکرار کن.");
  };

  const changeLevel = (next: string) => {
    recognition?.abort(); window.speechSynthesis?.cancel();
    setLevel(next); setIndex(0); setSpoken(""); setScore(null); setStatus("idle"); setMessage(""); setShowMeaning(false); setVoiceMessage("");
  };
  const nextPrompt = () => {
    recognition?.abort();
    setIndex(i => (i + 1) % prompts.length); setSpoken(""); setScore(null); setStatus("idle"); setMessage(""); setShowMeaning(false); setVoiceMessage("");
  };

  return <div className="speaking-page" dir="rtl">
    <header className="speaking-heading">
      <div><span className="speaking-eyebrow">مهارت گفتاری · Speaking</span><h1>بشنو، تکرار کن، بازخورد بگیر 🎙️</h1><p>به نمونه گوش بده، اجازهٔ میکروفون بده و جمله را به انگلیسی تکرار کن.</p></div>
      {onBack && <button className="speaking-back" onClick={onBack}>← بازگشت به مهارت‌ها</button>}
    </header>
    <div className="speaking-stats">
      <div><span>تمرین‌های این سطح</span><strong>{prompts.length}</strong></div>
      <div><span>انجام‌شده</span><strong>{prompts.filter(p => completed.includes(p.id)).length} / {prompts.length}</strong></div>
      <div><span>امتیاز آخر</span><strong>{score === null ? "—" : `${score}%`}</strong></div>
    </div>
    <section className="speaking-panel">
      <div className="speaking-topline"><div><span className="speaking-label">سطح تمرین</span><div className="speaking-levels">{["A0","A1","A2","B1"].map(l => <button key={l} className={level === l ? "active" : ""} onClick={() => changeLevel(l)}>{l}</button>)}</div></div><span className="speaking-counter">تمرین {index + 1} از {prompts.length}</span></div>
      <div className="speaking-progress"><span style={{width:`${(index+1)/prompts.length*100}%`}} /></div>
      <span className="speaking-label">جملهٔ امروز</span><h2>{prompt.title}</h2>
      <div className="speaking-model"><span className="speaking-wave">♫</span><div><strong>۱. اول به تلفظ نمونه گوش بده</strong><p>می‌توانی سرعت پخش را تغییر بدهی.</p></div><button onClick={playModel}>▶ پخش نمونه</button><select aria-label="سرعت پخش نمونه" value={rate} onChange={e=>setRate(Number(e.target.value))}><option value={0.65}>خیلی آرام</option><option value={0.85}>آرام</option><option value={1}>عادی</option></select></div>
      {voiceMessage && <p className="speaking-muted">{voiceMessage}</p>}
      <button className="speaking-meaning-toggle" onClick={()=>setShowMeaning(v=>!v)}>{showMeaning ? "پنهان کردن جمله" : "نمایش جمله و معنی"}</button>
      {showMeaning && <div className="speaking-transcript"><p dir="ltr">{prompt.text}</p><p>{prompt.meaning}</p></div>}
      <div className="speaking-record">
        <div className="speaking-mic-icon">{status === "listening" ? "●" : "🎙️"}</div>
        <h3>۲. حالا تو تکرار کن</h3><p>دکمه را بزن، اجازهٔ میکروفون را تأیید کن و جمله را واضح بگو.</p>
        <button className={status === "listening" ? "speaking-mic is-listening" : "speaking-mic"} onClick={status === "listening" ? () => recognition?.stop() : startRecording}>{status === "listening" ? "■ توقف ضبط" : "🎙️ شروع با میکروفون"}</button>
        {status === "listening" && <span className="speaking-listening-indicator">در حال گوش‌دادن… بعد از گفتن جمله، چند لحظه صبر کن.</span>}
        {spoken && <div className="speaking-recognized"><span>متنی که مرورگر شنیده:</span><p dir="ltr">{spoken}</p></div>}
        {message && <p className={status === "error" ? "speaking-error" : "speaking-message"} role="status">{message}</p>}
        {status !== "listening" && spoken && <button className="speaking-evaluate" onClick={evaluate}>بررسی شباهت گفتار</button>}
      </div>
      {score !== null && <div className="speaking-result"><div className="speaking-score-ring"><strong>{score}%</strong><span>شباهت متن</span></div><div><h3>{score >= 85 ? "خیلی خوب!" : score >= 60 ? "خوب است؛ یک بار دیگر تمرین کن" : "دوباره امتحان کن"}</h3><p>این امتیاز از مقایسهٔ متن تشخیص‌داده‌شده با جملهٔ هدف محاسبه شده است؛ ارزیابی دقیق آواها یا لهجه نیست.</p><strong>نکتهٔ تلفظ:</strong><p>{prompt.tip}</p></div></div>}
      <div className="speaking-actions"><button onClick={nextPrompt}>تمرین بعدی ←</button><button onClick={()=>{setSpoken("");setScore(null);setStatus("idle");setMessage("");setVoiceMessage("");}}>شروع دوباره</button></div>
    </section>
    <p className="speaking-disclaimer">محدودیت مهم: مرورگر صدای تو را به متن تبدیل می‌کند و میزان شباهت متن را می‌سنجد؛ این نسخه هنوز موج صدا، واج‌ها یا کیفیت لهجه را مستقیماً تحلیل نمی‌کند. تشخیص گفتار ممکن است در بعضی مرورگرها به سرویس آنلاین مرورگر وابسته باشد. صدا در این برنامه ضبط و ذخیره نمی‌شود؛ فقط متن تشخیص‌داده‌شده و تعداد تمرین‌ها در همین مرورگر می‌ماند.</p>
  </div>;
}
