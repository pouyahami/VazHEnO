import type { Lesson } from "./BaseLessons";

/**
 * Authored curriculum additions.
 * Unlike the legacy generated variants, every entry below has its own teaching
 * objective, contextual examples, and a question that tests that objective.
 */
export const curatedLessons: Lesson[] = [
  {
    id: "cur-a0-01", level: "A0", title: "درخواست ساده در کافه", category: "مکالمه کاربردی", minutes: 9,
    explanation: "برای سفارش مؤدبانه می‌توانی از ساختار I'd like + اسم استفاده کنی. این عبارت کوتاه‌شدهٔ I would like است و از I want مؤدبانه‌تر به نظر می‌رسد. برای درخواست، Please را هم می‌توانی در پایان اضافه کنی.",
    example: "I'd like a coffee, please.\nCan I have a glass of water?",
    translation: "یک قهوه لطفاً.\nمی‌توانم یک لیوان آب داشته باشم؟",
    tip: "I'd like برای سفارش مؤدبانه مناسب‌تر از I want است.",
    question: "در کافه می‌خواهی مؤدبانه یک چای سفارش بدهی. کدام جمله بهتر است؟",
    options: ["I like tea yesterday.", "I'd like a tea, please.", "I am tea, please.", "I liking tea."],
    answer: "I'd like a tea, please.", feedback: "درست است. I'd like + اسم یک درخواست مؤدبانه می‌سازد.",
    words: [{word:"I'd like",meaning:"مایلم / می‌خواهم",example:"I'd like a sandwich."},{word:"menu",meaning:"منو",example:"Can I see the menu?"},{word:"glass",meaning:"لیوان",example:"a glass of water"}]
  },
  {
    id: "cur-a0-02", level: "A0", title: "پرسیدن و گفتن شماره تلفن", category: "مکالمه کاربردی", minutes: 8,
    explanation: "برای پرسیدن شماره تلفن می‌گوییم What's your phone number? در خواندن شماره‌ها، هر رقم معمولاً جداگانه گفته می‌شود. صفر را در انگلیسی روزمره اغلب zero یا oh می‌خوانند.",
    example: "A: What's your phone number?\nB: It's 0912 345 6789.",
    translation: "الف: شماره تلفنت چیست؟\nب: ۰۹۱۲ ۳۴۵ ۶۷۸۹ است.",
    tip: "برای شماره تلفن از What is your number? هم می‌توان استفاده کرد، اما phone number دقیق‌تر است.",
    question: "کدام سؤال مشخصاً درباره شماره تلفن است؟",
    options: ["How old are you?", "What's your phone number?", "Where are you from?", "What time is it?"],
    answer: "What's your phone number?", feedback: "phone number یعنی شماره تلفن.",
    words: [{word:"number",meaning:"شماره / عدد",example:"What's your number?"},{word:"phone",meaning:"تلفن",example:"My phone is new."}]
  },
  {
    id: "cur-a1-01", level: "A1", title: "درخواست کمک و تکرار", category: "مکالمه", minutes: 10,
    explanation: "وقتی متوجه حرف کسی نمی‌شوی، به‌جای سکوت می‌توانی از عبارت‌های کوتاه استفاده کنی: Could you repeat that, please? یعنی ممکن است آن را تکرار کنید؟ اگر فقط بخشی را نفهمیدی، What does ... mean? را به کار ببر.",
    example: "A: The meeting is at half past three.\nB: Sorry, could you repeat that, please?",
    translation: "الف: جلسه ساعت سه و نیم است.\nب: ببخشید، ممکن است لطفاً تکرار کنید؟",
    tip: "Could you repeat that? طبیعی و مؤدبانه است؛ Repeat! به‌تنهایی ممکن است دستوری به نظر برسد.",
    question: "در مکالمه جمله‌ای را نشنیده‌ای. کدام پاسخ مؤدبانه‌تر است؟",
    options: ["Speak louder now!", "Could you repeat that, please?", "I don't hear you yesterday.", "Say again you."],
    answer: "Could you repeat that, please?", feedback: "این عبارت درخواست تکرار را مؤدبانه بیان می‌کند.",
    words: [{word:"repeat",meaning:"تکرار کردن",example:"Please repeat the question."},{word:"mean",meaning:"معنی دادن",example:"What does this word mean?"},{word:"sorry",meaning:"ببخشید",example:"Sorry, I didn't understand."}]
  },
  {
    id: "cur-a1-02", level: "A1", title: "some و any در خرید روزمره", category: "دستور زبان", minutes: 11,
    explanation: "some معمولاً در جمله مثبت می‌آید: We have some apples. any بیشتر در سؤال و جمله منفی استفاده می‌شود: Do you have any milk? و We don't have any milk. این یک قاعده پایه است؛ در پیشنهاد و درخواست، some در سؤال هم طبیعی است.",
    example: "There are some eggs in the fridge.\nAre there any tomatoes?\nWe don't have any bread.",
    translation: "چند تخم‌مرغ در یخچال هست.\nگوجه‌ای هست؟\nنان نداریم.",
    tip: "در سؤال خنثی معمولاً any؛ در پیشنهاد مثل Would you like some tea? از some استفاده کن.",
    question: "کدام جمله برای پرسیدن اینکه شیر داریم یا نه درست است؟",
    options: ["Do we have some milk?", "Do we have any milk?", "Are we have any milk?", "Do we has any milk?"],
    answer: "Do we have any milk?", feedback: "در سؤال خنثی درباره وجود شیر، any انتخاب معمول است.",
    words: [{word:"fridge",meaning:"یخچال",example:"The milk is in the fridge."},{word:"eggs",meaning:"تخم‌مرغ‌ها",example:"I need some eggs."},{word:"bread",meaning:"نان",example:"We don't have any bread."}]
  },
  {
    id: "cur-a2-01", level: "A2", title: "مقایسه صفت‌ها", category: "دستور زبان", minutes: 12,
    explanation: "برای مقایسه دو نفر یا چیز، صفت‌های کوتاه معمولاً er می‌گیرند و بعد از آن than می‌آید: cheaper than. صفت‌های بلند معمولاً با more می‌آیند: more comfortable than. برخی صفت‌ها بی‌قاعده‌اند؛ good به better تبدیل می‌شود.",
    example: "This train is faster than the bus.\nThat chair is more comfortable than this one.",
    translation: "این قطار از اتوبوس سریع‌تر است.\nآن صندلی از این یکی راحت‌تر است.",
    tip: "برای صفت کوتاه از more fast استفاده نکن؛ faster درست است.",
    question: "کدام جمله مقایسه را درست بیان می‌کند؟",
    options: ["My car is more cheap than yours.", "My car is cheaper than yours.", "My car is cheapest than yours.", "My car is cheap than yours."],
    answer: "My car is cheaper than yours.", feedback: "cheap صفت کوتاه است؛ شکل مقایسه‌ای آن cheaper است.",
    words: [{word:"faster",meaning:"سریع‌تر",example:"A train is faster than a bike."},{word:"comfortable",meaning:"راحت",example:"This sofa is comfortable."},{word:"than",meaning:"از (در مقایسه)",example:"She is taller than me."}]
  },
  {
    id: "cur-a2-02", level: "A2", title: "پیشنهاد دادن با should", category: "مکالمه و دستور زبان", minutes: 11,
    explanation: "برای توصیه و پیشنهاد از should + شکل ساده فعل استفاده می‌کنیم. برای منفی کردن، shouldn't می‌آوریم. بعد از should نه to می‌آید و نه s سوم‌شخص.",
    example: "You should get some rest.\nYou shouldn't drive when you're tired.",
    translation: "بهتر است کمی استراحت کنی.\nوقتی خسته‌ای نباید رانندگی کنی.",
    tip: "بعد از should همیشه شکل ساده فعل می‌آید: should go، نه should to go یا should goes.",
    question: "کدام جمله از نظر دستوری درست است؟",
    options: ["He should to see a doctor.", "He should sees a doctor.", "He should see a doctor.", "He should seeing a doctor."],
    answer: "He should see a doctor.", feedback: "ساختار should + فعل ساده است.",
    words: [{word:"advice",meaning:"توصیه",example:"Thanks for your advice."},{word:"rest",meaning:"استراحت",example:"You need some rest."},{word:"shouldn't",meaning:"نباید / بهتر است نکند",example:"You shouldn't worry."}]
  },
  {
    id: "cur-b1-01", level: "B1", title: "تفاوت حال کامل و گذشته ساده", category: "دستور زبان", minutes: 14,
    explanation: "گذشته ساده برای رویدادی است که زمان تمام‌شده و مشخصی دارد: I visited Rome last year. حال کامل تجربه یا نتیجه‌ای را به زمان حال وصل می‌کند، بدون اینکه زمان تمام‌شده مشخصی ذکر شود: I've visited Rome. با yesterday، last week و in 2020 معمولاً گذشته ساده می‌آید.",
    example: "I've lost my keys, so I can't open the door.\nI lost my keys yesterday, but I found them.",
    translation: "کلیدهایم را گم کرده‌ام، پس نمی‌توانم در را باز کنم.\nدیروز کلیدهایم را گم کردم، اما پیدایشان کردم.",
    tip: "وجود زمان مشخص و تمام‌شده مثل yesterday نشانه قوی گذشته ساده است.",
    question: "کدام گزینه با yesterday درست کامل می‌شود؟ I ___ her yesterday.",
    options: ["have seen", "saw", "has seen", "seeing"],
    answer: "saw", feedback: "yesterday زمان مشخص و تمام‌شده است؛ بنابراین saw در گذشته ساده می‌آید.",
    words: [{word:"recently",meaning:"اخیراً",example:"I've recently changed jobs."},{word:"already",meaning:"از قبل / تاکنون",example:"I've already eaten."},{word:"yesterday",meaning:"دیروز",example:"We met yesterday."}]
  },
  {
    id: "cur-b1-02", level: "B1", title: "بیان دلیل و نتیجه", category: "نوشتار", minutes: 13,
    explanation: "because دلیل را معرفی می‌کند و so نتیجه را. because به‌دنبال خود یک جمله‌واره می‌آورد؛ because of پیش از اسم یا عبارت اسمی می‌آید. این دو را با هم در یک ساختار ساده به‌کار نبر: Because it rained, so we stayed home نادرست است.",
    example: "We stayed at home because it was raining.\nIt was raining, so we stayed at home.\nThe match was cancelled because of the rain.",
    translation: "چون باران می‌بارید در خانه ماندیم.\nباران می‌بارید، بنابراین در خانه ماندیم.\nمسابقه به‌دلیل باران لغو شد.",
    tip: "because + جمله؛ because of + اسم؛ so + نتیجه.",
    question: "کدام جمله از نظر ساختار درست است؟",
    options: ["Because the road was closed, so we waited.", "We waited because the road was closed.", "We waited because of it was closed.", "So because the road closed."],
    answer: "We waited because the road was closed.", feedback: "بعد از because یک جمله کامل آمده و so اضافی استفاده نشده است.",
    words: [{word:"therefore",meaning:"بنابراین (رسمی)",example:"The data was incomplete; therefore, we repeated the test."},{word:"because of",meaning:"به دلیلِ",example:"The flight was delayed because of fog."},{word:"result",meaning:"نتیجه",example:"The result was unexpected."}]
  },
  {
    id: "cur-b2-01", level: "B2", title: "احتیاط در بیان ادعا", category: "نوشتار آکادمیک", minutes: 14,
    explanation: "در نوشتار تحلیلی، ادعاهای قطعی همیشه مناسب نیستند. واژه‌هایی مانند may, might, appears to و tends to میزان قطعیت را محدود می‌کنند. این کار را hedging می‌نامند و کمک می‌کند تفاوت میان واقعیت اثبات‌شده و برداشت نویسنده روشن بماند.",
    example: "The results suggest that sleep may affect memory.\nThis approach appears to be more effective in small groups.",
    translation: "نتایج نشان می‌دهند که خواب ممکن است بر حافظه اثر بگذارد.\nبه نظر می‌رسد این روش در گروه‌های کوچک مؤثرتر باشد.",
    tip: "suggests و may ادعا را محتاطانه می‌کنند؛ این واژه‌ها را فقط برای پنهان‌کردن شواهد مخالف به‌کار نبر.",
    question: "کدام جمله محتاطانه‌تر و مناسب‌تر برای گزارش یک نتیجه اولیه است؟",
    options: ["This proves the method always works.", "The findings may indicate a positive effect.", "Everyone knows this method is perfect.", "There is no possible doubt."],
    answer: "The findings may indicate a positive effect.", feedback: "may indicate قطعیت را متناسب با شواهد محدود می‌کند.",
    words: [{word:"findings",meaning:"یافته‌ها",example:"The findings support the hypothesis."},{word:"indicate",meaning:"نشان دادن",example:"The figures indicate a decline."},{word:"tentative",meaning:"موقت / غیرقطعی",example:"These are tentative conclusions."}]
  },
  {
    id: "cur-b2-02", level: "B2", title: "ساختار پاراگراف استدلالی", category: "نوشتار", minutes: 15,
    explanation: "یک پاراگراف استدلالی روشن معمولاً چهار جزء دارد: ادعای اصلی، توضیح، شاهد یا مثال، و جمله‌ای که ارتباط شاهد با ادعا را روشن می‌کند. مثال نباید جای ادعا را بگیرد. هر پاراگراف بهتر است یک ایده مرکزی داشته باشد.",
    example: "Public transport should receive more investment. It can reduce the number of private cars on the road. For example, reliable metro services give commuters an alternative to driving. This can ease congestion in busy areas.",
    translation: "حمل‌ونقل عمومی باید سرمایه‌گذاری بیشتری دریافت کند. این کار می‌تواند تعداد خودروهای شخصی در جاده را کاهش دهد. برای مثال، خدمات متروی قابل‌اعتماد جایگزینی برای رانندگی فراهم می‌کند. این امر می‌تواند ترافیک مناطق شلوغ را کاهش دهد.",
    tip: "پس از مثال، توضیح بده چرا آن مثال ادعای اصلی را پشتیبانی می‌کند.",
    question: "در پاراگراف استدلالی، جمله موضوعی چه وظیفه‌ای دارد؟",
    options: ["فقط یک مثال فرعی ارائه می‌دهد.", "ایده یا ادعای اصلی پاراگراف را معرفی می‌کند.", "همیشه نقل‌قول مستقیم است.", "پاراگراف را بدون ارتباط با موضوع تمام می‌کند."],
    answer: "ایده یا ادعای اصلی پاراگراف را معرفی می‌کند.", feedback: "جمله موضوعی جهت و ایده مرکزی پاراگراف را مشخص می‌کند.",
    words: [{word:"claim",meaning:"ادعا",example:"The claim needs evidence."},{word:"evidence",meaning:"شواهد",example:"We need stronger evidence."},{word:"commuter",meaning:"رفت‌وآمدکننده روزانه",example:"Many commuters use the train."}]
  },
  {
    id: "cur-c1-01", level: "C1", title: "وارونگی برای تأکید رسمی", category: "دستور زبان پیشرفته", minutes: 15,
    explanation: "در سبک رسمی و تأکیدی، قیدهای منفی یا محدودکننده مانند rarely، never، seldom و not only اگر در ابتدای جمله بیایند، معمولاً وارونگی فعل کمکی و فاعل ایجاد می‌کنند. ساختار شبیه سؤال می‌شود، اما جمله پرسشی نیست.",
    example: "Rarely have we witnessed such rapid change.\nNot only did she analyse the data, but she also challenged the assumptions.",
    translation: "به‌ندرت شاهد چنین تغییر سریعی بوده‌ایم.\nاو نه‌تنها داده‌ها را تحلیل کرد، بلکه فرض‌ها را نیز به چالش کشید.",
    tip: "اگر فعل کمکی وجود ندارد، برای گذشته ساده از did استفاده کن و فعل اصلی را به شکل پایه برگردان.",
    question: "کدام جمله وارونگی را درست به‌کار برده است؟",
    options: ["Rarely we have seen such results.", "Rarely have we seen such results.", "Rarely did we saw such results.", "Rarely have seen we such results."],
    answer: "Rarely have we seen such results.", feedback: "پس از Rarely در ابتدای جمله، فعل کمکی have پیش از فاعل we می‌آید.",
    words: [{word:"seldom",meaning:"به‌ندرت",example:"Such opportunities seldom arise."},{word:"witness",meaning:"شاهد بودن",example:"We witnessed a major change."},{word:"assumption",meaning:"فرض",example:"The conclusion rests on a weak assumption."}]
  },
  {
    id: "cur-c1-02", level: "C1", title: "تمایز لحن انتقادی و تهاجمی", category: "کاربرد زبان", minutes: 13,
    explanation: "در بحث حرفه‌ای می‌توان با ایده مخالفت کرد، بی‌آنکه به گوینده حمله شود. عبارت‌هایی مانند The argument overlooks...، The evidence does not fully support... و A limitation of this approach is... نقد را متوجه استدلال یا روش می‌کنند، نه شخصیت فرد.",
    example: "The proposal is promising; however, it overlooks the cost of long-term maintenance.\nA limitation of this approach is its small sample size.",
    translation: "این پیشنهاد امیدوارکننده است؛ بااین‌حال هزینه نگهداری بلندمدت را نادیده می‌گیرد.\nیکی از محدودیت‌های این روش، کوچک بودن حجم نمونه آن است.",
    tip: "به‌جای You are wrong، دقیقاً بگو کدام بخش استدلال یا شواهد کافی نیست.",
    question: "کدام عبارت نقد حرفه‌ای و متمرکز بر ایده است؟",
    options: ["You clearly have no idea.", "Your opinion is stupid.", "The argument overlooks an important cost.", "Only an idiot would suggest this."],
    answer: "The argument overlooks an important cost.", feedback: "این جمله محدودیت استدلال را نقد می‌کند، نه شخص را.",
    words: [{word:"overlook",meaning:"نادیده گرفتن",example:"The report overlooks a key risk."},{word:"limitation",meaning:"محدودیت",example:"Every method has limitations."},{word:"maintenance",meaning:"نگهداری",example:"The system requires regular maintenance."}]
  }
];
