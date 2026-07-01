/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ArrowLeft, Check, Banknote, FileSignature, CalendarClock } from "lucide-react";
// @ts-ignore
import markWhite from "./assets/logos/rbt-mark-white.png";
// @ts-ignore
import lockupWhite from "./assets/logos/rbt-lockup-white.png";

type Lang = "en" | "it";

const PROCEEDS = [
  { pct: 52.5, color: "#a652ff", en: "Team & new hires", it: "Team & nuove assunzioni" },
  { pct: 20, color: "#ffffff", en: "Technology & product", it: "Tecnologia & prodotto" },
  { pct: 15, color: "#b4118c", en: "Operations & logistics", it: "Operations & logistica" },
  { pct: 7.5, color: "#00f7c7", en: "IP protection & patents", it: "Protezione IP & brevetti" },
  { pct: 5, color: "#6b7280", en: "Sales & marketing", it: "Vendite & marketing" },
];

const TEAM = [
  { name: "Fabio Calebrano", roleEn: "Chief Executive Officer", roleIt: "Chief Executive Officer", initials: "FC" },
  { name: "Lorenzo Baglieri", roleEn: "Chief Technical Officer & PhD in Robotics", roleIt: "Chief Technical Officer & PhD in Robotics", initials: "LB" },
  { name: "Davide Calebrano", roleEn: "Chief Financial Officer", roleIt: "Chief Financial Officer", initials: "DC" },
  // { name: "Giuliano Canzonieri", roleEn: "Head of Software & Embedded Engineering", roleIt: "Head of Software & Embedded Engineering", initials: "GC" },  // TODO: riattivare in futuro
  // { name: "Guglielmo Donzella", roleEn: "Head of Control Systems Engineering", roleIt: "Head of Control Systems Engineering", initials: "GD" },  // TODO: riattivare in futuro
  { name: "Silvia Treccarichi", roleEn: "Business Strategy Advisor", roleIt: "Business Strategy Advisor", initials: "ST" },
];

