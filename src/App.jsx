import { useState, useEffect, useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import './App.css';

/* ───────────── DATA ───────────── */

const NAV_ITEMS = [
  { id: 'uvod', label: 'Úvod' },
  { id: 'mapa', label: 'Mapa vzdělávání' },
  { id: 'data', label: 'Data z auditu' },
  { id: 'strategie', label: 'Strategie' },
  { id: 'prototypy', label: 'Prototypy' },
  { id: 'ramec', label: 'Kompetenční rámec' },
  { id: 'kroky', label: 'Další kroky' },
];

const DRAWERS = [
  {
    title: 'Povinná školení',
    system: 'SAP LMS',
    desc: 'BOZP, PO, etický kodex, pracovní řád',
    format: 'PPT + e-learning',
    problem: 'Proklikání bez učení',
    color: '#E85D3A',
  },
  {
    title: 'Onboarding',
    system: 'Živě',
    desc: 'Iveta vede osobně, bez standardizovaného scénáře',
    format: 'Osobní setkání',
    problem: 'Délka: 10 min až 1 hodina, bez standardizace',
    color: '#0A9396',
  },
  {
    title: 'DL trénink (sklad)',
    system: 'Osobně',
    desc: '3denní vstupní školení, trenérka Gabriela, individuálně i skupinově',
    format: 'Hands-on trénink',
    problem: 'Palič času',
    color: '#E9C46A',
  },
  {
    title: 'Rozvojová školení',
    system: 'Externí + J-learning',
    desc: 'Externí lektoři + interní J-learning (Excel, prezentace)',
    format: 'Workshop / e-learning',
    problem: 'Odtrženo od kompetenčního rámce',
    color: '#E85D3A',
  },
  {
    title: 'Procedury',
    system: 'NetGenium',
    desc: '~800 procedur, PDF formát, „přečti a odklikni"',
    format: 'PDF dokumenty',
    problem: 'Většina lidí se raději zeptá kolegy',
    color: '#0A9396',
  },
];

const PROBLEMS = [
  { title: 'Vzdělávání odtrženo od kompetenčního rámce', detail: 'Neexistuje přímá vazba mezi požadovanými kompetencemi na pozici a nabízenými vzdělávacími obsahy. Lidé se učí „co je k dispozici", ne „co potřebují".' },
  { title: 'Žádná metrika dopadu', detail: 'Jediná sledovaná metrika je splněno/nesplněno. Chybí měření skutečného dopadu na práci — nezjistíme, zda školení něco změnilo.' },
  { title: 'Formáty zastaralé', detail: 'Prezentace s 86 slidy, PDF dokumenty bez interakce. Formáty, které nevyhovují preferencím zaměstnanců (56,5 % chce krátká videa).' },
  { title: 'Vstupní zátěž nováčka', detail: 'Nový zaměstnanec musí absolvovat 8–9 kurzů naráz v prvních dnech. Informační přehlcení bez priorizace.' },
  { title: 'Onboarding bez standardizace', detail: 'Každý nováček dostane jiný rozsah informací v závislosti na tom, kdo onboarding vede a kolik má času.' },
  { title: 'DL trénink = palič času', detail: '3denní intenzivní školení vyžaduje plnou pozornost trenérky. Části by šlo nahradit videem nebo simulací.' },
  { title: '800 procedur nikdo nečte', detail: 'Procedury v NetGenium existují, ale formát PDF + povinné odkliknutí vede k tomu, že lidé hledají odpovědi u kolegů místo v dokumentaci.' },
  { title: 'Chybí vstupní brána do vzdělávání', detail: 'Neexistuje jedno místo, kde by zaměstnanec viděl „co se mám učit, co mám splnit, kde začít". Vzdělávání je roztříštěné do více systémů.' },
];

const chartLearning = [
  { name: 'Krátká videa do 10 min', value: 56.5 },
  { name: 'Učení od kolegů v praxi', value: 48.2 },
  { name: 'Osobní workshop', value: 38.8 },
  { name: 'Online workshop s lektorem', value: 29.4 },
  { name: 'Individuální konzultace', value: 22.4 },
  { name: 'Písemné postupy a checklisty', value: 20.0 },
];

const chartTopics = [
  { name: 'AI nástroje (ChatGPT, Copilot)', value: 71.8 },
  { name: 'Efektivnější využití nástrojů', value: 54.1 },
  { name: 'Automatizace úkolů', value: 45.9 },
  { name: 'Práce s daty a tabulkami', value: 45.9 },
  { name: 'Bezpečnost a ochrana dat', value: 11.8 },
];

const chartEngagement = [
  { name: 'Ano, chci se zapojit', value: 66, fill: '#0A9396' },
  { name: 'Ne', value: 34, fill: '#cbd5e1' },
];

const METRICS = [
  { number: '80 %', label: 'přepisuje data manuálně', sublabel: 'produktivitní dluh', color: '#E85D3A' },
  { number: '7,1 %', label: 'bezpečnostní skóre', sublabel: 'kritické', color: '#E85D3A' },
  { number: '71,8 %', label: 'chce vzdělávání v AI', sublabel: '', color: '#0A9396' },
  { number: '56,5 %', label: 'preferuje krátká videa', sublabel: '', color: '#E9C46A' },
];

const PRINCIPLES = [
  { icon: '🎬', title: 'Video-first, ne text-first', desc: 'Primárním formátem se stává krátké video, ne PowerPoint nebo PDF.' },
  { icon: '🤝', title: 'Peer learning jako páteř', desc: 'Nejefektivnější učení probíhá od kolegů — formalizujeme a podpoříme ho.' },
  { icon: '📦', title: 'Mikrolearning, ne monolitické kurzy', desc: 'Místo celodenních školení krátké, cílené lekce do 10 minut.' },
  { icon: '🎯', title: 'Personalizace podle pozice', desc: 'Každá pozice dostane obsah relevantní pro svou roli a kompetence.' },
  { icon: '📊', title: 'Měřitelnost dopadu', desc: 'Sledujeme nejen dokončení, ale reálnou změnu v práci.' },
  { icon: '🤖', title: 'AI jako integrační prvek', desc: 'AI pomáhá personalizovat, generovat a distribuovat vzdělávací obsah.' },
];

const FORMATS = [
  { format: 'Krátká animovaná videa (2 min)', vhodne: 'BOZP scénáře, procedury', narocnost: 'Střední', priklad: '„Co dělat při požáru"' },
  { format: 'NotebookLM', vhodne: 'Znalostní báze, Q&A', narocnost: 'Nízká', priklad: 'Celý onboarding jako knowledge base' },
  { format: 'Copilot Agent', vhodne: 'Personalizovaný Q&A', narocnost: 'Střední–vysoká', priklad: '„Průvodce JUSDA"' },
  { format: 'Infografiky', vhodne: 'Procesy, checklisty', narocnost: 'Nízká', priklad: '„Můj první den v JUSDA"' },
  { format: 'Mikrolekce e-mailem', vhodne: 'Průběžné vzdělávání', narocnost: 'Nízká–střední', priklad: 'Týdenní AI tip podle pozice' },
  { format: 'Podcast / audio', vhodne: 'Intro materiály', narocnost: 'Nízká', priklad: 'Audio intro o JUSDA' },
  { format: 'Simulace / storytelling', vhodne: 'DL training, bezpečnost', narocnost: 'Vysoká', priklad: 'Scénka „hoří ve skladu"' },
  { format: 'Interaktivní kvíz', vhodne: 'Testování znalostí', narocnost: 'Střední', priklad: 'Kvíz po videu o BOZP' },
];

const COMPETENCY_LAYERS = [
  {
    title: 'Základní (povinné pro všechny)',
    items: ['MS365', 'Kyber bezpečnost', 'BOZP', 'Firemní kultura', 'Interní systémy'],
    color: '#E85D3A',
  },
  {
    title: 'Odborné (specifické pro pozici)',
    items: ['Pracovní právo', 'Nábor', 'Onboarding', 'MyDA', 'BaseCat', 'Mzdové podklady'],
    color: '#0A9396',
  },
  {
    title: 'Digitální a AI',
    items: ['Copilot v Outlooku/Excelu/Wordu', 'AI pro personalistiku', 'Power Automate'],
    color: '#1E2761',
  },
  {
    title: 'Rozvojové (kam růst)',
    items: ['Learning design', 'Talent management', 'Data-driven HR', 'Change management'],
    color: '#E9C46A',
  },
];

const FLOW_STEPS = [
  { label: 'Gap', detail: '„Copilot v Excelu"', icon: '🔍' },
  { label: 'Mikrovideo', detail: '2 min', icon: '🎬' },
  { label: 'Týdenní výzva', detail: 'E-mail', icon: '📧' },
  { label: 'Peer learning', detail: 'Teams', icon: '🤝' },
  { label: 'Test znalostí', detail: 'Kvíz', icon: '✅' },
];

const NEXT_STEPS = [
  'Export školení z SAP LMS (seznam všech kurzů)',
  'Ke každému kurzu: hodnocení citlivosti dat (zelená = můžeme transformovat / červená = nelze)',
  'Prioritizace: co předělat jako první',
  'Gabriela: vstup k DL tréninku na příštím setkání',
  'Zprovoznění Teams kanálu pro Kateřinu',
];

const TIMELINE = [
  { period: 'Duben–květen', desc: 'Pilotní prototypy', color: '#E85D3A' },
  { period: 'Červen', desc: 'Prezenční workshop — hands-on tvorba obsahu', color: '#0A9396' },
  { period: 'Průběžně', desc: 'Iterace na základě zpětné vazby', color: '#E9C46A' },
];

/* ───────────── COMPONENTS ───────────── */

function Navbar({ activeSection }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="navbar-brand">JUSDA</span>
        <div className="navbar-links">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`navbar-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Placeholder({ type, label }) {
  const isVideo = type === 'video';
  return (
    <div className={`placeholder ${isVideo ? 'placeholder-video' : 'placeholder-img'}`}>
      <div className="placeholder-icon">{isVideo ? '▶' : '🖼'}</div>
      <div className="placeholder-label">{label}</div>
    </div>
  );
}

function ExpandableCard({ title, detail, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`expandable-card ${open ? 'expanded' : ''}`} onClick={() => setOpen(!open)}>
      <div className="expandable-header">
        <span className="expandable-number">{index + 1}</span>
        <span className="expandable-title">{title}</span>
        <span className="expandable-arrow">{open ? '−' : '+'}</span>
      </div>
      {open && <div className="expandable-detail">{detail}</div>}
    </div>
  );
}

function MetricCard({ number, label, sublabel, color }) {
  return (
    <div className="metric-card" style={{ borderTopColor: color }}>
      <div className="metric-number" style={{ color }}>{number}</div>
      <div className="metric-label">{label}</div>
      {sublabel && <div className="metric-sublabel">{sublabel}</div>}
    </div>
  );
}

function HBarChart({ data, title, color = '#0A9396' }) {
  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={data.length * 52 + 20}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 40, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v} %`} />
          <YAxis type="category" dataKey="name" width={230} tick={{ fontSize: 13 }} />
          <Tooltip formatter={(v) => `${v} %`} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28}>
            {data.map((_, i) => (
              <Cell key={i} fill={color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function DonutChart({ data, title }) {
  return (
    <div className="chart-container chart-donut-wrap">
      <h3 className="chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value} %`}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v} %`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ───────────── SECTIONS ───────────── */

function SectionUvod() {
  return (
    <section id="uvod" className="section section-hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">Transformace vzdělávání<br />JUSDA Europe</h1>
          <p className="hero-subtitle">Analýza, strategie a prototypy — duben 2026</p>
          <p className="hero-text">
            Na základě digitálního auditu (85 respondentů), analýzy stávajících vzdělávacích materiálů
            a brainstormingu s pracovní skupinou jsme zmapovali aktuální stav vzdělávání v JUSDA
            a navrhujeme konkrétní kroky k transformaci.
          </p>
          <div className="hero-badge">Kateřina Švidrnochová &middot; Learning Design konzultantka</div>
        </div>
      </div>
    </section>
  );
}

function SectionMapa() {
  return (
    <section id="mapa" className="section">
      <div className="container">
        <h2 className="section-title">Jak to teď je — Mapa vzdělávacího ekosystému</h2>
        <p className="section-desc">5 „šuplíčků" vzdělávání v JUSDA</p>

        <div className="drawers-grid">
          {DRAWERS.map((d, i) => (
            <div key={i} className="drawer-card" style={{ borderLeftColor: d.color }}>
              <div className="drawer-header">
                <h3 className="drawer-title">{d.title}</h3>
                <span className="drawer-system">{d.system}</span>
              </div>
              <p className="drawer-desc">{d.desc}</p>
              <div className="drawer-meta">
                <span className="drawer-format">Formát: {d.format}</span>
              </div>
              <div className="drawer-problem">
                <span className="drawer-problem-icon">⚠</span> {d.problem}
              </div>
            </div>
          ))}
        </div>

        <h3 className="subsection-title">Identifikované problémy</h3>
        <p className="section-desc">Klikněte pro rozbalení detailu s evidencí</p>
        <div className="problems-grid">
          {PROBLEMS.map((p, i) => (
            <ExpandableCard key={i} title={p.title} detail={p.detail} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionData() {
  return (
    <section id="data" className="section section-alt">
      <div className="container">
        <h2 className="section-title">Co nám řekla data — Výsledky auditu</h2>
        <p className="section-desc">N = 85 respondentů, digitální audit JUSDA Europe</p>

        <div className="charts-grid">
          <HBarChart data={chartLearning} title="Jak se chcete učit? (multiple choice)" color="#0A9396" />
          <HBarChart data={chartTopics} title="Co se chcete učit?" color="#E85D3A" />
        </div>
        <div className="charts-grid charts-grid-single">
          <DonutChart data={chartEngagement} title="Zapojení do rozvoje" />
        </div>

        <h3 className="subsection-title">Klíčové metriky</h3>
        <div className="metrics-grid">
          {METRICS.map((m, i) => (
            <MetricCard key={i} {...m} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionStrategie() {
  return (
    <section id="strategie" className="section">
      <div className="container">
        <h2 className="section-title">Co navrhujeme — Strategie transformace</h2>

        <h3 className="subsection-title">6 principů</h3>
        <div className="principles-grid">
          {PRINCIPLES.map((p, i) => (
            <div key={i} className="principle-card">
              <div className="principle-icon">{p.icon}</div>
              <h4 className="principle-title">{p.title}</h4>
              <p className="principle-desc">{p.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="subsection-title">Matice formátů</h3>
        <div className="table-wrap">
          <table className="format-table">
            <thead>
              <tr>
                <th>Formát</th>
                <th>Vhodný pro</th>
                <th>Náročnost</th>
                <th>Příklad</th>
              </tr>
            </thead>
            <tbody>
              {FORMATS.map((f, i) => (
                <tr key={i}>
                  <td className="format-name">{f.format}</td>
                  <td>{f.vhodne}</td>
                  <td><span className="badge">{f.narocnost}</span></td>
                  <td className="format-example">{f.priklad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function SectionPrototypy() {
  return (
    <section id="prototypy" className="section section-alt">
      <div className="container">
        <h2 className="section-title">Prototypy — Before → After</h2>

        {/* 5a */}
        <div className="proto-block">
          <h3 className="subsection-title">5a: Prezentace „Vítejte v JUSDA"</h3>
          <p>Srovnání aktuální a redesignované verze klíčového slidu.</p>
          <div className="before-after">
            <div className="ba-item">
              <div className="ba-label ba-before">BEFORE</div>
              <Placeholder type="img" label="before-slide9.png — aktuální přeplněný slide" />
            </div>
            <div className="ba-arrow">→</div>
            <div className="ba-item">
              <div className="ba-label ba-after">AFTER</div>
              <Placeholder type="img" label="after-slide9.png — redesign s vizuální hierarchií" />
            </div>
          </div>
          <p className="proto-comment">
            <strong>Co se změnilo:</strong> Čistší vizuální hierarchie, méně textu na slide, klíčové informace zvýrazněny.
            Původní slide měl 12+ bodů bez priorizace — nová verze pracuje s vizuální hierarchií
            a navádí pohled na to nejdůležitější.
          </p>
        </div>

        {/* 5b */}
        <div className="proto-block">
          <h3 className="subsection-title">5b: Infografika „Můj první den"</h3>
          <Placeholder type="img" label="infografika-prvni-den.png" />
        </div>

        {/* 5c */}
        <div className="proto-block">
          <h3 className="subsection-title">5c: Video scénář</h3>
          <p><strong>Video 1:</strong> Co dělat, když se někdo zraní (~1:16)</p>
          <p>Krátké animované/natočené video, které nahrazuje textovou proceduru bezpečnosti práce. Zaměřuje se na konkrétní scénář a provádí diváka krok po kroku.</p>
          <Placeholder type="video" label="Video: Co dělat, když se někdo zraní" />
          <div className="storyboard">
            <h4>Storyboard</h4>
            <div className="storyboard-timeline">
              {[
                { time: '0:00', scene: 'Úvodní obrazovka', desc: 'Název + logo JUSDA' },
                { time: '0:05', scene: 'Scénář', desc: 'Kolega se zraní ve skladu' },
                { time: '0:15', scene: 'Krok 1', desc: 'Zajistit bezpečnost místa' },
                { time: '0:30', scene: 'Krok 2', desc: 'Zavolat první pomoc' },
                { time: '0:45', scene: 'Krok 3', desc: 'Poskytnout první pomoc' },
                { time: '1:00', scene: 'Krok 4', desc: 'Nahlásit incident' },
                { time: '1:10', scene: 'Shrnutí', desc: 'Klíčové body + kontakty' },
              ].map((s, i) => (
                <div key={i} className="storyboard-scene">
                  <div className="scene-time">{s.time}</div>
                  <div className="scene-title">{s.scene}</div>
                  <div className="scene-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5d */}
        <div className="proto-block">
          <h3 className="subsection-title">5d: Ukázka mikrolekce</h3>
          <p>Personalizovaný vzdělávací e-mail — jiný obsah podle pozice:</p>
          <div className="microlecture-grid">
            <div className="micro-card">
              <div className="micro-header" style={{ background: '#0A9396' }}>
                <span className="micro-role">Customer Service Clerk</span>
                <span className="micro-week">Týden 3 / AI tip</span>
              </div>
              <div className="micro-body">
                <h4>Copilot v Outlooku: Shrnutí dlouhého e-mailového vlákna</h4>
                <p>Otevřete dlouhé e-mailové vlákno → klikněte na „Shrnutí od Copilota" → získáte klíčové body a akční kroky během 5 sekund.</p>
                <p className="micro-tip">Tip: Funguje nejlépe u vláken s 5+ zprávami.</p>
                <div className="micro-cta">Vyzkoušejte dnes a dejte nám vědět na Teams!</div>
              </div>
            </div>
            <div className="micro-card">
              <div className="micro-header" style={{ background: '#E85D3A' }}>
                <span className="micro-role">Skladový administrátor</span>
                <span className="micro-week">Týden 3 / AI tip</span>
              </div>
              <div className="micro-body">
                <h4>Copilot v Excelu: Rychlé filtrování dat</h4>
                <p>Otevřete tabulku s příjmy/výdaji → klikněte na Copilot → napište „Zobraz mi řádky, kde je hodnota nad 10 000" → hotovo bez ručního filtrování.</p>
                <p className="micro-tip">Tip: Funguje i s přirozeným jazykem v češtině.</p>
                <div className="micro-cta">Vyzkoušejte dnes a dejte nám vědět na Teams!</div>
              </div>
            </div>
          </div>
          <div className="automation-schema">
            <h4>Schéma automatizace</h4>
            <div className="auto-flow">
              {[
                ['MS Lists', '(databáze pozic)'],
                ['Copilot Agent', '(generuje obsah)'],
                ['Power Automate', '(workflow)'],
                ['E-mail', '(personalizovaný)'],
              ].map((step, i) => (
                <div key={i} className="auto-step-wrap">
                  <div className="auto-step">
                    <div className="auto-step-main">{step[0]}</div>
                    <div className="auto-step-sub">{step[1]}</div>
                  </div>
                  {i < 3 && <div className="auto-arrow">→</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionRamec() {
  return (
    <section id="ramec" className="section">
      <div className="container">
        <h2 className="section-title">Kompetenční rámec — Ukázka</h2>
        <p className="section-desc">Na příkladu pozice: <strong>HR Generalist</strong></p>

        <div className="competency-layers">
          {COMPETENCY_LAYERS.map((layer, i) => (
            <div
              key={i}
              className="comp-layer"
              style={{ borderLeftColor: layer.color }}
            >
              <div className="comp-layer-title" style={{ color: layer.color }}>{layer.title}</div>
              <div className="comp-layer-items">
                {layer.items.map((item, j) => (
                  <span
                    key={j}
                    className="comp-chip"
                    style={{
                      background: `${layer.color}15`,
                      color: layer.color,
                      borderColor: `${layer.color}40`,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h3 className="subsection-title">Z gapu v kompetencích → personalizovaný obsah</h3>
        <div className="flow-steps">
          {FLOW_STEPS.map((step, i) => (
            <div key={i} className="flow-step-wrap">
              <div className="flow-step">
                <div className="flow-icon">{step.icon}</div>
                <div className="flow-label">{step.label}</div>
                <div className="flow-detail">{step.detail}</div>
              </div>
              {i < FLOW_STEPS.length - 1 && <div className="flow-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionKroky() {
  return (
    <section id="kroky" className="section section-alt">
      <div className="container">
        <h2 className="section-title">Další kroky</h2>

        <h3 className="subsection-title">Co potřebujeme od týmu JUSDA</h3>
        <div className="next-steps-list">
          {NEXT_STEPS.map((step, i) => (
            <div key={i} className="next-step-item">
              <div className="next-step-check">☐</div>
              <div className="next-step-text">{step}</div>
            </div>
          ))}
        </div>

        <h3 className="subsection-title">Časová osa</h3>
        <div className="timeline">
          {TIMELINE.map((t, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" style={{ background: t.color }} />
              <div className="timeline-content">
                <div className="timeline-period" style={{ color: t.color }}>{t.period}</div>
                <div className="timeline-desc">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-card">
          <h3>Kontakt</h3>
          <p className="contact-name">Mgr. Kateřina Švidrnochová</p>
          <p className="contact-role">Learning Design konzultantka</p>
        </div>
      </div>
    </section>
  );
}

/* ───────────── APP ───────────── */

export default function App() {
  const [activeSection, setActiveSection] = useState('uvod');
  const scrollListenerRef = useRef(false);

  useEffect(() => {
    if (scrollListenerRef.current) return;
    scrollListenerRef.current = true;

    const handleScroll = () => {
      const ids = NAV_ITEMS.map(n => n.id);
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(ids[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navbar activeSection={activeSection} />
      <main className="main">
        <SectionUvod />
        <SectionMapa />
        <SectionData />
        <SectionStrategie />
        <SectionPrototypy />
        <SectionRamec />
        <SectionKroky />
      </main>
      <footer className="footer">
        <div className="container">
          <p>JUSDA Europe &middot; Transformace vzdělávání &middot; 2026</p>
        </div>
      </footer>
    </>
  );
}
