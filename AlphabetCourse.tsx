import { useEffect, useMemo, useState } from "react";
import "./AlphabetCourse.css";

type Letter = { upper: string; lower: string; name: string; sound: string; word: string; meaning: string; hint: string };
const letters: Letter[] = [
{upper:"A",lower:"a",name:"اِی",sound:"æ",word:"apple",meaning:"سیب",hint:"صدای کوتاه مثل اولِ apple"},
{upper:"B",lower:"b",name:"بی",sound:"b",word:"book",meaning:"کتاب",hint:"لب‌ها را ببند و با صدا باز کن"},
{upper:"C",lower:"c",name:"سی",sound:"k / s",word:"cat",meaning:"گربه",hint:"در cat صدای ک می‌دهد"},
{upper:"D",lower:"d",name:"دی",sound:"d",word:"dog",meaning:"سگ",hint:"نوک زبان پشت دندان‌های بالا"},
{upper:"E",lower:"e",name:"ای",sound:"e",word:"egg",meaning:"تخم‌مرغ",hint:"صدای کوتاه در egg"},
{upper:"F",lower:"f",name:"اِف",sound:"f",word:"fish",meaning:"ماهی",hint:"لب پایین به دندان‌های بالا نزدیک می‌شود"},
{upper:"G",lower:"g",name:"جی",sound:"g / dʒ",word:"go",meaning:"رفتن",hint:"در go صدای گ می‌دهد"},
{upper:"H",lower:"h",name:"اِیچ",sound:"h",word:"hat",meaning:"کلاه",hint:"هوای آرام از گلو"},
{upper:"I",lower:"i",name:"آی",sound:"ɪ / aɪ",word:"ink",meaning:"جوهر",hint:"در ink صدای کوتاه دارد"},
{upper:"J",lower:"j",name:"جِی",sound:"dʒ",word:"jam",meaning:"مربا",hint:"صدایی شبیه ج"},
{upper:"K",lower:"k",name:"کِی",sound:"k",word:"kite",meaning:"بادبادک",hint:"صدایی شبیه ک"},
{upper:"L",lower:"l",name:"اِل",sound:"l",word:"leg",meaning:"پا",hint:"نوک زبان پشت دندان‌های بالا"},
{upper:"M",lower:"m",name:"اِم",sound:"m",word:"moon",meaning:"ماه",hint:"لب‌ها بسته و صدا از بینی"},
{upper:"N",lower:"n",name:"اِن",sound:"n",word:"nose",meaning:"بینی",hint:"صدا از بینی"},
{upper:"O",lower:"o",name:"اُو",sound:"ɒ / oʊ",word:"orange",meaning:"پرتقال",hint:"صدای آن با کلمه تغییر می‌کند"},
{upper:"P",lower:"p",name:"پی",sound:"p",word:"pen",meaning:"خودکار",hint:"هوای کوتاه با لب‌های بسته"},
{upper:"Q",lower:"q",name:"کیو",sound:"kw",word:"queen",meaning:"ملکه",hint:"معمولاً همراه u می‌آید"},
{upper:"R",lower:"r",name:"آر",sound:"r",word:"red",meaning:"قرمز",hint:"زبان را مثل فارسی نلرزان"},
{upper:"S",lower:"s",name:"اِس",sound:"s",word:"sun",meaning:"خورشید",hint:"صدای س"},
{upper:"T",lower:"t",name:"تی",sound:"t",word:"ten",meaning:"ده",hint:"صدای ت با هوای کوتاه"},
{upper:"U",lower:"u",name:"یو",sound:"ʌ / juː",word:"umbrella",meaning:"چتر",hint:"صدای آن در کلمات متفاوت است"},
{upper:"V",lower:"v",name:"وی",sound:"v",word:"van",meaning:"ون",hint:"دندان‌های بالا به لب پایین می‌رسند"},
{upper:"W",lower:"w",name:"دابلیو",sound:"w",word:"water",meaning:"آب",hint:"لب‌ها گرد می‌شوند"},
{upper:"X",lower:"x",name:"اِکس",sound:"ks / gz",word:"box",meaning:"جعبه",hint:"در پایان box صدای کْس دارد"},
{upper:"Y",lower:"y",name:"وای",sound:"y",word:"yes",meaning:"بله",hint:"صدایی شبیه ی"},
{upper:"Z",lower:"z",name:"زِد / زی",sound:"z",word:"zoo",meaning:"باغ‌وحش",hint:"صدای ز با لرزش گلو"}
];
const STORAGE = "vazheno-alphabet-progress-v1";
const speak = (text: string) => { if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; u.rate = 0.72; window.speechSynthesis.speak(u); } };
export default function AlphabetCourse() {
 const [open,setOpen] = useState(false);
 const [index,setIndex] = useState(0);
 const [done,setDone] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem(STORAGE) || "[]"); } catch { return []; } });
 const [mode,setMode] = useState<"learn"|"quiz">("learn");
 const [answer,setAnswer] = useState("");
 const [checked,setChecked] = useState(false);
 const [quizIndex,setQuizIndex] = useState(0);
 const [quizScore,setQuizScore] = useState(0);
 const [quizFinished,setQuizFinished] = useState(false);
 const current = letters[index];
 const quiz = useMemo(() => [letters[0],letters[1],letters[2],letters[3],letters[4],letters[5],letters[6],letters[7],letters[8],letters[9]],[]);
 const q = quiz[quizIndex];
 useEffect(()=>{localStorage.setItem(STORAGE,JSON.stringify(done));},[done]);
 const markDone = () => setDone(prev=>prev.includes(current.upper)?prev:[...prev,current.upper]);
 const next = () => { markDone(); setIndex(i=>(i+1)%letters.length); setAnswer(""); setChecked(false); };
 return <section className="alphabet-course panel">
  <div className="alphabet-head"><div><span className="eyebrow">ZERO LEVEL · پیش‌نیاز A0</span><h2>شروع از صفر مطلق</h2><p>برای وقتی که هنوز حروف انگلیسی را نمی‌شناسی؛ قدم‌به‌قدم و بدون پیش‌نیاز.</p></div><div className="alphabet-progress"><strong>{done.length}/26</strong><span>حرف تمرین‌شده</span></div></div>
  <div className="alphabet-track"><span style={{width:`${done.length/26*100}%`}} /></div>
  <div className="alphabet-actions"><button className="button button-primary" onClick={()=>setOpen(v=>!v)}>{open?"بستن آموزش":"شروع آموزش الفبا"} ←</button><button className="button button-ghost" onClick={()=>{setOpen(true);setMode("quiz");setQuizIndex(0);setQuizScore(0);setQuizFinished(false);setAnswer("");setChecked(false);}}>تمرین تشخیص حروف</button></div>
  {open && <div className="alphabet-work">
   {mode==="learn" ? <>
    <div className="alphabet-letter-card"><div className="alphabet-glyph">{current.upper}<span>{current.lower}</span></div><div className="alphabet-letter-details"><span className="eyebrow">حرف {index+1} از 26</span><h3>{current.upper} {current.lower}</h3><p><b>نام حرف:</b> {current.name}</p><p><b>صدای رایج:</b> {current.sound}</p><p className="alphabet-hint">{current.hint}</p><div className="alphabet-example"><span>{current.word}</span><b>{current.meaning}</b><button className="button button-ghost" onClick={()=>speak(current.word)} aria-label="شنیدن تلفظ کلمه">🔊 شنیدن کلمه</button><button className="button button-ghost" onClick={()=>speak(current.name)} aria-label="شنیدن نام حرف">🔊 شنیدن نام حرف</button></div></div></div>
    <div className="alphabet-letter-grid">{letters.map((l,i)=><button key={l.upper} className={`alphabet-letter-chip ${i===index?"selected":""} ${done.includes(l.upper)?"complete":""}`} onClick={()=>{setIndex(i);setAnswer("");setChecked(false);}}><b>{l.upper}{l.lower}</b><small>{done.includes(l.upper)?"✓":l.name}</small></button>)}</div>
    <div className="alphabet-footer"><button className="button button-ghost" onClick={()=>{setIndex(i=>Math.max(0,i-1));setAnswer("");setChecked(false);}}>→ قبلی</button><button className="button button-primary" onClick={next}>تمرین کردم؛ حرف بعدی ←</button></div>
   </> : quizFinished ? <div className="alphabet-quiz-result"><h3>آفرین! تمرین تمام شد</h3><p>پاسخ درست: {quizScore} از {quiz.length}</p><button className="button button-primary" onClick={()=>{setMode("learn");setQuizFinished(false);}}>بازگشت به آموزش</button><button className="button button-ghost" onClick={()=>{setQuizIndex(0);setQuizScore(0);setQuizFinished(false);setAnswer("");setChecked(false);}}>تکرار تمرین</button></div> : <div className="alphabet-quiz"><span className="eyebrow">پرسش {quizIndex+1} از {quiz.length}</span><h3>کدام حرف را می‌شنوی؟</h3><button className="alphabet-sound-button" onClick={()=>speak(q.name)}>🔊 پخش صدای نام حرف</button><div className="alphabet-quiz-options">{[q,letters[(quizIndex+7)%26],letters[(quizIndex+15)%26]].sort((a,b)=>a.upper.localeCompare(b.upper)).map(l=><button key={l.upper} className={answer===l.upper?"selected":""} onClick={()=>{if(!checked)setAnswer(l.upper);}}>{l.upper} {l.lower}</button>)}</div>{checked&&<p className={answer===q.upper?"correct":"incorrect"}>{answer===q.upper?"درست است، آفرین!":`پاسخ درست ${q.upper} ${q.lower} است. اشکالی ندارد، دوباره تمرین می‌کنیم.`}</p>}<div className="alphabet-footer">{!checked?<button className="button button-primary" disabled={!answer} onClick={()=>{setChecked(true);if(answer===q.upper)setQuizScore(s=>s+1);}}>بررسی پاسخ</button>:<button className="button button-primary" onClick={()=>{if(quizIndex===quiz.length-1){setQuizFinished(true);}else{setQuizIndex(i=>i+1);setAnswer("");setChecked(false);}}}>{quizIndex===quiz.length-1?"دیدن نتیجه":"سؤال بعدی ←"}</button>}</div></div>}
  </div>}
  <p className="alphabet-note">بعد از الفبا باید صداها و ترکیب حروف را یاد بگیری؛ حفظ نام حروف به‌تنهایی برای خواندن کافی نیست. پیشرفت این بخش روی همین دستگاه ذخیره می‌شود.</p>
 </section>;
}
