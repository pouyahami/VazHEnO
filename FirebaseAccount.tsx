import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth, firebaseEnabled, googleProvider } from "./firebase";

type Props = {
  onUserChange: (user: User | null) => void;
};

export default function FirebaseAccount({ onUserChange }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      onUserChange(nextUser);
    });
  }, [onUserChange]);

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setMessage("");
    try {
      await action();
    } catch (error) {
      const code = (error as { code?: string }).code ?? "";
      const messages: Record<string, string> = {
        "auth/invalid-email": "ایمیل واردشده معتبر نیست.",
        "auth/user-not-found": "حسابی با این ایمیل پیدا نشد.",
        "auth/wrong-password": "رمز عبور درست نیست.",
        "auth/invalid-credential": "ایمیل یا رمز عبور درست نیست.",
        "auth/email-already-in-use": "این ایمیل قبلاً ثبت‌نام کرده است.",
        "auth/weak-password": "رمز عبور باید حداقل ۶ کاراکتر باشد.",
        "auth/popup-closed-by-user": "پنجرهٔ ورود گوگل بسته شد.",
        "auth/unauthorized-domain": "دامنهٔ سایت در Firebase مجاز نشده است.",
        "auth/operation-not-allowed": "این روش ورود در Firebase فعال نیست.",
        "auth/network-request-failed": "اتصال شبکه برقرار نشد؛ فیلترشکن یا اینترنت را بررسی کن.",
      };
      setMessage(messages[code] ?? "عملیات انجام نشد. تنظیمات Firebase و اتصال اینترنت را بررسی کن.");
    } finally {
      setBusy(false);
    }
  };

  if (!firebaseEnabled || !auth) {
    return (
      <div className="firebase-account" dir="rtl">
        <span className="firebase-account-note">ورود ابری هنوز تنظیم نشده است. متغیرهای Firebase را در Cloudflare Pages وارد کن.</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="firebase-account" dir="rtl">
        <span className="firebase-account-note">وارد شده‌ای: {user.displayName || user.email}</span>
        <button className="button button-ghost small-button" disabled={busy} onClick={() => void run(() => signOut(auth))}>خروج</button>
        {message && <span role="status" className="firebase-account-message">{message}</span>}
      </div>
    );
  }

  return (
    <div className="firebase-account" dir="rtl">
      <form className="firebase-account-form" onSubmit={(event) => {
        event.preventDefault();
        void run(async () => {
          if (mode === "register") {
            const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
            if (name.trim()) await updateProfile(credential.user, { displayName: name.trim() });
          } else {
            await signInWithEmailAndPassword(auth, email.trim(), password);
          }
        });
      }}>
        {mode === "register" && (
          <input aria-label="نام نمایشی" autoComplete="name" placeholder="نام نمایشی (اختیاری)" value={name} onChange={(event) => setName(event.target.value)} />
        )}
        <input aria-label="ایمیل" type="email" autoComplete="email" required placeholder="ایمیل" value={email} onChange={(event) => setEmail(event.target.value)} />
        <input aria-label="رمز عبور" type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} minLength={6} required placeholder="رمز عبور (حداقل ۶ کاراکتر)" value={password} onChange={(event) => setPassword(event.target.value)} />
        <button className="button button-primary small-button" type="submit" disabled={busy}>{busy ? "لطفاً صبر کن…" : mode === "register" ? "ثبت‌نام" : "ورود"}</button>
      </form>
      <div className="firebase-account-actions">
        <button className="button button-ghost small-button" disabled={busy} onClick={() => setMode((current) => current === "login" ? "register" : "login")}>
          {mode === "login" ? "ساخت حساب" : "قبلاً حساب دارم"}
        </button>
        <button className="button button-ghost small-button" disabled={busy} onClick={() => void run(() => signInWithPopup(auth, googleProvider))}>ورود با Google</button>
      </div>
      {message && <span role="status" className="firebase-account-message">{message}</span>}
    </div>
  );
}
