import { doc, getDoc, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "../firebase";
import type { SavedState } from "../types";
import { PROGRESS_VERSION } from "../types";

function safeNumber(n: unknown, fallback = 0) {
  return typeof n === "number" && Number.isFinite(n) ? n : fallback;
}

/** ادغام امن: اتحاد درس‌های تکمیل‌شده؛ زمان جدیدتر برندهٔ فیلدهای اسکالر */
export function mergeProgress(local: SavedState, cloud: Partial<SavedState> | null): SavedState {
  if (!cloud) return { ...local, version: PROGRESS_VERSION, updatedAt: Date.now() };
  const localTs = safeNumber(local.updatedAt);
  const cloudTs = safeNumber(cloud.updatedAt);
  const newer = cloudTs >= localTs ? { ...local, ...cloud } : { ...cloud, ...local };
  const completed = Array.from(
    new Set([
      ...(Array.isArray(local.completedLessons) ? local.completedLessons : []),
      ...(Array.isArray(cloud.completedLessons) ? cloud.completedLessons : []),
    ]),
  );
  return {
    ...local,
    ...newer,
    completedLessons: completed,
    reviewedWords: Array.from(
      new Set([
        ...(Array.isArray(local.reviewedWords) ? local.reviewedWords : []),
        ...(Array.isArray(cloud.reviewedWords) ? cloud.reviewedWords : []),
      ]),
    ),
    reviewDates: { ...(cloud.reviewDates || {}), ...(local.reviewDates || {}) },
    version: PROGRESS_VERSION,
    updatedAt: Date.now(),
  } as SavedState;
}

export async function loadCloudProgress(user: User): Promise<Partial<SavedState> | null> {
  if (!db || !user?.uid) return null;
  try {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() as { progress?: Partial<SavedState> };
    return data.progress ?? null;
  }
}

export async function saveCloudProgress(user: User, progress: SavedState): Promise<void> {
  if (!db || !user?.uid) return;
  try {
    const ref = doc(db, "users", user.uid);
    await setDoc(
      ref,
      {
        progress: {
          ...progress,
          version: PROGRESS_VERSION,
          updatedAt: Date.now(),
        },
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        updatedAt: Date.now(),
      },
      { merge: true },
    );
  } catch (err) {
    console.warn("saveCloudProgress failed", err);
  }
}

/** فقط ترجیحات UI بدون پیشرفت یادگیری */
export function uiPrefsOnly(state: SavedState): Partial<SavedState> {
  return {
    fontScale: state.fontScale,
    targetLang: state.targetLang,
    dailyGoal: state.dailyGoal,
    userName: state.userName,
  };
}
