
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import StageAssessment from "./StageAssessment";
import ListeningPractice from "./ListeningPractice";
import SpeakingPractice from "./SpeakingPractice";
import { expandedLessons } from "./ExpandedLessons";

type Level = "A0" | "A1" | "A2" | "B1" | "B2" | "C1";
type Page =
  | "home"
  | "dashboard"
  | "placement"
  | "path"
  | "lesson"
  | "practice"
  | "review"
  | "skills"
  | "settings"
  | "assessment"
  | "listening"
  | "speaking";

type Question = {
  id: string;
  level: Level;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

type Lesson = {
  id: string;
  level: Level;
  title: string;
  category: string;
  minutes: number;
  explanation: string;
  example: string;
  translation: string;
  tip: string;
  question: string;
  options: string[];
  answer: string;
  feedback: string;
  words: { word: string; meaning: string; example: string }[];
};

type SavedState = {
  userName: string;
  dailyGoal: string;
  completedLessons: string[];
  reviewedWords: string[];
  reviewDates: Record<string, number>;
  currentLessonId: string;
  level: Level;
  placementHistory: string[][];
  placementResult: Level | null;
  lastStudyDate: string;
  studiedToday: number;
  skillProgress: Record<string, number>;
};

const STORAGE_KEY = "vazheno-progress-v3";
const LEVELS: Level[] = ["A0", "A1", "A2", "B1", "B2", "C1"];

const emptyState: SavedState = {
  userName: "دوست زبان‌آموز",
  dailyGoal: "۱۵ دقیقه",
  completedLessons: [],
  reviewedWords: [],
  reviewDates: {},
  currentLessonId: "a0-1",
  level: "A0",
  placementHistory: [],
  placementResult: null,
  lastStudyDate: "",
  studiedToday: 0,
  skillProgress: { reading: 0, listening: 0, speaking: 0, writing: 0 },
};

function loadSaved(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as Partial<SavedState>;
    return {
      ...emptyState,
      ...parsed,
      completedLessons: Array.isArray(parsed.completedLessons)
        ? parsed.completedLessons
        : [],
      reviewedWords: Array.isArray(parsed.reviewedWords)
        ? parsed.reviewedWords
        : [],
      reviewDates: parsed.reviewDates ?? {},
      placementHistory: Array.isArray(parsed.placementHistory)
        ? parsed.placementHistory
        : [],
    };
  } catch {
    return emptyState;
  }
}

