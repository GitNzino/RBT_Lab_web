/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent, KeyboardEvent, ReactElement } from "react";
import Investor from "./Investor";
import {
  ArrowRight,
  Boxes,
  Users,
  Layers,
  ShieldCheck,
  Sparkles,
  X,
  CheckCircle2,
  Hand,
  Eye,
  Waves,
  Sprout,
  Cpu,
  Workflow,
} from "lucide-react";

// @ts-ignore
import markWhite from "./assets/logos/rbt-mark-white.png";
// @ts-ignore
import lockupWhite from "./assets/logos/rbt-lockup-white.png";
// @ts-ignore
import roboticArmImg from "./assets/images/rbt-underside-vision.jpg";

// @ts-ignore
import embodiedAiImg from "./assets/images/rbt-seed-tray.jpg";

type Lang = "en" | "it";

// EmailJS configuration (https://www.emailjs.com). The form sends these template variables:
//   name, from_name, email, from_email, message, title
//   - NOTIFY template (template_e6xxec8) -> RBT Lab. Set its "To Email" = core@rbtlab.tech
//     and "Reply To" = {{email}} so you can reply straight to the requester.
//   - AUTOREPLY template (template_ya1elac) -> the visitor. Set its "To Email" = {{email}}.
// If a key is missing, the form falls back to opening the visitor's mail client.
const EMAILJS_PUBLIC_KEY: string = "fFQxQpLz4R3QNqDwZ";
const EMAILJS_SERVICE_ID = "service_51rb49l";
const EMAILJS_TEMPLATE_NOTIFY = "template_e6xxec8";
const EMAILJS_TEMPLATE_AUTOREPLY = "template_ya1elac";

const TEAM = [
  { name: "Fabio Calebrano", roleEn: "Chief Executive Officer", roleIt: "Chief Executive Officer", initials: "FC", linkedin: "https://www.linkedin.com/in/fabio-calebrano/", linkedinActive: true },
  { name: "Lorenzo Baglieri", roleEn: "Chief Technical Officer & PhD in Robotics", roleIt: "Chief Technical Officer & PhD in Robotics", initials: "LB", linkedin: "https://www.linkedin.com/in/lorenzo-baglieri/", linkedinActive: true },
  { name: "Davide Calebrano", roleEn: "Chief Financial Officer", roleIt: "Chief Financial Officer", initials: "DC", linkedin: "https://www.linkedin.com/in/davidecalebrano/", linkedinActive: true },
  { name: "Giuliano Canzonieri", roleEn: "Head of Software & Embedded Engineering", roleIt: "Head of Software & Embedded Engineering", initials: "GC", linkedin: "https://www.linkedin.com/in/giuliano-canzonieri-712186251/", linkedinActive: false },
  { name: "Silvia Treccarichi", roleEn: "Business Strategy Advisor", roleIt: "Business Strategy Advisor", initials: "ST", linkedin: "https://www.linkedin.com/in/silvia-treccarichi/", linkedinActive: true },
  // { name: "Guglielmo Donzella", roleEn: "Head of Control Systems Engineering", roleIt: "Head of Control Systems Engineering", initials: "GD", linkedin: "https://www.linkedin.com/in/guglielmo-donzella-38698962/", linkedinActive: false },  // TODO: riattivare in futuro — posizionato dopo Silvia per restare in basso a destra (Silvia centro, Guglielmo dx) nella griglia a 3 colonne
];

