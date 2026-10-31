
import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import FirebaseAccount from "./FirebaseAccount";
import { db } from "./firebase";
import "./App.css";
import StageAssessment from "./StageAssessment";
import ListeningPractice from "./ListeningPractice";
import SpeakingPractice from "./SpeakingPractice";
import ImmersivePractice from "./ImmersivePractice";
import DailyLearning from "./DailyLearning";
import AlphabetCourse from "./AlphabetCourse";
import IeltsCourse from "./IeltsCourse";
import SmartLearning from "./SmartLearning";
import { expandedLessons } from "./ExpandedLessons";
import { extraLessons } from "./ExtraLessons";
import AchievementBadges from "./AchievementBadges";

// EMERGENCY: full file too large for this channel — see commit message
export default function App() {
  return (
    <div dir="rtl" style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>واژه‌نو</h1>
      <p>در حال بازگردانی فایل اصلی… لطفاً چند لحظه صبر کن و صفحه را رفرش کن.</p>
      <p>اگر این پیام ماند، از GitHub فایل App.tsx را از کامیت قبلی برگردان.</p>
      <p>
        <a href="https://github.com/pouyahami/VazHEnO/blob/5acad85faf21d24b1b67e36c242277df7c4e0427/App.tsx">
          لینک نسخهٔ سالم App.tsx
        </a>
      </p>
    </div>
  );
}
