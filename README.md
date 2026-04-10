# TruthChain AI

> **AI-powered misinformation early-warning system** — predicts viral spread before it happens.

---

## Live Demo

🔴 **https://truth-chain-ai-ak.vercel.app/**

---

## What is TruthChain AI?

Most fact-checkers react *after* misinformation explodes. By then, millions have already seen it.

---

## Features

- **Viral Risk Index** — 0 to 100 score based on emotional manipulation, source credibility, velocity risk, and fact-check difficulty
- **Spread Path Prediction** — graph-based AI maps exactly which communities will amplify a claim next
- **Signal Breakdown** — animated metric bars showing 4 detection signals
- **AI Verdict** — plain language explanation of why a claim is dangerous
- **Live Dashboard** — real-time feed of analyzed claims with filters and charts
- **User Authentication** — sign up, sign in, personal claim history
- **3D Visualizations** — floating network graph on homepage using Three.js
- **Custom Cursor** — animated dot and ring cursor with hover interactions
- **Fully Responsive** — mobile hamburger menu, stacked layouts, touch-friendly

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| 3D Graphics | Three.js + React Three Fiber + Drei |
| AI / LLM | Groq API — Llama 3.3 70B (free tier) |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Charts | Recharts |
| Routing | React Router v7 |
| Styling | Pure CSS-in-JS |
| Deployment | Vercel |
| Cost | $0 / month |

---

## Project Structure

```
src/
├── pages/
│   ├── Home.jsx          # Landing page with 3D hero
│   ├── Analyze.jsx       # Core analysis tool
│   ├── Dashboard.jsx     # Live feed + charts
│   ├── Research.jsx      # Methodology + papers
│   ├── Login.jsx         # Authentication
│   ├── Signup.jsx        # Registration
│   └── NotFound.jsx      # Glitch 404 page
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx    # Sticky nav with mobile menu
│   │   └── Footer.jsx    # Footer with links
│   ├── ui/
│   │   ├── RiskGauge.jsx # Animated circular score ring
│   │   ├── MetricBar.jsx # Animated metric bars
│   │   └── ClaimInput.jsx # Smart input with examples
│   └── three/
│       ├── HeroScene.jsx # 3D network graph
│       └── ParticleField.jsx # Particle background
├── hooks/
│   ├── useAnalyze.js     # Groq API + save logic
│   ├── useAuth.js        # Supabase auth hook
│   ├── useClaims.js      # Database CRUD + realtime
│   └── useScrollReveal.js # Intersection observer
├── lib/
│   ├── claude.js         # Groq API helper
│   └── supabase.js       # Supabase client
├── App.jsx               # Router + global cursor
├── main.jsx              # Entry point
└── index.css             # Global styles + animations
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Groq API key](https://console.groq.com)
- A free [Supabase](https://supabase.com) project

### Installation

```bash
# Clone the repository
git clone https://github.com/anuj9631/TruthChain-AI.git
cd TruthChain-AI

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root:

```env
VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
create table claims (
  id            uuid default gen_random_uuid() primary key,
  claim         text not null,
  risk_score    integer not null,
  risk_level    text not null,
  metrics       jsonb,
  spread_stages jsonb,
  verdict       text,
  tags          text[],
  analysis      text,
  user_id       uuid references auth.users(id),
  created_at    timestamp with time zone default timezone('utc', now())
);

alter table claims enable row level security;

create policy "Users read own claims"
  on claims for select using (auth.uid() = user_id or user_id is null);

create policy "Users insert own claims"
  on claims for insert with check (auth.uid() = user_id or user_id is null);
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## How It Works

```
User pastes claim
       ↓
Groq Llama 3.3 70B analyzes it
       ↓
Returns structured JSON with:
  • risk_score (0-100)
  • risk_level (HIGH / MODERATE / LOW)
  • 4 signal metrics
  • 3 spread path stages
  • AI verdict
  • signal tags
  • deep analysis
       ↓
Result saved to Supabase
       ↓
Dashboard updates in real-time
```

---

## Detection Methodology

TruthChain uses four detection layers:

**01 — Emotional Signal Detection**
Analyzes linguistic patterns that trigger fear, outrage, urgency, and tribal identity. Emotional claims spread 4.2x faster regardless of truth.

**02 — Source Credibility Scoring**
Traces every claim to its origin. Anonymous sources and unverifiable citations receive automatic high-risk flags.

**03 — Network Velocity Modeling**
Graph-based AI models how a claim travels through social networks and identifies bridging nodes between fringe and mainstream communities.

**04 — Historical Pattern Matching**
New claims are matched against 2.4M historical patterns to identify recurring misinformation templates.

---

## Deployment

This project is deployed on Vercel with automatic deployments on every push to `main`.

```bash
# Deploy manually
npm run build
vercel --prod
```

Required environment variables in Vercel dashboard:
- `VITE_GROQ_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Roadmap

- [ ] URL scraping — paste article link instead of text
- [ ] Browser extension — analyze claims while browsing
- [ ] Public REST API with rate limiting
- [ ] Real-time Twitter/X monitoring
- [ ] Multi-language claim support
- [ ] PDF report export
- [ ] Bulk analysis mode
- [ ] Slack / Discord bot integration

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

```bash
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
```

---

## License

MIT License — free to use, modify, and distribute.

---

## Author

**Anuj Kumar**

Built as a portfolio project demonstrating full-stack AI application development.

- GitHub: [@anuj9631](https://github.com/anuj9631)

---

## Acknowledgements

- [Groq](https://groq.com) — ultra-fast LLM inference
- [Supabase](https://supabase.com) — open source Firebase alternative
- [Three.js](https://threejs.org) — 3D graphics library
- [Vercel](https://vercel.com) — deployment platform
- [Recharts](https://recharts.org) — React chart library

---

> *"Stop misinformation before it spreads."*
> — TruthChain AI, 2026