const lessons: Lesson[] = [
  {
    id: "a0-1", level: "A0", title: "سلام و معرفی خود", category: "مکالمه",
    minutes: 8,
    explanation: "برای معرفی نام از My name is یا شکل کوتاه‌تر I'm استفاده می‌کنیم. برای پرسیدن نام می‌گوییم What is your name?",
    example: "My name is Sara. I'm from Iran.",
    translation: "اسم من سارا است. من اهل ایران هستم.",
    tip: "I'm شکل کوتاه I am است.",
    question: "کدام جمله یعنی «اسم من علی است»؟",
    options: ["My name Ali.", "My name is Ali.", "I name is Ali.", "Me Ali name."],
    answer: "My name is Ali.",
    feedback: "پس از My name باید از is استفاده کنیم.",
    words: [
      { word: "name", meaning: "نام", example: "My name is Ali." },
      { word: "from", meaning: "از / اهل", example: "I'm from Iran." },
      { word: "hello", meaning: "سلام", example: "Hello, Sara!" },
    ],
  },
  {
    id: "a0-2", level: "A0", title: "ضمیرهای فاعلی", category: "دستور زبان",
    minutes: 10,
    explanation: "I یعنی من، you یعنی تو یا شما، he برای مرد، she برای زن، it برای چیز یا حیوان، we یعنی ما و they یعنی آن‌ها.",
    example: "She is a student. They are friends.",
    translation: "او دانش‌آموز است. آن‌ها دوست هستند.",
    tip: "در انگلیسی معمولاً فاعل پیش از فعل می‌آید.",
    question: "جای خالی را پر کن: ___ are my friends.",
    options: ["He", "It", "They", "She"],
    answer: "They",
    feedback: "برای «آن‌ها» از They استفاده می‌کنیم.",
    words: [
      { word: "friend", meaning: "دوست", example: "He is my friend." },
      { word: "student", meaning: "دانش‌آموز / دانشجو", example: "I am a student." },
    ],
  },
  {
    id: "a0-3", level: "A0", title: "فعل am، is و are", category: "دستور زبان",
    minutes: 12,
    explanation: "در زمان حال، I با am، فاعل‌های he/she/it با is و you/we/they با are می‌آیند.",
    example: "I am happy. She is ready. We are here.",
    translation: "من خوشحالم. او آماده است. ما اینجا هستیم.",
    tip: "I am، he is، they are را با مثال‌های متعدد تمرین کن.",
    question: "My parents ___ at home.",
    options: ["is", "am", "are", "be"],
    answer: "are",
    feedback: "My parents جمع است؛ بنابراین are درست است.",
    words: [
      { word: "happy", meaning: "خوشحال", example: "I am happy." },
      { word: "ready", meaning: "آماده", example: "We are ready." },
    ],
  },
  {
    id: "a0-4", level: "A0", title: "جملهٔ منفی و سؤال ساده", category: "جمله‌سازی",
    minutes: 12,
    explanation: "برای منفی کردن فعل to be، not را بعد از آن می‌آوریم. برای سؤال، am/is/are را پیش از فاعل قرار می‌دهیم.",
    example: "She isn't tired. Are you ready?",
    translation: "او خسته نیست. آیا آماده‌ای؟",
    tip: "You are happy → Are you happy?",
    question: "کدام سؤال درست است؟",
    options: ["You are ready?", "Are you ready?", "Do you are ready?", "Is you ready?"],
    answer: "Are you ready?",
    feedback: "در سؤال با to be، فعل پیش از فاعل می‌آید.",
    words: [
      { word: "tired", meaning: "خسته", example: "I am not tired." },
      { word: "busy", meaning: "مشغول", example: "Are you busy?" },
    ],
  },
  {
    id: "a1-1", level: "A1", title: "حال ساده و عادت‌ها", category: "دستور زبان",
    minutes: 14,
    explanation: "از حال ساده برای عادت‌ها و واقعیت‌ها استفاده می‌کنیم. با he/she/it معمولاً به فعل s اضافه می‌شود.",
    example: "I work every day. She works at a bank.",
    translation: "من هر روز کار می‌کنم. او در بانک کار می‌کند.",
    tip: "I work، ولی he works.",
    question: "My brother ___ football every Friday.",
    options: ["play", "plays", "playing", "is play"],
    answer: "plays",
    feedback: "با My brother که سوم‌شخص مفرد است، plays درست است.",
    words: [
      { word: "usually", meaning: "معمولاً", example: "I usually walk to work." },
      { word: "always", meaning: "همیشه", example: "She always arrives early." },
    ],
  },
  {
    id: "a1-2", level: "A1", title: "منفی و سؤال با do و does", category: "دستور زبان",
    minutes: 14,
    explanation: "در حال ساده برای سؤال و منفی از do/does استفاده می‌کنیم. بعد از does، فعل اصلی به شکل پایه برمی‌گردد.",
    example: "Does he work here? He doesn't work here.",
    translation: "آیا او اینجا کار می‌کند؟ او اینجا کار نمی‌کند.",
    tip: "Does she likes غلط است؛ Does she like درست است.",
    question: "___ your sister speak English?",
    options: ["Do", "Does", "Is", "Has"],
    answer: "Does",
    feedback: "برای she در سؤال حال ساده از Does استفاده می‌کنیم.",
    words: [
      { word: "speak", meaning: "صحبت کردن", example: "Do you speak English?" },
      { word: "understand", meaning: "فهمیدن", example: "I understand you." },
    ],
  },
  {
    id: "a1-3", level: "A1", title: "حال استمراری", category: "دستور زبان",
    minutes: 15,
    explanation: "برای کاری که اکنون در جریان است، از am/is/are + فعل ing استفاده می‌کنیم.",
    example: "I'm reading a book right now.",
    translation: "همین الان دارم کتاب می‌خوانم.",
    tip: "حال ساده برای عادت؛ حال استمراری برای کاری در جریان.",
    question: "Look! The children ___ in the garden.",
    options: ["play", "plays", "are playing", "is playing"],
    answer: "are playing",
    feedback: "The children جمع است و کاری در حال انجام است.",
    words: [
      { word: "now", meaning: "اکنون", example: "I'm studying now." },
      { word: "currently", meaning: "در حال حاضر", example: "She's currently working." },
    ],
  },
  {
    id: "a1-4", level: "A1", title: "گذشتهٔ ساده", category: "دستور زبان",
    minutes: 16,
    explanation: "برای کار تمام‌شده در گذشته از گذشتهٔ ساده استفاده می‌کنیم. افعال باقاعده معمولاً ed می‌گیرند؛ افعال بی‌قاعده شکل جداگانه دارند.",
    example: "I watched a film. We went home.",
    translation: "فیلمی تماشا کردم. به خانه رفتیم.",
    tip: "گذشتهٔ go می‌شود went، نه goed.",
    question: "Yesterday, we ___ to the museum.",
    options: ["go", "goed", "went", "gone"],
    answer: "went",
    feedback: "گذشتهٔ سادهٔ go، went است.",
    words: [
      { word: "yesterday", meaning: "دیروز", example: "I called him yesterday." },
      { word: "visited", meaning: "دیدار کرد / بازدید کرد", example: "We visited our aunt." },
    ],
  },
  {
    id: "a2-1", level: "A2", title: "حال کامل؛ تجربه و نتیجه", category: "دستور زبان",
    minutes: 18,
    explanation: "حال کامل از have/has + قسمت سوم فعل ساخته می‌شود و برای تجربه یا نتیجه‌ای مرتبط با زمان حال به کار می‌رود.",
    example: "I've visited London twice.",
    translation: "دو بار از لندن بازدید کرده‌ام.",
    tip: "با زمان دقیق و تمام‌شده‌ای مثل yesterday معمولاً گذشتهٔ ساده مناسب‌تر است.",
    question: "She ___ never tried sushi.",
    options: ["did", "has", "is", "was"],
    answer: "has",
    feedback: "برای She در حال کامل از has + قسمت سوم استفاده می‌کنیم.",
    words: [
      { word: "already", meaning: "از قبل / تا حالا", example: "I've already eaten." },
      { word: "experience", meaning: "تجربه", example: "It was a great experience." },
    ],
  },
  {
    id: "a2-2", level: "A2", title: "مقایسهٔ صفت‌ها", category: "دستور زبان",
    minutes: 15,
    explanation: "برای مقایسهٔ بسیاری از صفت‌های کوتاه از er و برای صفت‌های بلند از more استفاده می‌کنیم.",
    example: "This book is cheaper than that one.",
    translation: "این کتاب از آن یکی ارزان‌تر است.",
    tip: "good شکل بی‌قاعده دارد: better، و نه gooder.",
    question: "This exercise is ___ than the last one.",
    options: ["more easy", "easier", "easy", "easiest"],
    answer: "easier",
    feedback: "شکل مقایسه‌ای easy، کلمهٔ easier است.",
    words: [
      { word: "cheaper", meaning: "ارزان‌تر", example: "This is cheaper." },
      { word: "better", meaning: "بهتر", example: "I feel better today." },
    ],
  },
  {
    id: "a2-3", level: "A2", title: "آینده با going to و will", category: "دستور زبان",
    minutes: 16,
    explanation: "going to اغلب برای برنامه یا قصد قبلی به کار می‌رود. will برای پیش‌بینی، تصمیم لحظه‌ای و قول هم استفاده می‌شود.",
    example: "I'm going to study tonight. I'll help you.",
    translation: "امشب قصد دارم درس بخوانم. کمکت می‌کنم.",
    tip: "این دو ساختار همیشه قابل جایگزینی نیستند؛ به موقعیت توجه کن.",
    question: "We have bought the tickets. We ___ travel tomorrow.",
    options: ["going to", "are going to", "will to", "are go to"],
    answer: "are going to",
    feedback: "برای برنامهٔ قبلی از am/is/are going to استفاده می‌کنیم.",
    words: [
      { word: "plan", meaning: "برنامه‌ریزی کردن", example: "I plan to travel." },
      { word: "probably", meaning: "احتمالاً", example: "It will probably rain." },
    ],
  },
  {
    id: "a2-4", level: "A2", title: "افعال وجهی و درخواست مؤدبانه", category: "مکالمه",
    minutes: 15,
    explanation: "can برای توانایی یا اجازه، should برای توصیه و could برای درخواست مؤدبانه کاربرد دارد.",
    example: "Could you help me, please?",
    translation: "ممکن است لطفاً به من کمک کنید؟",
    tip: "پس از can، should و could شکل پایهٔ فعل می‌آید.",
    question: "You look ill. You ___ see a doctor.",
    options: ["should", "would to", "must to", "are"],
    answer: "should",
    feedback: "برای توصیه از should + شکل پایهٔ فعل استفاده می‌کنیم.",
    words: [
      { word: "advice", meaning: "توصیه", example: "Thanks for your advice." },
      { word: "permission", meaning: "اجازه", example: "May I ask permission?" },
    ],
  },
  {
    id: "b1-1", level: "B1", title: "شرطی نوع اول", category: "دستور زبان",
    minutes: 18,
    explanation: "شرطی نوع اول برای موقعیت واقعی یا محتمل آینده است: If + حال ساده، سپس will + شکل پایه.",
    example: "If it rains, we'll stay at home.",
    translation: "اگر باران ببارد، در خانه می‌مانیم.",
    tip: "در بخش if معمولاً برای این ساختار از will استفاده نمی‌کنیم.",
    question: "If she ___ early, we'll have time for coffee.",
    options: ["will arrive", "arrives", "arrived", "would arrive"],
    answer: "arrives",
    feedback: "در بخش شرط، حال ساده به کار می‌رود.",
    words: [
      { word: "unless", meaning: "مگر اینکه", example: "I'll go unless it rains." },
      { word: "likely", meaning: "محتمل", example: "It's likely to happen." },
    ],
  },
  {
    id: "b1-2", level: "B1", title: "جمله‌واره‌های موصولی", category: "دستور زبان",
    minutes: 18,
    explanation: "who برای افراد، which برای اشیا و حیوانات و that در بسیاری از جمله‌های موصولی برای هر دو استفاده می‌شود.",
    example: "The woman who called you is my teacher.",
    translation: "زنی که به تو زنگ زد معلم من است.",
    tip: "ضمیر موصولی به اسم قبل از خود اشاره می‌کند.",
    question: "The laptop ___ I bought is already broken.",
    options: ["who", "where", "which", "whose"],
    answer: "which",
    feedback: "برای اشاره به laptop از which یا در این جمله that استفاده می‌شود.",
    words: [
      { word: "whose", meaning: "که مالِ اوست", example: "The man whose car was stolen called." },
      { word: "although", meaning: "اگرچه", example: "Although it was late, we continued." },
    ],
  },
  {
    id: "b1-3", level: "B1", title: "گذشتهٔ کامل", category: "دستور زبان",
    minutes: 18,
    explanation: "گذشتهٔ کامل had + قسمت سوم فعل، رویدادی را نشان می‌دهد که پیش از رویداد دیگری در گذشته رخ داده است.",
    example: "By the time I arrived, the film had started.",
    translation: "وقتی رسیدم، فیلم شروع شده بود.",
    tip: "ترتیب دو رویداد گذشته را در نظر بگیر.",
    question: "She was upset because she ___ her wallet.",
    options: ["loses", "has lost", "had lost", "was lose"],
    answer: "had lost",
    feedback: "گم کردن کیف قبل از ناراحتی در گذشته رخ داده است.",
    words: [
      { word: "by the time", meaning: "تا زمانی که", example: "By the time we arrived, it was dark." },
      { word: "realize", meaning: "متوجه شدن", example: "I realized my mistake." },
    ],
  },
  {
    id: "b1-4", level: "B1", title: "گزارش کردن گفته‌ها", category: "دستور زبان",
    minutes: 18,
    explanation: "در نقل‌قول غیرمستقیم، زمان فعل اغلب یک مرحله به گذشته می‌رود، به‌ویژه وقتی فعل گزارش در گذشته باشد.",
    example: 'She said, "I am tired." → She said she was tired.',
    translation: "او گفت که خسته است / خسته بود.",
    tip: "تغییر ضمیر و زمان به بافت و زمان گزارش بستگی دارد.",
    question: 'He said, "I have finished." → He said he ___ finished.',
    options: ["has", "have", "had", "is"],
    answer: "had",
    feedback: "حال کامل در این گزارش معمولاً به گذشتهٔ کامل تبدیل می‌شود.",
    words: [
      { word: "claim", meaning: "ادعا کردن", example: "He claimed he was innocent." },
      { word: "mention", meaning: "اشاره کردن", example: "She mentioned the problem." },
    ],
  },
  {
    id: "b2-1", level: "B2", title: "شرطی نوع سوم و پشیمانی", category: "دستور زبان",
    minutes: 20,
    explanation: "شرطی نوع سوم دربارهٔ گذشتهٔ غیرواقعی است: If + past perfect، سپس would have + قسمت سوم.",
    example: "If I had left earlier, I would have caught the train.",
    translation: "اگر زودتر راه افتاده بودم، به قطار می‌رسیدم.",
    tip: "این ساختار دربارهٔ اتفاقی است که در گذشته رخ نداده.",
    question: "If they had invited me, I ___.",
    options: ["would go", "would have gone", "went", "had gone"],
    answer: "would have gone",
    feedback: "نتیجهٔ شرطی نوع سوم از would have + قسمت سوم ساخته می‌شود.",
    words: [
      { word: "regret", meaning: "پشیمانی / پشیمان شدن", example: "I regret saying that." },
      { word: "assume", meaning: "فرض کردن", example: "I assumed you knew." },
    ],
  },
  {
    id: "b2-2", level: "B2", title: "مجهول در زمان‌های مختلف", category: "دستور زبان",
    minutes: 20,
    explanation: "در جملهٔ مجهول، تمرکز بر عمل یا دریافت‌کنندهٔ آن است: شکل مناسب be + قسمت سوم فعل.",
    example: "The report was written yesterday.",
    translation: "گزارش دیروز نوشته شد.",
    tip: "زمان جمله در فعل be نشان داده می‌شود.",
    question: "The results ___ tomorrow.",
    options: ["announce", "will announce", "will be announced", "are announcing by"],
    answer: "will be announced",
    feedback: "مجهول آینده با will be + قسمت سوم ساخته می‌شود.",
    words: [
      { word: "conduct", meaning: "انجام دادن / هدایت کردن", example: "They conducted an experiment." },
      { word: "evidence", meaning: "شواهد", example: "There is strong evidence." },
    ],
  },
  {
    id: "b2-3", level: "B2", title: "تأکید و وارونگی", category: "دستور زبان",
    minutes: 20,
    explanation: "در زبان رسمی، پس از برخی عبارت‌های منفی مانند Never، ساختار وارونگی می‌آید؛ فعل کمکی پیش از فاعل قرار می‌گیرد.",
    example: "Never have I seen such a view.",
    translation: "هرگز چنین منظره‌ای ندیده‌ام.",
    tip: "این ساختار رسمی‌تر از ترتیب معمول جمله است.",
    question: "Rarely ___ such a difficult problem.",
    options: ["I have seen", "have I seen", "I saw", "did I have seen"],
    answer: "have I seen",
    feedback: "پس از Rarely در ابتدای جمله، وارونگی فعل کمکی و فاعل می‌آید.",
    words: [
      { word: "barely", meaning: "به‌سختی / تقریباً نه", example: "I could barely hear him." },
      { word: "nevertheless", meaning: "با این وجود", example: "It was difficult; nevertheless, we succeeded." },
    ],
  },
  {
    id: "b2-4", level: "B2", title: "پیوند دادن ایده‌ها", category: "نوشتن",
    minutes: 18,
    explanation: "پیونددهنده‌هایی مانند whereas، nevertheless و consequently رابطهٔ تضاد یا نتیجه را روشن می‌کنند.",
    example: "The plan was expensive; nevertheless, it succeeded.",
    translation: "طرح پرهزینه بود؛ با این وجود موفق شد.",
    tip: "پیونددهنده باید رابطهٔ معنایی دو ایده را درست نشان دهد.",
    question: "The first option is cheaper, ___ the second is more reliable.",
    options: ["therefore", "whereas", "consequently", "because of"],
    answer: "whereas",
    feedback: "Whereas دو وضعیت متضاد را مقایسه می‌کند.",
    words: [
      { word: "whereas", meaning: "در حالی که", example: "I like tea, whereas he prefers coffee." },
      { word: "consequently", meaning: "در نتیجه", example: "It rained; consequently, the match was cancelled." },
    ],
  },
  {
    id: "c1-1", level: "C1", title: "قیدهای ظریف و لحن", category: "واژگان پیشرفته",
    minutes: 22,
    explanation: "در سطح پیشرفته، انتخاب قید بر میزان قطعیت یا نگرش گوینده اثر می‌گذارد. Apparently نشان می‌دهد چیزی بر اساس اطلاعات موجود چنین به نظر می‌رسد.",
    example: "Apparently, the figures were misinterpreted.",
    translation: "ظاهراً ارقام اشتباه تفسیر شده بودند.",
    tip: "apparently لزوماً به معنای تأیید قطعی گوینده نیست.",
    question: "Choose the most natural completion: The findings were ___ inconclusive.",
    options: ["highly", "utterly", "largely", "deeply"],
    answer: "largely",
    feedback: "Largely inconclusive ترکیب طبیعی برای «عمدتاً بی‌نتیجه» است.",
    words: [
      { word: "apparently", meaning: "ظاهراً", example: "Apparently, nobody was informed." },
      { word: "substantially", meaning: "به میزان قابل توجه", example: "Costs have substantially increased." },
    ],
  },
  {
    id: "c1-2", level: "C1", title: "عبارت‌های اسمی رسمی", category: "نوشتن",
    minutes: 22,
    explanation: "در متن رسمی، nominalisation یا اسمی‌سازی می‌تواند متن را فشرده‌تر کند؛ مثلاً the company expanded → the company's expansion.",
    example: "The committee rejected the proposal. → The committee's rejection of the proposal...",
    translation: "کمیته پیشنهاد را رد کرد. → رد پیشنهاد توسط کمیته...",
    tip: "اسمی‌سازی بیش از حد، متن را سنگین و مبهم می‌کند.",
    question: "Which phrase is the clearest formal nominalisation of 'They decided to postpone it'?",
    options: [
      "Their decision to postpone it",
      "They decision postponing it",
      "Their deciding postponed",
      "The decide to postpone",
    ],
    answer: "Their decision to postpone it",
    feedback: "Decision اسم مناسب برای تبدیل decide به ساختار اسمی است.",
    words: [
      { word: "subsequent", meaning: "بعدی / متعاقب", example: "Subsequent research confirmed it." },
      { word: "implication", meaning: "پیامد / دلالت", example: "We discussed the implications." },
    ],
  },
  {
    id: "c1-3", level: "C1", title: "معنا و کاربرد واژه‌ها", category: "واژگان پیشرفته",
    minutes: 22,
    explanation: "در سطح پیشرفته، هم‌نشینی واژه‌ها مهم است. برخی واژه‌ها با ترکیب‌های خاص طبیعی‌ترند؛ برای نمونه pose a threat و نه معمولاً make a threat.",
    example: "The new policy poses a significant threat.",
    translation: "سیاست جدید تهدید قابل‌توجهی ایجاد می‌کند.",
    tip: "واژگان را همراه با عبارت و جمله یاد بگیر، نه به‌صورت تک‌کلمه.",
    question: "Which collocation is most natural?",
    options: ["do a decision", "make a research", "pose a threat", "say a conclusion"],
    answer: "pose a threat",
    feedback: "Pose a threat یک هم‌نشینی طبیعی و رایج است.",
    words: [
      { word: "plausible", meaning: "باورپذیر", example: "That sounds plausible." },
      { word: "ambiguous", meaning: "مبهم / دوپهلو", example: "The wording is ambiguous." },
    ],
  },
  {
    id: "c1-4", level: "C1", title: "استدلال و ظرافت معنایی", category: "خواندن",
    minutes: 22,
    explanation: "در متن‌های پیشرفته، تفاوت بین ادعا، شواهد و نتیجه‌گیری را تشخیص بده. نویسنده ممکن است محتاطانه حرف بزند و نتیجه را قطعی اعلام نکند.",
    example: "The evidence appears to suggest a modest improvement.",
    translation: "شواهد ظاهراً از بهبودی اندک حکایت دارند.",
    tip: "appears to suggest از ادعای قطعی محتاطانه‌تر است.",
    question: "Which statement is the most cautious?",
    options: [
      "This proves the treatment always works.",
      "The evidence may indicate a benefit.",
      "There is no possible doubt.",
      "The result is unquestionably universal.",
    ],
    answer: "The evidence may indicate a benefit.",
    feedback: "May indicate بیان محتاطانه‌تری از شواهد است.",
    words: [
      { word: "tentative", meaning: "موقت / محتاطانه", example: "We reached a tentative conclusion." },
      { word: "compelling", meaning: "قانع‌کننده", example: "The argument is compelling." },
    ],
  },
];

