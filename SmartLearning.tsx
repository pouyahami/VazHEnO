import { useEffect, useMemo, useState } from "react";
import "./SmartLearning.css";

type Level = "A0" | "A1" | "A2" | "B1" | "B2" | "C1";
type Word = { word: string; meaning: string; example: string };
type Lesson = {
  id: string; level: string; title: string; example: string; translation: string;
  question: string; options: string[]; answer: string; feedback?: string;
  words?: Word[];
};
type Props = { lessons: Lesson[]; currentLevel: string; onLevelChange: (level: Level) => void };
type Rating = "again" | "hard" | "good" | "easy";
type Card = { id: string; prompt: string; answer: string; example: string; level: string; kind: "word" | "sentence"; due: number; interval: number; ease: number; reps: number; lapses: number; lastRating?: Rating };
type ReviewData = { cards: Card[]; answers: number; correct: number; placementLevel?: Level; placementDate?: string };
const STORE = "vazheno-smart-learning-v1";
const DAY = 86400000;

const questionBank: { level: Level; q: string; options: [string,string,string,string]; answer: number; why: string }[] = [
  {level:"A0",q:"کدام جمله یعنی «من دانشجو هستم»؟",options:["I student.","I am a student.","I is student.","Me am student."],answer:1,why:"برای معرفی با اسم، I am + اسم به کار می‌رود."},
  {level:"A0",q:"جای خالی را پر کن: She ___ happy.",options:["am","are","is","be"],answer:2,why:"با She از is استفاده می‌کنیم."},
  {level:"A0",q:"معنی Hello چیست؟",options:["خداحافظ","سلام","متشکرم","شب‌بخیر"],answer:1,why:"Hello برای سلام کردن است."},
  {level:"A0",q:"کدام ضمیر برای چند نفر است؟",options:["He","It","She","They"],answer:3,why:"They به معنی آن‌هاست."},
  {level:"A0",q:"جملهٔ درست را انتخاب کن.",options:["You are ready.","You is ready.","You am ready.","You be ready."],answer:0,why:"با You از are استفاده می‌شود."},
  {level:"A0",q:"معنی book چیست؟",options:["میز","خانه","کتاب","مدرسه"],answer:2,why:"Book یعنی کتاب."},
  {level:"A1",q:"My brother ___ football every week.",options:["play","plays","playing","is play"],answer:1,why:"در حال ساده، سوم‌شخص مفرد معمولاً s می‌گیرد."},
  {level:"A1",q:"___ you like coffee?",options:["Are","Does","Do","Is"],answer:2,why:"برای سؤال حال ساده با you از Do استفاده می‌کنیم."},
  {level:"A1",q:"Yesterday, we ___ home.",options:["go","gone","went","going"],answer:2,why:"گذشتهٔ سادهٔ go، went است."},
  {level:"A1",q:"There ___ two chairs in the room.",options:["is","are","am","be"],answer:1,why:"برای اسم جمع از are استفاده می‌شود."},
  {level:"A1",q:"کدام جمله دربارهٔ کاری در حال انجام است؟",options:["I read every day.","I am reading now.","I reads now.","I reading now."],answer:1,why:"حال استمراری با am/is/are + فعل ing ساخته می‌شود."},
  {level:"A1",q:"جمع child چیست؟",options:["childs","childes","children","childrens"],answer:2,why:"Children جمع بی‌قاعدهٔ child است."},
  {level:"A2",q:"She has ___ her homework.",options:["finish","finished","finishing","finishes"],answer:1,why:"حال کامل با have/has و قسمت سوم فعل ساخته می‌شود."},
  {level:"A2",q:"This bag is ___ than that one.",options:["cheap","cheapest","cheaper","more cheap"],answer:2,why:"شکل مقایسه‌ای cheap، کلمهٔ cheaper است."},
  {level:"A2",q:"You ___ see a doctor if you feel worse.",options:["should","would to","are","has"],answer:0,why:"برای توصیه از should + فعل پایه استفاده می‌کنیم."},
  {level:"A2",q:"We ___ visit our aunt tomorrow; we bought tickets.",options:["are going to","going","are go","will to"],answer:0,why:"ساختار قصد قبلی am/is/are going to + فعل پایه است."},
  {level:"A2",q:"I have lived here ___ 2020.",options:["for","since","during","from"],answer:1,why:"Since نقطهٔ شروع زمان را نشان می‌دهد."},
  {level:"A2",q:"معنی carefully چیست؟",options:["با دقت","به‌ندرت","ناگهان","تقریباً"],answer:0,why:"Carefully یعنی با دقت."},
  {level:"B1",q:"If it rains, we ___ at home.",options:["stayed","would stayed","will stay","stay yesterday"],answer:2,why:"در شرطی نوع اول، نتیجه معمولاً با will + فعل پایه می‌آید."},
  {level:"B1",q:"The woman ___ lives next door is a doctor.",options:["which","who","where","whose"],answer:1,why:"Who برای اشاره به افراد به کار می‌رود."},
  {level:"B1",q:"By the time I arrived, the film ___.",options:["starts","has started","had started","starting"],answer:2,why:"گذشتهٔ کامل رویداد زودتر از رویداد دیگر در گذشته را نشان می‌دهد."},
  {level:"B1",q:"He asked me where I ___.",options:["live","lived","do live","am live"],answer:1,why:"در نقل‌قول غیرمستقیم با فعل گذشته، زمان اغلب یک مرحله به گذشته می‌رود."},
  {level:"B1",q:"I’m interested ___ learning languages.",options:["on","at","in","for"],answer:2,why:"ترکیب درست interested in است."},
  {level:"B1",q:"کدام واژه نزدیک‌ترین معنی به reliable دارد؟",options:["قابل اعتماد","پر سر و صدا","موقت","مبهم"],answer:0,why:"Reliable یعنی قابل اعتماد."},
  {level:"B2",q:"If I had known, I ___ you.",options:["would tell","would have told","will tell","told"],answer:1,why:"شرطی نوع سوم از would have + قسمت سوم استفاده می‌کند."},
  {level:"B2",q:"The report ___ by the team last week.",options:["wrote","was written","has writing","is write"],answer:1,why:"مجهول گذشته با was/were + قسمت سوم ساخته می‌شود."},
  {level:"B2",q:"Rarely ___ such a beautiful view.",options:["I have seen","have I seen","I saw have","seen I have"],answer:1,why:"پس از Rarely در ابتدای جملهٔ رسمی، وارونگی فعل کمکی و فاعل رخ می‌دهد."},
  {level:"B2",q:"Despite ___ tired, she continued working.",options:["be","was","being","to be"],answer:2,why:"پس از despite، اسم یا شکل ing فعل می‌آید."},
  {level:"B2",q:"The findings are broadly ___ with earlier research.",options:["consistent","consistency","consist","consistently"],answer:0,why:"پس از are broadly به صفت consistent نیاز داریم."},
  {level:"B2",q:"معنی reluctant چیست؟",options:["مشتاق","بی‌میل","مطمئن","سخاوتمند"],answer:1,why:"Reluctant یعنی بی‌میل یا مردد."},
  {level:"C1",q:"Had I known about the delay, I ___ earlier.",options:["would leave","will have left","would have left","left"],answer:2,why:"وارونگی Had I known معادل If I had known است و نتیجهٔ گذشته با would have می‌آید."},
  {level:"C1",q:"The proposal was rejected, ___ its apparent merits.",options:["notwithstanding","whereas","unless","thereby"],answer:0,why:"Notwithstanding به معنی با وجودِ است و بافت جمله را کامل می‌کند."},
  {level:"C1",q:"Her argument is persuasive, but it rests on a ___ assumption.",options:["tenuous","tenuously","tenuity","tenure"],answer:0,why:"پیش از اسم assumption به صفت tenuous نیاز داریم."},
  {level:"C1",q:"The new policy may ___ unintended consequences.",options:["entail","enclose","evoke","elude"],answer:0,why:"Entail یعنی در پی داشتن یا مستلزم بودن."},
  {level:"C1",q:"Which phrase means “to make an idea seem less important”?",options:["play down","bring about","put up with","come across"],answer:0,why:"Play down یعنی کم‌اهمیت جلوه دادن."},
  {level:"C1",q:"His explanation was so ___ that few people could follow it.",options:["lucid","convoluted","succinct","straightforward"],answer:1,why:"Convoluted یعنی پیچیده و دشوار برای دنبال کردن."}
];

