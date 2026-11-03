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
 * لحن: معلم صبور فارسی‌زبان — گرم، شفاف، با دیالوگ واقعی
 * نه لغت‌نامهٔ خشک و نه متن دانشگاهی سنگین
 */
export const baseLessons: Lesson[] = [
  {
    id: "a0-1",
    level: "A0",
    title: "اولین سلام به انگلیسی",
    category: "مکالمه واقعی",
    minutes: 8,
    explanation:
      "تصور کن وارد یک کلاس یا فروشگاه شده‌ای و می‌خواهی مؤدب باشی. اولین چیزی که از دهانت درمی‌آید معمولاً یک سلام است.\n\nدر انگلیسی، Hello تقریباً همه‌جا کار می‌کند — رسمی و غیررسمی. Hi کمی خودمانی‌تر است؛ به دوست یا هم‌سن راحت‌تر گفته می‌شود. موقع رفتن، Goodbye کمی کامل‌تر است و Bye کوتاه و روزمره.\n\nلازم نیست جملهٔ بلند بسازی. همین یک کلمه، درِ ارتباط را باز می‌کند.",
    example: "— Hello!\n— Hi!\n— Goodbye!\n— Bye!",
    translation: "— سلام!\n— سلام!\n— خداحافظ!\n— بای!",
    tip: "اگر فقط یک چیز از این درس یاد بگیری، Hello کافی است تا هر مکالمهٔ تازه‌ای را شروع کنی.",
    question: "وقتی کسی را می‌بینی و می‌خواهی سلام کنی، کدام طبیعی‌تر است؟",
    options: ["Bye", "Hello", "Thank you", "From"],
    answer: "Hello",
    feedback:
      "درست است. Hello برای شروع گفت‌وگو است. Bye وقتی است که می‌خواهی خداحافظی کنی — جایشان را عوض نکن.",
    words: [
      { word: "hello", meaning: "سلام (تقریباً همه‌جا)", example: "Hello! How are you?" },
      { word: "hi", meaning: "سلام خودمانی", example: "Hi, Sara!" },
      { word: "goodbye", meaning: "خداحافظ", example: "Goodbye, see you tomorrow." },
      { word: "bye", meaning: "خداحافظ کوتاه", example: "Bye!" },
    ],
  },
  {
    id: "a0-2",
    level: "A0",
    title: "بله، نه، لطفاً، ممنون",
    category: "مکالمه واقعی",
    minutes: 9,
    explanation:
      "بعد از سلام، بیشتر گفت‌وگوها با چند جواب کوتاه جلو می‌روند: قبول کردن، رد کردن، خواهش و تشکر.\n\nYes = بله. No = نه. وقتی چیزی تعارف می‌شود، Yes, please خیلی مؤدبانه‌تر از یک Yes خشک است. Thank you همان «ممنون» خودمان است؛ جواب رایج‌اش You're welcome یعنی «خواهش می‌کنم».\n\nاین‌ها کوچک به نظر می‌رسند، اما بدون‌شان مکالمه سرد و ناقص می‌شود.",
    example: "A: Coffee?\nB: Yes, please.\nA: Here you are.\nB: Thank you.\nA: You're welcome.",
    translation:
      "الف: قهوه؟\nب: بله، لطفاً.\nالف: بفرمایید.\nب: ممنون.\nالف: خواهش می‌کنم.",
    tip: "اگر فقط Yes بگویی درست است؛ اما Yes, please لبخند مؤدبانهٔ زبان انگلیسی است.",
    question: "کسی برایت کاری کرده. طبیعی‌ترین واکنش کدام است؟",
    options: ["Hello", "Thank you", "Goodbye", "No please"],
    answer: "Thank you",
    feedback: "آفرین. Thank you همان پلی است بین گرفتن کمک و ادامهٔ رابطهٔ مؤدبانه.",
    words: [
      { word: "yes", meaning: "بله", example: "Yes, I understand." },
      { word: "no", meaning: "نه", example: "No, thank you." },
      { word: "please", meaning: "لطفاً", example: "Yes, please." },
      { word: "thank you", meaning: "ممنون", example: "Thank you so much." },
    ],
  },
  {
    id: "a0-3",
    level: "A0",
    title: "اسمت چیست؟ خودت را معرفی کن",
    category: "مکالمه واقعی",
    minutes: 10,
    explanation:
      "حالا می‌خواهی بگویی کی هستی. ساده‌ترین و درست‌ترین شکل این است:\n\nMy name is + اسم.\n\nشکل کوتاه‌تر و خیلی رایج: I'm + اسم (I'm همان I am است).\n\nبرای پرسیدن از طرف مقابل بگو: What's your name?\n\nنکتهٔ مهم: نگو My name Ali. بعد از name باید is بیاید — مثل این‌که در فارسی می‌گویی «اسم من علی است»، نه «اسم من علی».",
    example: "— What's your name?\n— My name is Ali.\n— I'm Sara. Nice to meet you.",
    translation:
      "— اسمت چیست؟\n— اسم من علی است.\n— من سارا هستم. از آشنایی‌ات خوشحالم.",
    tip: "Nice to meet you را بعد از معرفی اضافه کن؛ مکالمه یک‌دفعه انسانی‌تر می‌شود.",
    question: "کدام جمله از نظر انگلیسی درست است؟",
    options: ["My name Reza.", "My name is Reza.", "I name is Reza.", "Me name Reza."],
    answer: "My name is Reza.",
    feedback: "دقیقاً. اسکلت جمله این است: My name is + اسم. بقیهٔ گزینه‌ها شبیه ترجمه‌ی کلمه‌به‌کلمه از فارسی‌اند و در انگلیسی طبیعی نیستند.",
    words: [
      { word: "name", meaning: "اسم", example: "My name is Neda." },
      { word: "my", meaning: "مال من / ـم", example: "my name" },
      { word: "your", meaning: "مال تو / ـت", example: "your name" },
      { word: "nice to meet you", meaning: "از آشنایی‌ات خوشحالم", example: "Nice to meet you!" },
    ],
  },
  {
    id: "a0-4",
    level: "A0",
    title: "اهل کجایی؟",
    category: "مکالمه واقعی",
    minutes: 10,
    explanation:
      "بعد از اسم، سؤال بعدی تقریباً همیشه این است: از کجا آمده‌ای؟\n\nسؤال: Where are you from?\nجواب: I'm from + کشور یا شهر.\n\nمثال: I'm from Iran. / I'm from Tehran.\n\nfrom اینجا یعنی «اهلِ / از». ترتیب کلمات مهم است: اول I'm، بعد from، بعد مکان — نه I from Iran.",
    example: "— Where are you from?\n— I'm from Iran.\n— Oh, nice! I'm from Turkey.",
    translation:
      "— اهل کجایی؟\n— من اهل ایران هستم.\n— آه، عالیه! من اهل ترکیه هستم.",
    tip: "اگر فقط شهر را بگویی هم درست است: I'm from Isfahan. طرف معمولاً می‌فهمد.",
    question: "کدام شکل طبیعی و درست است؟",
    options: ["I from Iran.", "I'm from Iran.", "I'm Iran from.", "From I am Iran."],
    answer: "I'm from Iran.",
    feedback: "بله — I'm from + مکان. سه گزینهٔ دیگر شبیه چیدن کلمات فارسی با ترتیب انگلیسی‌اند و شنونده را گیج می‌کنند.",
    words: [
      { word: "from", meaning: "از / اهلِ", example: "I'm from Iran." },
      { word: "where", meaning: "کجا", example: "Where are you from?" },
      { word: "Iran", meaning: "ایران", example: "I'm from Iran." },
      { word: "city", meaning: "شهر", example: "My city is Shiraz." },
    ],
  },
  {
    id: "a1-1",
    level: "A1",
    title: "من، تو، او — ضمیرها جان می‌گیرند",
    category: "ساخت جمله",
    minutes: 12,
    explanation:
      "تا اینجا اسم خودت را گفتی. حالا به‌جای تکرار اسم، از ضمیر استفاده می‌کنیم — درست مثل فارسی که به‌جای «علی رفت» می‌گوییم «او رفت».\n\nI = من · you = تو/شما · he = او (مرد) · she = او (زن) · it = چیز یا حیوان · we = ما · they = آن‌ها\n\nدر انگلیسی فاعل معمولاً اول می‌آید، بعد فعل. این نظم را از همین‌جا در گوش‌ات قفل کن.",
    example: "I am a student.\nShe is a teacher.\nThey are my friends.",
    translation: "من دانش‌آموزم.\nاو معلم است.\nآن‌ها دوست‌های من هستند.",
    tip: "اگر نمی‌دانی جنسیت چیست یا مهم نیست، در جمع از they استفاده کن — کاملاً طبیعی است.",
    question: "جای خالی را با حس زبان پر کن: ___ are my friends.",
    options: ["He", "She", "It", "They"],
    answer: "They",
    feedback: "friends جمع است؛ پس They. He و She برای یک نفرند و It برای چیز.",
    words: [
      { word: "friend", meaning: "دوست", example: "He is my friend." },
      { word: "student", meaning: "دانش‌آموز / دانشجو", example: "I am a student." },
      { word: "teacher", meaning: "معلم", example: "She is a teacher." },
      { word: "they", meaning: "آن‌ها", example: "They are here." },
    ],
  },
  {
    id: "a1-2",
    level: "A1",
    title: "هستم، است، هستند — قلب جمله",
    category: "ساخت جمله",
    minutes: 12,
    explanation:
      "فعل to be مثل «است / هستم / هستند» در فارسی است؛ بدون آن خیلی از معرفی‌ها لنگ می‌ماند.\n\nقانون سه‌تایی را حفظ کن:\n• I → am\n• he / she / it → is\n• you / we / they → are\n\nمثال زنده: I am happy. She is a doctor. We are ready.\nشکل کوتاه در گفتار خیلی رایج است: I'm, she's, we're.",
    example: "I am happy today.\nShe is a doctor.\nWe are ready for class.",
    translation: "امروز خوشحالم.\nاو پزشک است.\nبرای کلاس آماده‌ایم.",
    tip: "اگر یک‌بار بگویی I is … گوش انگلیسی‌زبان می‌پرد. I همیشه با am است.",
    question: "My parents ___ at home.",
    options: ["is", "am", "are", "be"],
    answer: "are",
    feedback: "parents یعنی پدر و مادر — جمع است؛ پس are. is برای یک نفر می‌ماند.",
    words: [
      { word: "happy", meaning: "خوشحال", example: "I am happy." },
      { word: "ready", meaning: "آماده", example: "We are ready." },
      { word: "doctor", meaning: "پزشک", example: "She is a doctor." },
      { word: "today", meaning: "امروز", example: "I am busy today." },
    ],
  },
  {
    id: "a1-3",
    level: "A1",
    title: "نه و سؤال — جمله را برعکس کن",
    category: "ساخت جمله",
    minutes: 12,
    explanation:
      "تا حالا جملهٔ مثبت ساختی. زندگی واقعی پر از «نه» و «مگر…؟» است.\n\nمنفی: بعد از am/is/are یک not بگذار. شکل کوتاه: isn't / aren't / I'm not.\nسؤال: فعل را بیاور اول. You are ready → Are you ready?\n\nاینجا do لازم نیست؛ با to be خود فعل جابه‌جا می‌شود.",
    example: "She isn't tired.\nAre you ready?\nI'm not a teacher.",
    translation: "او خسته نیست.\nآماده‌ای؟\nمن معلم نیستم.",
    tip: "اگر خواستی مؤدب بپرسی، لحن‌ات را نرم کن؛ ساختار همان Are you…؟ می‌ماند.",
    question: "کدام سؤال از نظر ساختار انگلیسی درست است؟",
    options: ["You are ready?", "Are you ready?", "Do you are ready?", "Is you ready?"],
    answer: "Are you ready?",
    feedback: "درست. با to be، فعل می‌آید جلو: Are you…؟ گزینهٔ Do you are… اشتباه رایج فارسی‌زبان‌هاست.",
    words: [
      { word: "tired", meaning: "خسته", example: "I'm not tired." },
      { word: "busy", meaning: "مشغول", example: "Are you busy?" },
      { word: "isn't", meaning: "نیست", example: "He isn't here." },
      { word: "aren't", meaning: "نیستند / نیستی", example: "They aren't ready." },
    ],
  },
  {
    id: "a1-4",
    level: "A1",
    title: "عادت‌های روزانه با حال ساده",
    category: "زندگی روزمره",
    minutes: 14,
    explanation:
      "می‌خواهی بگویی معمولاً چه کار می‌کنی — نه فقط همین لحظه. اینجا حال ساده می‌آید.\n\nI work every day. She works at a bank.\n\nتفاوت مهم: با he/she/it به فعل یک s اضافه می‌شود. I work / he works. این s کوچک، نشانهٔ بزرگِ «بلدم انگلیسی حرف بزنم» است.",
    example: "I work every day.\nShe works at a bank.\nWe play football on Fridays.",
    translation: "هر روز کار می‌کنم.\nاو در بانک کار می‌کند.\nجمعه‌ها فوتبال بازی می‌کنیم.",
    tip: "every day، usually، always دوست‌های حال ساده‌اند — پایشان را که دیدی، به عادت فکر کن.",
    question: "My brother ___ football every Friday.",
    options: ["play", "plays", "playing", "is play"],
    answer: "plays",
    feedback: "brother یعنی he؛ پس plays. بدون s جمله از نظر بومی‌ها ناتمام حس می‌شود.",
    words: [
      { word: "every day", meaning: "هر روز", example: "I study every day." },
      { word: "usually", meaning: "معمولاً", example: "I usually walk to work." },
      { word: "work", meaning: "کار کردن", example: "I work in an office." },
      { word: "play", meaning: "بازی کردن", example: "They play tennis." },
    ],
  },
  {
    id: "a2-1",
    level: "A2",
    title: "سؤال و منفی با do و does",
    category: "ساخت جمله",
    minutes: 14,
    explanation:
      "وقتی فعل اصلی to be نیست، برای سؤال و منفی از do / does کمک می‌گیریم.\n\nDo you speak English?\nDoes she work here?\nHe doesn't live in Tehran.\n\nنکتهٔ طلایی: بعد از does، فعل برمی‌گردد به شکل ساده — Does she like tea؟ نه likes. این را بارها اشتباه می‌کنند؛ تو تکرارش کن تا ملکه‌ات شود.",
    example: "Does he work here?\nHe doesn't work here.\nDo you speak English?",
    translation: "آیا او اینجا کار می‌کند؟\nاو اینجا کار نمی‌کند.\nانگلیسی حرف می‌زنی؟",
    tip: "does را فقط برای he/she/it بگذار. برای I/you/we/they همان do کافی است.",
    question: "___ your sister speak English?",
    options: ["Do", "Does", "Is", "Has"],
    answer: "Does",
    feedback: "sister = she → Does. Is برای to be است و این‌جا فعل اصلی speak است.",
    words: [
      { word: "speak", meaning: "حرف زدن (به زبانی)", example: "I speak Persian." },
      { word: "live", meaning: "زندگی کردن", example: "I live in Tehran." },
      { word: "doesn't", meaning: "نمی‌کند (he/she/it)", example: "He doesn't know." },
      { word: "understand", meaning: "فهمیدن", example: "Do you understand?" },
    ],
  },
  {
    id: "a2-2",
    level: "A2",
    title: "همین حالا چه کار می‌کنی؟",
    category: "زندگی روزمره",
    minutes: 14,
    explanation:
      "فرق ظریف ولی مهم: حال ساده می‌گوید «عادت من این است». حال استمراری می‌گوید «همین الآن در جریان است».\n\nساخت: am/is/are + فعلing\nI'm reading right now.\nLook! The children are playing.\n\nاگر now یا Look! دیدی، ذهن‌ات برود سمت استمراری.",
    example: "I'm reading a book right now.\nLook! The children are playing in the garden.",
    translation: "همین الآن دارم کتاب می‌خوانم.\nنگاه کن! بچه‌ها در باغ دارند بازی می‌کنند.",
    tip: "I read every night = عادت. I'm reading now = این لحظه. هر دو درست‌اند؛ زمان‌شان فرق دارد.",
    question: "Look! The children ___ in the garden.",
    options: ["play", "plays", "are playing", "is playing"],
    answer: "are playing",
    feedback: "Look! یعنی همین الآن. children جمع است → are playing.",
    words: [
      { word: "right now", meaning: "همین الآن", example: "I'm busy right now." },
      { word: "reading", meaning: "در حال خواندن", example: "She is reading." },
      { word: "waiting", meaning: "در حال منتظر بودن", example: "We are waiting for the bus." },
      { word: "look", meaning: "نگاه کن", example: "Look! It's snowing." },
    ],
  },
  {
    id: "a2-3",
    level: "A2",
    title: "دیروز چه شد؟ گذشتهٔ ساده",
    category: "داستان روزمره",
    minutes: 15,
    explanation:
      "وقتی داستان تمام‌شده تعریف می‌کنی، به گذشتهٔ ساده نیاز داری.\n\nبسیاری از فعل‌ها ed می‌گیرند: watch → watched. ولی انگلیسی پر از بی‌قاعده‌هاست: go → went، نه goed.\n\nمنفی و سؤال با did ساخته می‌شود و فعل اصلی برمی‌گردد به شکل ساده: I didn't go. Did you go?",
    example: "I watched a film yesterday.\nWe went home.\nShe didn't call me.",
    translation: "دیروز فیلم دیدم.\nبه خانه رفتیم.\nبه من زنگ نزد.",
    tip: "yesterday و last night مثل چراغ‌اند: معمولاً گذشتهٔ ساده می‌خواهند.",
    question: "Yesterday, we ___ to the museum.",
    options: ["go", "goed", "went", "gone"],
    answer: "went",
    feedback: "گذشتهٔ go می‌شود went. goed وجود ندارد؛ gone هم برای ساختار دیگری است.",
    words: [
      { word: "yesterday", meaning: "دیروز", example: "I worked yesterday." },
      { word: "went", meaning: "رفت", example: "We went to the park." },
      { word: "watched", meaning: "تماشا کرد", example: "I watched a series." },
      { word: "last night", meaning: "دیشب", example: "I slept early last night." },
    ],
  },
  {
    id: "a2-4",
    level: "A2",
    title: "فردا چه می‌کنی؟ will و going to",
    category: "برنامه و تصمیم",
    minutes: 14,
    explanation:
      "برای آینده دو ابزار پرکاربرد داری.\n\nbe going to → برنامه یا قصدی که از قبل شکل گرفته: I'm going to study tonight.\nwill → تصمیم لحظه‌ای، قول، یا پیش‌بینی: I'll help you.\n\nهر دو دربارهٔ آینده‌اند؛ اما حس‌شان فرق می‌کند — یکی «از قبل تصمیم داشتم»، دیگری «الآن تصمیم می‌گیرم».",
    example: "I'm going to study tonight.\nI'll help you with the bags.",
    translation: "امشب می‌خواهم درس بخوانم.\nبا کیف‌ها کمکت می‌کنم.",
    tip: "بعد از will فعل بدون to می‌آید: I'll help — نه I'll to help.",
    question: "We already bought the tickets. We ___ travel tomorrow.",
    options: ["going to", "are going to", "will to", "are go to"],
    answer: "are going to",
    feedback: "بلیت از قبل خریده شده؛ یعنی برنامه بوده → are going to.",
    words: [
      { word: "tonight", meaning: "امشب", example: "See you tonight." },
      { word: "tomorrow", meaning: "فردا", example: "I'll call you tomorrow." },
      { word: "help", meaning: "کمک کردن", example: "I'll help you." },
      { word: "plan", meaning: "برنامه داشتن", example: "We plan to travel." },
    ],
  },
];