const COPY = {
  en: {
    nav: { problem: "Problem", solution: "Solution", caseStudy: "Case Study", tech: "Technology", team: "Team", contact: "Contact us" },
    hero: {
      tag: "New Generation Collaborative Robotics",
      titleA: "Think Human.",
      titleB: "Act Robotic.",
      sub: "We give SMEs the robotic superpowers they could never afford. Validated, collaborative modules that work alongside your team.",
      cta1: "Become a Lighthouse Customer",
      cta2: "Meet the team",
      cta3: "Invest in RBT Lab",
      highlights: [
        { title: "Open architecture", sub: "Yours to adapt, never locked in." },
        { title: "Built for SMEs", sub: "Robotic superpower, at SME scale." },
        { title: "Truly collaborative", sub: "Beside your team, not in a cage." },
      ],
    },
    problem: {
      eyebrow: "The Problem",
      title: "The Integration Trap",
      callout: "<b>€1 in hardware. €3 in integration.</b> Workers fenced out. That's the real hidden cost of automation today.",
      cards: [
        { tag: "RIGIDITY", title: "Systemic Rigidity", text: "Built for isolation, not adaptation. Traditional automation replaces workers, but it can't actually work with them." },
        { tag: "LABOR GAP", title: "The Labor Gap", text: "59% of industrial firms can't find manual workers. Full replacement isn't the answer. Collaboration is." },
      ],
    },
    solution: {
      eyebrow: "The Solution",
      title: "A Modular Robotic Ecosystem",
      sub: "Validated, ready to use collaborative modules. Reusable architecture, no integration risk, finally within reach for SMEs.",
      cards: [
        { title: "Collaborative Revolution", text: "No replacing your processes or workflows. We plug in alongside your team, so humans and robots work better, together.", icon: "users" },
        { title: "Workforce Amplifier", text: "Collaborative robots share the heavy load with your people. Same workforce, higher output. The labor gap, bridged.", icon: "layers" },
        { title: "Modular by Design", text: "Reusable, validated modules deploy without integration risk. A scalable architecture that grows with you.", icon: "boxes" },
      ],
    },
    caseStudy: {
      eyebrow: "Case Study: Seeds Manipulator",
      title: "From bottleneck to breakthrough",
      sub: "A real production process, reimagined with one collaborative robotic system.",
      cols: [
        { step: "The Bottleneck", cls: "s1", items: ["Irregular seeds resist automation", "2 to 3 operators tied up full time", "Locked on manual tray inspection"] },
        { step: "Our Solution", cls: "s2", items: ["One collaborative robotic system", "Modules: Manipulator, Vision", "Vibration plus Seed grasping"] },
        { step: "The Result", cls: "s3", items: ["50% faster on difficult seeds", "2h/day of line monitoring saved", "1 to 2 operators freed for tasks of higher value"] },
      ],
      metrics: [
        { num: "50%", label: "Faster on difficult seeds" },
        { num: "2h/day", label: "Line monitoring saved" },
        { num: "€36K", label: "Saved per year, per installation" },
      ],
    },
    tech: {
      eyebrow: "Technology",
      title: "Modular architecture, control in real time",
      sub: "Each deployment is composed from reusable, validated modules, combined to fit your process, not the other way around.",
      modules: [
        { name: "Manipulator", desc: "Modular Cartesian manipulator, adaptable to every production line.", icon: "hand" },
        { name: "Vision", desc: "Perception in real time that handles irregular, variable parts.", icon: "eye" },
        { name: "Vibration", desc: "Active feeding and separation for difficult materials.", icon: "waves" },
        { name: "Seed grasping", desc: "End effector with feedback that confirms every grasp before it moves on.", icon: "sprout" },
      ],
      features: [
        { h: "Safe by design", t: "Detecting the presence and position of the person lets humans and robots share the same space, with no cages.", icon: "shield" },
        { h: "Plug and deploy", t: "Validated modules cut months of integration down to a guided installation. No need to reengineer your setup.", icon: "workflow" },
        { h: "Reusable and scalable", t: "Every module is reusable across processes and verticals, so each deployment compounds the value of the last.", icon: "cpu" },
      ],
    },
    team: {
      eyebrow: "The Founders",
      title: "Meet the team",
      sub: "The minds building RBT Lab: engineering, research and strategy under one roof.",
    },
    cta: {
      title: "Let's build the future of collaborative robotics.",
      sub: "Got a bottleneck in your process that no one has ever managed to automate?\nAs an RBT Lab Lighthouse Customer you don't just solve it, you turn it into profit!\nGet in touch to become a Lighthouse Customer.",
      button: "Become a Lighthouse Customer",
    },
    footer: { rights: "© 2026 RBT Lab. All rights reserved." },
    modal: {
      title: "Get in touch",
      sub: "Tell us about your challenge and we'll explore a collaborative solution together.",
      subInvestor: "Tell us how you'd like to get involved and we'll take it from there.",
      name: "Full name",
      namePh: "Jane Doe",
      email: "Work email",
      emailPh: "jane@company.com",
      subjectLabel: "Subject",
      subjectPh: "What is your request about?",
      message: "Your message",
      messagePh: "What would you like to talk to RBT Lab about?",
      messagePhLighthouse: "Tell us about your problem so we can understand how to solve it.",
      messagePhInvestor: "Tell us how you'd like to support RBT Lab: ticket size, expertise, or the kind of partnership you have in mind.",
      submit: "Send request",
      sending: "Sending...",
      okTitle: "Request sent!",
      okBody: (n: string, e: string) => `Thanks for your interest in RBT Lab, ${n}. Our team will reach out at ${e} shortly.`,
      close: "Close",
    },
  },
  it: {
    nav: { problem: "Problema", solution: "Soluzione", caseStudy: "Case Study", tech: "Tecnologia", team: "Team", contact: "Contattaci" },
    hero: {
      tag: "Robotica Collaborativa di Nuova Generazione",
      titleA: "Think Human.",
      titleB: "Act Robotic.",
      sub: "Diamo alle PMI i superpoteri robotici che non avrebbero mai potuto permettersi. Moduli collaborativi validati che lavorano insieme al tuo team.",
      cta1: "Diventa un Cliente Pilota",
      cta2: "Conosci il team",
      cta3: "Investi in RBT Lab",
      highlights: [
        { title: "Architettura aperta", sub: "Tua da adattare, mai vincolata." },
        { title: "Pensata per le PMI", sub: "Superpotere robotico, su scala PMI." },
        { title: "Davvero collaborativa", sub: "Accanto al tuo team, non in gabbia." },
      ],
    },
    problem: {
      eyebrow: "Il Problema",
      title: "La Trappola dell'Integrazione",
      callout: "<b>€1 di hardware. €3 di integrazione.</b> Operatori esclusi. È questo il vero costo nascosto dell'automazione di oggi.",
      cards: [
        { tag: "RIGIDITÀ", title: "Rigidità Sistemica", text: "Progettata per l'isolamento, non per l'adattamento. L'automazione tradizionale sostituisce gli operatori, ma non sa lavorare con loro." },
        { tag: "GAP DI MANODOPERA", title: "Il Gap di Manodopera", text: "Il 59% delle aziende industriali non trova operatori manuali. La sostituzione totale non è la risposta. La collaborazione lo è." },
      ],
    },
    solution: {
      eyebrow: "La Soluzione",
      title: "Un Ecosistema Robotico Modulare",
      sub: "Moduli collaborativi validati e pronti all'uso. Architettura riutilizzabile, nessun rischio d'integrazione, finalmente alla portata delle PMI.",
      cards: [
        { title: "Rivoluzione Collaborativa", text: "Nessuna sostituzione dei tuoi processi o flussi di lavoro. Ci integriamo accanto al tuo team, così persone e robot lavorano meglio, insieme.", icon: "users" },
        { title: "Amplificatore di Forza Lavoro", text: "I robot collaborativi condividono il carico pesante con le tue persone. Stessa forza lavoro, output più alto. Il gap colmato.", icon: "layers" },
        { title: "Modulare per Design", text: "Moduli riutilizzabili e validati, installati senza rischio d'integrazione. Un'architettura scalabile che cresce con te.", icon: "boxes" },
      ],
    },
    caseStudy: {
      eyebrow: "Case Study: Seeds Manipulator",
      title: "Dal collo di bottiglia alla svolta",
      sub: "Un processo produttivo reale, ripensato con un solo sistema robotico collaborativo.",
      cols: [
        { step: "Il Collo di Bottiglia", cls: "s1", items: ["Semi irregolari, difficili da automatizzare", "Da 2 a 3 operatori impegnati a tempo pieno", "Bloccati su ispezione manuale dei vassoi"] },
        { step: "La Nostra Soluzione", cls: "s2", items: ["Un unico sistema robotico collaborativo", "Moduli: Manipolatore, Visione", "Vibrazione più presa dei semi"] },
        { step: "Il Risultato", cls: "s3", items: ["50% più veloce sui semi difficili", "2h/giorno di controllo della linea risparmiate", "Da 1 a 2 operatori liberati per attività a più valore"] },
      ],
      metrics: [
        { num: "50%", label: "Più veloce sui semi difficili" },
        { num: "2h/giorno", label: "Controllo linea risparmiato" },
        { num: "€36K", label: "Risparmiati all'anno, per installazione" },
      ],
    },
    tech: {
      eyebrow: "Tecnologia",
      title: "Architettura modulare, controllo in tempo reale",
      sub: "Ogni installazione è composta da moduli riutilizzabili e validati, combinati per adattarsi al tuo processo, non il contrario.",
      modules: [
        { name: "Manipolatore", desc: "Manipolatore cartesiano modulare, adattabile a tutte le linee di produzione.", icon: "hand" },
        { name: "Visione", desc: "Percezione in tempo reale che gestisce parti irregolari e variabili.", icon: "eye" },
        { name: "Vibrazione", desc: "Alimentazione e separazione attiva per materiali difficili.", icon: "waves" },
        { name: "Presa semi", desc: "End effector con retroazione che conferma ogni presa prima di proseguire.", icon: "sprout" },
      ],
      features: [
        { h: "Progettato per essere sicuro", t: "La rilevazione della presenza e della posizione dell'uomo permette di condividere lo stesso spazio, senza gabbie.", icon: "shield" },
        { h: "Plug and deploy", t: "I moduli validati riducono mesi di integrazione a un'installazione guidata. Nessuna reingegnerizzazione del tuo processo.", icon: "workflow" },
        { h: "Riutilizzabile e scalabile", t: "Ogni modulo è riutilizzabile tra processi e settori, così ogni installazione moltiplica il valore della precedente.", icon: "cpu" },
      ],
    },
    team: {
      eyebrow: "I Founder",
      title: "Il team",
      sub: "Le menti che costruiscono RBT Lab: ingegneria, ricerca e strategia sotto lo stesso tetto.",
    },
    cta: {
      title: "Costruiamo insieme il futuro della robotica collaborativa.",
      sub: "Hai un collo di bottiglia nel tuo processo che nessuno è mai riuscito ad automatizzare?\nCome Cliente Pilota di RBT Lab non solo lo risolvi, ma lo trasformi in guadagno!\nContattaci per diventare Cliente Pilota.",
      button: "Diventa un Cliente Pilota",
    },
    footer: { rights: "© 2026 RBT Lab. Tutti i diritti riservati." },
    modal: {
      title: "Contattaci",
      sub: "Raccontaci della tua sfida e studieremo insieme una soluzione collaborativa.",
      subInvestor: "Raccontaci come vorresti essere coinvolto e ci pensiamo noi.",
      name: "Nome completo",
      namePh: "Mario Rossi",
      email: "Email aziendale",
      emailPh: "mario@azienda.com",
      subjectLabel: "Oggetto",
      subjectPh: "Di cosa tratta la tua richiesta?",
      message: "Il tuo messaggio",
      messagePh: "Di cosa vuoi parlare a RBT Lab?",
      messagePhLighthouse: "Raccontaci del tuo problema per aiutarci a capire come risolverlo.",
      messagePhInvestor: "Raccontaci come vorresti aiutarci: taglio d'investimento, competenze o il tipo di partnership che hai in mente.",
      submit: "Invia richiesta",
      sending: "Invio...",
      okTitle: "Richiesta inviata!",
      okBody: (n: string, e: string) => `Grazie per l'interesse in RBT Lab, ${n}. Il nostro team ti contatterà a breve all'indirizzo ${e}.`,
      close: "Chiudi",
    },
  },
} as const;

