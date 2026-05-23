import React, { useState, useEffect, useRef } from "react";
import {
  Crosshair, Zap, Radio, Activity, ArrowUpRight, Check, X, ChevronRight,
  Target, TrendingDown, Lock, Eye, EyeOff, Mail, Key, ArrowRight,
  Sparkles, AlertCircle, Cpu, Gauge, Layers, Hash, MoveRight, Terminal,
  ShieldCheck, Clock, Flame
} from "lucide-react";

// ============ TICKER COMPONENT ============
// Эффект "тикающей" сетки коэффициентов в фоне — как биржевой терминал
function CoefTicker() {
  const warehouses = ["KOL", "ELE", "TUL", "POD", "KAZ", "PEN", "NSK", "EKA", "SHU", "KRD"];
  const [ticks, setTicks] = useState(() =>
    warehouses.map(w => ({
      wh: w,
      coef: Math.floor(Math.random() * 6),
      flash: false
    }))
  );

  useEffect(() => {
    const i = setInterval(() => {
      setTicks(prev => prev.map(t => {
        if (Math.random() < 0.18) {
          const newCoef = Math.floor(Math.random() * 8);
          return { ...t, coef: newCoef, flash: true };
        }
        return { ...t, flash: false };
      }));
    }, 800);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.22]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-5 gap-2 text-[10px] font-mono uppercase rotate-[-8deg] scale-150">
          {ticks.map((t, i) => (
            <div key={i} className={`flex items-center gap-1.5 px-2 py-1 border border-lime-400/30 bg-zinc-950/80 ${t.flash ? "border-lime-400 bg-lime-400/10" : ""} transition-all`}>
              <span className="text-zinc-500">{t.wh}</span>
              <span className={t.coef === 0 ? "text-lime-400" : t.coef <= 2 ? "text-emerald-400" : t.coef <= 5 ? "text-amber-400" : "text-rose-400"}>
                {t.coef === 0 ? "FREE" : `×${t.coef}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ TYPING EFFECT ============
function TypedHeadline() {
  const phrases = ["слоты бронирования", "лимиты перераспределения", "коэффициенты приёмки", "окна доставки на склад"];
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[idx];
    const speed = deleting ? 35 : 60;
    const timeout = setTimeout(() => {
      if (!deleting && text === current) {
        setTimeout(() => setDeleting(true), 1800);
        return;
      }
      if (deleting && text === "") {
        setDeleting(false);
        setIdx((idx + 1) % phrases.length);
        return;
      }
      setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, idx]);

  return (
    <span className="text-lime-400">
      {text}
      <span className="inline-block w-[3px] h-[0.9em] bg-lime-400 ml-1 align-middle animate-pulse" />
    </span>
  );
}

// ============ LIVE COUNTER ============
function LiveCounter({ start, suffix = "", duration = 2000 }) {
  const [val, setVal] = useState(start);
  useEffect(() => {
    const i = setInterval(() => {
      setVal(v => v + Math.floor(Math.random() * 3));
    }, 2500);
    return () => clearInterval(i);
  }, []);
  return <span className="font-mono tabular-nums">{val.toLocaleString("ru")}{suffix}</span>;
}

// ============ TERMINAL LOG ============
function LiveTerminal() {
  const lines = [
    { t: "00:12:847", type: "scan", msg: "[scan] Коледино → Казань: ×3 (нет)" },
    { t: "00:12:912", type: "scan", msg: "[scan] Электросталь → Новосиб: ×5 (нет)" },
    { t: "00:13:002", type: "hit",  msg: "[HIT!] Подольск → Екат-бург: ×0 FREE — 320 ед." },
    { t: "00:13:018", type: "book", msg: "[BOOK] Запрос на бронирование..." },
    { t: "00:13:241", type: "ok",   msg: "[OK] Слот забронирован #BK-2049173" },
    { t: "00:13:242", type: "info", msg: "[bill] Списано 800₽" },
    { t: "00:13:892", type: "scan", msg: "[scan] Шушары → Тула: ×2 (выше лимита)" },
    { t: "00:13:953", type: "scan", msg: "[scan] Краснодар → Пенза: ×0 FREE — 95 ед." },
    { t: "00:13:966", type: "book", msg: "[BOOK] Запрос на бронирование..." },
    { t: "00:14:188", type: "ok",   msg: "[OK] Слот забронирован #BK-2049174" },
  ];
  const [visible, setVisible] = useState(3);
  useEffect(() => {
    const i = setInterval(() => {
      setVisible(v => v >= lines.length ? 3 : v + 1);
    }, 700);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="font-mono text-xs leading-relaxed space-y-0.5">
      {lines.slice(0, visible).map((l, i) => (
        <div key={i} className="flex gap-3 animate-[fadeIn_0.3s]">
          <span className="text-zinc-600">{l.t}</span>
          <span className={
            l.type === "hit" ? "text-lime-400 font-semibold" :
            l.type === "book" ? "text-cyan-400" :
            l.type === "ok" ? "text-emerald-400" :
            l.type === "info" ? "text-amber-400" :
            "text-zinc-500"
          }>{l.msg}</span>
        </div>
      ))}
      <div className="flex gap-3">
        <span className="text-zinc-700">{`00:14:${String(Math.floor(visible * 47) % 999).padStart(3, "0")}`}</span>
        <span className="text-zinc-700">[scan] <span className="inline-block w-2 h-3 bg-lime-400/60 animate-pulse" /></span>
      </div>
    </div>
  );
}

// ============ MAIN ============
export default function SlotHuntLanding() {
  const [page, setPage] = useState("landing"); // 'landing' | 'signup'

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden" style={{ fontFamily: "'JetBrains Mono', 'Manrope', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Manrope', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-grotesk { font-family: 'Space Grotesk', sans-serif; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gridScroll {
          0% { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }
        .bg-grid {
          background-image:
            linear-gradient(rgba(190, 242, 100, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(190, 242, 100, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridScroll 20s linear infinite;
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .scan-line {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(190, 242, 100, 0.5), transparent);
          animation: scan 8s linear infinite;
          pointer-events: none;
        }
        @keyframes blink {
          50% { opacity: 0.3; }
        }
        .blink { animation: blink 1.5s infinite; }
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E");
          opacity: 0.04;
          mix-blend-mode: overlay;
        }
      `}</style>

      {page === "signup" ? <SignupPage onBack={() => setPage("landing")} /> : <LandingPage onSignup={() => setPage("signup")} />}
    </div>
  );
}

// ============ LANDING ============
function LandingPage({ onSignup }) {
  return (
    <>
      {/* ============ NAV ============ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-lime-300 to-emerald-500 flex items-center justify-center">
              <Crosshair size={16} className="text-zinc-950" strokeWidth={2.8} />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight font-display">SLOTHUNT<span className="text-lime-400">.</span></div>
              <div className="text-[9px] text-zinc-500 -mt-0.5 tracking-[0.2em]">WB SLOT INTELLIGENCE</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <a href="#how" className="hover:text-lime-400 transition-colors">Как работает</a>
            <a href="#pricing" className="hover:text-lime-400 transition-colors">Тарифы</a>
            <a href="#compare" className="hover:text-lime-400 transition-colors">vs. Lynio</a>
            <a href="#faq" className="hover:text-lime-400 transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden md:block text-sm text-zinc-400 hover:text-zinc-100 px-3 py-1.5">Войти</button>
            <button onClick={onSignup} className="text-sm bg-lime-400 hover:bg-lime-300 text-zinc-950 font-semibold px-3 py-1.5 rounded-md transition-colors">
              Начать бесплатно
            </button>
          </div>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 noise" />
        <div className="scan-line" />
        <CoefTicker />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-400/30 bg-lime-400/5 text-xs text-lime-300 mb-6 font-mono">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-lime-400"></span>
                </span>
                <span className="uppercase tracking-widest">Live · 2 847 слотов поймано за сегодня</span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] mb-6">
                Ваш бот-снайпер<br />
                ловит <TypedHeadline /><br />
                <span className="text-zinc-500">на Wildberries.</span>
              </h1>

              <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-xl">
                Окно бронирования на популярные склады заполняется за <span className="text-lime-300 font-mono">0.3 секунды</span>.
                Ручной мониторинг — пустая трата времени. SlotHunt дежурит 24/7, ловит ×0 коэффициенты
                и бронирует за вас.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <button onClick={onSignup} className="group flex items-center gap-2 px-5 py-3 bg-lime-400 hover:bg-lime-300 text-zinc-950 font-semibold rounded-lg transition-colors shadow-lg shadow-lime-400/30">
                  <Target size={16} strokeWidth={2.8} />
                  Запустить охоту бесплатно
                  <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <a href="#how" className="flex items-center gap-2 px-5 py-3 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 rounded-lg transition-colors">
                  <Terminal size={16} />
                  Смотреть как работает
                </a>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-md">
                <div>
                  <div className="text-2xl font-mono font-bold text-zinc-50"><LiveCounter start={847200} suffix=" ₽" /></div>
                  <div className="text-xs text-zinc-500 mt-1">Сэкономлено клиентами</div>
                </div>
                <div>
                  <div className="text-2xl font-mono font-bold text-zinc-50">97<span className="text-lime-400">.4</span>%</div>
                  <div className="text-xs text-zinc-500 mt-1">Success rate</div>
                </div>
                <div>
                  <div className="text-2xl font-mono font-bold text-zinc-50">8<span className="text-zinc-600 text-base"> мин</span></div>
                  <div className="text-xs text-zinc-500 mt-1">Среднее время отлова</div>
                </div>
              </div>
            </div>

            {/* Live terminal */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-lime-400/20 via-transparent to-cyan-400/10 blur-3xl" />
              <div className="relative bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/50 border-b border-zinc-800">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-lime-400/60" />
                  </div>
                  <div className="text-xs text-zinc-500 font-mono">hunter.log — live</div>
                  <div className="flex items-center gap-1.5 text-xs text-lime-400 font-mono">
                    <Radio size={11} className="blink" />
                    REC
                  </div>
                </div>
                <div className="p-5 h-80 overflow-hidden">
                  <LiveTerminal />
                </div>
                <div className="px-4 py-2.5 bg-zinc-900/30 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-zinc-500 font-mono">
                    <span><span className="text-lime-400">●</span> connected</span>
                    <span>workers: 50</span>
                    <span>rps: 187</span>
                  </div>
                  <div className="text-zinc-600 font-mono">v2.4.1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section className="border-y border-zinc-800/60 bg-zinc-900/30 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { v: "1 247", l: "активных селлеров", trend: "+18%" },
              { v: "184 392", l: "слотов поймано всего", trend: "+34%" },
              { v: "₽12.4M", l: "клиентских остатков перемещено", trend: "+27%" },
              { v: "0.3 сек", l: "средняя реакция бота", trend: null },
            ].map((s, i) => (
              <div key={i} className="border-l-2 border-lime-400/30 pl-4">
                <div className="text-3xl font-mono font-bold text-zinc-50">{s.v}</div>
                <div className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                  {s.l}
                  {s.trend && <span className="text-lime-400 font-mono">↑ {s.trend}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <div className="text-xs uppercase tracking-[0.3em] text-lime-400 font-mono mb-3">/ как работает</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Три шага от подключения<br />до первого пойманного слота.
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl">
              Никаких сложных интеграций. Подключаетесь через API-ключ из ЛК Wildberries — и бот выходит на охоту.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                icon: Key,
                title: "Подключи кабинет",
                desc: "Вставь JWT-ключ из ЛК WB и cookie сессии. 30 секунд — и SlotHunt видит твои товары, склады, остатки.",
                detail: "AES-256 шифрование · соответствие 152-ФЗ"
              },
              {
                num: "02",
                icon: Target,
                title: "Создай задачу",
                desc: "Укажи артикул, направление склад→склад, количество и макс. коэффициент. Установи ставку — спишется только при успехе.",
                detail: "Прогноз вероятности отлова в реальном времени"
              },
              {
                num: "03",
                icon: Crosshair,
                title: "Получи слот",
                desc: "Бот опрашивает WB 24/7 с распределённого пула прокси. При появлении лимита — бронирует за 200 мс. Уведомление в Telegram.",
                detail: "Success rate 97.4% по слотам ×0–×2"
              },
            ].map((step, i) => (
              <div key={i} className="group relative bg-zinc-900/30 border border-zinc-800 hover:border-lime-400/30 rounded-xl p-6 transition-all">
                <div className="absolute top-4 right-4 text-7xl font-mono font-bold text-zinc-800/50 group-hover:text-lime-400/20 transition-colors">
                  {step.num}
                </div>
                <step.icon size={28} className="text-lime-400 mb-6" strokeWidth={1.8} />
                <h3 className="font-display text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">{step.desc}</p>
                <div className="text-xs text-lime-300/80 font-mono pt-3 border-t border-zinc-800">
                  → {step.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="py-24 bg-zinc-900/20 border-y border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <div className="text-xs uppercase tracking-[0.3em] text-lime-400 font-mono mb-3">/ возможности</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Не просто отлов слотов.<br />
              <span className="text-zinc-500">Полный командный центр.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Crosshair, title: "Отлов слотов 24/7", desc: "Параллельная охота за десятками маршрутов. Приоритеты, дедлайны, ставки." },
              { icon: Layers,    title: "Карта коэффициентов", desc: "Сетка ×0…×20 по 200+ складам обновляется каждые 30 сек." },
              { icon: TrendingDown, title: "Аналитика остатков", desc: "Прогноз обнуления склада по ФО. Авто-рекомендации куда переместить." },
              { icon: Gauge,     title: "Прогноз вероятности", desc: "ML-модель оценивает шансы отлова до создания задачи." },
              { icon: ShieldCheck, title: "Безопасность", desc: "AES-256 шифрование ключей, прокси-пул, ротация UA, 152-ФЗ." },
              { icon: Cpu,       title: "Pay-per-success", desc: "Ставка списывается только после реального бронирования. Никаких подписок без результата." },
              { icon: Activity,  title: "Telegram-бот", desc: "Мгновенные уведомления, быстрые действия, ежедневная сводка." },
              { icon: Hash,      title: "Multi-account", desc: "До 10 WB-кабинетов в одном интерфейсе. Для агентств и крупных селлеров." },
              { icon: Clock,     title: "История и аудит", desc: "Каждая попытка, каждая копейка — в неизменяемом логе на 12 мес." },
            ].map((f, i) => (
              <div key={i} className="group bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 rounded-lg p-5 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-lime-400/10 border border-lime-400/20 flex items-center justify-center shrink-0 group-hover:bg-lime-400/15 transition-colors">
                    <f.icon size={16} className="text-lime-400" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100 mb-1.5">{f.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ COMPARISON ============ */}
      <section id="compare" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 text-center">
            <div className="text-xs uppercase tracking-[0.3em] text-lime-400 font-mono mb-3">/ сравнение</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Чем мы отличаемся от конкурентов
            </h2>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-zinc-500 font-medium">Возможность</th>
                  <th className="px-5 py-4 text-center">
                    <div className="inline-flex items-center gap-2 text-lime-400 font-display font-bold">
                      <Crosshair size={14} /> SlotHunt
                    </div>
                  </th>
                  <th className="px-5 py-4 text-center text-zinc-500 font-mono text-xs">Lynio</th>
                  <th className="px-5 py-4 text-center text-zinc-500 font-mono text-xs">mp_helpbot</th>
                  <th className="px-5 py-4 text-center text-zinc-500 font-mono text-xs">Chrome-расширения</th>
                </tr>
              </thead>
              <tbody className="font-display">
                {[
                  ["Отлов слотов 24/7",         "yes", "yes", "yes", "no"],
                  ["Pay-per-success",            "yes", "no",  "no",  "no"],
                  ["Аналитика по ФО",            "yes", "part","no",  "no"],
                  ["ML-прогноз отлова",          "yes", "no",  "no",  "no"],
                  ["Multi-account (до 10)",      "yes", "yes", "yes", "no"],
                  ["Telegram-бот",               "yes", "yes", "yes", "no"],
                  ["Скорость реакции",           "0.3с", "1-2с","1-3с","5-10с"],
                  ["Прокси-пул",                 "200 IP","20","10","нет"],
                  ["Цена/мес от",                "0₽", "2 990₽", "1 990₽", "990₽"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/40 hover:bg-zinc-900/30">
                    <td className="px-5 py-3.5 text-zinc-300 font-medium">{row[0]}</td>
                    {row.slice(1).map((val, j) => (
                      <td key={j} className={`px-5 py-3.5 text-center ${j === 0 ? "bg-lime-400/5" : ""}`}>
                        {val === "yes" ? (
                          <Check size={16} className={j === 0 ? "text-lime-400 inline" : "text-zinc-400 inline"} strokeWidth={2.5} />
                        ) : val === "no" ? (
                          <X size={16} className="text-zinc-700 inline" strokeWidth={2} />
                        ) : val === "part" ? (
                          <span className="text-amber-400 text-xs font-mono">частично</span>
                        ) : (
                          <span className={`font-mono text-xs ${j === 0 ? "text-lime-300 font-bold" : "text-zinc-400"}`}>{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-600 mt-4 text-center font-mono">* Данные конкурентов на 19 мая 2026, по публичным источникам</p>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="py-24 bg-zinc-900/20 border-y border-zinc-800/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center">
            <div className="text-xs uppercase tracking-[0.3em] text-lime-400 font-mono mb-3">/ тарифы</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Платите только за результат
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Без скрытых платежей. Стартовый тариф вечно бесплатный, остальные — с pay-per-success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* СТАРТ */}
            <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-colors">
              <div className="text-xs uppercase tracking-wider text-zinc-500 font-mono mb-2">/ старт</div>
              <h3 className="font-display text-2xl font-bold mb-4">Знакомство</h3>
              <div className="mb-1">
                <span className="text-5xl font-display font-bold">0</span>
                <span className="text-2xl font-display text-zinc-500">₽</span>
                <span className="text-sm text-zinc-500 ml-1">/ мес</span>
              </div>
              <div className="text-sm text-zinc-500 mb-8 font-mono">+ 200₽ за каждый отлов</div>
              <button className="w-full py-2.5 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg transition-colors mb-8 text-sm font-medium">
                Начать бесплатно
              </button>
              <ul className="space-y-3 text-sm text-zinc-400">
                {["1 WB-кабинет", "До 10 отловов в месяц", "Базовая аналитика", "Email уведомления", "Стандартная очередь"].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check size={14} className="text-zinc-500 mt-0.5 shrink-0" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ПРОФИ — featured */}
            <div className="relative bg-gradient-to-b from-lime-400/[0.05] to-zinc-950 border border-lime-400/40 rounded-2xl p-8 shadow-2xl shadow-lime-400/10 lg:scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-lime-400 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-full font-mono">
                Популярный
              </div>
              <div className="text-xs uppercase tracking-wider text-lime-400 font-mono mb-2">/ профи</div>
              <h3 className="font-display text-2xl font-bold mb-4">Для активных селлеров</h3>
              <div className="mb-1">
                <span className="text-5xl font-display font-bold">2 990</span>
                <span className="text-2xl font-display text-zinc-500">₽</span>
                <span className="text-sm text-zinc-500 ml-1">/ мес</span>
              </div>
              <div className="text-sm text-lime-300 mb-8 font-mono">+ 100₽ за отлов</div>
              <button className="w-full py-2.5 bg-lime-400 hover:bg-lime-300 text-zinc-950 font-semibold rounded-lg transition-colors mb-8 shadow-lg shadow-lime-400/20">
                Выбрать Профи
              </button>
              <ul className="space-y-3 text-sm text-zinc-300">
                {[
                  "До 3 WB-кабинетов",
                  "До 100 отловов в месяц",
                  "Полная аналитика по ФО",
                  "Telegram-бот",
                  "ML-прогноз вероятности",
                  "Приоритет в очереди ×2",
                  "Карта коэффициентов",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check size={14} className="text-lime-400 mt-0.5 shrink-0" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* БИЗНЕС */}
            <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-colors">
              <div className="text-xs uppercase tracking-wider text-zinc-500 font-mono mb-2">/ бизнес</div>
              <h3 className="font-display text-2xl font-bold mb-4">Агентства и крупные</h3>
              <div className="mb-1">
                <span className="text-5xl font-display font-bold">9 990</span>
                <span className="text-2xl font-display text-zinc-500">₽</span>
                <span className="text-sm text-zinc-500 ml-1">/ мес</span>
              </div>
              <div className="text-sm text-zinc-500 mb-8 font-mono">+ 50₽ за отлов</div>
              <button className="w-full py-2.5 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg transition-colors mb-8 text-sm font-medium">
                Выбрать Бизнес
              </button>
              <ul className="space-y-3 text-sm text-zinc-400">
                {[
                  "До 10 WB-кабинетов",
                  "Безлимит отловов",
                  "B2B API доступ",
                  "Приоритет в очереди ×5",
                  "Dedicated прокси-пул",
                  "Закрывающие документы",
                  "Менеджер аккаунта",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check size={14} className="text-zinc-500 mt-0.5 shrink-0" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a href="#" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-lime-400 transition-colors font-mono">
              Нужен Enterprise или особые условия? Напишите нам
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-12">
            <div className="text-xs uppercase tracking-[0.3em] text-lime-400 font-mono mb-3">/ вопросы</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">FAQ</h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Безопасно ли подключать WB-кабинет?",
                a: "Да. API-ключи и cookie сессии шифруются AES-256-GCM, ключ шифрования хранится в Vault отдельно от БД. Данные размещены в РФ (Selectel), соответствие 152-ФЗ. Доступ к ключам имеют только воркеры — никто из команды их не видит."
              },
              {
                q: "Может ли WB заблокировать мой аккаунт за использование сервиса?",
                a: "Риск минимизирован: запросы идут с пула из 200 IP, имитируют поведение реального селлера (rate-limit 3 RPS, ротация User-Agent, естественные задержки). За 2 года ни один наш клиент не получил блокировку. Сервис работает по принципу «бот работает от вашего имени по вашему поручению» — формально это автоматизация ваших же действий."
              },
              {
                q: "Что значит pay-per-success?",
                a: "Ставка резервируется на вашем балансе при создании задачи, но списывается только когда слот РЕАЛЬНО забронирован у WB. Не нашли слот — деньги вернулись. Никаких подписок без результата."
              },
              {
                q: "Сколько времени занимает отлов слота ×0?",
                a: "На популярные склады (Казань, Электросталь) — 5–30 минут в среднем. На менее загруженные — мгновенно. Success rate по слотам ×0–×2 — 97.4%."
              },
              {
                q: "Можно ли использовать на нескольких WB-аккаунтах?",
                a: "Да, на тарифе Профи — до 3, на Бизнесе — до 10, на Enterprise — без ограничений."
              },
              {
                q: "Как отказаться от подписки?",
                a: "В личном кабинете кнопкой «Отменить подписку». Доступ сохраняется до конца оплаченного периода. Возврата за неиспользованный период нет, но баланс pay-per-success возвращается."
              },
            ].map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-24 relative overflow-hidden border-t border-zinc-800/60">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-lime-400/10 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <Flame size={32} className="text-lime-400 mx-auto mb-6" strokeWidth={1.5} />
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[0.95]">
            Пока вы спите —<br />
            <span className="text-lime-400">кто-то ловит ваши слоты.</span>
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
            Подключитесь за 2 минуты. Первые 10 отловов — бесплатно. Без карты.
          </p>
          <button onClick={onSignup} className="group inline-flex items-center gap-2 px-6 py-3.5 bg-lime-400 hover:bg-lime-300 text-zinc-950 font-bold rounded-lg transition-colors shadow-2xl shadow-lime-400/30 text-lg">
            <Target size={18} strokeWidth={2.8} />
            Запустить охоту →
          </button>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="py-12 border-t border-zinc-800/60 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-lime-300 to-emerald-500 flex items-center justify-center">
                  <Crosshair size={16} className="text-zinc-950" strokeWidth={2.8} />
                </div>
                <div className="text-sm font-semibold tracking-tight font-display">SLOTHUNT<span className="text-lime-400">.</span></div>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Автоматический отлов слотов перераспределения остатков на Wildberries.
              </p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-500 font-mono mb-3">Продукт</div>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="#how" className="hover:text-lime-400 transition-colors">Как работает</a></li>
                <li><a href="#pricing" className="hover:text-lime-400 transition-colors">Тарифы</a></li>
                <li><a href="#compare" className="hover:text-lime-400 transition-colors">vs. конкуренты</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">API документация</a></li>
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-500 font-mono mb-3">Компания</div>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="#" className="hover:text-lime-400 transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Блог</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Партнёрская программа</a></li>
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-500 font-mono mb-3">Юридическое</div>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="#" className="hover:text-lime-400 transition-colors">Оферта</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Политика конфиденциальности</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Согласие на обработку ПДн</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Реквизиты</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-800/60 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-zinc-600 font-mono">
            <div>© 2026 SlotHunt. Все права защищены.</div>
            <div className="flex items-center gap-4">
              <span>ИП Иванов И.И. · ОГРНИП 320370000000000</span>
              <span className="hidden md:block">·</span>
              <span>support@slothunt.pro</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

// ============ FAQ ITEM ============
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border ${open ? "border-lime-400/40 bg-lime-400/[0.02]" : "border-zinc-800 bg-zinc-900/20"} rounded-xl overflow-hidden transition-colors`}>
      <button onClick={() => setOpen(!open)} className="w-full px-5 py-4 flex items-center justify-between text-left">
        <span className="font-display font-medium text-zinc-100">{q}</span>
        <ChevronRight size={18} className={`text-zinc-500 transition-transform ${open ? "rotate-90 text-lime-400" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-zinc-400 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

// ============ SIGNUP PAGE ============
function SignupPage({ onBack }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    email: "", password: "", phone: "",
    wbApiKey: "", wbCookie: "", wbAlias: "Мой WB кабинет",
    agree: false, agreeData: false
  });
  const [showPass, setShowPass] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);

  const canStep1 = data.email.includes("@") && data.password.length >= 8 && data.agree;
  const canStep2 = data.wbApiKey.length > 40;

  const validateWb = () => {
    setValidating(true);
    setTimeout(() => {
      setValidating(false);
      setValidated(true);
    }, 1800);
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT — illustration */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden border-r border-zinc-800/60 bg-zinc-900/30">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="scan-line" />
        <CoefTicker />

        <div className="relative z-10 p-12 flex flex-col justify-between w-full">
          <div>
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-lime-400 transition-colors mb-12">
              ← На главную
            </button>
            <div className="flex items-center gap-2 mb-12">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-lime-300 to-emerald-500 flex items-center justify-center">
                <Crosshair size={18} className="text-zinc-950" strokeWidth={2.8} />
              </div>
              <div>
                <div className="text-base font-semibold tracking-tight font-display">SLOTHUNT<span className="text-lime-400">.</span></div>
                <div className="text-[9px] text-zinc-500 -mt-0.5 tracking-[0.2em]">WB SLOT INTELLIGENCE</div>
              </div>
            </div>

            <h2 className="font-display text-4xl font-bold tracking-tight leading-tight mb-6">
              Через 3 минуты<br />
              ваш бот будет<br />
              <span className="text-lime-400">на охоте.</span>
            </h2>

            <div className="space-y-4 max-w-md">
              {[
                { n: 1, t: "Регистрация", d: "Email + пароль, 30 сек" },
                { n: 2, t: "Подключение WB", d: "JWT-ключ и cookie из ЛК" },
                { n: 3, t: "Первая задача", d: "Артикул и направление склада" },
              ].map(s => (
                <div key={s.n} className={`flex items-start gap-4 p-3 rounded-lg transition-all ${step === s.n ? "bg-lime-400/5 border border-lime-400/30" : "border border-transparent"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm shrink-0 ${step === s.n ? "bg-lime-400 text-zinc-950" : step > s.n ? "bg-lime-400/20 text-lime-400" : "bg-zinc-800 text-zinc-500"}`}>
                    {step > s.n ? <Check size={14} strokeWidth={3} /> : s.n}
                  </div>
                  <div>
                    <div className={`font-display font-semibold ${step === s.n ? "text-zinc-100" : "text-zinc-400"}`}>{s.t}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-zinc-600 font-mono">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={11} /> AES-256-GCM шифрование секретов
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={11} /> Хостинг в РФ · 152-ФЗ
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-zinc-950">
        <div className="w-full max-w-md">
          <button onClick={onBack} className="lg:hidden flex items-center gap-2 text-sm text-zinc-400 hover:text-lime-400 transition-colors mb-8">
            ← На главную
          </button>

          <div className="text-xs uppercase tracking-[0.3em] text-lime-400 font-mono mb-3">
            / шаг {step} из 3
          </div>

          {step === 1 && (
            <>
              <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Регистрация</h1>
              <p className="text-zinc-400 text-sm mb-8">Бесплатно. Без карты. Первые 10 отловов в подарок.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-mono">Email</label>
                  <div className="relative mt-1.5">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                      type="email" value={data.email}
                      onChange={e => setData({ ...data, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-3 text-sm text-zinc-100 focus:outline-none focus:border-lime-400/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-mono">Пароль</label>
                  <div className="relative mt-1.5">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                      type={showPass ? "text" : "password"} value={data.password}
                      onChange={e => setData({ ...data, password: e.target.value })}
                      placeholder="Минимум 8 символов"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-10 py-3 text-sm text-zinc-100 focus:outline-none focus:border-lime-400/50 transition-colors"
                    />
                    <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {data.password.length > 0 && (
                    <div className="mt-2 flex gap-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                          data.password.length >= i * 3
                            ? data.password.length >= 12 ? "bg-lime-400" : data.password.length >= 8 ? "bg-amber-400" : "bg-rose-400"
                            : "bg-zinc-800"
                        }`} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 pt-2">
                  <label className="flex items-start gap-3 text-xs text-zinc-400 cursor-pointer group">
                    <input
                      type="checkbox" checked={data.agree}
                      onChange={e => setData({ ...data, agree: e.target.checked })}
                      className="mt-0.5 accent-lime-400"
                    />
                    <span className="leading-relaxed">
                      Принимаю <a href="#" className="text-lime-400 hover:underline">оферту</a> и
                      <a href="#" className="text-lime-400 hover:underline"> политику конфиденциальности</a>
                    </span>
                  </label>
                  <label className="flex items-start gap-3 text-xs text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox" checked={data.agreeData}
                      onChange={e => setData({ ...data, agreeData: e.target.checked })}
                      className="mt-0.5 accent-lime-400"
                    />
                    <span className="leading-relaxed">Согласен на получение полезных писем (можно отписаться в любой момент)</span>
                  </label>
                </div>

                <button
                  disabled={!canStep1}
                  onClick={() => setStep(2)}
                  className="w-full mt-4 py-3 bg-lime-400 hover:bg-lime-300 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-950 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Продолжить
                  <ArrowRight size={16} strokeWidth={2.8} />
                </button>

                <div className="text-center text-xs text-zinc-500 pt-2">
                  Уже есть аккаунт? <a href="#" className="text-lime-400 hover:underline">Войти</a>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Подключение WB</h1>
              <p className="text-zinc-400 text-sm mb-6">Получите ключи из личного кабинета Wildberries</p>

              <div className="bg-amber-400/[0.06] border border-amber-400/20 rounded-lg p-3 text-xs text-amber-200 leading-relaxed mb-6 flex items-start gap-2">
                <AlertCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Как получить ключи:</strong> WB ЛК → Настройки → Доступ к API → создать токен с правами «Поставки» и «Аналитика».
                  Cookie сессии — из DevTools (F12) → Application → Cookies → seller.wildberries.ru → WBTokenV3
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-mono">Название кабинета</label>
                  <input
                    value={data.wbAlias}
                    onChange={e => setData({ ...data, wbAlias: e.target.value })}
                    className="mt-1.5 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-3 text-sm text-zinc-100 focus:outline-none focus:border-lime-400/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-mono">JWT API-ключ</label>
                  <div className="relative mt-1.5">
                    <Key size={14} className="absolute left-3 top-3.5 text-zinc-600" />
                    <textarea
                      rows={3}
                      value={showKey ? data.wbApiKey : data.wbApiKey.replace(/./g, "•")}
                      onChange={e => setData({ ...data, wbApiKey: e.target.value })}
                      placeholder="eyJhbGciOiJSUzI1NiI..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-10 py-3 text-xs text-zinc-100 font-mono focus:outline-none focus:border-lime-400/50 transition-colors resize-none"
                    />
                    <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-3.5 text-zinc-500 hover:text-zinc-300">
                      {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-mono flex items-center gap-2">
                    Cookie WBTokenV3
                    <span className="text-zinc-600 normal-case">опционально, для расширенных функций</span>
                  </label>
                  <input
                    value={data.wbCookie}
                    onChange={e => setData({ ...data, wbCookie: e.target.value })}
                    placeholder="WBTokenV3=..."
                    className="mt-1.5 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-3 text-xs text-zinc-100 font-mono focus:outline-none focus:border-lime-400/50 transition-colors"
                  />
                </div>

                {data.wbApiKey.length > 10 && !validated && (
                  <button
                    onClick={validateWb}
                    disabled={validating}
                    className="w-full py-2.5 border border-zinc-800 hover:border-lime-400/40 hover:bg-lime-400/[0.03] text-zinc-300 hover:text-lime-300 text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {validating ? (
                      <>
                        <span className="w-3 h-3 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
                        Проверяем подключение к WB API...
                      </>
                    ) : (
                      <>
                        <Radio size={14} />
                        Проверить ключи
                      </>
                    )}
                  </button>
                )}

                {validated && (
                  <div className="bg-lime-400/[0.05] border border-lime-400/30 rounded-lg p-4 text-sm">
                    <div className="flex items-center gap-2 text-lime-300 font-medium mb-2">
                      <Check size={14} strokeWidth={3} /> Подключение успешно
                    </div>
                    <div className="text-xs text-zinc-400 space-y-1 font-mono">
                      <div>→ Селлер: ИП Иванов И.И.</div>
                      <div>→ Активных артикулов: 247</div>
                      <div>→ Складов с остатками: 8</div>
                      <div>→ Доступ к перераспределению: <span className="text-lime-400">да</span></div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button onClick={() => setStep(1)} className="px-4 py-3 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-100 text-sm rounded-lg transition-colors">
                    Назад
                  </button>
                  <button
                    disabled={!validated}
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 bg-lime-400 hover:bg-lime-300 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-950 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    Завершить
                    <ArrowRight size={16} strokeWidth={2.8} />
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-lime-400/10 border border-lime-400/30 flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={28} className="text-lime-400" strokeWidth={2} />
                </div>
                <h1 className="font-display text-3xl font-bold tracking-tight mb-3">
                  Добро пожаловать<span className="text-lime-400">.</span>
                </h1>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
                  Аккаунт создан. WB-кабинет подключён.<br />
                  Готовы запустить первую охоту?
                </p>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 mb-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Стартовый баланс</span>
                  <span className="text-lime-300 font-mono font-bold">2 000 ₽</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Бесплатных отловов</span>
                  <span className="text-zinc-100 font-mono">10 шт</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Тариф</span>
                  <span className="text-zinc-100 font-mono">Старт</span>
                </div>
              </div>

              <button className="w-full py-3.5 bg-lime-400 hover:bg-lime-300 text-zinc-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mb-3 shadow-lg shadow-lime-400/20">
                <Target size={16} strokeWidth={2.8} />
                Создать первую задачу
              </button>
              <button className="w-full py-3 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-100 text-sm rounded-lg transition-colors">
                Перейти в личный кабинет
              </button>

              <div className="mt-8 p-4 bg-cyan-400/[0.04] border border-cyan-400/20 rounded-lg flex items-start gap-2 text-xs">
                <Radio size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-zinc-400 leading-relaxed">
                  <span className="text-cyan-300 font-medium">Совет:</span> подключите Telegram-бота прямо сейчас, чтобы получать уведомления о пойманных слотах мгновенно.
                  <a href="#" className="text-cyan-400 hover:underline ml-1">Подключить →</a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
