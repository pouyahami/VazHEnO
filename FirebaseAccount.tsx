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
  const [open, setOpen] = useState(false);
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
      if (nextUser) setOpen(false);
    });
  }, [onUserChange]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("auth-modal-open");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("auth-modal-open");
    };
  }, [open, busy]);

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
        "auth/network-request-failed": "اتصال شبکه برقرار نشد؛ اینترنت را بررسی کن.",
      };
      setMessage(messages[code] ?? "عملیات انجام نشد. تنظیمات Firebase و اتصال اینترنت را بررسی کن.");
    } finally {
      setBusy(false);
    }
  };

  const switchMode = () => {
    setMode((current) => current === "login" ? "register" : "login");
    setMessage("");
  };

  return (
    <div className="firebase-account" dir="rtl">
      {user ? (
        <div className="firebase-account-signed-in">
          <span className="firebase-user-label" title={user.email ?? ""}>سلام، {user.displayName || user.email}</span>
          <button className="button button-ghost small-button" disabled={busy} onClick={() => void run(() => signOut(auth!))}>خروج</button>
        </div>
      ) : (
        <div className="firebase-account-entry">
          <button className="button button-ghost small-button" onClick={() => { setMode("login"); setMessage(""); setOpen(true); }}>ورود</button>
          <button className="button button-primary small-button" onClick={() => { setMode("register"); setMessage(""); setOpen(true); }}>ساخت حساب</button>
        </div>
      )}

      {open && (
        <div className="auth-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !busy) setOpen(false);
        }}>
          <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" dir="rtl">
            <button className="auth-modal-close" type="button" aria-label="بستن پنجره" onClick={() => !busy && setOpen(false)}>×</button>
            <div className="auth-modal-brand" aria-hidden="true">و</div>
            <h2 id="auth-modal-title">{mode === "login" ? "ورود به واژه‌نو" : "ساخت حساب کاربری"}</h2>
            <p className="auth-modal-subtitle">{mode === "login" ? "برای ادامهٔ یادگیری وارد حساب خودت شو." : "حساب بساز و پیشرفت یادگیری‌ات را ذخیره کن."}</p>

            {!firebaseEnabled || !auth ? (
              <div className="auth-modal-warning" role="status">ورود ابری هنوز تنظیم نشده است. ابتدا متغیرهای Firebase را در تنظیمات Cloudflare Pages وارد کن.</div>
            ) : (
              <>
                <form className="auth-modal-form" onSubmit={(event) => {
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
                    <label className="auth-field">
                      <span>نام نمایشی <small>(اختیاری)</small></span>
                      <input autoComplete="name" placeholder="نامی که نمایش داده می‌شود" value={name} onChange={(event) => setName(event.target.value)} />
                    </label>
                  )}
                  <label className="auth-field">
                    <span>ایمیل</span>
                    <input type="email" autoComplete="email" required placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
                  </label>
                  <label className="auth-field">
                    <span>رمز عبور</span>
                    <input type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} minLength={6} required placeholder={mode === "register" ? "حداقل ۶ کاراکتر" : "رمز عبور"} value={password} onChange={(event) => setPassword(event.target.value)} />
                  </label>
                  <button className="button button-primary auth-submit" type="submit" disabled={busy}>{busy ? "لطفاً صبر کن…" : mode === "register" ? "ثبت‌نام" : "ورود"}</button>
                </form>
                <div className="auth-modal-divider"><span>یا</span></div>
                <button className="auth-google-button" type="button" disabled={busy} onClick={() => void run(() => signInWithPopup(auth, googleProvider))}>
                  <svg aria-hidden="true" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.01 13.22l7.98 6.19C12.88 13.72 18.01 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.1 46.98 31.27 46.98 24.55Z"/><path fill="#FBBC05" d="M10.99 28.59A14.4 14.4 0 0 1 10.2 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.58 10.78l8.41-6.19Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-5.99 0-11.12-4.22-13.01-9.91l-8.41 6.19C6.51 43.62 14.62 48 24 48Z"/></svg>
                  ورود با Google
                </button>
                {message && <p className="auth-modal-message" role="alert">{message}</p>}
                <p className="auth-modal-switch">
                  {mode === "login" ? "حساب ندارید؟" : "قبلاً حساب دارید؟"}
                  <button type="button" onClick={switchMode} disabled={busy}>{mode === "login" ? "ثبت‌نام کنید" : "وارد شوید"}</button>
                </p>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