const SOLUTION_ICONS: Record<string, ReactElement> = {
  users: <Users size={26} />, layers: <Layers size={26} />, boxes: <Boxes size={26} />,
};
const MODULE_ICONS: Record<string, ReactElement> = {
  hand: <Hand size={24} />, eye: <Eye size={24} />, waves: <Waves size={24} />, sprout: <Sprout size={24} />,
};
const FEATURE_ICONS: Record<string, ReactElement> = {
  shield: <ShieldCheck size={20} />, workflow: <Workflow size={20} />, cpu: <Cpu size={20} />,
};

export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const t = COPY[lang];

  // Pick language from the visitor's country (Italy -> Italian), unless they choose manually.
  const langLockedRef = useRef(false);
  const chooseLang = (l: Lang) => { langLockedRef.current = true; setLang(l); };
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((d) => { if (!langLockedRef.current && d && d.country_code === "IT") setLang("it"); })
      .catch(() => {});
  }, []);

  const [route, setRoute] = useState<"home" | "investor">(
    () => (typeof window !== "undefined" && window.location.pathname.replace(/\/+$/, "") === "/investor" ? "investor" : "home")
  );
  const go = (r: "home" | "investor") => {
    window.history.pushState({}, "", r === "investor" ? "/investor" : "/");
    setRoute(r);
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname.replace(/\/+$/, "") === "/investor" ? "investor" : "home");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", title: "", message: "" });
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 110;
      const sections = ["hero", "problem", "solution", "case", "tech", "team"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top && scrollPos < top + el.offsetHeight) {
            setActiveTab(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    const title = formData.title.trim() || (lang === "it" ? "Diventare un Cliente Pilota" : "Becoming a Lighthouse Customer");
    const subject = `Richiesta di diventare cliente pilota: ${formData.name}`;

    // Preferred path: EmailJS sends two emails, the notification to RBT Lab (template_e6xxec8)
    // and the auto reply confirmation to the visitor (template_ya1elac).
    const params = {
      name: formData.name,
      from_name: formData.name,
      email: formData.email,
      from_email: formData.email,
      message: formData.message,
      title,
    };
    if (EMAILJS_PUBLIC_KEY !== "YOUR_EMAILJS_PUBLIC_KEY") {
      try {
        setSending(true);
        const sendTemplate = (template: string) =>
          fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              service_id: EMAILJS_SERVICE_ID,
              template_id: template,
              user_id: EMAILJS_PUBLIC_KEY,
              template_params: params,
            }),
          });
        const res = await sendTemplate(EMAILJS_TEMPLATE_NOTIFY);
        await sendTemplate(EMAILJS_TEMPLATE_AUTOREPLY).catch(() => {});
        setSending(false);
        if (res.ok) { setFormSubmitted(true); return; }
      } catch {
        setSending(false);
      }
    }

    // Fallback: open the visitor's mail client with everything prefilled.
    const body = `Nome: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`;
    window.location.href = `mailto:core@rbtlab.tech?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setFormSubmitted(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: "smooth" }); setActiveTab(id); }
  };

  const navItem = (id: string, label: string) => (
    <li>
      <a
        href={`#${id}`}
        onClick={(e) => { e.preventDefault(); scrollToSection(id); }}
        className={`nc-nav-link ${activeTab === id ? "active" : ""}`}
      >
        {label}
      </a>
    </li>
  );

  const [contactMode, setContactMode] = useState<"contact" | "lighthouse" | "investor">("contact");
  const openContact = (mode: "contact" | "lighthouse" | "investor" = "contact") => { setContactMode(mode); setFormSubmitted(false); setModalOpen(true); };
  const contactModal = modalOpen && (
        <div className="nc-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="nc-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="nc-modal-close" onClick={() => setModalOpen(false)} aria-label="Close">
              <X size={20} />
            </button>

            {formSubmitted ? (
              <div style={{ textAlign: "center", padding: "12px 0", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
                <CheckCircle2 size={52} style={{ color: "var(--mint)" }} />
                <h3 style={{ fontSize: "23px", color: "#fff", fontWeight: 700, margin: 0 }}>{t.modal.okTitle}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                  {t.modal.okBody(formData.name, formData.email)}
                </p>
                <button className="nc-btn-accent" style={{ marginTop: "8px", width: "100%" }} onClick={() => setModalOpen(false)}>
                  {t.modal.close}
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Sparkles size={18} style={{ color: "var(--mint)" }} />
                    <h3 style={{ fontSize: "23px", color: "#fff", fontWeight: 700, margin: 0 }}>{t.modal.title}</h3>
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0 }}>{contactMode === "investor" ? t.modal.subInvestor : t.modal.sub}</p>
                </div>

                <div className="nc-form-group">
                  <label className="nc-form-label">{t.modal.name}</label>
                  <input type="text" className="nc-form-input" placeholder={t.modal.namePh} required
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div className="nc-form-group">
                  <label className="nc-form-label">{t.modal.email}</label>
                  <input type="email" className="nc-form-input" placeholder={t.modal.emailPh} required
                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>

                <div className="nc-form-group">
                  <label className="nc-form-label">{t.modal.subjectLabel}</label>
                  <input type="text" className="nc-form-input" placeholder={t.modal.subjectPh}
                    value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>

                <div className="nc-form-group">
                  <label className="nc-form-label">{t.modal.message}</label>
                  <textarea className="nc-form-input nc-form-textarea" rows={4} placeholder={contactMode === "investor" ? t.modal.messagePhInvestor : contactMode === "lighthouse" ? t.modal.messagePhLighthouse : t.modal.messagePh}
                    value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                </div>

                <button type="submit" className="nc-btn-accent" style={{ width: "100%", marginTop: "6px" }} disabled={sending}>
                  {sending ? t.modal.sending : t.modal.submit} <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
  );

  if (route === "investor") {
    return (
      <>
        <Investor lang={lang} setLang={chooseLang} goHome={() => go("home")} onContact={() => openContact("investor")} />
        {contactModal}
      </>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {/* HEADER */}
      <header className="nc-navbar">
        <div className="nc-container nc-navbar-container">
          <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection("hero"); }} className="nc-logo">
            <img src={markWhite} alt="RBT Lab" className="nc-logo-mark" />
            RBT Lab<span className="nc-logo-dot">.</span>
          </a>

          <ul className="nc-nav-menu">
            {navItem("problem", t.nav.problem)}
            {navItem("solution", t.nav.solution)}
            {navItem("case", t.nav.caseStudy)}
            {navItem("tech", t.nav.tech)}
            {navItem("team", t.nav.team)}
          </ul>

          <div className="nc-nav-actions">
            <div className="nc-lang-toggle" role="group" aria-label="Language">
              <button className={`nc-lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => chooseLang("en")}>EN</button>
              <button className={`nc-lang-btn ${lang === "it" ? "active" : ""}`} onClick={() => chooseLang("it")}>IT</button>
            </div>
            <button className="nc-btn-get-started" onClick={() => openContact()}>
              {t.nav.contact}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section id="hero" className="nc-hero">
          <div className="nc-ribbon nc-ribbon-violet" style={{ top: "-180px", right: "-160px" }}></div>
          <div className="nc-ribbon nc-ribbon-mint" style={{ bottom: "-260px", left: "-200px" }}></div>
          <div className="nc-container nc-hero-grid">
            <div className="nc-hero-left">
              <div className="nc-tag-capsule">
                <span className="nc-tag-dot"></span>
                {t.hero.tag}
              </div>
              <h1 className="nc-hero-title">
                {t.hero.titleA}<br />
                <span className="nc-highlight-gradient">{t.hero.titleB}</span>
              </h1>
              <p className="nc-hero-subtitle">{t.hero.sub}</p>
              <div className="nc-hero-actions">
                <button className="nc-btn-accent" onClick={() => scrollToSection("contact")}>
                  {t.hero.cta1}
                </button>
                <button className="nc-btn-accent nc-btn-invest" onClick={() => go("investor")}>
                  {t.hero.cta3}
                </button>
                <button className="nc-btn-accent nc-btn-team" onClick={() => scrollToSection("team")}>
                  {t.hero.cta2}
                </button>
              </div>
              <div className="nc-hero-highlights">
                {t.hero.highlights.map((h, i) => (
                  <div className="nc-hl" key={i}>
                    <span className="nc-hl-dot"></span>
                    <div>
                      <div className="nc-hl-title">{h.title}</div>
                      <div className="nc-hl-sub">{h.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="nc-hero-right">
              <div className="nc-image-frame">
                <img src={roboticArmImg} alt="RBT Lab end effector and vision module, underside view" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section id="problem" className="nc-section nc-section-base">
          <div className="nc-ribbon nc-ribbon-magenta" style={{ top: "10%", left: "-300px" }}></div>
          <div className="nc-container">
            <div className="nc-sec-header">
              <span className="nc-sec-eyebrow">{t.problem.eyebrow}</span>
              <h2 className="nc-sec-title">{t.problem.title}</h2>
            </div>
            <p className="nc-callout" dangerouslySetInnerHTML={{ __html: t.problem.callout }} />
            <div className="nc-grid-2">
              {t.problem.cards.map((c, i) => (
                <div className="nc-card" key={i}>
                  <div className="nc-card-icon nc-card-icon-red">
                    {i === 0 ? <Layers size={22} /> : <Users size={22} />}
                  </div>
                  <h3 className="nc-card-title">{c.title}</h3>
                  <p className="nc-card-text">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOLUTION */}
        <section id="solution" className="nc-section nc-section-alt">
          <div className="nc-ribbon nc-ribbon-violet" style={{ top: "-200px", right: "-260px" }}></div>
          <div className="nc-container">
            <div className="nc-sec-header">
              <span className="nc-sec-eyebrow">{t.solution.eyebrow}</span>
              <h2 className="nc-sec-title">{t.solution.title}</h2>
              <p className="nc-sec-subtitle">{t.solution.sub}</p>
            </div>
            <div className="nc-grid-3">
              {t.solution.cards.map((c, i) => (
                <div className="nc-card" key={i}>
                  <div className="nc-card-icon">{SOLUTION_ICONS[c.icon]}</div>
                  <h3 className="nc-card-title">{c.title}</h3>
                  <p className="nc-card-text">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CASE STUDY */}
        <section id="case" className="nc-section nc-section-base">
          <div className="nc-ribbon nc-ribbon-mint" style={{ bottom: "-260px", right: "-200px" }}></div>
          <div className="nc-container">
            <div className="nc-sec-header">
              <span className="nc-sec-eyebrow">{t.caseStudy.eyebrow}</span>
              <h2 className="nc-sec-title">{t.caseStudy.title}</h2>
              <p className="nc-sec-subtitle">{t.caseStudy.sub}</p>
            </div>
            <div className="nc-case-grid">
              {t.caseStudy.cols.map((col, i) => (
                <div className="nc-case-col" key={i}>
                  <span className={`nc-case-step ${col.cls}`}>{col.step}</span>
                  <ul className="nc-case-list">
                    {col.items.map((it, j) => (
                      <li key={j}>
                        <CheckCircle2 size={16} style={{ color: col.cls === "s1" ? "#ff5d7a" : col.cls === "s2" ? "var(--violet-bright)" : "var(--mint)" }} />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="nc-metrics">
              {t.caseStudy.metrics.map((m, i) => (
                <div className="nc-metric" key={i}>
                  <div className="nc-metric-num">{m.num}</div>
                  <div className="nc-metric-label">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TECHNOLOGY */}
        <section id="tech" className="nc-section nc-section-alt">
          <div className="nc-ribbon nc-ribbon-violet" style={{ top: "-180px", left: "-260px" }}></div>
          <div className="nc-container">
            <div className="nc-sec-header">
              <span className="nc-sec-eyebrow">{t.tech.eyebrow}</span>
              <h2 className="nc-sec-title">{t.tech.title}</h2>
              <p className="nc-sec-subtitle">{t.tech.sub}</p>
            </div>
            <div className="nc-tech-split">
              <div>
                <div className="nc-module-grid">
                  {t.tech.modules.map((m, i) => (
                    <div className="nc-module" key={i}>
                      {MODULE_ICONS[m.icon]}
                      <div className="nc-module-name">{m.name}</div>
                      <div className="nc-module-desc">{m.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="nc-feature-list">
                  {t.tech.features.map((f, i) => (
                    <div className="nc-feature" key={i}>
                      <div className="nc-feature-ic">{FEATURE_ICONS[f.icon]}</div>
                      <div>
                        <h4 className="nc-feature-h">{f.h}</h4>
                        <p className="nc-feature-t">{f.t}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="nc-tech-img">
                <img src={embodiedAiImg} alt="RBT Lab seed tray and end effector" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section id="team" className="nc-section nc-section-base">
          <div className="nc-ribbon nc-ribbon-magenta" style={{ bottom: "-220px", left: "-240px" }}></div>
          <div className="nc-container">
            <div className="nc-sec-header">
              <span className="nc-sec-eyebrow">{t.team.eyebrow}</span>
              <h2 className="nc-sec-title">{t.team.title}</h2>
              <p className="nc-sec-subtitle">{t.team.sub}</p>
            </div>
            <div className="nc-team-grid">
              {TEAM.map((m, i) => (
                <div
                  className={`nc-team-card${m.linkedinActive ? " nc-team-card--linked" : ""}`}
                  key={i}
                  {...(m.linkedinActive
                    ? {
                        role: "link",
                        tabIndex: 0,
                        onClick: () => window.open(m.linkedin, "_blank", "noopener,noreferrer"),
                        onKeyDown: (e: KeyboardEvent) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            window.open(m.linkedin, "_blank", "noopener,noreferrer");
                          }
                        },
                        "aria-label": `${m.name} su LinkedIn`,
                      }
                    : {})}
                >
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
      </main>

      {/* CTA FOOTER */}
      <footer id="contact" className="nc-cta-footer">
        <div className="nc-ribbon nc-ribbon-violet" style={{ top: "-200px", left: "50%", transform: "translateX(-50%)" }}></div>
        <div className="nc-container">
          <div className="nc-cta-box">
            <h2 className="nc-cta-title">{t.cta.title}</h2>
            <p className="nc-cta-sub">{t.cta.sub}</p>
            <button className="nc-btn-cta-big" onClick={() => openContact("lighthouse")}>
              {t.cta.button}
            </button>
          </div>

          <div className="nc-micro-footer">
            <div className="nc-footer-brand">
              <img src={lockupWhite} alt="RBT Lab" className="nc-footer-lockup" />
              <span className="nc-footer-tagline">Think Human. Act Robotic.</span>
            </div>
            <div>{t.footer.rights}</div>
          </div>
        </div>
      </footer>

      {/* CONTACT MODAL */}
      {contactModal}
    </div>
  );
}