const placementPool: Question[] = [
  { id: "p-a0-1", level: "A0", question: "Choose the correct sentence.", options: ["I is happy.", "I am happy.", "I are happy.", "I be happy."], answer: "I am happy.", explanation: "I با am می‌آید." },
  { id: "p-a0-2", level: "A0", question: "What does 'apple' mean?", options: ["کتاب", "سیب", "خانه", "آب"], answer: "سیب", explanation: "Apple یعنی سیب." },
  { id: "p-a0-3", level: "A0", question: "She ___ my sister.", options: ["am", "are", "is", "be"], answer: "is", explanation: "She با is می‌آید." },
  { id: "p-a0-4", level: "A0", question: "Choose the correct question.", options: ["What your name?", "What is your name?", "What are name?", "How name you?"], answer: "What is your name?", explanation: "ساختار درست What is your name? است." },
  { id: "p-a1-1", level: "A1", question: "He usually ___ to work by bus.", options: ["go", "goes", "going", "is go"], answer: "goes", explanation: "در حال ساده برای he از goes استفاده می‌کنیم." },
  { id: "p-a1-2", level: "A1", question: "We ___ dinner when you called.", options: ["have", "had", "were having", "are having"], answer: "were having", explanation: "کاری در جریان در گذشته: were having." },
  { id: "p-a1-3", level: "A1", question: "There isn't ___ milk left.", options: ["many", "much", "few", "several"], answer: "much", explanation: "Milk اسم غیرقابل‌شمارش است." },
  { id: "p-a1-4", level: "A1", question: "I ___ him yesterday.", options: ["see", "seen", "saw", "have see"], answer: "saw", explanation: "Yesterday معمولاً با گذشتهٔ ساده می‌آید." },
  { id: "p-a2-1", level: "A2", question: "I've lived here ___ 2020.", options: ["for", "since", "during", "from"], answer: "since", explanation: "Since نقطهٔ شروع را بیان می‌کند." },
  { id: "p-a2-2", level: "A2", question: "If I have time, I ___ you.", options: ["called", "would called", "will call", "had called"], answer: "will call", explanation: "شرطی نوع اول: if + حال ساده و will در نتیجه." },
  { id: "p-a2-3", level: "A2", question: "This is the ___ film I've ever seen.", options: ["better", "best", "good", "most good"], answer: "best", explanation: "برای عالی good از best استفاده می‌شود." },
  { id: "p-a2-4", level: "A2", question: "You ___ smoke in a hospital.", options: ["mustn't", "don't have", "should to", "couldn't to"], answer: "mustn't", explanation: "Mustn't منع و ممنوعیت را بیان می‌کند." },
  { id: "p-b1-1", level: "B1", question: "By the time we arrived, the meeting ___.", options: ["started", "has started", "had started", "starts"], answer: "had started", explanation: "شروع جلسه پیش از رسیدن ما اتفاق افتاده بود." },
  { id: "p-b1-2", level: "B1", question: "The man ___ car was stolen called the police.", options: ["who", "whose", "which", "whom"], answer: "whose", explanation: "Whose مالکیت را نشان می‌دهد." },
  { id: "p-b1-3", level: "B1", question: "She suggested ___ a taxi.", options: ["take", "to take", "taking", "took"], answer: "taking", explanation: "Suggest معمولاً با فعل ing می‌آید." },
  { id: "p-b1-4", level: "B1", question: "He asked me where ___.", options: ["did I live", "I lived", "do I live", "I live yesterday"], answer: "I lived", explanation: "در سؤال غیرمستقیم ترتیب جمله خبری است." },
  { id: "p-b2-1", level: "B2", question: "If she had studied harder, she ___ the exam.", options: ["would pass", "would have passed", "will pass", "had passed"], answer: "would have passed", explanation: "شرطی نوع سوم دربارهٔ گذشتهٔ غیرواقعی است." },
  { id: "p-b2-2", level: "B2", question: "The proposal ___ by the board next week.", options: ["will review", "will be reviewed", "reviews", "has reviewed"], answer: "will be reviewed", explanation: "مجهول آینده: will be + قسمت سوم." },
  { id: "p-b2-3", level: "B2", question: "Hardly ___ the room when the phone rang.", options: ["I had entered", "had I entered", "I entered", "did I entered"], answer: "had I entered", explanation: "Hardly در ابتدای جمله وارونگی ایجاد می‌کند." },
  { id: "p-b2-4", level: "B2", question: "The evidence was limited; ___, the claim was widely accepted.", options: ["nevertheless", "because", "unless", "whereas of"], answer: "nevertheless", explanation: "Nevertheless تضاد میان دو گزاره را نشان می‌دهد." },
  { id: "p-c1-1", level: "C1", question: "Which phrase is most idiomatic?", options: ["do a risk", "pose a risk", "make a risk", "give a risk"], answer: "pose a risk", explanation: "Pose a risk هم‌نشینی طبیعی در انگلیسی است." },
  { id: "p-c1-2", level: "C1", question: "Choose the most cautious academic claim.", options: ["This proves the theory.", "This may lend support to the theory.", "This unquestionably settles the matter.", "This always confirms everything."], answer: "This may lend support to the theory.", explanation: "May lend support بیان محتاطانه و آکادمیک است." },
  { id: "p-c1-3", level: "C1", question: "Not until the data were reviewed ___ the error.", options: ["we noticed", "did we notice", "we did noticed", "noticed we"], answer: "did we notice", explanation: "پس از Not until در ابتدای جمله وارونگی رخ می‌دهد." },
  { id: "p-c1-4", level: "C1", question: "The results are ___ consistent with the initial hypothesis.", options: ["broadly", "deeply", "utterly", "heavily"], answer: "broadly", explanation: "Broadly consistent ترکیب طبیعی و رایجی است." },

  { id: "p-a0-5", level: "A0", question: "Choose the correct sentence.", options: ["They is at home.", "They are at home.", "They am at home.", "They be at home."], answer: "They are at home.", explanation: "They با are می‌آید." },
  { id: "p-a0-6", level: "A0", question: "Choose the correct reply: 'How are you?'", options: ["I'm fine, thanks.", "I fine is.", "I have fine.", "I are good."], answer: "I'm fine, thanks.", explanation: "پاسخ رایج به How are you? عبارت I'm fine, thanks است." },
  { id: "p-a1-5", level: "A1", question: "My sister doesn't ___ coffee.", options: ["likes", "like", "liking", "liked"], answer: "like", explanation: "پس از doesn't فعل اصلی به شکل پایه می‌آید." },
  { id: "p-a1-6", level: "A1", question: "There are ___ apples on the table.", options: ["a little", "much", "a few", "any of"], answer: "a few", explanation: "Apples قابل‌شمارش و جمع است؛ a few برای تعداد کم به‌کار می‌رود." },
  { id: "p-a2-5", level: "A2", question: "I have known him ___ five years.", options: ["since", "for", "from", "during"], answer: "for", explanation: "For مدت زمان را نشان می‌دهد؛ five years یک مدت است." },
  { id: "p-a2-6", level: "A2", question: "You look tired. You ___ take a break.", options: ["should", "should to", "are", "would to"], answer: "should", explanation: "برای توصیه از should + شکل پایهٔ فعل استفاده می‌کنیم." },
  { id: "p-b1-5", level: "B1", question: "I wish I ___ more free time.", options: ["have", "will have", "had", "am having"], answer: "had", explanation: "برای آرزوی خلاف واقع در زمان حال، پس از I wish از گذشتهٔ ساده استفاده می‌شود." },
  { id: "p-b1-6", level: "B1", question: "Despite ___ late, he joined the meeting.", options: ["be", "being", "was", "to be"], answer: "being", explanation: "پس از despite اسم یا شکل ing فعل می‌آید." },
  { id: "p-b2-5", level: "B2", question: "No sooner ___ than the lights went out.", options: ["we arrived", "had we arrived", "we had arrive", "did we arrived"], answer: "had we arrived", explanation: "با No sooner در ابتدای جمله، وارونگی و معمولاً past perfect به‌کار می‌رود." },
  { id: "p-b2-6", level: "B2", question: "The manager insisted that the report ___ revised.", options: ["is", "was", "be", "being"], answer: "be", explanation: "در ساختار رسمی insist that، شکل پایهٔ فعل در جملهٔ وابسته می‌آید." },
  { id: "p-c1-5", level: "C1", question: "Choose the most natural collocation.", options: ["draw a conclusion", "pull a conclusion", "make a conclusion", "take a conclusion"], answer: "draw a conclusion", explanation: "Draw a conclusion هم‌نشینی طبیعی و رایج است." },
  { id: "p-c1-6", level: "C1", question: "The findings, ___ preliminary, are promising.", options: ["albeit", "despite of", "whereas of", "unless"], answer: "albeit", explanation: "Albeit به معنی «هرچند» است و در این جمله به‌صورت پیونددهندهٔ فشرده به‌کار می‌رود." },
];

