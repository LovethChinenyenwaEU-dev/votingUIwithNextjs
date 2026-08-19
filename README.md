AfricaPlan Foundation Election System

An upgraded, highly resilient, and zero-dependency local election portal built for handling dynamic voting sessions. Unlike static layouts, this engine transitions candidate data management from predictable selections to unrestricted user inputs while strictly enforcing programmatic boundaries across multi-candidate fields.

Built with Next.js (Pages Router), typed via TypeScript, styled with Tailwind CSS, and fueled by cached state synchronization via TanStack React Query.

Technical Core & Architecture

State Cache Isolation: Utilizes TanStack Query (`useQuery`, `useMutation`) to cache, manage, and process real-time structural layout modifications without relying on external UI components.
Persistent Hydration Engine: Simulates a low-latency API database layer using client-side `localStorage`. Data persists gracefully across accidental page refreshes without causing Next.js SSR hydration mismatches.
Dynamic Content Normalization: Automatically processes unstructured candidate inputs (trimming hidden margins and neutralizing case-sensitivity) to prevent duplicate profiles from breaking statistical integrity.

Election Mechanics & Logic Rules

1. The 20-Voter Threshold
The system initializes an isolated roster array containing exactly 20 predefined slots (`Voter 1` to `Voter 20`). 

2. Single-Ballot Restrictions
Voters choose their assigned name from a dropdown interface. Once a ballot is cast, their item is instantly marked `hasVoted: true` and structurally **disabled** from the selection array to prevent double-voting.

3. Progressive Reveal Engine
The View Winners dashboard button remains dynamically locked (`disabled={true}`) through conditional rendering parameters. It activates autonomously *only* when all 20 active slots register as completed.

4. Dynamic Title Splitting & Tie-Breakers
When triggered, a specialized mathematical reducer computes scores, extracts percentages, and executes automatic tie-breaking algorithms:
Clear Hierarchy: Highest count receives Head of Cohort; second-highest receives Assistant.
Primary Tie: If two candidates draw for first place, both are designated Co-Heads of Cohort (Assistant seat remains vacant).
Secondary Tie: If a single winner is clear but runners-up draw, the candidates are split into Co-Assistants.

Live Deployment

This project is fully built, optimized, and deployed live on Vercel. 

Production Environment: Access the live election portal instantly at (https://voting-u-iwith-nextjs.vercel.app/).
CI/CD Optimization: Integrated with Vercel's automated build engine, triggering lightweight, ahead-of-time (AOT) static optimization loops on every main branch code push.

Setting Up Locally

Ensure you have [Bun](https://bun.sh) installed on your machine.

1. Install Project Dependencies
Run the installation profile using the Bun package manager:
```bash
bun install
```

2. Run the Development Server
Fire up the Next.js local environment:
```bash
bun run dev
```

3. Open and Evaluate
Point your browser to [http://localhost:3000](http://localhost:3000) to trace states through the embedded TanStack DevTools drawer.

File Tree Mapping
```text
├── src/
│   ├── components/
│   │   ├── Navbar.tsx        # Branded header housing layout status nodes
│   │   ├── Footer.tsx        # Standard semantic closure block
│   │   ├── votingform.tsx    # Dropdown array controllers & normalized entry lines
│   │   └── resultsModal.tsx  # Dynamic reducer calculating standings and percentages
│   ├── hooks/
│   │   └── useVoting.ts      # Main TanStack Query & localStorage synchronization hub
│   ├── layouts/
│   │   └── RootLayout.tsx    # Structural application shell wrapper
│   └── pages/
│       ├── _app.tsx          # QueryClientProvider wrapper & DevTools initializer
│       └── index.tsx         # SSR-safe Client Hydration shell with Dynamic Importing