function clean(s: string) { return s.toLowerCase().replace(/[^a-z0-9' ]/g,"").replace(/\s+/g," ").trim(); }
function levelFromScore(score: number): Level { if(score < 5) return "A0"; if(score < 11) return "A1"; if(score < 17) return "A2"; if(score < 23) return "B1"; if(score < 29) return "B2"; return "C1"; }
function loadReview(): ReviewData {
  try { const raw=localStorage.getItem(STORE); if(raw) return JSON.parse(raw) as ReviewData; } catch {}
  return {cards:[],answers:0,correct:0};
}
function seedCards(lessons: Lesson[], existing: Card[]): Card[] {
  const known = new Set(existing.map(c=>c.id));
  const fresh: Card[] = [];
  lessons.forEach(lesson => {
    (lesson.words ?? []).forEach(w => {
      const id = "word:"+w.word.toLowerCase();
      if(!known.has(id) && w.word && w.meaning) fresh.push({id,prompt:w.word,answer:w.meaning,example:w.example || lesson.example,level:lesson.level,kind:"word",due:Date.now(),interval:0,ease:2.5,reps:0,lapses:0});
    });
    const id = "sentence:"+lesson.id;
    if(!known.has(id) && lesson.example && lesson.translation) fresh.push({id,prompt:lesson.translation,answer:lesson.example,example:lesson.title,level:lesson.level,kind:"sentence",due:Date.now(),interval:0,ease:2.5,reps:0,lapses:0});
  });
  return [...existing,...fresh];
}
function nextCard(card: Card, rating: Rating): Card {
  let reps=card.reps, interval=card.interval, ease=card.ease, lapses=card.lapses;
  if(rating==="again"){ reps=0; interval=0; lapses++; ease=Math.max(1.3,ease-0.2); }
  if(rating==="hard"){ interval=Math.max(1,Math.round((interval||1)*1.2)); ease=Math.max(1.3,ease-0.15); reps++; }
  if(rating==="good"){ interval=reps===0?1:reps===1?3:Math.max(4,Math.round(interval*ease)); reps++; }
  if(rating==="easy"){ interval=reps===0?3:Math.max(5,Math.round((interval||3)*ease*1.3)); ease=Math.min(3.2,ease+0.15); reps++; }
  const due=Date.now()+(rating==="again"?5*60*1000:interval*DAY);
  return {...card,reps,interval,ease,lapses,due,lastRating:rating};
}

export default function SmartLearning({lessons,currentLevel,onLevelChange}:Props) {
  const [data,setData]=useState<ReviewData>(loadReview);
  const [tab,setTab]=useState<"review"|"placement"|"practice"|"account">("review");
  const [revealed,setRevealed]=useState(false);
  const [placementIndex,setPlacementIndex]=useState(0);
  const [answers,setAnswers]=useState<Record<number,number>>({});
  const [result,setResult]=useState<Level|null>(null);
  const [practiceIndex,setPracticeIndex]=useState(0);
  const [picked,setPicked]=useState<string[]>([]);
  const [practiceChecked,setPracticeChecked]=useState(false);
  const [feedback,setFeedback]=useState("");
  const [profileName,setProfileName]=useState(()=>{try{return localStorage.getItem("vazheno-profile-name")||""}catch{return ""}});
  const [profileEmail,setProfileEmail]=useState(()=>{try{return localStorage.getItem("vazheno-profile-email")||""}catch{return ""}});
  const [installPrompt,setInstallPrompt]=useState<any>(null);
  const [online,setOnline]=useState(navigator.onLine);
  useEffect(()=>{setData(old=>({...old,cards:seedCards(lessons,old.cards)}));},[lessons]);
  useEffect(()=>{try{localStorage.setItem(STORE,JSON.stringify(data));}catch{}},[data]);
  useEffect(()=>{const onlineHandler=()=>setOnline(true),offlineHandler=()=>setOnline(false),installHandler=(event:Event)=>{event.preventDefault();setInstallPrompt(event)};window.addEventListener("online",onlineHandler);window.addEventListener("offline",offlineHandler);window.addEventListener("beforeinstallprompt",installHandler);return()=>{window.removeEventListener("online",onlineHandler);window.removeEventListener("offline",offlineHandler);window.removeEventListener("beforeinstallprompt",installHandler)}},[]);
  const due=useMemo(()=>data.cards.filter(c=>c.due<=Date.now()).sort((a,b)=>a.due-b.due),[data.cards]);
  const [activeId,setActiveId]=useState("");
  const active=due.find(c=>c.id===activeId) ?? due[0];
  const practiceItems=useMemo(()=>lessons.filter(l=>l.level===currentLevel || l.level===result).slice(0,30),[lessons,currentLevel,result]);
  const task=practiceItems[practiceIndex%Math.max(1,practiceItems.length)];
  const bank=useMemo(()=>task?task.answer.replace(/[.!?]$/,"").split(/\s+/).sort((a,b)=>((a.charCodeAt(0)*17)%13)-((b.charCodeAt(0)*17)%13)):[],[task]);
  const correct=task ? clean(picked.join(" "))===clean(task.answer.replace(/[.!?]$/,"")) : false;
  const chooseAnswer=(i:number)=>setAnswers(prev=>({...prev,[placementIndex]:i}));
  const finishPlacement=()=>{
    const score=questionBank.reduce((n,q,i)=>n+(answers[i]===q.answer?1:0),0);
    const level=levelFromScore(score);setResult(level);setData(old=>({...old,placementLevel:level,placementDate:new Date().toISOString()}));onLevelChange(level);
    setFeedback(`از ۳۶ سؤال، ${score} پاسخ درست داشتی. مسیر پیشنهادی تو از سطح ${level} شروع می‌شود.`);
  };
  const rate=(rating:Rating)=>{
    if(!active)return;
    const updated=nextCard(active,rating);
    setData(old=>({...old,cards:old.cards.map(c=>c.id===active.id?updated:c),answers:old.answers+1,correct:old.correct+(rating==="again"?0:1)}));
    setRevealed(false);setActiveId("");setFeedback(rating==="again"?"این مورد حدود ۵ دقیقهٔ دیگر دوباره نمایش داده می‌شود.":`مرور بعدی در ${updated.interval} روز دیگر برنامه‌ریزی شد.`);
  };
  const saveProfile=()=>{
    try{localStorage.setItem("vazheno-profile-name",profileName);localStorage.setItem("vazheno-profile-email",profileEmail);setFeedback("پروفایل محلی ذخیره شد. برای همگام‌سازی واقعی بین دستگاه‌ها، حساب کاربری و پایگاه دادهٔ امن باید روی سرور پیکربندی شود.");}catch{setFeedback("ذخیره‌سازی مرورگر در دسترس نیست.");}
  };
  const exportProgress=()=>{
    const payload=JSON.stringify({review:data,profile:{name:profileName,email:profileEmail},exportedAt:new Date().toISOString()},null,2);
    const url=URL.createObjectURL(new Blob([payload],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download="vazheno-progress.json";a.click();URL.revokeObjectURL(url);
  };
  const importProgress=(file:File)=>{
    const reader=new FileReader();reader.onload=()=>{try{const payload=JSON.parse(String(reader.result));if(payload.review?.cards){setData(payload.review);setProfileName(payload.profile?.name||"");setProfileEmail(payload.profile?.email||"");setFeedback("پیشرفت از فایل وارد شد.");}else setFeedback("ساختار فایل پیشرفت معتبر نیست.");}catch{setFeedback("خواندن فایل ناموفق بود.");}};reader.readAsText(file);
  };
  const startPlacement=()=>{setAnswers({});setPlacementIndex(0);setResult(null);setFeedback("");setTab("placement")};
  const nextPlacement=()=>{if(placementIndex<35)setPlacementIndex(i=>i+1);else finishPlacement()};
  const resetPractice=()=>{setPicked([]);setPracticeChecked(false);setFeedback("")};
  return <section className="smart-learning" dir="rtl">
    <header className="smart-heading"><div><span className="smart-eyebrow">واژه‌نو · یادگیری تطبیقی</span><h1>یادگیری هوشمند</h1><p>مرور در زمان مناسب، تعیین سطح دقیق‌تر و تمرین فعال؛ پیشرفتت روی همین دستگاه ذخیره می‌شود.</p></div><span className={`connection-pill ${online?"online":"offline"}`}>{online?"● آنلاین":"● آفلاین"}</span></header>
    <div className="smart-tabs" role="tablist" aria-label="بخش‌های یادگیری هوشمند">
      {([{id:"review",label:"مرور فاصله‌دار"},{id:"placement",label:"تعیین سطح ۳۶ سؤالی"},{id:"practice",label:"جمله‌سازی"},{id:"account",label:"پروفایل و پشتیبان"}] as const).map(t=><button key={t.id} className={tab===t.id?"active":""} onClick={()=>{setTab(t.id);setFeedback("")}} role="tab" aria-selected={tab===t.id}>{t.label}</button>)}
    </div>
    {tab==="review"&&<div className="smart-grid">
      <article className="smart-panel smart-review-panel"><div className="smart-panel-top"><div><span className="smart-eyebrow">مرورهای موعدرسیده</span><h2>{due.length} کارت آمادهٔ مرور</h2></div><span className="smart-count">{data.cards.length} کارت</span></div>
        {active?<><div className="smart-flashcard"><span className="smart-card-kind">{active.kind==="word"?"واژه":"جمله"} · {active.level}</span><h3 dir={active.kind==="word"?"ltr":"auto"}>{active.prompt}</h3>{revealed?<div className="smart-answer"><strong dir="auto">{active.answer}</strong><p dir="auto">{active.example}</p></div>:<p>پاسخ را به خاطر بیاور؛ بعد آن را نمایش بده.</p>}</div>
          {!revealed?<button className="smart-primary" onClick={()=>setRevealed(true)}>نمایش پاسخ</button>:<div className="smart-rating-grid"><button onClick={()=>rate("again")}><b>دوباره</b><small>۵ دقیقه</small></button><button onClick={()=>rate("hard")}><b>سخت</b><small>{Math.max(1,Math.round((active.interval||1)*1.2))} روز</small></button><button onClick={()=>rate("good")}><b>خوب</b><small>{active.reps===0?1:active.reps===1?3:Math.max(4,Math.round(active.interval*active.ease))} روز</small></button><button onClick={()=>rate("easy")}><b>آسان</b><small>{active.reps===0?3:Math.max(5,Math.round((active.interval||3)*active.ease*1.3))} روز</small></button></div>}
        </>:<div className="smart-empty"><span>✓</span><h3>فعلاً مرور عقب‌افتاده نداری</h3><p>کارت‌های تازه از واژه‌ها و جمله‌های درس‌ها اضافه می‌شوند. بعداً دوباره سر بزن.</p></div>}
      </article>
      <aside className="smart-panel smart-stats"><h2>آمار مرور تو</h2><div className="smart-stat"><span>مرورهای انجام‌شده</span><strong>{data.answers}</strong></div><div className="smart-stat"><span>کارت‌های ساخته‌شده</span><strong>{data.cards.length}</strong></div><div className="smart-stat"><span>سطح پیشنهادی</span><strong>{data.placementLevel||currentLevel}</strong></div><p>هر بار «دوباره، سخت، خوب یا آسان» را انتخاب کنی، زمان مرور بعدی و سختی کارت بر اساس عملکردت تنظیم می‌شود.</p></aside>
    </div>}
    {tab==="placement"&&<div className="smart-panel"><div className="smart-panel-top"><div><span className="smart-eyebrow">ارزیابی A0 تا C1</span><h2>تعیین سطح ۳۶ سؤالی</h2><p>شش سؤال از هر سطح؛ نتیجه یک تخمین آموزشی است، نه مدرک رسمی.</p></div><span className="smart-count">{result? "نتیجه":`سؤال ${placementIndex+1} از ۳۶`}</span></div>
      {result?<div className="smart-result"><span className="smart-result-level">{result}</span><h3>مسیر پیشنهادی تو آماده است</h3><p>{feedback}</p><p>درس‌ها و تمرین‌ها را از این سطح دنبال کن. هر زمان خواستی می‌توانی دوباره آزمون بدهی.</p><button className="smart-primary" onClick={()=>setTab("practice")}>شروع تمرین در سطح {result}</button><button className="smart-secondary" onClick={startPlacement}>تکرار آزمون</button></div>:<><div className="smart-progress"><span style={{width:`${((placementIndex+1)/36)*100}%`}}/></div><div className="smart-question"><span className="smart-count">{questionBank[placementIndex].level}</span><h3>{questionBank[placementIndex].q}</h3><div className="smart-options">{questionBank[placementIndex].options.map((option,i)=><button key={option} className={answers[placementIndex]===i?"chosen":""} onClick={()=>chooseAnswer(i)}>{option}</button>)}</div><p className="smart-hint">پاسخ درست پس از پایان آزمون نمایش داده می‌شود.</p><div className="smart-question-actions"><button className="smart-secondary" disabled={placementIndex===0} onClick={()=>setPlacementIndex(i=>i-1)}>سؤال قبل</button><button className="smart-primary" disabled={answers[placementIndex]===undefined} onClick={nextPlacement}>{placementIndex===35?"مشاهدهٔ نتیجه":"سؤال بعد"}</button></div></div></>}
    </div>}
    {tab==="practice"&&<div className="smart-panel"><div className="smart-panel-top"><div><span className="smart-eyebrow">یادگیری با انجام دادن</span><h2>جمله را خودت بساز</h2><p>کلمه‌ها را مرتب کن، پاسخ را بررسی کن و توضیح فارسی بگیر.</p></div><span className="smart-count">{task?.level||currentLevel}</span></div>
      {task?<><div className="smart-practice-prompt"><span>معنی جمله</span><h3>{task.translation}</h3><div className="smart-built-sentence" dir="ltr">{picked.length?picked.map((w,i)=><button key={i} onClick={()=>{setPicked(old=>old.filter((_,j)=>j!==i));setPracticeChecked(false)}}>{w} ×</button>):<span>کلمه‌ها را از بانک زیر انتخاب کن</span>}</div><div className="smart-word-bank" dir="ltr">{bank.map((word,i)=><button key={i} disabled={picked.filter(w=>w===word).length>=bank.slice(0,i+1).filter(w=>w===word).length} onClick={()=>{setPicked(old=>[...old,word]);setPracticeChecked(false);setFeedback("")}}>{word} +</button>)}</div>
      <div className="smart-question-actions"><button className="smart-secondary" onClick={resetPractice}>از نو</button><button className="smart-primary" onClick={()=>{setPracticeChecked(true);setFeedback(correct?"آفرین! ترتیب جمله درست است. به حرف بزرگ ابتدای جمله و نشانه‌گذاری پایانی هم توجه کن.":`هنوز دقیق نیست. ساختار پیشنهادی: ${task.answer}. به جایگاه فاعل و فعل دقت کن.`);setData(old=>({...old,answers:old.answers+1,correct:old.correct+(correct?1:0)}))}}>بررسی جمله</button></div>
      {practiceChecked&&<div className={`smart-feedback ${correct?"success":""}`} role="status">{feedback}</div>}</div><div className="smart-question-actions"><button className="smart-secondary" onClick={()=>{setPracticeIndex(i=>(i+practiceItems.length-1)%practiceItems.length);resetPractice()}}>تمرین قبلی</button><button className="smart-primary" onClick={()=>{setPracticeIndex(i=>(i+1)%practiceItems.length);resetPractice()}}>تمرین بعدی ←</button></div></>:<p>برای این سطح هنوز تمرینی در دسترس نیست.</p>}
    </div>}
    {tab==="account"&&<div className="smart-panel"><span className="smart-eyebrow">پروفایل و انتقال پیشرفت</span><h2>پیشرفتت را نگه دار</h2><p>فعلاً اطلاعات و مرورها به‌صورت محلی روی همین مرورگر ذخیره می‌شوند. برای ورود با ایمیل/گوگل و همگام‌سازی امن بین دستگاه‌ها باید سرویس احراز هویت و پایگاه دادهٔ سرور پیکربندی شود؛ این فرم ورود واقعی نیست.</p><div className="smart-profile-fields"><label>نام نمایشی<input value={profileName} onChange={e=>setProfileName(e.target.value)} placeholder="نام تو"/></label><label>ایمیل (برای شناسایی در فایل پشتیبان)<input type="email" value={profileEmail} onChange={e=>setProfileEmail(e.target.value)} placeholder="you@example.com" dir="ltr"/></label></div><div className="smart-question-actions"><button className="smart-primary" onClick={saveProfile}>ذخیرهٔ پروفایل محلی</button><button className="smart-secondary" onClick={exportProgress}>خروجی گرفتن از پیشرفت</button><label className="smart-file-button">وارد کردن پیشرفت<input type="file" accept="application/json" onChange={e=>{const file=e.target.files?.[0];if(file)importProgress(file);e.currentTarget.value=""}}/></label></div><div className="smart-offline-card"><div><strong>{online?"اتصال اینترنت برقرار است":"در حالت آفلاین هستی"}</strong><p>درس‌های بارگذاری‌شده و کارت‌های مرور روی دستگاه در دسترس‌اند. تغییرات به سرور همگام نمی‌شوند تا زمانی که حساب ابری پیکربندی شود.</p></div><button className="smart-secondary" onClick={async()=>{if(installPrompt){await installPrompt.prompt();setInstallPrompt(null)}else setFeedback("اگر از مرورگر پشتیبانی‌شده استفاده می‌کنی، گزینهٔ «نصب برنامه» را از منوی مرورگر انتخاب کن.")}}>نصب واژه‌نو</button></div>{feedback&&<div className="smart-feedback" role="status">{feedback}</div>}</div>}
    <p className="smart-footnote">پیشرفت محلی به‌طور خودکار ذخیره می‌شود. برای انتقال به دستگاه دیگر از بخش «پروفایل و پشتیبان» خروجی بگیر.</p>
  </section>;
}
