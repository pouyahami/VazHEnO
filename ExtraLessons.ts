type ExtraLesson = {
  id: string;
  level: "A0" | "A1" | "A2" | "B1" | "B2" | "C1";
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

type Topic = {
  level: ExtraLesson["level"];
  title: string;
  category: string;
  explanation: string;
  example: string;
  translation: string;
  tip: string;
};

const TOPICS: Topic[] = [
  { level: "A0", title: "اعداد ۱ تا ۲۰", category: "واژگان", explanation: "اعداد پایه برای سن، قیمت و شماره ضروری‌اند.", example: "I am twenty years old.", translation: "من بیست ساله‌ام.", tip: "teen برای ۱۳ تا ۱۹ رایج است." },
  { level: "A0", title: "رنگ‌ها", category: "واژگان", explanation: "رنگ‌ها صفت‌اند و معمولاً پیش از اسم می‌آیند.", example: "a blue car", translation: "یک ماشین آبی", tip: "صفت رنگ با جمع تغییر نمی‌کند." },
  { level: "A0", title: "روزهای هفته", category: "واژگان", explanation: "روزهای هفته با on می‌آیند.", example: "See you on Friday.", translation: "جمعه می‌بینمت.", tip: "روزها با حرف بزرگ نوشته می‌شوند." },
  { level: "A0", title: "خانواده", category: "واژگان", explanation: "واژگان پایه خانواده را با my تمرین کن.", example: "This is my brother.", translation: "این برادر من است.", tip: "my پیش از اسم می‌آید." },
  { level: "A0", title: "غذاهای رایج", category: "واژگان", explanation: "واژگان خوراکی برای سفارش و خرید لازم است.", example: "I like rice and chicken.", translation: "برنج و مرغ دوست دارم.", tip: "like بعد از فاعل می‌آید." },
  { level: "A0", title: "ساعت‌های ساده", category: "مکالمه", explanation: "What time is it برای پرسیدن ساعت است.", example: "It is three o'clock.", translation: "ساعت سه است.", tip: "o'clock برای ساعت کامل است." },
  { level: "A0", title: "فعل have", category: "دستور زبان", explanation: "have برای مالکیت به کار می‌رود.", example: "I have a pen.", translation: "من یک خودکار دارم.", tip: "He has نه He have." },
  { level: "A0", title: "like و want", category: "جمله‌سازی", explanation: "want می‌تواند to + فعل بگیرد.", example: "I want to learn English.", translation: "می‌خواهم انگلیسی یاد بگیرم.", tip: "want to + فعل ساده." },
  { level: "A0", title: "مکان‌های شهر", category: "واژگان", explanation: "school و park مکان‌های پرکاربردند.", example: "The school is near the park.", translation: "مدرسه نزدیک پارک است.", tip: "near یعنی نزدیک." },
  { level: "A0", title: "احساسات ساده", category: "واژگان", explanation: "happy و tired با am/is/are می‌آیند.", example: "I am hungry.", translation: "گرسنه‌ام.", tip: "صفت بعد از to be می‌آید." },
  { level: "A1", title: "عادات روزانه", category: "مکالمه", explanation: "عادت‌ها با حال ساده بیان می‌شوند.", example: "I wake up at 7 every day.", translation: "هر روز ساعت ۷ بیدار می‌شوم.", tip: "every day نشانهٔ عادت است." },
  { level: "A1", title: "خرید ساده", category: "مکالمه", explanation: "How much is it قیمت را می‌پرسد.", example: "How much is this shirt?", translation: "قیمت این پیراهن چقدر است؟", tip: "this نزدیک و that دور است." },
  { level: "A1", title: "پرسیدن مسیر", category: "مکالمه", explanation: "Where is برای مسیر مفید است.", example: "Where is the station?", translation: "ایستگاه کجاست؟", tip: "Turn left یعنی بپیچ چپ." },
  { level: "A1", title: "آب‌وهوا", category: "واژگان", explanation: "sunny و rainy واژگان آب‌وهوا هستند.", example: "It is sunny today.", translation: "امروز آفتابی است.", tip: "It is برای آب‌وهوا رایج است." },
  { level: "A1", title: "توانایی با can", category: "دستور زبان", explanation: "can توانایی و اجازه را نشان می‌دهد.", example: "I can swim.", translation: "می‌توانم شنا کنم.", tip: "بعد از can فعل بدون to." },
  { level: "A1", title: "گذشتهٔ go و see", category: "دستور زبان", explanation: "go→went و see→saw بی‌قاعده‌اند.", example: "We went to the museum.", translation: "به موزه رفتیم.", tip: "با yesterday گذشتهٔ ساده مناسب است." },
  { level: "A1", title: "علاقه‌مندی‌ها", category: "مکالمه", explanation: "like می‌تواند اسم یا فعل ing بگیرد.", example: "I like reading books.", translation: "کتاب خواندن را دوست دارم.", tip: "like + اسم یا ing." },
  { level: "A1", title: "برنامهٔ هفتگی", category: "جمله‌سازی", explanation: "on + روز برای برنامه مفید است.", example: "I play football on Saturdays.", translation: "شنبه‌ها فوتبال بازی می‌کنم.", tip: "s در Saturdays برای عادت." },
  { level: "A1", title: "دعوت مؤدبانه", category: "مکالمه", explanation: "Would you like دعوت مؤدبانه است.", example: "Would you like some tea?", translation: "چای میل دارید؟", tip: "some در تعارف رایج است." },
  { level: "A1", title: "پیشنهاد با Let's", category: "مکالمه", explanation: "Let's + فعل پیشنهاد گروهی است.", example: "Let's go home.", translation: "بیایید به خانه برویم.", tip: "بعد از Let's فعل ساده." },
  { level: "A2", title: "ever و never", category: "دستور زبان", explanation: "ever در سؤال تجربه و never در منفی می‌آید.", example: "Have you ever been to Turkey?", translation: "تا به حال ترکیه رفته‌ای؟", tip: "been قسمت سوم be است." },
  { level: "A2", title: "used to", category: "دستور زبان", explanation: "used to عادت گذشته را نشان می‌دهد.", example: "I used to live in Shiraz.", translation: "قبلاً در شیراز زندگی می‌کردم.", tip: "used to + فعل ساده." },
  { level: "A2", title: "who و which", category: "دستور زبان", explanation: "who برای انسان و which برای چیز است.", example: "The man who called is my uncle.", translation: "مردی که زنگ زد عموی من است.", tip: "who فاعل بند موصولی است." },
  { level: "A2", title: "گذشته استمراری", category: "دستور زبان", explanation: "was/were + ing کار در جریان گذشته است.", example: "I was reading when you called.", translation: "داشتم می‌خواندم که زنگ زدی.", tip: "when نقطهٔ قطع را نشان می‌دهد." },
  { level: "A2", title: "عذرخواهی", category: "مکالمه", explanation: "I'm sorry عبارت پایهٔ عذرخواهی است.", example: "I'm sorry I'm late.", translation: "متأسفم دیر کردم.", tip: "late یعنی دیر." },
  { level: "A2", title: "توافق و مخالفت", category: "مکالمه", explanation: "I agree برای موافقت به کار می‌رود.", example: "I agree with you.", translation: "با تو موافقم.", tip: "agree with + شخص." },
  { level: "A2", title: "سفر و فرودگاه", category: "واژگان", explanation: "flight و passport واژگان سفرند.", example: "My flight is at noon.", translation: "پروازم ظهر است.", tip: "at noon یعنی ظهر." },
  { level: "A2", title: "سلامت", category: "واژگان", explanation: "have a headache ساختار رایج درد است.", example: "I have a headache.", translation: "سردرد دارم.", tip: "have a + درد." },
  { level: "A2", title: "تماس تلفنی", category: "مکالمه", explanation: "call back یعنی تماس برگشتی.", example: "I'll call you back.", translation: "بعداً زنگ می‌زنم.", tip: "will برای تصمیم لحظه‌ای." },
  { level: "A2", title: "شرطی نوع صفر", category: "دستور زبان", explanation: "If + حال ساده برای واقعیت عمومی است.", example: "If you heat ice, it melts.", translation: "اگر یخ را گرم کنی آب می‌شود.", tip: "هر دو بخش حال ساده‌اند." },
  { level: "B1", title: "شرطی نوع دوم", category: "دستور زبان", explanation: "If + گذشته و would برای فرض حال است.", example: "If I had time, I would travel.", translation: "اگر وقت داشتم سفر می‌کردم.", tip: "معنی حال/آینده فرضی دارد." },
  { level: "B1", title: "حال کامل استمراری", category: "دستور زبان", explanation: "have been + ing از گذشته تا حال ادامه دارد.", example: "I have been studying for two hours.", translation: "دو ساعت است درس می‌خوانم.", tip: "for مدت و since شروع." },
  { level: "B1", title: "مجهول", category: "دستور زبان", explanation: "be + قسمت سوم تمرکز را روی عمل می‌گذارد.", example: "The email was sent yesterday.", translation: "ایمیل دیروز فرستاده شد.", tip: "was sent مجهول گذشته است." },
  { level: "B1", title: "نقل قول غیرمستقیم", category: "دستور زبان", explanation: "در گزارش گفتار زمان‌ها اغلب عقب می‌روند.", example: "She said she was tired.", translation: "گفت که خسته است.", tip: "said that اختیاری است." },
  { level: "B1", title: "حروف اضافه وابسته", category: "واژگان", explanation: "good at و interested in ترکیب ثابت‌اند.", example: "She is good at math.", translation: "در ریاضی خوب است.", tip: "good at نه good in." },
  { level: "B1", title: "نظرنویسی", category: "نوشتار", explanation: "نظر را با دلیل پشتیبانی کن.", example: "In my opinion, reading helps memory.", translation: "به نظر من مطالعه به حافظه کمک می‌کند.", tip: "In my opinion برای شروع نظر." },
  { level: "B1", title: "درخواست مؤدبانه", category: "مکالمه", explanation: "Could we لحن مؤدبانه‌تری دارد.", example: "Could we meet tomorrow?", translation: "می‌توانیم فردا ملاقات کنیم؟", tip: "Could از Can نرم‌تر است." },
  { level: "B1", title: "توصیف روند", category: "آیلتس", explanation: "increase و decrease واژگان نمودارند.", example: "The number increased steadily.", translation: "تعداد به‌طور پیوسته افزایش یافت.", tip: "steadily یعنی پیوسته." },
  { level: "B1", title: "عبارت‌های ربط", category: "نوشتار", explanation: "although و however انسجام می‌سازند.", example: "Although it was late, we continued.", translation: "اگرچه دیر بود ادامه دادیم.", tip: "Although بند کامل می‌گیرد." },
  { level: "B1", title: "آینده کامل", category: "دستور زبان", explanation: "will have + p.p. اتمام پیش از آینده است.", example: "By 2030, I will have graduated.", translation: "تا ۲۰۳۰ فارغ‌التحصیل شده‌ام.", tip: "By نقطهٔ مرجع زمانی است." },
  { level: "B2", title: "شرطی نوع سوم", category: "دستور زبان", explanation: "would have برای پشیمانی از گذشته است.", example: "If I had studied, I would have passed.", translation: "اگر درس خوانده بودم قبول می‌شدم.", tip: "گذشتهٔ غیرواقعی است." },
  { level: "B2", title: "wish", category: "دستور زبان", explanation: "wish + گذشته حسرت حال را می‌رساند.", example: "I wish I knew French.", translation: "کاش فرانسوی می‌دانستم.", tip: "knew ظاهر گذشته و معنی حال دارد." },
  { level: "B2", title: "لحن آکادمیک", category: "نوشتار", explanation: "evidence و conclude لحن علمی می‌سازند.", example: "The evidence suggests a clear trend.", translation: "شواهد روند روشنی را نشان می‌دهد.", tip: "suggests با evidence مفرد." },
  { level: "B2", title: "بحث دو طرفه", category: "آیلتس", explanation: "On the one hand ساختار بحث است.", example: "On the one hand, cities offer jobs.", translation: "از یک سو شهرها شغل دارند.", tip: "سپس On the other hand." },
  { level: "B2", title: "افعال عبارتی", category: "واژگان", explanation: "give up یعنی تسلیم شدن.", example: "Don't give up too soon.", translation: "خیلی زود تسلیم نشو.", tip: "give up فعل عبارتی است." },
  { level: "B2", title: "recommend that", category: "دستور زبان", explanation: "recommend that + فاعل + فعل ساده.", example: "I recommend that he apply early.", translation: "توصیه می‌کنم زود اقدام کند.", tip: "اغلب بدون should." },
  { level: "B2", title: "تأکید cleft", category: "دستور زبان", explanation: "It is ... that برای تأکید است.", example: "It is practice that improves fluency.", translation: "تمرین است که روانی را بهتر می‌کند.", tip: "ساختار cleft تأکید می‌سازد." },
  { level: "B2", title: "لحن دیپلماتیک", category: "مکالمه", explanation: "It might be better to لحن نرم می‌سازد.", example: "It might be better to wait.", translation: "شاید بهتر باشد صبر کنیم.", tip: "might احتمال مؤدبانه است." },
  { level: "B2", title: "محیط‌زیست", category: "واژگان", explanation: "renewable energy عبارت رایج است.", example: "Renewable energy is expanding.", translation: "انرژی تجدیدپذیر در حال گسترش است.", tip: "renewable یعنی تجدیدپذیر." },
  { level: "B2", title: "گرایش‌ها", category: "نوشتار", explanation: "There is a growing tendency عبارت رسمی است.", example: "There is a growing tendency to work remotely.", translation: "گرایش فزاینده‌ای به دورکاری هست.", tip: "growing tendency = گرایش رو به رشد." },
  { level: "C1", title: "حدس گذشته", category: "دستور زبان", explanation: "might have + p.p. حدس گذشته است.", example: "He might have missed the train.", translation: "شاید قطار را از دست داده باشد.", tip: "might have + قسمت سوم." },
  { level: "C1", title: "اسم‌سازی", category: "واژگان", explanation: "develop به development تبدیل می‌شود.", example: "The development of AI is rapid.", translation: "توسعه هوش مصنوعی سریع است.", tip: "the development of + اسم." },
  { level: "C1", title: "نقد منطقی", category: "نوشتار", explanation: "overlooks برای نقد مؤدبانه است.", example: "This argument overlooks key data.", translation: "این استدلال داده‌های کلیدی را نادیده می‌گیرد.", tip: "overlooks یعنی نادیده گرفتن." },
  { level: "C1", title: "وارونگی", category: "دستور زبان", explanation: "Rarely در آغاز جمله وارونگی می‌سازد.", example: "Rarely have I seen such clarity.", translation: "به‌ندرت چنین وضوحی دیده‌ام.", tip: "فعل کمکی پیش از فاعل می‌آید." },
  { level: "C1", title: "عبارات رسمی", category: "واژگان", explanation: "in light of یعنی با توجه به.", example: "In light of recent changes, we revised the plan.", translation: "با توجه به تغییرات اخیر برنامه را اصلاح کردیم.", tip: "in light of = با توجه به." },
  { level: "C1", title: "ارائه حرفه‌ای", category: "مکالمه", explanation: "outline برای سرفصل‌بندی ارائه است.", example: "I'd like to outline three points.", translation: "مایلم سه نکته را مطرح کنم.", tip: "outline یعنی سرفصل‌بندی." },
  { level: "C1", title: "شفاف‌سازی", category: "نوشتار", explanation: "namely برای توضیح دقیق است.", example: "We need two skills, namely writing and speaking.", translation: "به دو مهارت نیاز داریم، یعنی نوشتن و صحبت.", tip: "namely توضیح می‌دهد." },
  { level: "C1", title: "فرضیه", category: "آکادمیک", explanation: "It is plausible that لحن محتاطانه علمی است.", example: "It is plausible that motivation predicts success.", translation: "محتمل است که انگیزه موفقیت را پیش‌بینی کند.", tip: "plausible یعنی باورپذیر." },
  { level: "C1", title: "انسجام پاراگراف", category: "نوشتار", explanation: "جمله موضوعی ایدهٔ اصلی را می‌گوید.", example: "A clear topic sentence guides the reader.", translation: "جمله موضوعی روشن خواننده را هدایت می‌کند.", tip: "topic sentence = جمله موضوعی." },
  { level: "C1", title: "جمع‌بندی", category: "نوشتار", explanation: "Overall برای جمع‌بندی کلی مناسب است.", example: "Overall, consistent practice remains essential.", translation: "در مجموع تمرین منظم ضروری می‌ماند.", tip: "Overall جمع‌بندی می‌کند." },
];

/** شمارندهٔ پایدار برای چیدمان قطعی گزینه‌ها (بدون Math.random تا رندر و تست قابل‌تکرار باشد) */
function rotate<T>(items: T[], by: number): T[] {
  const n = items.length;
  const k = ((by % n) + n) % n;
  return [...items.slice(k), ...items.slice(0, k)];
}

/**
 * برای هر موضوع دقیقاً یک درس با یک پرسش واقعی ساخته می‌شود:
 * «معنی جملهٔ مثال چیست؟» و گزینه‌های نادرست ترجمهٔ جملهٔ مثال سایر موضوع‌های همان سطح‌اند.
 * به این ترتیب پاسخ درست یکتاست و هیچ گزینهٔ ساختگی یا بی‌معنی وجود ندارد.
 */
function buildLesson(topic: Topic, topicIndex: number): ExtraLesson {
  const levels = ["A0", "A1", "A2", "B1", "B2", "C1"];
  const sameLevel = TOPICS.filter((t) => t.level === topic.level && t.translation !== topic.translation);
  const pool = sameLevel.length >= 3 ? sameLevel : TOPICS.filter((t) => t.translation !== topic.translation);
  const distractors = rotate(pool, topicIndex * 7 + 1)
    .map((t) => t.translation)
    .filter((value, index, all) => all.indexOf(value) === index)
    .slice(0, 3);
  const options = rotate([topic.translation, ...distractors], topicIndex);

  return {
    id: `${topic.level.toLowerCase()}-x-${String(topicIndex + 1).padStart(2, "0")}`,
    level: topic.level,
    title: topic.title,
    category: topic.category,
    minutes: 8 + levels.indexOf(topic.level),
    explanation: topic.explanation,
    example: topic.example,
    translation: topic.translation,
    tip: topic.tip,
    question: `معنی جملهٔ زیر کدام است؟  «${topic.example}»`,
    options,
    answer: topic.translation,
    feedback: `درست است: «${topic.translation}». نکته: ${topic.tip}`,
    words: [],
  };
}

/** ۶۰ درس تکمیلی؛ هر موضوع یک بار و بدون نسخهٔ تکراری. */
export const extraLessons: ExtraLesson[] = TOPICS.map((topic, index) => buildLesson(topic, index));