const INV = {
  en: {
    back: "Back to site",
    contact: "Get in touch",
    heroEyebrow: "Investor Relations",
    heroTitle: "Invest in RBT Lab",
    heroSub: "Collaborative robotics for SMEs, in a market driven by structural labour shortages and reshoring. We turn an unsolved bottleneck into a scalable, royalty generating product.",
    heroAsk: "Raising €300K to €500K",
    heroAskLabel: "SAFE, closing Q2 2027",
    mEyebrow: "Size of Market",
    mTitle: "A large and fast growing market",
    mNote: "Driven by structural labour shortages and reshoring. Entry through Italy, scaling across Europe.",
    cagr: "22% CAGR",
    cagrLabel: "Global collaborative robotics",
    tam: { v: "€3.8B", l: "TAM", d: "Global collaborative robotics market" },
    sam: { v: "€1.1B", l: "SAM", d: "European SME manufacturing" },
    som: { v: "€15M", l: "SOM", d: "5 EU markets by 2031" },
    pEyebrow: "Competition & Positioning",
    pTitle: "The only one that refuses the trade off",
    pLead: "Everyone else forces a trade off: open but enterprise, or affordable but locked in. RBT Lab refuses it, open architecture, built for SMEs.",
    axisXright: "Open architecture",
    axisXleft: "Locked in",
    axisYtop: "Built for SMEs",
    axisYbottom: "Enterprise only",
    us: "RBT Lab",
    otherA: "Enterprise platforms",
    otherB: "Locked in SME kits",
    iEyebrow: "Investment",
    iTitle: "What RBT Lab asks",
    askValue: "€300K to €500K",
    terms: "SAFE",
    termsLabel: "Terms",
    timing: "Q2 2027 close",
    timingLabel: "Timing",
    amountLabel: "Round size",
    objTitle: "Primary objectives",
    objectives: [
      "PoC validated with Centro Seia (TRL 5 to TRL 7)",
      "Key hires across engineering and operations",
      "5 installations during 2027",
      "Focus on new modules design",
    ],
    proceedsTitle: "Use of proceeds",
    teamEyebrow: "The Founders",
    teamTitle: "Meet the team",
    teamSub: "The minds building RBT Lab: engineering, research and strategy under one roof.",
    ctaTitle: "Let's build the future of collaborative robotics.",
    ctaSub: "Want the full deck and data room? Reach out and we will walk you through it.",
    ctaButton: "Get in touch",
    mailSubject: "Investment enquiry, RBT Lab",
  },
  it: {
    back: "Torna al sito",
    contact: "Contattaci",
    heroEyebrow: "Investor Relations",
    heroTitle: "Investi in RBT Lab",
    heroSub: "Robotica collaborativa per le PMI, in un mercato trainato dalla carenza strutturale di manodopera e dal reshoring. Trasformiamo un collo di bottiglia irrisolto in un prodotto scalabile che genera royalty.",
    heroAsk: "Raccolta da €300K a €500K",
    heroAskLabel: "SAFE, chiusura Q2 2027",
    mEyebrow: "Dimensione di Mercato",
    mTitle: "Un mercato ampio e in rapida crescita",
    mNote: "Trainato dalla carenza strutturale di manodopera e dal reshoring. Ingresso dall'Italia, scalando in tutta Europa.",
    cagr: "22% CAGR",
    cagrLabel: "Robotica collaborativa globale",
    tam: { v: "€3.8B", l: "TAM", d: "Mercato globale della robotica collaborativa" },
    sam: { v: "€1.1B", l: "SAM", d: "Manifattura PMI europea" },
    som: { v: "€15M", l: "SOM", d: "5 mercati UE entro il 2031" },
    pEyebrow: "Competizione & Posizionamento",
    pTitle: "Gli unici a rifiutare il compromesso",
    pLead: "Tutti gli altri impongono un compromesso: aperti ma enterprise, oppure accessibili ma vincolati. RBT Lab lo rifiuta, architettura aperta, pensata per le PMI.",
    axisXright: "Architettura aperta",
    axisXleft: "Vincolato",
    axisYtop: "Pensato per le PMI",
    axisYbottom: "Solo enterprise",
    us: "RBT Lab",
    otherA: "Piattaforme enterprise",
    otherB: "Kit PMI vincolati",
    iEyebrow: "Investimento",
    iTitle: "Cosa chiede RBT Lab",
    askValue: "€300K a €500K",
    terms: "SAFE",
    termsLabel: "Strumento",
    timing: "Chiusura Q2 2027",
    timingLabel: "Tempistica",
    amountLabel: "Dimensione round",
    objTitle: "Obiettivi primari",
    objectives: [
      "PoC validato con Centro Seia (da TRL 5 a TRL 7)",
      "Assunzioni chiave tra ingegneria e operations",
      "5 installazioni nel 2027",
      "Focus sul design di nuovi moduli",
    ],
    proceedsTitle: "Impiego dei fondi",
    teamEyebrow: "I Founder",
    teamTitle: "Il team",
    teamSub: "Le menti che costruiscono RBT Lab: ingegneria, ricerca e strategia sotto lo stesso tetto.",
    ctaTitle: "Costruiamo insieme il futuro della robotica collaborativa.",
    ctaSub: "Vuoi il deck completo e la data room? Scrivici e ti accompagniamo.",
    ctaButton: "Contattaci",
    mailSubject: "Richiesta di investimento, RBT Lab",
  },
} as const;

