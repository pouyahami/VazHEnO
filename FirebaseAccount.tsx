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
  const [open, setOpen] = useState(false);
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
      if (nextUser) setOpen(false);
    });
  }, [onUserChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

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

  const switchMode = (next: "login" | "register") => {
    setMode(next);
    setMessage("");
  };

  if (!firebaseEnabled || !auth) {
    return (
      <div className="firebase-account" dir="rtl">
        <span className="firebase-account-note">ورود ابری هنوز تنظیم نشده است.</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="firebase-account firebase-account-logged" dir="rtl">
        <span className="firebase-account-note">
          {user.displayName || user.email}
        </span>
        <button
          className="button button-ghost small-button"
          disabled={busy}
          onClick={() => void run(() => signOut(auth))}
        >
          خروج
        </button>
        {message && (
          <span role="status" className="firebase-account-message">
            {message}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="firebase-account" dir="rtl">
      <button
        className="button button-ghost small-button"
        type="button"
        onClick={() => {
          setMode("login");
          setMessage("");
          setOpen(true);
        }}
      >
        ورود
      </button>
      <button
        className="button button-primary small-button"
        type="button"
        onClick={() => {
          setMode("register");
          setMessage("");
          setOpen(true);
        }}
      >
        ساخت حساب
      </button>

      {open && (
        <div
          className="auth-modal-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            dir="rtl"
          >
            <button
              className="auth-modal-close"
              type="button"
              aria-label="بستن"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

            <div className="auth-modal-header">
              <div className="auth-modal-brand">و</div>
              <h2 id="auth-modal-title">
                {mode === "login" ? "ورود به واژه‌نو" : "ساخت حساب کاربری"}
              </h2>
              <p>
                {mode === "login"
                  ? "برای ذخیره پیشرفت و ادامه یادگیری وارد شو."
                  : "یک حساب بساز تا پیشرفتت ذخیره شود."}
              </p>
            </div>

            <form
              className="auth-modal-form"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  if (mode === "register") {
                    const credential = await createUserWithEmailAndPassword(
                      auth,
                      email.trim(),
                      password
                    );
                    if (name.trim()) {
                      await updateProfile(credential.user, {
                        displayName: name.trim(),
                      });
                    }
                  } else {
                    await signInWithEmailAndPassword(
                      auth,
                      email.trim(),
                      password
                    );
                  }
                });
              }}
            >
              {mode === "register" && (
                <label className="auth-field">
                  <span>نام نمایشی</span>
                  <input
                    aria-label="نام نمایشی"
                    autoComplete="name"
                    placeholder="اختیاری"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </label>
              )}

              <label className="auth-field">
                <span>ایمیل</span>
                <input
                  aria-label="ایمیل"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              <label className="auth-field">
                <span>رمز عبور</span>
                <input
                  aria-label="رمز عبور"
                  type="password"
                  autoComplete={
                    mode === "register" ? "new-password" : "current-password"
                  }
                  minLength={6}
                  required
                  placeholder="حداقل ۶ کاراکتر"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>

              {message && (
                <span role="status" className="auth-modal-message">
                  {message}
                </span>
              )}

              <button
                className="button button-primary auth-submit"
                type="submit"
                disabled={busy}
              >
                {busy
                  ? "لطفاً صبر کن…"
                  : mode === "register"
                    ? "ثبت‌نام"
                    : "ورود"}
              </button>
            </form>

            <div className="auth-modal-divider">
              <span>یا</span>
            </div>

            <button
              className="button button-ghost auth-google"
              type="button"
              disabled={busy}
              onClick={() =>
                void run(() => signInWithPopup(auth, googleProvider))
              }
            >
              ورود با Google
            </button>

            <div className="auth-modal-switch">
              {mode === "login" ? (
                <>
                  حساب ندارید؟{" "}
                  <button type="button" onClick={() => switchMode("register")}>
                    ثبت‌نام کنید
                  </button>
                </>
              ) : (
                <>
                  قبلاً حساب دارید؟{" "}
                  <button type="button" onClick={() => switchMode("login")}>
                    وارد شوید
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
