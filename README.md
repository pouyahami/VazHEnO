# واژه‌نو (Vazheno)

اپ آموزش زبان با توضیح فارسی؛ React 18 + TypeScript + Vite، ورود و همگام‌سازی با Firebase، دیپلوی روی Cloudflare Pages.

## اجرا

```bash
npm install
cp .env.example .env   # مقادیر VITE_FIREBASE_* را پر کنید
npm run dev
```

## کنترل کیفیت

```bash
npm run ci   # typecheck + اعتبارسنجی محتوای درس‌ها + build
```

اعتبارسنجی محتوا (`scripts/validate-lessons.mjs`) همهٔ درس‌ها را واقعاً بارگذاری می‌کند و این موارد را بررسی می‌کند: یکتا بودن id، معتبر بودن سطح، وجود پاسخ میان گزینه‌ها، نبودن گزینهٔ تکراری یا خالی، کامل بودن فیلدها و پرسش‌های تکراری.

## دیپلوی (Cloudflare Pages)

- Build command: `npm run build`، Output: `dist`
- متغیرهای `VITE_FIREBASE_*` را در تنظیمات Pages بگذارید.
- در Firebase Console: قوانین `firestore.rules` را منتشر کنید و دامنهٔ سایت را به Authorized domains اضافه کنید.

## ساختار محتوا

`BaseLessons.ts` و `ExpandedLessons.ts` (انگلیسی، دست‌نویس)، `ExtraLessons.ts` (۶۰ درس تکمیلی، یک درس برای هر موضوع)، `SpanishLessons.ts`.
