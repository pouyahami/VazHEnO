export type Level = "A0" | "A1" | "A2" | "B1" | "B2" | "C1";

export type Lesson = {
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

/** Curriculum v2 — A0 starts with greeting, NOT name introduction */
export const baseLessons: Lesson[] = [
  {
    id: "a0-1",
    level: "A0",
    title: "اولین سلام به انگلیسی",
    category: "مکالمه واقعی",
    minutes: 8,
    explanation:
      "تصور کن وارد یک کلاس یا فروشگاه شده‌ای. اولین چیزی که از دهانت درمی‌آید معمولاً یک سلام است — نه معرفی کامل.\n\nHello تقریباً همه‌جا کار می‌کند. Hi خودمانی‌تر است. موقع رفتن Goodbye یا Bye.\n\nلازم نیست جملهٔ بلند بسازی. همین یک کلمه درِ ارتباط را باز می‌کند.",
    example: "— Hello!\n— Hi!\n— Goodbye!\n— Bye!",
    translation: "— سلام!\n— سلام!\n— خداحافظ!\n— بای!",
    tip: "اگر فقط یک چیز یاد بگیری: Hello برای شروع هر مکالمه کافی است.",
    question: "وقتی کسی را می‌بینی و می‌خواهی سلام کنی، کدام طبیعی‌تر است؟",
    options: ["Bye", "Hello", "Thank you", "From"],
    answer: "Hello",
    feedback: "درست است. Hello برای شروع گفت‌وگوست. Bye برای خداحافظی است.",
    words: [
      { word: "hello", meaning: "سلام", example: "Hello!" },
      { word: "hi", meaning: "سلام خودمانی", example: "Hi!" },
      { word: "goodbye", meaning: "خداحافظ", example: "Goodbye!" },
      { word: "bye", meaning: "بای", example: "Bye!" },
    ],
  },
  {
    id: "a0-2",
    level: "A0",
    title: "بله، نه، لطفاً، ممنون",
    category: "مکالمه واقعی",
    minutes: 9,
    explanation:
      "بعد از سلام، مکالمه با جواب‌های کوتاه جلو می‌رود.\n\nYes = بله · No = نه · Please = لطفاً · Thank you = ممنون\n\nوقتی چیزی تعارف می‌شود، Yes, please مؤدبانه‌تر از Yes تنها است.",
    example: "A: Coffee?\nB: Yes, please.\nA: Here you are.\nB: Thank you.",
    translation: "الف: قهوه؟\nب: بله، لطفاً.\nالف: بفرمایید.\nب: ممنون.",
    tip: "Yes, please لبخند مؤدبانهٔ انگلیسی است.",
    question: "کسی برایت کاری کرده. طبیعی‌ترین واکنش؟",
    options: ["Hello", "Thank you", "Goodbye", "No please"],
    answer: "Thank you",
    feedback: "آفرین. Thank you برای قدردانی است.",
    words: [
      { word: "yes", meaning: "بله", example: "Yes." },
      { word: "no", meaning: "نه", example: "No." },
      { word: "please", meaning: "لطفاً", example: "Yes, please." },
      { word: "thank you", meaning: "ممنون", example: "Thank you." },
    ],
  },
  {
    id: "a0-3",
    level: "A0",
    title: "اسمت چیست؟ معرفی نام",
    category: "مکالمه واقعی",
    minutes: 10,
    explanation:
      "حالا نوبت معرفی است — بعد از سلام، نه قبل از آن.\n\nMy name is + اسم\nشکل کوتاه: I'm + اسم\nسؤال: What's your name?\n\nغلط رایج: My name Ali — بعد از name باید is بیاید.",
    example: "— What's your name?\n— My name is Ali.\n— I'm Sara. Nice to meet you.",
    translation: "— اسمت چیست؟\n— اسم من علی است.\n— من سارا هستم. از آشنایی خوشحالم.",
    tip: "Nice to meet you را بعد از معرفی اضافه کن.",
    question: "کدام جمله درست است؟",
    options: ["My name Reza.", "My name is Reza.", "I name is Reza.", "Me name Reza."],
    answer: "My name is Reza.",
    feedback: "ساختار درست: My name is + اسم.",
    words: [
      { word: "name", meaning: "اسم", example: "My name is Neda." },
      { word: "my", meaning: "ـم", example: "my name" },
      { word: "your", meaning: "ـت", example: "your name" },
      { word: "nice to meet you", meaning: "از آشنایی خوشحالم", example: "Nice to meet you!" },
    ],
  },
  {
    id: "a0-4",
    level: "A0",
    title: "اهل کجایی؟",
    category: "مکالمه واقعی",
    minutes: 10,
    explanation:
      "سؤال رایج بعدی: Where are you from?\nجواب: I'm from + کشور یا شهر.\n\nI'm from Iran. / I'm from Tehran.",
    example: "— Where are you from?\n— I'm from Iran.",
    translation: "— اهل کجایی؟\n— من اهل ایران هستم.",
    tip: "ترتیب: I'm + from + مکان.",
    question: "کدام شکل درست است؟",
    options: ["I from Iran.", "I'm from Iran.", "I'm Iran from.", "From I am Iran."],
    answer: "I'm from Iran.",
    feedback: "I'm from + مکان.",
    words: [
      { word: "from", meaning: "از / اهل", example: "I'm from Iran." },
      { word: "where", meaning: "کجا", example: "Where are you from?" },
      { word: "Iran", meaning: "ایران", example: "I'm from Iran." },
    ],
  },
  {
    id: "a1-1",
    level: "A1",
    title: "ضمیرهای فاعلی",
    category: "ساخت جمله",
    minutes: 12,
    explanation:
      "I, you, he, she, it, we, they\nفاعل معمولاً قبل از فعل می‌آید.",
    example: "I am a student.\nShe is a teacher.\nThey are friends.",
    translation: "من دانش‌آموزم.\nاو معلم است.\nآن‌ها دوست‌اند.",
    tip: "they برای جمع است.",
    question: "___ are my friends.",
    options: ["He", "She", "It", "They"],
    answer: "They",
    feedback: "friends جمع → They.",
    words: [
      { word: "friend", meaning: "دوست", example: "He is my friend." },
      { word: "student", meaning: "دانش‌آموز", example: "I am a student." },
    ],
  },
  {
    id: "a1-2",
    level: "A1",
    title: "am / is / are",
    category: "ساخت جمله",
    minutes: 12,
    explanation:
      "I → am | he/she/it → is | you/we/they → are",
    example: "I am happy.\nShe is a doctor.\nWe are ready.",
    translation: "خوشحالم.\nاو پزشک است.\nآماده‌ایم.",
    tip: "I همیشه با am.",
    question: "My parents ___ at home.",
    options: ["is", "am", "are", "be"],
    answer: "are",
    feedback: "parents جمع → are.",
    words: [
      { word: "happy", meaning: "خوشحال", example: "I am happy." },
      { word: "ready", meaning: "آماده", example: "We are ready." },
    ],
  },
  {
    id: "a1-3",
    level: "A1",
    title: "منفی و سؤال با to be",
    category: "ساخت جمله",
    minutes: 12,
    explanation:
      "منفی: am/is/are + not\nسؤال: فعل قبل از فاعل — Are you ready?",
    example: "She isn't tired.\nAre you ready?",
    translation: "او خسته نیست.\nآماده‌ای؟",
    tip: "با to be از do استفاده نکن.",
    question: "کدام سؤال درست است؟",
    options: ["You are ready?", "Are you ready?", "Do you are ready?", "Is you ready?"],
    answer: "Are you ready?",
    feedback: "Are you ready? ساختار درست است.",
    words: [
      { word: "tired", meaning: "خسته", example: "I'm not tired." },
      { word: "busy", meaning: "مشغول", example: "Are you busy?" },
    ],
  },
  {
    id: "a1-4",
    level: "A1",
    title: "حال ساده و عادت",
    category: "زندگی روزمره",
    minutes: 14,
    explanation:
      "عادت و واقعیت با حال ساده.\nبا he/she/it معمولاً s به فعل اضافه می‌شود: work → works.",
    example: "I work every day.\nShe works at a bank.",
    translation: "هر روز کار می‌کنم.\nاو در بانک کار می‌کند.",
    tip: "I work / he works",
    question: "My brother ___ football every Friday.",
    options: ["play", "plays", "playing", "is play"],
    answer: "plays",
    feedback: "brother = he → plays",
    words: [
      { word: "every day", meaning: "هر روز", example: "I study every day." },
      { word: "usually", meaning: "معمولاً", example: "I usually walk." },
    ],
  },
  {
    id: "a2-1",
    level: "A2",
    title: "do و does",
    category: "ساخت جمله",
    minutes: 14,
    explanation:
      "سؤال/منفی حال ساده (غیر to be): do / does\nبعد از does فعل بدون s: Does she like tea?",
    example: "Does he work here?\nDo you speak English?",
    translation: "آیا اینجا کار می‌کند؟\nانگلیسی حرف می‌زنی؟",
    tip: "Does she like — نه likes",
    question: "___ your sister speak English?",
    options: ["Do", "Does", "Is", "Has"],
    answer: "Does",
    feedback: "sister = she → Does",
    words: [
      { word: "speak", meaning: "صحبت کردن", example: "I speak Persian." },
      { word: "live", meaning: "زندگی کردن", example: "I live here." },
    ],
  },
  {
    id: "a2-2",
    level: "A2",
    title: "حال استمراری",
    category: "زندگی روزمره",
    minutes: 14,
    explanation:
      "کار در جریان الآن: am/is/are + فعلing",
    example: "I'm reading now.\nThe children are playing.",
    translation: "الان دارم می‌خوانم.\nبچه‌ها دارند بازی می‌کنند.",
    tip: "now → اغلب استمراری",
    question: "Look! The children ___ in the garden.",
    options: ["play", "plays", "are playing", "is playing"],
    answer: "are playing",
    feedback: "جمع + الآن → are playing",
    words: [
      { word: "now", meaning: "الان", example: "I'm working now." },
      { word: "look", meaning: "نگاه کن", example: "Look!" },
    ],
  },
  {
    id: "a2-3",
    level: "A2",
    title: "گذشتهٔ ساده",
    category: "داستان روزمره",
    minutes: 15,
    explanation:
      "رویداد تمام‌شده در گذشته.\ngo → went (نه goed)",
    example: "I watched a film.\nWe went home.",
    translation: "فیلم دیدم.\nبه خانه رفتیم.",
    tip: "yesterday → گذشتهٔ ساده",
    question: "Yesterday, we ___ to the museum.",
    options: ["go", "goed", "went", "gone"],
    answer: "went",
    feedback: "گذشتهٔ go = went",
    words: [
      { word: "yesterday", meaning: "دیروز", example: "I worked yesterday." },
      { word: "went", meaning: "رفت", example: "We went home." },
    ],
  },
  {
    id: "a2-4",
    level: "A2",
    title: "will و going to",
    category: "برنامه و تصمیم",
    minutes: 14,
    explanation:
      "going to = برنامه از قبل\nwill = تصمیم لحظه‌ای / قول / پیش‌بینی",
    example: "I'm going to study tonight.\nI'll help you.",
    translation: "امشب درس می‌خوانم.\nکمکت می‌کنم.",
    tip: "بعد از will فعل بدون to",
    question: "We bought tickets. We ___ travel tomorrow.",
    options: ["going to", "are going to", "will to", "are go to"],
    answer: "are going to",
    feedback: "برنامه قبلی → are going to",
    words: [
      { word: "tonight", meaning: "امشب", example: "See you tonight." },
      { word: "tomorrow", meaning: "فردا", example: "I'll call tomorrow." },
    ],
  },
];
