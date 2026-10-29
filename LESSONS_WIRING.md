# اتصال درس‌های جدید و امکانات آخر

فایل `ExtraLessons.ts` حدود ۲۴۰ درس اضافه می‌کند.

## فقط ۲ خط در App.tsx برای ۵۰۰ درس

### ۱) ایمپورت
بعد از:
```ts
import { expandedLessons } from "./ExpandedLessons";
```
این را بگذار:
```ts
import { extraLessons } from "./ExtraLessons";
```

### ۲) آرایه lessons
این خط:
```ts
const lessons: Lesson[] = [...baseLessons, ...expandedLessons];
```
را عوض کن به:
```ts
const lessons: Lesson[] = [...baseLessons, ...expandedLessons, ...(extraLessons as Lesson[])];
```

اگر این خط را دیدی حذف یا کامنت کن (جلوگیری از تکرار):
```ts
lessons.push(...(expandedLessons as any));
```

---

بقیه امکانات (استریک، ریدایرکت بعد از ثبت‌نام، جستجو، خروجی JSON، about)
در کامیت‌های اخیر بخشی‌شان در FirebaseAccount و AchievementBadges آماده است.
برای استریک و جستجو همان بلوک‌های کوتاه داخل App.tsx لازم است.
