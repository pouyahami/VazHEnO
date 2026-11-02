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

export const baseLessons: Lesson[] = [
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
];