lessons.push(...(expandedLessons as any));

const reviewWords = lessons.flatMap((lesson) =>
  lesson.words.map((word) => ({ ...word, lessonId: lesson.id, level: lesson.level })),
);

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function makePlacement(previous: string[][]): Question[] {
  const lastRun = previous[previous.length - 1] ?? [];
  // Six questions per CEFR band, presented from easier to harder.
  return LEVELS.flatMap((level) => {
    const pool = shuffle(placementPool.filter((question) => question.level === level));
    const fresh = pool.filter((question) => !lastRun.includes(question.id));
    return (fresh.length >= 6 ? fresh : pool).slice(0, 6);
  });
}

function estimateLevel(answers: Record<string, string>): Level {
  let highest: Level = "A0";
  for (const level of LEVELS) {
    const group = placementPool.filter((question) => question.level === level && question.id in answers);
    if (group.length === 0) break;
    const correct = group.filter((question) => answers[question.id] === question.answer).length;
    if (correct >= Math.ceil(group.length * (2 / 3))) highest = level;
    else break;
  }
  return highest;
}

const GRAMMAR_GUIDES: Record<string, { rule: string; form: string; examples: string[]; mistake: string }> = {
  "a0-2": { rule: "ضمیر فاعلی نشان می‌دهد چه کسی یا چه چیزی کار را انجام می‌دهد. در انگلیسی معمولاً فاعل را حذف نمی‌کنیم.", form: "I / You / He / She / It / We / They + فعل", examples: ["I study English. — من انگلیسی می‌خوانم.", "They live here. — آن‌ها اینجا زندگی می‌کنند."], mistake: "برای یک مرد از he و برای یک زن از she استفاده کن؛ برای اشیا معمولاً it می‌آید." },
  "a0-3": { rule: "فعل to be برای معرفی، توصیف و گفتن حالت یا مکان به‌کار می‌رود.", form: "I am · He/She/It is · You/We/They are", examples: ["I am ready. — من آماده‌ام.", "She is happy. — او خوشحال است.", "We are at home. — ما خانه هستیم."], mistake: "نگو I is یا they is؛ شکل فعل باید با فاعل هماهنگ باشد." },
  "a0-4": { rule: "برای منفی کردن to be، کلمهٔ not را بعد از آن می‌آوریم. برای سؤال، فعل to be را قبل از فاعل قرار می‌دهیم.", form: "منفی: فاعل + am/is/are + not · سؤال: Am/Is/Are + فاعل ...?", examples: ["He is not busy. — او مشغول نیست.", "Are you ready? — آماده‌ای؟"], mistake: "با to be معمولاً do/does نمی‌آوریم؛ «Do you are ready?» نادرست است." },
  "a1-1": { rule: "حال ساده برای عادت‌ها، برنامه‌های تکراری و واقعیت‌هاست. در جملهٔ مثبت، با he/she/it معمولاً به فعل s یا es اضافه می‌شود.", form: "I/You/We/They + فعل پایه · He/She/It + فعل s/es", examples: ["I play football every week. — هر هفته فوتبال بازی می‌کنم.", "She watches TV at night. — او شب‌ها تلویزیون تماشا می‌کند."], mistake: "بعد از does یا doesn't فعل را به شکل پایه برگردان: Does she work? نه Does she works?" },
  "a1-2": { rule: "برای سؤال و منفی در حال ساده از do یا does کمک می‌گیریم. Does برای he/she/it و do برای I/you/we/they است.", form: "سؤال: Do/Does + فاعل + فعل پایه؟ · منفی: فاعل + don't/doesn't + فعل پایه", examples: ["Do you like tea? — چای دوست داری؟", "He doesn't work here. — او اینجا کار نمی‌کند."], mistake: "وقتی does یا doesn't داریم، به فعل اصلی s اضافه نکن." },
  "a1-3": { rule: "حال استمراری کاری را نشان می‌دهد که همین حالا یا در یک دورهٔ موقت در جریان است.", form: "فاعل + am/is/are + فعل-ing", examples: ["I'm reading now. — الان دارم مطالعه می‌کنم.", "They are staying with us this week. — این هفته پیش ما می‌مانند."], mistake: "فعل کمکی to be را حذف نکن؛ «She working» جملهٔ کامل نیست." },
  "a1-4": { rule: "گذشتهٔ ساده برای کاری است که در گذشته تمام شده؛ زمان‌هایی مثل yesterday و last week اغلب نشانهٔ آن هستند.", form: "مثبت: فاعل + فعل گذشته · منفی: didn't + فعل پایه · سؤال: Did + فاعل + فعل پایه؟", examples: ["We watched a film. — فیلمی تماشا کردیم.", "Did you go out? — بیرون رفتی؟"], mistake: "بعد از did/didn't شکل پایه می‌آید: Did you see? نه Did you saw?" },
  "a2-1": { rule: "حال کامل تجربه یا نتیجه‌ای را به زمان حال پیوند می‌دهد؛ زمان دقیق و تمام‌شده معمولاً با گذشتهٔ ساده می‌آید.", form: "فاعل + have/has + قسمت سوم فعل (V3)", examples: ["I've visited London twice. — دو بار لندن رفته‌ام.", "She has lost her keys. — کلیدهایش را گم کرده است."], mistake: "برای yesterday معمولاً گذشتهٔ ساده بگو: I saw him yesterday، نه I have seen him yesterday." },
  "a2-2": { rule: "صفت مقایسه‌ای برای مقایسهٔ دو چیز استفاده می‌شود. بسیاری از صفت‌های کوتاه er می‌گیرند و صفت‌های بلند با more می‌آیند.", form: "صفت کوتاه + -er + than · more + صفت بلند + than", examples: ["This bag is cheaper than that one. — این کیف ارزان‌تر از آن است.", "English is more interesting than I expected. — انگلیسی از چیزی که انتظار داشتم جالب‌تر است."], mistake: "good → better و bad → worse؛ این‌ها بی‌قاعده‌اند." },
  "a2-3": { rule: "going to بیشتر برای قصد یا برنامهٔ از قبل شکل‌گرفته است؛ will برای تصمیم لحظه‌ای، قول و پیش‌بینی هم به‌کار می‌رود.", form: "فاعل + am/is/are going to + فعل پایه · فاعل + will + فعل پایه", examples: ["I'm going to study tonight. — قصد دارم امشب درس بخوانم.", "I'll help you. — کمکت می‌کنم."], mistake: "بعد از will، to نمی‌آید: will go، نه will to go." },
  "a2-4": { rule: "افعال وجهی معنی توانایی، توصیه یا درخواست را اضافه می‌کنند و پس از آن‌ها فعل پایه می‌آید.", form: "can / should / could + فعل پایه", examples: ["I can swim. — می‌توانم شنا کنم.", "You should rest. — بهتر است استراحت کنی.", "Could you help me? — ممکن است کمکم کنی؟"], mistake: "پس از should یا can از to استفاده نکن: should go، نه should to go." },
  "b1-1": { rule: "شرطی نوع اول دربارهٔ شرطی واقعی یا محتمل در آینده است.", form: "If + حال ساده، will + فعل پایه", examples: ["If it rains, we'll stay home. — اگر باران ببارد، خانه می‌مانیم.", "If you study, you'll improve. — اگر درس بخوانی، پیشرفت می‌کنی."], mistake: "در بخش if معمولاً will نمی‌آوریم: If she arrives، نه If she will arrive." },
  "b1-2": { rule: "جمله‌وارهٔ موصولی اطلاعات بیشتری دربارهٔ یک اسم می‌دهد. who برای افراد، which برای چیزها و whose برای مالکیت است.", form: "اسم + who/which/that/whose + توضیح", examples: ["The woman who called is my aunt. — زنی که زنگ زد خاله‌ام است.", "The phone that I bought is new. — تلفنی که خریدم نو است."], mistake: "برای مالکیت از whose استفاده کن؛ who به‌تنهایی معنی «که مال اوست» نمی‌دهد." },
  "b1-3": { rule: "گذشتهٔ کامل رویدادی را نشان می‌دهد که پیش از رویداد دیگری در گذشته رخ داده بود.", form: "فاعل + had + قسمت سوم فعل (V3)", examples: ["The film had started before we arrived. — فیلم پیش از رسیدن ما شروع شده بود."], mistake: "ترتیب رویدادها مهم است؛ برای هر اتفاق گذشته‌ای خودکار گذشتهٔ کامل به‌کار نبر." },
  "b1-4": { rule: "در نقل‌قول غیرمستقیم، وقتی فعل گزارش در گذشته باشد، زمان فعل اغلب یک مرحله به گذشته می‌رود؛ ضمیرها هم با گوینده هماهنگ می‌شوند.", form: "She said, “I am tired.” → She said (that) she was tired.", examples: ["He said, “I have finished.” → He said he had finished."], mistake: "تغییر زمان همیشه اجباری نیست؛ اگر واقعیت هنوز برقرار باشد، بافت جمله مهم است." },
  "b2-1": { rule: "شرطی نوع سوم برای تصور نتیجهٔ متفاوتی در گذشته است؛ معمولاً آن اتفاق دیگر قابل تغییر نیست.", form: "If + had + V3، would have + V3", examples: ["If I had left earlier, I would have caught the train. — اگر زودتر راه افتاده بودم، به قطار می‌رسیدم."], mistake: "بعد از would have باید قسمت سوم فعل بیاید: would have gone، نه would have went." },
  "b2-2": { rule: "مجهول زمانی مناسب است که انجام‌دهنده نامعلوم، بدیهی یا کم‌اهمیت باشد و تمرکز روی عمل یا نتیجه باشد.", form: "شکل مناسب be + قسمت سوم فعل (V3)", examples: ["The report was written yesterday. — گزارش دیروز نوشته شد.", "The results will be announced tomorrow. — نتایج فردا اعلام خواهند شد."], mistake: "زمان در شکل be مشخص می‌شود؛ در مجهول آینده از will be + V3 استفاده کن." },
  "b2-3": { rule: "در سبک رسمی، اگر عبارت منفی یا محدودکننده‌ای مثل Never یا Rarely ابتدای جمله بیاید، معمولاً فعل کمکی قبل از فاعل می‌آید.", form: "Never/Rarely + فعل کمکی + فاعل + فعل اصلی", examples: ["Never have I seen this. — هرگز این را ندیده‌ام.", "Rarely do we get such a chance. — به‌ندرت چنین فرصتی پیدا می‌کنیم."], mistake: "پس از وارونگی، ترتیب را دقیق نگه دار: Never have I seen، نه Never I have seen." },
};
function App() {
  const [saved, setSaved] = useState<SavedState>(loadSaved);
  const [page, setPage] = useState<Page>("home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const [lessonIndex, setLessonIndex] = useState(() => {
    const initial = loadSaved();
    const index = lessons.findIndex((lesson) => lesson.id === initial.currentLessonId);
    return index >= 0 ? index : 0;
  });
  const [lessonChoice, setLessonChoice] = useState("");
  const [lessonChecked, setLessonChecked] = useState(false);
  const [placementQuestions, setPlacementQuestions] = useState<Question[]>([]);
  const [placementIndex, setPlacementIndex] = useState(0);
  const [placementAnswers, setPlacementAnswers] = useState<Record<string, string>>({});
  const [placementFinished, setPlacementFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [practiceWords, setPracticeWords] = useState<string[]>([]);
  const [practiceFeedback, setPracticeFeedback] = useState("");
  const [practiceSentence, setPracticeSentence] = useState("I really like football");
  const [reviewAnswer, setReviewAnswer] = useState<Record<string, boolean>>({});
  const [reviewInput, setReviewInput] = useState<Record<string, string>>({});
  const [reviewFeedback, setReviewFeedback] = useState<Record<string, string>>({});
  const [writingText, setWritingText] = useState("");
  const [writingFeedback, setWritingFeedback] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      setNotice("ذخیره‌سازی مرورگر در دسترس نیست؛ فضای ذخیره‌سازی را بررسی کن.");
    }
  }, [saved]);

  const updateSaved = (patch: Partial<SavedState>) => {
    setSaved((current) => ({ ...current, ...patch }));
  };

  const go = (next: Page) => {
    setPage(next);
    setMobileMenu(false);
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentLesson = lessons[lessonIndex] ?? lessons[0];
  const completedCount = saved.completedLessons.length;
  const progress = Math.round((completedCount / lessons.length) * 100);
  const reviewQueue = useMemo(() => {
    const now = Date.now();
    return reviewWords.filter((word) => {
      const nextReview = saved.reviewDates[word.word] ?? 0;
      return nextReview <= now;
    });
  }, [saved.reviewDates, saved.reviewedWords]);

  const startLesson = (id: string) => {
    const index = lessons.findIndex((lesson) => lesson.id === id);
    if (index < 0) return;
    setLessonIndex(index);
    updateSaved({ currentLessonId: id });
    setLessonChoice("");
    setLessonChecked(false);
    go("lesson");
  };

  const recordSkill = (skill: "reading" | "listening" | "speaking" | "writing") => {
    setSaved((current) => ({ ...current, skillProgress: { ...emptyState.skillProgress, ...(current.skillProgress ?? {}), [skill]: ((current.skillProgress ?? {})[skill] ?? 0) + 1 } }));
  };

  const speakLessonExample = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentLesson.example);
      utterance.lang = "en-US"; utterance.rate = 0.82; window.speechSynthesis.speak(utterance);
      recordSkill("listening"); setNotice("نمونهٔ انگلیسی پخش شد؛ یک بار دیگر گوش بده و سپس خودت تکرار کن.");
    } else setNotice("مرورگر شما پخش گفتار را پشتیبانی نمی‌کند.");
  };

  const completeLesson = () => {
    const today = new Date().toISOString().slice(0, 10);
    setSaved((current) => ({
      ...current,
      completedLessons: current.completedLessons.includes(currentLesson.id)
        ? current.completedLessons
        : [...current.completedLessons, currentLesson.id],
      currentLessonId: lessons[(lessonIndex + 1) % lessons.length].id,
      lastStudyDate: today,
      studiedToday: current.lastStudyDate === today ? current.studiedToday + currentLesson.minutes : currentLesson.minutes,
    }));
    setNotice("آفرین! درس ثبت شد و پیشرفتت ذخیره شد.");
  };

  const startQuiz = () => {
    const questions = makePlacement(saved.placementHistory);
    setPlacementQuestions(questions);
    setPlacementIndex(0);
    setPlacementAnswers({});
    setPlacementFinished(false);
    setSelectedAnswer("");
    setNotice("");
    go("placement");
  };

  const currentPlacement = placementQuestions[placementIndex];
  const placementScore = placementQuestions.filter(
    (question) => placementAnswers[question.id] === question.answer,
  ).length;
  const estimatedLevel = estimateLevel(placementAnswers);

  const submitPlacement = () => {
    if (!currentPlacement || !selectedAnswer) {
      setNotice("لطفاً یک گزینه را انتخاب کن.");
      return;
    }
    const nextAnswers = { ...placementAnswers, [currentPlacement.id]: selectedAnswer };
    setPlacementAnswers(nextAnswers);
    setSelectedAnswer("");
    setNotice("");
    if (placementIndex < placementQuestions.length - 1) {
      setPlacementIndex((index) => index + 1);
    } else {
      setPlacementFinished(true);
      const result = estimateLevel(nextAnswers);
      const history = [...saved.placementHistory, placementQuestions.map((q) => q.id)].slice(-8);
      updateSaved({
        placementHistory: history,
        placementResult: result,
        level: result,
        currentLessonId: lessons.find((lesson) => lesson.level === result)?.id ?? "a0-1",
      });
    }
  };

  const checkLesson = () => {
    setLessonChecked(true);
    if (lessonChoice === currentLesson.answer) {
      recordSkill("reading");
      setNotice("آفرین! پاسخ درست است. " + currentLesson.feedback);
    } else {
      setNotice("هنوز درست نیست. " + currentLesson.feedback);
    }
  };

  const nextLesson = () => {
    const next = Math.min(lessonIndex + 1, lessons.length - 1);
    setLessonIndex(next);
    updateSaved({ currentLessonId: lessons[next].id });
    setLessonChoice("");
    setLessonChecked(false);
    setNotice("");
  };

  const markReviewed = (word: string, confidence: "easy" | "hard") => {
    const intervals = confidence === "easy" ? 3 * 24 * 60 * 60 * 1000 : 10 * 60 * 1000;
    updateSaved({
      reviewedWords: saved.reviewedWords.includes(word)
        ? saved.reviewedWords
        : [...saved.reviewedWords, word],
      reviewDates: {
        ...saved.reviewDates,
        [word]: Date.now() + intervals,
      },
    });
    setReviewFeedback((current) => ({
      ...current,
      [word]: confidence === "easy"
        ? "عالی! این واژه سه روز دیگر برای مرور برنامه‌ریزی شد."
        : "اشکالی ندارد؛ این واژه برای مرور دوباره در چند دقیقهٔ آینده زمان‌بندی شد.",
    }));
  };

  const addPracticeWord = (word: string) => {
    setPracticeWords((current) => [...current, word]);
    setPracticeFeedback("");
  };

  const removePracticeWord = (index: number) => {
    setPracticeWords((current) => current.filter((_, i) => i !== index));
    setPracticeFeedback("");
  };

  const checkPractice = () => {
    const sentence = practiceWords.join(" ").replace(/[.!?]$/, "").toLowerCase().trim();
    const accepted = ["i like football", "i really like football"];
    setPracticeFeedback(
      accepted.includes(sentence)
        ? "عالیه! جمله درست است. حالا بدون دیدن کلمه‌ها دوباره آن را بساز."
        : "هنوز درست نیست. برای این تمرین می‌توانی جملهٔ I really like football را بسازی. ترتیب پیشنهادی: I + really + like + football.",
    );
  };

  const checkWriting = () => {
    const words = writingText.trim().split(/\s+/).filter(Boolean);
    if (words.length < 4) {
      setWritingFeedback("کمی بیشتر بنویس؛ تلاش کن دست‌کم یک جملهٔ کامل با چهار کلمه یا بیشتر بسازی.");
      return;
    }
    const hasCapital = /^[A-Z]/.test(writingText.trim());
    const hasEnding = /[.!?]$/.test(writingText.trim());
    setWritingFeedback(
      `${hasCapital ? "شروع جمله با حرف بزرگ خوب است." : "جمله را با حرف بزرگ شروع کن."} ${hasEnding ? "نشانهٔ پایانی را درست گذاشته‌ای." : "در پایان جمله نقطه، سؤال یا علامت تعجب بگذار."} این بررسی اولیه است و هنوز جایگزین ارزیابی کامل دستور زبان نیست.`,
    );
  };

  return (
    <div className="app-shell" dir="rtl">
      <header className="topbar">
        <div className="topbar-inner">
          <button className="brand" onClick={() => go("home")} aria-label="صفحه اصلی واژه‌نو">
            <span className="brand-mark">و</span>
            <span className="brand-name">واژه‌نو</span>
          </button>
          <button className="mobile-menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="باز کردن منو">☰</button>
          <nav className={`top-links ${mobileMenu ? "is-open" : ""}`}>
            <button onClick={() => go("home")}>صفحهٔ اصلی</button>
            <button onClick={() => go("path")}>مسیر یادگیری</button>
            <button onClick={() => go("skills")}>مهارت‌ها</button>
            <button onClick={() => go("assessment")}>ارزیابی مرحله‌ای</button>
          </nav>
          <div className="top-actions">
            <button className="button button-ghost small-button" onClick={() => go("dashboard")}>فضای یادگیری</button>
            <button className="button button-primary small-button" onClick={startQuiz}>تعیین سطح</button>
          </div>
        </div>
      </header>

      {page === "home" && (
        <main>
          <section className="hero section-container">
            <div className="hero-copy">
              <span className="eyebrow"><span className="eyebrow-dot" /> یادگیری اصولی، قدم‌به‌قدم</span>
              <h1>انگلیسی را<br /><span className="gradient-text">واقعاً یاد بگیر.</span></h1>
              <p className="hero-description">از اولین جمله‌ها تا درک متن‌های پیشرفته؛ با آموزش فارسی، تمرین فعال و مسیر متناسب با سطح خودت.</p>
              <div className="hero-actions">
                <button className="button button-primary button-large" onClick={startQuiz}>شروع تعیین سطح <span>←</span></button>
                <button className="button button-ghost button-large" onClick={() => go("path")}>دیدن دوره‌ها</button>
              </div>
              <div className="hero-trust"><span className="trust-icon">✓</span> شش سطح از A0 تا C1 <span className="trust-separator">·</span> توضیح فارسی <span className="trust-separator">·</span> ذخیرهٔ پیشرفت</div>
            </div>
            <div className="hero-visual">
              <div className="glow-orb glow-one" />
              <div className="glow-orb glow-two" />
              <div className="learning-card main-learning-card">
                <div className="learning-card-top"><span className="mini-label">درس نمونه</span><span className="lesson-number">A0 / C1</span></div>
                <div className="lesson-illustration">Aa</div>
                <h3>اولین جملهٔ تو</h3>
                <p className="english-example">I am learning English.</p>
                <p className="persian-example">من دارم انگلیسی یاد می‌گیرم.</p>
                <div className="card-progress"><span /></div>
                <div className="card-footer"><span>پیشرفت دوره</span><strong>{progress}٪</strong></div>
              </div>
              <div className="floating-note note-top"><span className="note-icon purple-icon">✦</span><div><strong>مسیر شخصی‌سازی‌شده</strong><small>بر اساس نتیجهٔ آزمون</small></div></div>
              <div className="floating-note note-bottom"><span className="note-icon green-icon">✓</span><div><strong>تمرین و مرور</strong><small>با ذخیرهٔ پیشرفت</small></div></div>
              <div className="visual-decoration decoration-one">Aa</div><div className="visual-decoration decoration-two">文</div>
            </div>
          </section>
          <section className="stats-strip section-container">
            <div><strong>۶ سطح</strong><span>از A0 تا C1</span></div>
            <div><strong>{lessons.length} درس</strong><span>آموزش مرحله‌ای</span></div>
            <div><strong>۴ مهارت</strong><span>خواندن، شنیدن، نوشتن، گفتن</span></div>
            <div><strong>مرور زمان‌بندی‌شده</strong><span>برای ماندگاری بیشتر</span></div>
          </section>
          <section className="section-container section-block">
            <div className="section-heading"><span className="eyebrow">روش واژه‌نو</span><h2>فقط حفظ نکن؛ <span className="gradient-text">یاد بگیر استفاده کنی.</span></h2><p>از یادگیری مفهوم تا استفادهٔ مستقل از آن پیش برو.</p></div>
            <div className="feature-grid">
              <article className="feature-card"><div className="feature-icon purple-icon">✧</div><h3>توضیح روشن فارسی</h3><p>قواعد را با مثال و نکته‌های کاربردی یاد بگیر.</p><span className="feature-index">01</span></article>
              <article className="feature-card"><div className="feature-icon blue-icon">✎</div><h3>جمله‌سازی واقعی</h3><p>خودت کلمات را مرتب کن و جمله بساز.</p><span className="feature-index">02</span></article>
              <article className="feature-card"><div className="feature-icon green-icon">↻</div><h3>مرور زمان‌بندی‌شده</h3><p>واژه‌ها را دوباره تمرین کن تا بهتر در حافظه بمانند.</p><span className="feature-index">03</span></article>
              <article className="feature-card"><div className="feature-icon orange-icon">◈</div><h3>پیشرفت واقعی</h3><p>تکمیل درس‌ها و نتیجهٔ تمرین‌ها ثبت می‌شوند.</p><span className="feature-index">04</span></article>
            </div>
          </section>
          <section className="cta-section section-container"><div><span className="eyebrow">شروع مسیر تو</span><h2>قدم اول را همین امروز بردار.</h2><p>به ۳۶ سؤال از آسان به سخت پاسخ بده؛ نتیجه نقطهٔ شروع مناسب‌تری پیشنهاد می‌کند.</p></div><button className="button button-light button-large" onClick={startQuiz}>شروع تعیین سطح <span>←</span></button></section>
        </main>
      )}

      {page !== "home" && (
        <div className="workspace section-container">
          <aside className={`sidebar ${mobileMenu ? "is-open" : ""}`}>
            <div className="sidebar-user"><div className="avatar">{saved.userName.slice(0, 1) || "و"}</div><div><strong>{saved.userName}</strong><span>سطح {saved.placementResult ?? saved.level}</span></div></div>
            <div className="sidebar-label">فضای یادگیری</div>
            {([
              ["dashboard", "داشبورد من", "▦"],
              ["path", "مسیر یادگیری", "⌁"],
              ["lesson", "درس امروز", "▤"],
              ["practice", "جمله‌سازی", "✎"],
              ["review", "مرور هوشمند", "↻"],
              ["skills", "مهارت‌ها", "◉"],
              ["assessment", "ارزیابی مرحله‌ای", "✓"],
              ["settings", "تنظیمات", "⚙"],
            ] as [Page, string, string][]).map(([id, label, icon]) => (
              <button key={id} className={`sidebar-link ${page === id ? "active" : ""}`} onClick={() => go(id)}>
                <span className="sidebar-link-icon">{icon}</span>{label}
                {id === "review" && <span className="sidebar-count">{reviewQueue.length}</span>}
              </button>
            ))}
            <div className="sidebar-help"><span>✦</span><strong>قدم‌به‌قدم پیش برو</strong><p>پیشرفت کوچک هر روز، نتیجهٔ بزرگ می‌سازد.</p><button onClick={() => go("path")}>ادامهٔ مسیر ←</button></div>
            <button className="sidebar-home" onClick={() => go("home")}>← بازگشت به صفحهٔ اصلی</button>
          </aside>

          <section className="workspace-content">
            {page === "assessment" && <StageAssessment onBack={() => go("dashboard")} />}
            {page === "listening" && <ListeningPractice onBack={() => go("skills")} />}
            {page === "speaking" && <SpeakingPractice onBack={() => go("skills")} />}
            {page === "dashboard" && (
              <>
                <div className="page-heading"><div><span className="eyebrow">فضای شخصی تو</span><h1>خوش برگشتی، {saved.userName}! 👋</h1><p>هر روز کمی تمرین، تو را جلوتر می‌برد.</p></div><button className="button button-primary" onClick={() => startLesson(saved.currentLessonId)}>ادامهٔ یادگیری ←</button></div>
                <div className="welcome-banner"><div><span className="banner-label">هدف امروز: {saved.dailyGoal}</span><h2>یک قدم دیگر بردار.</h2><p>سطح فعلی: {saved.placementResult ?? saved.level} · {saved.studiedToday} دقیقه مطالعهٔ امروز</p><button className="button button-light" onClick={() => startLesson(saved.currentLessonId)}>شروع درس</button></div><div className="banner-symbol">✦</div></div>
                <div className="metric-grid">
                  <div className="metric-card"><span className="metric-icon purple-icon">⌁</span><span>پیشرفت دوره</span><strong>{progress}%</strong><div className="mini-progress"><span style={{ width: `${progress}%` }} /></div></div>
                  <div className="metric-card"><span className="metric-icon green-icon">✓</span><span>درس‌های تکمیل‌شده</span><strong>{completedCount} <small>از {lessons.length}</small></strong></div>
                  <div className="metric-card"><span className="metric-icon orange-icon">↻</span><span>برای مرور</span><strong>{reviewQueue.length} <small>واژه</small></strong></div>
                  <div className="metric-card"><span className="metric-icon blue-icon">◷</span><span>هدف روزانه</span><strong>{saved.dailyGoal}</strong></div>
                </div>
                <div className="panel profile-skills"><div className="panel-heading"><div><h3>پروفایل مهارتی تو</h3><p>پیشرفت هر مهارت جداگانه ثبت می‌شود؛ با تمرین‌های داخل درس، نوارها به‌روز می‌شوند.</p></div><span className="level-pill">۴ مهارت</span></div><div className="profile-skill-grid">{([{key:"reading",en:"Reading",fa:"خواندن",icon:"文"},{key:"listening",en:"Listening",fa:"شنیدن",icon:"♫"},{key:"speaking",en:"Speaking",fa:"گفتار",icon:"◉"},{key:"writing",en:"Writing",fa:"نوشتن",icon:"✎"}] as const).map((skill) => { const score = Math.min(100, (saved.skillProgress?.[skill.key] ?? 0) * 5); return <div className="profile-skill" key={skill.key}><div className="profile-skill-top"><span className="profile-skill-icon">{skill.icon}</span><div><strong>{skill.fa}</strong><small>{skill.en}</small></div><b>{score}٪</b></div><div className="mini-progress"><span style={{width: score + "%"}} /></div><small>{saved.skillProgress?.[skill.key] ?? 0} تمرین ثبت‌شده</small></div>; })}</div></div>
                <div className="content-grid">
                  <div className="panel"><div className="panel-heading"><div><h3>درس بعدی</h3><p>بر اساس مسیر دوره</p></div><button className="text-button" onClick={() => go("path")}>همهٔ درس‌ها ←</button></div><div className="next-lesson"><div className="next-lesson-icon">Aa</div><div className="next-lesson-info"><span className="lesson-tag">{currentLesson.level} · {currentLesson.category}</span><h4>{currentLesson.title}</h4><p>{currentLesson.minutes} دقیقه · همراه با تمرین</p></div><button className="round-arrow" onClick={() => startLesson(currentLesson.id)}>←</button></div></div>
                  <div className="panel"><div className="panel-heading"><div><h3>سطح‌های دوره</h3><p>مسیر آموزشی</p></div></div>{LEVELS.map((level) => { const total = lessons.filter((l) => l.level === level).length; const done = lessons.filter((l) => l.level === level && saved.completedLessons.includes(l.id)).length; return <div className="skill-row" key={level}><span>{level}</span><div className="skill-track"><span style={{ width: `${total ? done / total * 100 : 0}%` }} /></div><small>{done}/{total}</small></div>; })}</div>
                </div>
              </>
            )}

            {page === "placement" && (
              <div className="quiz-wrap">
                <div className="quiz-top"><button className="text-button" onClick={() => go("home")}>← بازگشت</button><span>تعیین سطح چندمرحله‌ای</span></div>
                {!placementFinished ? (
                  <div className="quiz-card panel">
                    <div className="quiz-progress-label"><span>سؤال {placementIndex + 1} از {placementQuestions.length}</span><span>{Math.round(placementIndex / placementQuestions.length * 100)}٪</span></div>
                    <div className="quiz-progress"><span style={{ width: `${placementIndex / placementQuestions.length * 100}%` }} /></div>
                    <span className="eyebrow">سطح {currentPlacement?.level} · پاسخ‌ها را با دقت انتخاب کن</span>
                    <h2>{currentPlacement?.question}</h2>
                    <div className="quiz-options">
                      {currentPlacement?.options.map((option, index) => <button key={option} className={`quiz-option ${selectedAnswer === option ? "selected" : ""}`} onClick={() => setSelectedAnswer(option)}><span className="option-letter">{String.fromCharCode(65 + index)}</span>{option}<span className="option-check">{selectedAnswer === option ? "✓" : ""}</span></button>)}
                    </div>
                    {notice && <p className="notice">{notice}</p>}
                    <button className="button button-primary button-large full-button" onClick={submitPlacement}>{placementIndex === placementQuestions.length - 1 ? "مشاهدهٔ نتیجه" : "سؤال بعدی"} ←</button>
                    <p className="quiz-footnote">آزمون شامل ۳۶ سؤال در شش سطح A0 تا C1 است و از آسان به سخت پیش می‌رود. آزمون‌های بین‌المللی تعداد ثابتی ندارند؛ این آزمون از چارچوب CEFR الهام گرفته و رسمی نیست. شنیدن، گفتار و نوشتار نیز برای ارزیابی کامل باید جداگانه سنجیده شوند.</p>
                  </div>
                ) : (
                  <div className="quiz-card panel quiz-result">
                    <div className="result-symbol">✦</div><span className="eyebrow">نتیجهٔ آزمون</span>
                    <h2>سطح پیشنهادی تو: {estimatedLevel}</h2>
                    <div className="score-circle"><strong>{placementScore}</strong><span>از {placementQuestions.length}</span></div>
                    <p>پاسخ درست: {placementScore} از {placementQuestions.length}. سطح پیشنهادی بر اساس عملکرد در سؤال‌های هر سطح محاسبه شده است؛ این نتیجه تخمینی است و آزمون رسمی CEFR محسوب نمی‌شود.</p>
                    <button className="button button-primary button-large full-button" onClick={() => { const first = lessons.find((lesson) => lesson.level === estimatedLevel) ?? lessons[0]; startLesson(first.id); }}>شروع دورهٔ {estimatedLevel} ←</button>
                    <button className="text-button" onClick={startQuiz}>آزمون تازه با سؤال‌های متفاوت</button>
                  </div>
                )}
              </div>
            )}

            {page === "path" && (
              <>
                <div className="page-heading"><div><span className="eyebrow">نقشهٔ راه تو</span><h1>مسیر یادگیری</h1><p>درس‌ها را به ترتیب یا از سطح مورد نیازت انتخاب کن.</p></div><span className="level-pill">سطح: {saved.placementResult ?? saved.level}</span></div>
                <div className="path-overview panel"><div><span>پیشرفت دوره</span><strong>{progress}٪</strong></div><div className="mini-progress"><span style={{ width: `${progress}%` }} /></div><p>{completedCount} درس از {lessons.length} درس تکمیل شده است.</p></div>
                {LEVELS.map((level) => {
                  const group = lessons.filter((lesson) => lesson.level === level);
                  return <div key={level} className="path-level-group">
                    <h2>{level} <span className="level-pill">{group.length} درس</span></h2>
                    <div className="path-list">
                      {group.map((lesson) => {
                        const done = saved.completedLessons.includes(lesson.id);
                        return <article className={`path-lesson panel ${done ? "completed" : ""}`} key={lesson.id}>
                          <div className="path-step">{done ? "✓" : String(lessons.indexOf(lesson) + 1).padStart(2, "0")}</div>
                          <div className="path-lesson-info"><div className="path-meta"><span>{lesson.level}</span><span>{lesson.minutes} دقیقه</span>{done && <span className="done-label">تکمیل‌شده</span>}</div><h3>{lesson.title}</h3><p>{lesson.category} · آموزش، مثال و تمرین</p></div>
                          <button className={done ? "button button-ghost" : "button button-primary"} onClick={() => startLesson(lesson.id)}>{done ? "مرور درس" : "شروع درس"} ←</button>
                        </article>;
                      })}
                    </div>
                  </div>;
                })}
                <div className="info-note">مسیر واژه‌نو اکنون شامل درس‌های بیشتر در شش سطح A0 تا C1 است. در هر درس، توضیح فارسی، مثال، واژگان و تمرین تعاملی قرار دارد و تمرین‌های شنیدن، گفتن و نوشتن نیز به همان صفحه اضافه شده‌اند. این مسیر همچنان در حال گسترش و بازبینی آموزشی است.</div>
              </>
            )}

            {page === "lesson" && (
              <div className="lesson-page">
                <div className="page-heading"><div><span className="eyebrow">درس تعاملی · {currentLesson.level}</span><h1>{currentLesson.title}</h1><p>{currentLesson.category} · حدود {currentLesson.minutes} دقیقه</p></div><span className="level-pill">درس {lessonIndex + 1} از {lessons.length}</span></div>
                <div className="lesson-progress"><span style={{ width: `${((lessonIndex + 1) / lessons.length) * 100}%` }} /></div>
                <article className="panel lesson-main-card">
                  <div className="lesson-step-label">مفهوم اصلی</div>
                  <h2>{currentLesson.title}</h2>
                  <p className="lesson-explanation">{currentLesson.explanation}</p>
                  {GRAMMAR_GUIDES[currentLesson.id] && (
                    <section className="grammar-guide" aria-label="توضیح کامل گرامر">
                      <h3>گرامر را قدم‌به‌قدم بفهم</h3>
                      <p>{GRAMMAR_GUIDES[currentLesson.id].rule}</p>
                      <div className="grammar-formula"><strong>ساختار جمله</strong><span dir="ltr">{GRAMMAR_GUIDES[currentLesson.id].form}</span></div>
                      <div className="grammar-examples"><strong>مثال‌های بیشتر</strong>{GRAMMAR_GUIDES[currentLesson.id].examples.map((example) => <p key={example} dir="auto">{example}</p>)}</div>
                      <div className="grammar-mistake"><strong>اشتباه رایج</strong><p>{GRAMMAR_GUIDES[currentLesson.id].mistake}</p></div>
                    </section>
                  )}
                  <div className="example-box"><span>مثال انگلیسی</span><strong dir="ltr">{currentLesson.example}</strong><p>{currentLesson.translation}</p></div>
                  <div className="tip-box"><span>✦ نکتهٔ مهم</span><p>{currentLesson.tip}</p></div>
                  <div className="lesson-question"><h3>{currentLesson.question}</h3>
                    <div className="inline-options">{currentLesson.options.map((option) => <button key={option} className={`quiz-option ${lessonChoice === option ? "selected" : ""}`} onClick={() => { setLessonChoice(option); setLessonChecked(false); setNotice(""); }}>{option}</button>)}</div>
                    <button className="button button-primary" onClick={checkLesson}>بررسی پاسخ</button>
                    {lessonChecked && <div className={`feedback-box ${lessonChoice === currentLesson.answer ? "success" : ""}`}>{lessonChoice === currentLesson.answer ? "آفرین! پاسخ درست است. " : "پاسخ درست: " + currentLesson.answer + ". "}{currentLesson.feedback}</div>}
                  </div>
                  <div className="panel"><h3>واژگان این درس</h3>{currentLesson.words.map((word) => <div className="review-card" key={word.word}><strong dir="ltr">{word.word}</strong><span>{word.meaning}</span><p dir="ltr">{word.example}</p><button className="button button-ghost" onClick={() => markReviewed(word.word, "hard")}>افزودن به مرور</button></div>)}</div>
                  <section className="panel integrated-practice"><div className="panel-heading"><div><span className="eyebrow">تمرین یکپارچه</span><h3>همین درس را با چهار مهارت یاد بگیر</h3><p>گرامر و واژگان را بلافاصله در شنیدن، گفتن و نوشتن به کار ببر.</p></div></div>
                    <div className="integrated-skill-actions">
                      <div className="integrated-skill"><span className="skill-big-icon blue-icon">♫</span><div><strong>شنیدن · Listening</strong><p>مثال همین درس را با تلفظ انگلیسی گوش بده.</p><button className="button button-ghost" onClick={speakLessonExample}>پخش مثال انگلیسی 🔊</button></div></div>
                      <div className="integrated-skill"><span className="skill-big-icon orange-icon">◉</span><div><strong>گفتن · Speaking</strong><p>مثال را با صدای بلند تکرار کن؛ بعد تمرین گفتار را ثبت کن.</p><button className="button button-ghost" onClick={() => { recordSkill("speaking"); setNotice("تمرین گفتاری این درس ثبت شد. برای بازخورد گفتار می‌توانی از بخش گفتار هم استفاده کنی."); }}>تمرین گفتاری را انجام دادم ✓</button><button className="text-button" onClick={() => go("speaking")}>بازخورد گفتار ←</button></div></div>
                      <div className="integrated-skill"><span className="skill-big-icon green-icon">✎</span><div className="integrated-writing"><strong>نوشتن · Writing</strong><p>با موضوع همین درس یک جملهٔ انگلیسی بنویس.</p><textarea className="text-input" rows={3} value={writingText} onChange={(event) => setWritingText(event.target.value)} placeholder={currentLesson.example} /><button className="button button-ghost" onClick={() => { checkWriting(); if (writingText.trim().length >= 8) recordSkill("writing"); }}>بررسی نوشته و ثبت تمرین</button>{writingFeedback && <p className="notice">{writingFeedback}</p>}</div></div>
                    </div><p className="integrated-note">خواندن و درک مطلب با سؤال همین درس سنجیده می‌شود. پاسخ درست، پیشرفت مهارت خواندن را هم ثبت می‌کند.</p>
                  </section>
                  {notice && <p className="notice">{notice}</p>}
                  <div className="lesson-controls">
                    <button className="button button-ghost" disabled={lessonIndex === 0} onClick={() => { setLessonIndex(Math.max(0, lessonIndex - 1)); setLessonChoice(""); setLessonChecked(false); }}>→ درس قبل</button>
                    <button className="button button-ghost" onClick={completeLesson}>ثبت تکمیل درس ✓</button>
                    <button className="button button-primary" onClick={nextLesson}>{lessonIndex === lessons.length - 1 ? "آخرین درس" : "درس بعد ←"}</button>
                  </div>
                </article>
              </div>
            )}

            {page === "practice" && (
              <>
                <div className="page-heading"><div><span className="eyebrow">تمرین فعال</span><h1>خودت جمله بساز</h1><p>کلمه‌ها را به ترتیب کنار هم بگذار و جملهٔ درست بساز.</p></div><span className="level-pill">تمرین جمله‌سازی</span></div>
                <div className="panel practice-panel">
                  <span className="practice-label">معنی جمله</span><h2>من واقعاً فوتبال را دوست دارم.</h2>
                  <p>کلمه‌ها را انتخاب کن. برای حذف یک کلمه، روی آن در کادر جمله کلیک کن.</p>
                  <div className="sentence-area"><span className="sentence-caption">جملهٔ تو</span><div className="sentence-words">{practiceWords.length === 0 ? <span className="sentence-placeholder">کلمه‌ها را از پایین انتخاب کن...</span> : practiceWords.map((word, index) => <button className="word-chip selected-word" key={`${word}-${index}`} onClick={() => removePracticeWord(index)}>{word} ×</button>)}</div></div>
                  <div className="word-bank-label">کلمه‌های موجود</div>
                  <div className="word-bank">{["I", "really", "like", "football", "am", "is", "playing", "the"].map((word, index) => <button className="word-chip" key={`${word}-${index}`} onClick={() => addPracticeWord(word)}>{word} <span>+</span></button>)}</div>
                  <div className="practice-actions"><button className="button button-ghost" onClick={() => { setPracticeWords([]); setPracticeFeedback(""); }}>پاک کردن</button><button className="button button-primary" onClick={checkPractice}>بررسی جمله ←</button></div>
                  {practiceFeedback && <div className={`feedback-box ${practiceFeedback.startsWith("عالیه") ? "success" : ""}`}>{practiceFeedback}</div>}
                </div>
                <div className="panel settings-panel"><h3>تمرین نوشتاری</h3><p>یک جملهٔ انگلیسی دربارهٔ خودت بنویس.</p><textarea className="text-input" rows={4} value={writingText} onChange={(event) => setWritingText(event.target.value)} placeholder="مثلاً: I live in Iran." /><button className="button button-primary" onClick={checkWriting}>بررسی اولیهٔ نوشته</button>{writingFeedback && <p className="notice">{writingFeedback}</p>}</div>
              </>
            )}

            {page === "review" && (
              <>
                <div className="page-heading"><div><span className="eyebrow">برای ماندگاری</span><h1>مرور هوشمند</h1><p>اول معنی را به خاطر بیاور؛ سپس پاسخ را بررسی کن.</p></div><span className="level-pill">{reviewQueue.length} واژهٔ موعدرسیده</span></div>
                <div className="review-list">
                  {(reviewQueue.length ? reviewQueue : reviewWords.filter((word) => !saved.reviewedWords.includes(word.word)).slice(0, 12)).map((item) => (
                    <article className="panel review-card" key={item.word}>
                      <div className="review-word" dir="ltr">{item.word}</div>
                      <div className="review-meaning">
                        {reviewAnswer[item.word] ? <><strong>{item.meaning}</strong><p dir="ltr">{item.example}</p></> : <span>اول معنی این واژه را به خاطر بیاور...</span>}
                        <input className="text-input" value={reviewInput[item.word] ?? ""} onChange={(event) => setReviewInput((current) => ({ ...current, [item.word]: event.target.value }))} placeholder="معنی فارسی (اختیاری)" />
                      </div>
                      {!reviewAnswer[item.word] ? <button className="button button-primary" onClick={() => setReviewAnswer((current) => ({ ...current, [item.word]: true }))}>نمایش پاسخ</button> : <div className="review-actions"><button className="button button-primary" onClick={() => markReviewed(item.word, "easy")}>بلدم ✓</button><button className="button button-ghost" onClick={() => markReviewed(item.word, "hard")}>نیاز به تمرین</button></div>}
                      {reviewFeedback[item.word] && <p className="notice">{reviewFeedback[item.word]}</p>}
                    </article>
                  ))}
                </div>
                {reviewQueue.length === 0 && <div className="info-note">واژهٔ موعدرسیده‌ای برای مرور نداری؛ واژه‌های جدید را از درس‌ها اضافه کن. مرورهای بعدی طبق زمان‌بندی ذخیره‌شده دوباره ظاهر می‌شوند.</div>}
              </>
            )}

            {page === "skills" && (
              <>
                <div className="page-heading"><div><span className="eyebrow">چهار مهارت اصلی</span><h1>مهارت‌های زبان</h1><p>مهارت‌ها را در کنار هم تمرین کن.</p></div></div>
                <div className="skill-cards-grid">
                  <article className="panel skill-card"><div className="skill-big-icon purple-icon">文</div><span className="skill-en">Reading</span><h3>خواندن</h3><p>متن‌های کوتاه درس‌ها را بخوان و معنی را از بافت حدس بزن.</p><button className="text-button" onClick={() => startLesson(saved.currentLessonId)}>شروع تمرین ←</button></article>
                  <article className="panel skill-card"><div className="skill-big-icon blue-icon">♫</div><span className="skill-en">Listening</span><h3>شنیدن</h3><p>به مکالمه‌های کوتاه گوش بده، سرعت را تنظیم کن و با سؤال‌های درک مطلب تمرین کن.</p><button className="text-button" onClick={() => go("listening")}>شروع تمرین ←</button></article>
                  <article className="panel skill-card"><div className="skill-big-icon green-icon">✎</div><span className="skill-en">Writing</span><h3>نوشتن</h3><p>جمله‌های انگلیسی بنویس و بررسی اولیهٔ ساختار را دریافت کن.</p><button className="text-button" onClick={() => go("practice")}>شروع تمرین ←</button></article>
                  <article className="panel skill-card"><div className="skill-big-icon orange-icon">◉</div><span className="skill-en">Speaking</span><h3>گفتن و مکالمه</h3><p>با میکروفون جمله‌ها را تکرار کن و بازخورد اولیه دربارهٔ شباهت گفتارت بگیر.</p><button className="text-button" onClick={() => go("speaking")}>شروع تمرین ←</button></article>
                </div>
                {notice && <p className="notice">{notice}</p>}
              </>
            )}

            {page === "settings" && (
              <>
                <div className="page-heading"><div><span className="eyebrow">فضای شخصی</span><h1>تنظیمات</h1><p>اطلاعات و هدف یادگیری خودت را تغییر بده.</p></div></div>
                <div className="panel settings-panel">
                  <h3>اطلاعات زبان‌آموز</h3><p>تنظیمات در همین مرورگر ذخیره می‌شوند.</p>
                  <label className="field-label" htmlFor="user-name">نام نمایشی</label>
                  <input id="user-name" className="text-input" value={saved.userName} onChange={(event) => updateSaved({ userName: event.target.value })} />
                  <label className="field-label" htmlFor="daily-goal">هدف روزانه</label>
                  <select id="daily-goal" className="text-input" value={saved.dailyGoal} onChange={(event) => updateSaved({ dailyGoal: event.target.value })}><option>۵ دقیقه</option><option>۱۰ دقیقه</option><option>۱۵ دقیقه</option><option>۲۰ دقیقه</option><option>۳۰ دقیقه</option><option>۴۵ دقیقه</option><option>۶۰ دقیقه</option></select>
                  <button className="button button-primary" onClick={() => { updateSaved({ userName: saved.userName.trim() || "دوست زبان‌آموز" }); setNotice("تنظیمات ذخیره شد."); }}>ذخیرهٔ تنظیمات</button>
                  {notice && <p className="notice">{notice}</p>}
                  <div className="info-note">حذف پیشرفت فقط وقتی انجام بده که واقعاً می‌خواهی از ابتدا شروع کنی.</div>
                  <button className="button button-ghost" onClick={() => { if (window.confirm("تمام پیشرفت ذخیره‌شده در این مرورگر پاک شود؟")) { localStorage.removeItem(STORAGE_KEY); setSaved(emptyState); setLessonIndex(0); setNotice("پیشرفت این مرورگر پاک شد."); } }}>پاک کردن پیشرفت این مرورگر</button>
                </div>
              </>
            )}
          </section>
        </div>
      )}

      <footer className="site-footer"><div className="footer-inner"><button className="brand" onClick={() => go("home")}><span className="brand-mark">و</span><span className="brand-name">واژه‌نو</span></button><p>یادگیری زبان با فهمیدن، تمرین کردن و مرور هوشمند.</p><span>نسخهٔ آموزشی اولیه · ۲۰۲۶</span></div></footer>
    </div>
  );
}

export default App;