export default function Investor({ lang, setLang, goHome, onContact }: { lang: Lang; setLang: (l: Lang) => void; goHome: () => void; onContact: () => void }) {
  const t = INV[lang];
  const [activeProceed, setActiveProceed] = useState<number | null>(null);
  const [activeQuad, setActiveQuad] = useState<string | null>(null);
  const scrollToInvestment = () => document.getElementById("investment")?.scrollIntoView({ behavior: "smooth" });

  // Donut geometry for use of proceeds
  const r = 70;
  const C = 2 * Math.PI * r;
  let acc = 0;
  const segments = PROCEEDS.map((p, i) => {
    const len = (p.pct / 100) * C;
    const el = (
      <circle
        key={i}
        className="inv-seg"
        cx="100" cy="100" r={r}
        fill="none" stroke={p.color} strokeWidth={activeProceed === i ? 44 : 30}
        strokeDasharray={`${len} ${C - len}`}
        strokeDashoffset={-acc}
        transform="rotate(-90 100 100)"
        onMouseEnter={() => setActiveProceed(i)}
        onMouseLeave={() => setActiveProceed(null)}
      />
    );
    acc += len;
    return el;
  });

  return (
    <div className="inv-page">
      {/* NAV */}
      <header className="nc-navbar">
        <div className="nc-container nc-navbar-container">
          <a href="/" onClick={(e) => { e.preventDefault(); goHome(); }} className="nc-logo">
            <img src={markWhite} alt="RBT Lab" className="nc-logo-mark" />
            RBT Lab<span className="nc-logo-dot">.</span>
          </a>
          <div className="nc-nav-actions">
            <a href="/" onClick={(e) => { e.preventDefault(); goHome(); }} className="nc-nav-link inv-back">
              <ArrowLeft size={15} /> {t.back}
            </a>
            <div className="nc-lang-toggle" role="group" aria-label="Language">
              <button className={`nc-lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>EN</button>
              <button className={`nc-lang-btn ${lang === "it" ? "active" : ""}`} onClick={() => setLang("it")}>IT</button>
            </div>
            <button className="nc-btn-get-started" onClick={onContact}>{t.contact}</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="nc-hero inv-hero">
        <div className="nc-ribbon nc-ribbon-violet" style={{ top: "-180px", right: "-160px" }}></div>
        <div className="nc-ribbon nc-ribbon-mint" style={{ bottom: "-240px", left: "-200px" }}></div>
        <div className="nc-container inv-hero-inner">
          <span className="nc-tag-capsule"><span className="nc-tag-dot"></span>{t.heroEyebrow}</span>
          <h1 className="nc-hero-title inv-hero-title">{t.heroTitle.split(" ").slice(0, -1).join(" ")} <span className="nc-highlight-gradient">{t.heroTitle.split(" ").slice(-1)}</span></h1>
          <p className="nc-hero-subtitle inv-hero-sub">{t.heroSub}</p>
          <button type="button" className="inv-ask-pill" onClick={scrollToInvestment}>
            <Banknote size={20} />
            <div>
              <div className="inv-ask-pill-num">{t.heroAsk}</div>
              <div className="inv-ask-pill-label">{t.heroAskLabel}</div>
            </div>
          </button>
        </div>
      </section>

      {/* SIZE OF MARKET */}
      <section className="nc-section nc-section-base">
        <div className="nc-ribbon nc-ribbon-violet" style={{ top: "-200px", right: "-260px" }}></div>
        <div className="nc-container">
          <div className="nc-sec-header">
            <span className="nc-sec-eyebrow">{t.mEyebrow}</span>
            <h2 className="nc-sec-title">{t.mTitle}</h2>
            <p className="nc-sec-subtitle">{t.mNote}</p>
          </div>
          <div className="inv-market">
            <div className="inv-bullseye">
              <svg viewBox="0 0 320 320" width="100%" height="100%">
                <circle className="inv-ring" cx="160" cy="160" r="150" fill="rgba(124,0,214,0.13)" stroke="rgba(166,82,255,0.5)" strokeWidth="1.5" />
                <circle className="inv-ring" cx="160" cy="160" r="104" fill="rgba(255,93,122,0.13)" stroke="rgba(255,93,122,0.5)" strokeWidth="1.5" />
                <circle className="inv-ring" cx="160" cy="160" r="60" fill="rgba(0,247,199,0.16)" stroke="rgba(0,247,199,0.65)" strokeWidth="1.5" />
                <text x="160" y="40" textAnchor="middle" className="inv-ring-label" fill="#a652ff">TAM €3.8B</text>
                <text x="160" y="90" textAnchor="middle" className="inv-ring-label" fill="#ff5d7a">SAM €1.1B</text>
                <text x="160" y="168" textAnchor="middle" className="inv-ring-label" fill="#00f7c7">SOM €15M</text>
              </svg>
            </div>
            <div className="inv-market-cards">
              <div className="inv-mcard"><div className="inv-mcard-l">TAM</div><div className="inv-mcard-v">{t.tam.v}</div><div className="inv-mcard-d">{t.tam.d}</div></div>
              <div className="inv-mcard"><div className="inv-mcard-l">SAM</div><div className="inv-mcard-v">{t.sam.v}</div><div className="inv-mcard-d">{t.sam.d}</div></div>
              <div className="inv-mcard"><div className="inv-mcard-l">SOM</div><div className="inv-mcard-v">{t.som.v}</div><div className="inv-mcard-d">{t.som.d}</div></div>
              <div className="inv-mcard inv-mcard-cagr"><div className="inv-mcard-v">{t.cagr}</div><div className="inv-mcard-d">{t.cagrLabel}</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPETITION & POSITIONING */}
      <section className="nc-section nc-section-alt">
        <div className="nc-ribbon nc-ribbon-mint" style={{ bottom: "-240px", right: "-200px" }}></div>
        <div className="nc-container">
          <div className="nc-sec-header">
            <span className="nc-sec-eyebrow">{t.pEyebrow}</span>
            <h2 className="nc-sec-title">{t.pTitle}</h2>
            <p className="nc-sec-subtitle">{t.pLead}</p>
          </div>
          <div className="inv-quadrant">
            <svg viewBox="0 0 400 400" width="100%" height="100%">
              <line x1="200" y1="20" x2="200" y2="380" stroke="rgba(255,255,255,0.12)" />
              <line x1="20" y1="200" x2="380" y2="200" stroke="rgba(255,255,255,0.12)" />
              <text x="388" y="196" textAnchor="end" className="inv-axis">{t.axisXright}</text>
              <text x="12" y="196" textAnchor="start" className="inv-axis">{t.axisXleft}</text>
              <text x="206" y="30" textAnchor="start" className="inv-axis">{t.axisYtop}</text>
              <text x="206" y="374" textAnchor="start" className="inv-axis">{t.axisYbottom}</text>
              {/* others */}
              <circle className="inv-qdot" cx="288" cy="296" r="11" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)"
                style={{ transform: activeQuad === "a" ? "scale(1.3)" : "none" }}
                onMouseEnter={() => setActiveQuad("a")} onMouseLeave={() => setActiveQuad(null)} />
              <text x="288" y="324" textAnchor="middle" className="inv-dot-l inv-qlabel"
                style={{ transform: activeQuad === "a" ? "translateY(12px) scale(1.18)" : "none" }}
                onMouseEnter={() => setActiveQuad("a")} onMouseLeave={() => setActiveQuad(null)}>{t.otherA}</text>

              <circle className="inv-qdot" cx="112" cy="120" r="11" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)"
                style={{ transform: activeQuad === "b" ? "scale(1.3)" : "none" }}
                onMouseEnter={() => setActiveQuad("b")} onMouseLeave={() => setActiveQuad(null)} />
              <text x="112" y="100" textAnchor="middle" className="inv-dot-l inv-qlabel"
                style={{ transform: activeQuad === "b" ? "translateY(-12px) scale(1.18)" : "none" }}
                onMouseEnter={() => setActiveQuad("b")} onMouseLeave={() => setActiveQuad(null)}>{t.otherB}</text>

              {/* us */}
              <g className="inv-qdot"
                style={{ transform: activeQuad === "us" ? "scale(1.28)" : "none" }}
                onMouseEnter={() => setActiveQuad("us")} onMouseLeave={() => setActiveQuad(null)}>
                <circle cx="300" cy="104" r="20" fill="#00f7c7" />
                <circle cx="300" cy="104" r="34" fill="none" stroke="#00f7c7" strokeOpacity="0.4" />
              </g>
              <text x="300" y="158" textAnchor="middle" className="inv-dot-us inv-qlabel"
                style={{ transform: activeQuad === "us" ? "translateY(16px) scale(1.16)" : "none" }}
                onMouseEnter={() => setActiveQuad("us")} onMouseLeave={() => setActiveQuad(null)}>{t.us}</text>
            </svg>
          </div>
        </div>
      </section>

      {/* INVESTMENT */}
      <section id="investment" className="nc-section nc-section-base">
        <div className="nc-ribbon nc-ribbon-violet" style={{ top: "-180px", left: "-260px" }}></div>
        <div className="nc-container">
          <div className="nc-sec-header">
            <span className="nc-sec-eyebrow">{t.iEyebrow}</span>
            <h2 className="nc-sec-title">{t.iTitle}</h2>
          </div>

          <div className="inv-ask-row">
            <div className="inv-ask-card inv-ask-big">
              <div className="inv-ask-k">{t.amountLabel}</div>
              <div className="inv-ask-n">{t.askValue}</div>
            </div>
            <div className="inv-ask-card">
              <FileSignature size={22} />
              <div className="inv-ask-k">{t.termsLabel}</div>
              <div className="inv-ask-s">{t.terms}</div>
            </div>
            <div className="inv-ask-card">
              <CalendarClock size={22} />
              <div className="inv-ask-k">{t.timingLabel}</div>
              <div className="inv-ask-s">{t.timing}</div>
            </div>
          </div>

          <div className="inv-invest-grid">
            <div className="inv-obj">
              <h3 className="inv-block-title">{t.objTitle}</h3>
              <ul className="inv-obj-list">
                {t.objectives.map((o, i) => (
                  <li key={i}><span className="inv-check"><Check size={14} /></span>{o}</li>
                ))}
              </ul>
            </div>

            <div className="inv-proceeds">
              <h3 className="inv-block-title">{t.proceedsTitle}</h3>
              <div className="inv-donut-wrap">
                <svg viewBox="0 0 200 200" className="inv-donut" aria-hidden="true">
                  {segments}
                </svg>
                <ul className="inv-legend">
                  {PROCEEDS.map((p, i) => (
                    <li key={i}
                      onMouseEnter={() => setActiveProceed(i)}
                      onMouseLeave={() => setActiveProceed(null)}
                    >
                      <span className="inv-legend-dot" style={{ background: p.color }}></span>
                      <span className="inv-legend-l" style={{ color: activeProceed === i ? "#fff" : undefined, fontWeight: activeProceed === i ? 700 : undefined, transform: activeProceed === i ? "scale(1.08)" : undefined }}>{lang === "en" ? p.en : p.it}</span>
                      <span className="inv-legend-p">{p.pct}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="nc-section nc-section-alt">
        <div className="nc-ribbon nc-ribbon-magenta" style={{ bottom: "-220px", left: "-240px" }}></div>
        <div className="nc-container">
          <div className="nc-sec-header">
            <span className="nc-sec-eyebrow">{t.teamEyebrow}</span>
            <h2 className="nc-sec-title">{t.teamTitle}</h2>
            <p className="nc-sec-subtitle">{t.teamSub}</p>
          </div>
          <div className="nc-team-grid">
            {TEAM.map((m, i) => (
              <div className="nc-team-card" key={i}>
                <div className="nc-avatar">{m.initials}</div>
                <div>
                  <h3 className="nc-team-name">{m.name}</h3>
                  <p className="nc-team-role">{lang === "en" ? m.roleEn : m.roleIt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <footer className="nc-cta-footer">
        <div className="nc-ribbon nc-ribbon-violet" style={{ top: "-200px", left: "50%", transform: "translateX(-50%)" }}></div>
        <div className="nc-container">
          <div className="nc-cta-box">
            <h2 className="nc-cta-title">{t.ctaTitle}</h2>
            <p className="nc-cta-sub" style={{ whiteSpace: "normal" }}>{t.ctaSub}</p>
            <button className="nc-btn-cta-big" onClick={onContact}>{t.ctaButton}</button>
          </div>
          <div className="nc-micro-footer">
            <div className="nc-footer-brand">
              <img src={lockupWhite} alt="RBT Lab" className="nc-footer-lockup" />
              <span className="nc-footer-tagline">Think Human. Act Robotic.</span>
            </div>
            <a href="/" onClick={(e) => { e.preventDefault(); goHome(); }} className="nc-footer-link" style={{ color: "var(--text-tertiary)" }}>{t.back}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
