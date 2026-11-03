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

/**
 * مسیر پایه انگلیسی برای فارسی‌زبانان
 * A0 = صفر مطلق: اول سلام و عبارات کوتاه، بعد معرفی، بعد ساختار
 */
export const baseLessons: Lesson[] = [
  // ───────── A0: صفر مطلق ─────────
  {
    id: "a0-1",
    level: "A0",
    title: "سلام و خداحافظی",
    category: "مکالمه",
    minutes: 8,
    explanation:
      "اولین قدم در انگلیسی، سلام کردن است. Hello برای بیشتر موقعیت‌ها مناسب است. Hi غیررسمی‌تر است. برای خداحافظی از Goodbye یا Bye استفاده می‌کنیم. این‌ها جمله‌های کامل نیستند؛ فقط عبارت‌های کوتاه‌اند.",
    example: "Hello!\nHi!\nGoodbye!\nBye!",
    translation: "سلام!\nسلام! (غیررسمی)\nخداحافظ!\nبای!",
    tip: "به کسی که تازه می‌بینی بگو Hello. موقع رفتن بگو Goodbye یا Bye.",
    question: "کدام گزینه برای سلام کردن درست است؟",
    options: ["Bye", "Hello", "Name", "From"],
    answer: "Hello",
    feedback: "برای سلام، Hello درست است. Bye برای خداحافظی است.",
    words: [
      { word: "hello", meaning: "سلام", example: "Hello!" },
      { word: "hi", meaning: "سلام (غیررسمی)", example: "Hi!" },
      { word: "goodbye", meaning: "خداحافظ", example: "Goodbye!" },
      { word: "bye", meaning: "بای / خداحافظ کوتاه", example: "Bye!" },
    ],
  },
  {
    id: "a0-2",
    level: "A0",
    title: "بله، خیر، لطفاً، ممنون",
    category: "مکالمه",
    minutes: 8,
    explanation:
      "Yes یعنی بله و No یعنی خیر. Please یعنی لطفاً و Thank you یعنی ممنون. You're welcome جواب رایج به Thank you است (خواهش می‌کنم). این چهار عبارت در هر مکالمهٔ ساده لازم‌اند.",
    example: "A: Coffee?\nB: Yes, please.\nA: Here you are.\nB: Thank you.\nA: You're welcome.",
    translation:
      "الف: قهوه؟\nب: بله، لطفاً.\nالف: بفرمایید.\nب: ممنون.\nالف: خواهش می‌کنم.",
    tip: "اگر چیزی می‌خواهی، Yes, please مؤدبانه‌تر از Yes تنها است.",
    question: "وقتی کسی به تو کمک می‌کند، معمولاً چه می‌گویی؟",
    options: ["Hello", "Thank you", "Goodbye", "No please"],
    answer: "Thank you",
    feedback: "برای قدردانی می‌گوییم Thank you.",
    words: [
      { word: "yes", meaning: "بله", example: "Yes." },
      { word: "no", meaning: "خیر", example: "No." },
      { word: "please", meaning: "لطفاً", example: "Yes, please." },
      { word: "thank you", meaning: "ممنون", example: "Thank you." },
    ],
  },
  {
    id: "a0-3",
    level: "A0",
    title: "اسم من چیست؟ معرفی نام",
    category: "مکالمه",
    minutes: 10,
    explanation:
      "برای گفتن اسم خودت بگو: My name is + اسم. شکل کوتاه‌تر: I'm + اسم (I'm = I am). برای پرسیدن اسم طرف مقابل: What is your name? یا What's your name?",
    example: "My name is Ali.\nI'm Sara.\nWhat's your name?",
    translation: "اسم من علی است.\nمن سارا هستم.\nاسم تو چیست؟",
    tip: "بعد از My name همیشه is می‌آید: My name is … نه My name Ali.",
    question: "کدام جمله یعنی «اسم من رضا است»؟",
    options: ["My name Reza.", "My name is Reza.", "I name is Reza.", "Me name Reza."],
    answer: "My name is Reza.",
    feedback: "ساختار درست: My name is + اسم.",
    words: [
      { word: "name", meaning: "نام / اسم", example: "My name is Ali." },
      { word: "my", meaning: "ـِ من", example: "my name" },
      { word: "your", meaning: "ـِ تو", example: "your name" },
      { word: "what", meaning: "چه / چیست", example: "What is your name?" },
    ],
  },
  {
    id: "a0-4",
    level: "A0",
    title: "اهل کجا هستی؟",
    category: "مکالمه",
    minutes: 10,
    explanation:
      "برای گفتن محل زندگی یا ملیت می‌گوییم: I'm from + کشور یا شهر. سؤال رایج: Where are you from? جواب: I'm from Iran. / I'm from Tehran.",
    example: "Where are you from?\nI'm from Iran.\nI'm from Tehran.",
    translation: "اهل کجا هستی؟\nمن اهل ایران هستم.\nمن اهل تهران هستم.",
    tip: "from یعنی «از / اهل». قبل از نام کشور یا شهر می‌آید.",
    question: "کدام جمله درست است؟",
    options: [
      "I from Iran.",
      "I'm from Iran.",
      "I'm Iran from.",
      "From I Iran.",
    ],
    answer: "I'm from Iran.",
    feedback: "ساختار درست: I'm from + مکان.",
    words: [
      { word: "from", meaning: "از / اهل", example: "I'm from Iran." },
      { word: "where", meaning: "کجا", example: "Where are you from?" },
      { word: "Iran", meaning: "ایران", example: "I'm from Iran." },
      { word: "city", meaning: "شهر", example: "My city is Tehran." },
    ],
  },
  // ───────── A1 ─────────
  {
    id: "a1-1",
    level: "A1",
    title: "ضمیرهای فاعلی: I, you, he, she…",
    category: "دستور زبان",
    minutes: 12,
    explanation:
      "ضمیر فاعلی جای اسم می‌نشیند: I (من)، you (تو/شما)، he (او مرد)، she (او زن)، it (چیز/حیوان)، we (ما)، they (آن‌ها). در انگلیسی معمولاً فاعل قبل از فعل می‌آید.",
    example: "I am a student.\nShe is a teacher.\nThey are friends.",
    translation: "من دانش‌آموز هستم.\nاو معلم است.\nآن‌ها دوست هستند.",
    tip: "he برای مرد، she برای زن، they برای جمع یا وقتی جنسیت مهم نیست.",
    question: "جای خالی: ___ are my friends.",
    options: ["He", "She", "It", "They"],
    answer: "They",
    feedback: "friends جمع است؛ فاعل مناسب They است.",
    words: [
      { word: "I", meaning: "من", example: "I am Ali." },
      { word: "you", meaning: "تو / شما", example: "You are kind." },
      { word: "he", meaning: "او (مرد)", example: "He is my brother." },
      { word: "she", meaning: "او (زن)", example: "She is my sister." },
      { word: "we", meaning: "ما", example: "We are ready." },
      { word: "they", meaning: "آن‌ها", example: "They are here." },
    ],
  },
  {
    id: "a1-2",
    level: "A1",
    title: "فعل to be: am / is / are",
    category: "دستور زبان",
    minutes: 12,
    explanation:
      "فعل to be در حال ساده سه شکل دارد: I → am | he/she/it → is | you/we/they → are. این فعل برای هویت، حال، و توصیف بسیار پرکاربرد است.",
    example: "I am happy.\nShe is a doctor.\nWe are ready.",
    translation: "من خوشحالم.\nاو پزشک است.\nما آماده‌ایم.",
    tip: "شکل کوتاه: I'm / she's / we're. در نوشتار رسمی‌تر گاهی شکل کامل بهتر است.",
    question: "My parents ___ at home.",
    options: ["is", "am", "are", "be"],
    answer: "are",
    feedback: "parents جمع است → are.",
    words: [
      { word: "am", meaning: "هستم (با I)", example: "I am fine." },
      { word: "is", meaning: "است (با he/she/it)", example: "She is here." },
      { word: "are", meaning: "هستند / هستی (با you/we/they)", example: "They are ready." },
      { word: "happy", meaning: "خوشحال", example: "I am happy." },
    ],
  },
  {
    id: "a1-3",
    level: "A1",
    title: "منفی و سؤال با to be",
    category: "جمله‌سازی",
    minutes: 12,
    explanation:
      "منفی: بعد از am/is/are واژهٔ not می‌آید (isn't / aren't شکل کوتاه). سؤال: am/is/are را قبل از فاعل می‌آوریم. مثال: You are ready → Are you ready?",
    example: "She isn't tired.\nAre you ready?\nI'm not a teacher.",
    translation: "او خسته نیست.\nآماده‌ای؟\nمن معلم نیستم.",
    tip: "در سؤال با to be، از do/does استفاده نکن.",
    question: "کدام سؤال درست است؟",
    options: ["You are ready?", "Are you ready?", "Do you are ready?", "Is you ready?"],
    answer: "Are you ready?",
    feedback: "فعل to be قبل از فاعل می‌آید: Are you…?",
    words: [
      { word: "not", meaning: "نه / نیست", example: "I'm not tired." },
      { word: "tired", meaning: "خسته", example: "She isn't tired." },
      { word: "ready", meaning: "آماده", example: "Are you ready?" },
      { word: "busy", meaning: "مشغول", example: "Is he busy?" },
    ],
  },
  {
    id: "a1-4",
    level: "A1",
    title: "حال ساده: عادت‌ها",
    category: "دستور زبان",
    minutes: 14,
    explanation:
      "حال ساده برای عادت و واقعیت به‌کار می‌رود. با I/you/we/they فعل به شکل پایه است. با he/she/it معمولاً s به فعل اضافه می‌شود: work → works.",
    example: "I work every day.\nShe works at a bank.\nThey play football.",
    translation: "من هر روز کار می‌کنم.\nاو در بانک کار می‌کند.\nآن‌ها فوتبال بازی می‌کنند.",
    tip: "I work ولی he works. این s را فراموش نکن.",
    question: "My brother ___ football every Friday.",
    options: ["play", "plays", "playing", "is play"],
    answer: "plays",
    feedback: "brother = he → plays.",
    words: [
      { word: "work", meaning: "کار کردن", example: "I work here." },
      { word: "every day", meaning: "هر روز", example: "I study every day." },
      { word: "usually", meaning: "معمولاً", example: "I usually walk." },
      { word: "always", meaning: "همیشه", example: "She always arrives early." },
    ],
  },
  // ───────── A2 ─────────
  {
    id: "a2-1",
    level: "A2",
    title: "منفی و سؤال با do / does",
    category: "دستور زبان",
    minutes: 14,
    explanation:
      "در حال ساده برای سؤال و منفی (غیر از to be) از do/does استفاده می‌کنیم. does برای he/she/it است. بعد از does، فعل اصلی بدون s می‌آید: Does she like tea?",
    example: "Does he work here?\nHe doesn't work here.\nDo you speak English?",
    translation: "آیا او اینجا کار می‌کند؟\nاو اینجا کار نمی‌کند.\nانگلیسی حرف می‌زنی؟",
    tip: "غلط رایج: Does she likes — درست: Does she like.",
    question: "___ your sister speak English?",
    options: ["Do", "Does", "Is", "Has"],
    answer: "Does",
    feedback: "your sister = she → Does.",
    words: [
      { word: "do", meaning: "فعل کمکی سؤال/منفی", example: "Do you live here?" },
      { word: "does", meaning: "شکل do برای he/she/it", example: "Does he know?" },
      { word: "speak", meaning: "صحبت کردن", example: "I speak Persian." },
      { word: "understand", meaning: "فهمیدن", example: "I understand." },
    ],
  },
  {
    id: "a2-2",
    level: "A2",
    title: "حال استمراری: الآن در جریان",
    category: "دستور زبان",
    minutes: 14,
    explanation:
      "برای کاری که همین حالا در جریان است: am/is/are + فعلing. مثال: I'm reading now. حال ساده = عادت؛ حال استمراری = الآن.",
    example: "I'm reading a book right now.\nLook! The children are playing.",
    translation: "همین الآن دارم کتاب می‌خوانم.\nنگاه کن! بچه‌ها دارند بازی می‌کنند.",
    tip: "کلمه‌هایی مثل now و right now اغلب با حال استمراری می‌آیند.",
    question: "Look! The children ___ in the garden.",
    options: ["play", "plays", "are playing", "is playing"],
    answer: "are playing",
    feedback: "children جمع + کار در جریان → are playing.",
    words: [
      { word: "now", meaning: "الان", example: "I'm working now." },
      { word: "right now", meaning: "همین الآن", example: "She's calling right now." },
      { word: "reading", meaning: "در حال خواندن", example: "I'm reading." },
      { word: "waiting", meaning: "در حال منتظر بودن", example: "We are waiting." },
    ],
  },
  {
    id: "a2-3",
    level: "A2",
    title: "گذشتهٔ ساده",
    category: "دستور زبان",
    minutes: 15,
    explanation:
      "برای کار تمام‌شده در گذشته از گذشتهٔ ساده استفاده می‌کنیم. فعل‌های باقاعده معمولاً ed می‌گیرند (watch → watched). فعل‌های بی‌قاعده شکل جدا دارند (go → went، نه goed).",
    example: "I watched a film yesterday.\nWe went home.\nShe didn't call me.",
    translation: "دیروز یک فیلم دیدم.\nبه خانه رفتیم.\nاو به من زنگ نزد.",
    tip: "بعد از did / didn't فعل به شکل ساده برمی‌گردد: didn't go.",
    question: "Yesterday, we ___ to the museum.",
    options: ["go", "goed", "went", "gone"],
    answer: "went",
    feedback: "گذشتهٔ go می‌شود went.",
    words: [
      { word: "yesterday", meaning: "دیروز", example: "I studied yesterday." },
      { word: "went", meaning: "رفت (گذشتهٔ go)", example: "We went home." },
      { word: "watched", meaning: "تماشا کرد", example: "I watched TV." },
      { word: "last night", meaning: "دیشب", example: "I slept early last night." },
    ],
  },
  {
    id: "a2-4",
    level: "A2",
    title: "آینده با going to و will",
    category: "دستور زبان",
    minutes: 14,
    explanation:
      "be going to برای برنامه یا قصد از قبل: I'm going to study tonight. will برای تصمیم لحظه‌ای، قول یا پیش‌بینی: I'll help you. این دو همیشه جای هم نیستند.",
    example: "I'm going to study tonight.\nI'll help you with the bags.",
    translation: "امشب قصد دارم درس بخوانم.\nبا کیف‌ها کمکت می‌کنم.",
    tip: "بعد از will فعل بدون to می‌آید: I'll help — نه I'll to help.",
    question: "We have tickets. We ___ travel tomorrow.",
    options: ["going to", "are going to", "will to", "are go to"],
    answer: "are going to",
    feedback: "برنامهٔ قبلی → are going to.",
    words: [
      { word: "will", meaning: "خواهـد / برای آینده", example: "I will call you." },
      { word: "going to", meaning: "قصد داشتن / قرار است", example: "I'm going to rest." },
      { word: "tomorrow", meaning: "فردا", example: "See you tomorrow." },
      { word: "tonight", meaning: "امشب", example: "I'm free tonight." },
    ],
  },
];
