# OLOWO (Ọlọ́wó) — Autonomous AI Finance Operator for Real Commerce
### 🏆 Built for the Tameion Agents Hackathon 2026 | Powered by Circle & Arc

> **"OLOWO watches the money. You run the business."**  
> *Autonomous financial guardianship rooted in historical Byzantine treasury wisdom, powered by Circle Developer Tools and the Arc settlement layer.*

[![Next.js 16](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Circle](https://img.shields.io/badge/Circle-Wallets%20%7C%20Paymaster%20%7C%20Gateway%20%7C%20USYC-0066FF?style=flat)](https://developers.circle.com/)
[![Arc Network](https://img.shields.io/badge/Settlement-Arc%20Network%20(84532)-00D084?style=flat)](https://thecanteenapp.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🏛️ The Tameion Heritage & Ancient Prior Art Modernized

The hackathon takes its name from the Byzantine **Tameion** (ταμεῖον) — the imperial treasury, wardrobe, and reserve chamber where state wealth was stewarded under strict constitutional mandates. OLOWO bridges ancient governance principles with bleeding-edge agentic crypto rails:

| Ancient Prior Art (Hackathon Spec) | Historical Mechanism | Modern OLOWO Implementation |
| :--- | :--- | :--- |
| **01. The Athenian Euthyna** (εὔθυνα) | Greek magistrates stood before an assembly of 10 auditors (*logistai*) to account for every drachma spent. | **Continuous 4-Stage Decision Replay (`components/decisions/DecisionReplayModal.tsx`)**: Replays any payment across State Observed ➔ Mandate Constraints ➔ Agent Reasoning Trace ➔ Arc Settlement Hash. |
| **02. The Greek Symbolon** (σύμβολον) | Split tally objects or seals: two halves broken apart that must fit together to validate an obligation. | **3-Way Verification Engine (`lib/policy/engine.ts`)**: Reconciles Purchase Order ⇄ Waybill photo proof ⇄ Circle Wallet escrow before a single cent moves. |
| **03. The Parable of the Talents** | Severe condemnation of the servant who buried capital idle in the ground rather than putting it to work. | **Automated USYC Yield Engine (`lib/circle/index.ts`)**: Sweeps idle operating reserves into tokenized money market funds earning **5.15% APY** (+₦1,065/day on $5,000 reserve). |

---

## 🌍 Solving the Real Problem: 85% of African Commerce

Most crypto agent projects fail because they build toys for DeFi traders who don't need them. **OLOWO is built for the backbone of African trade**:

- **The Problem**: Mama Ngozi runs a grain wholesale warehouse in Balogun Market, Lagos. She manages 24 grain farmers in Kano, 6 cross-border haulage truckers from Cotonou, and shop rent reserves. She loses up to 18% of margin every month to duplicate waybill fraud, currency volatility (Naira inflation), supplier disputes, and banking delays during cross-border transit.
- **The Solution**: 
  - **WhatsApp Commerce Interface**: Vendors and haulage drivers send waybills and delivery photos directly to OLOWO via WhatsApp.
  - **Studio Neural Nigerian Pidgin & Simple English**: Speaks to traders in their language with Microsoft `en-NG-AbeoNeural` natural voice notes.
  - **Dual Currency Rails**: Displays instant parallel balances ($USDC + ₦ Naira at live ₦1,500 rate).
  - **Sub-Second Arc Settlement**: Clears valid contractor payments in <380ms with sponsored gas via Circle Paymaster.

---

## ⚡ The Core Autonomous Loop

```text
       Inbound WhatsApp / Email / API Waybill or Invoice
                             ↓
              [1] Vendor Whitelist Check
                             ↓
              [2] Symbolon 3-Way Match (PO ⇄ Waybill ⇄ Milestone)
                             ↓
              [3] Duplicate Claim Protection
                             ↓
              [4] Minimum Reserve Solvency Guard ($5,000 Floor)
                             ↓
              [5] Autonomous Mandate Evaluation ($1,000 Limit)
                             ↓
             ┌───────────────────────────────┐
             │                               │
       ALL CHECKS PASS               THRESHOLD EXCEEDED / VIOLATION
             │                               │
             ↓                               ↓
   Execute Arc Settlement            Escalate to Owner via WhatsApp
   via Circle Paymaster (Gasless)    with Euthyna Reasoning Trace
             │                               │
             ↓                               ↓
   USDC Dispatched (<380ms)          Wait for Madam / Owner Signature
             │                               │
             └───────────────┬───────────────┘
                             ↓
         Immutable Audit Log & USYC Yield Optimization
```

---

## 🛠️ Circle Developer Stack & Arc Integration

OLOWO leverages the complete Circle Developer Tool suite and Arc rails:

1. **Circle Developer-Controlled Wallets (`lib/circle/index.ts`)**:
   - `0x1927...84F1` — Main Operating Treasury
   - `0x77c2...B39a` — Rent Reserve Wallet (staked in USYC)
   - `0x55d1...2E74` — Contractor Escrow Vault
2. **Circle Paymaster Gasless Sponsorship**:
   - 100% of vendor settlements on Arc Network are gas-sponsored. Merchants pay $0 in gas fees.
3. **Circle Gateway Multichain Aggregation**:
   - Unified liquidity aggregation across Arc Network (Primary), Base, and Arbitrum.
4. **Tokenized USYC Yield Engine**:
   - Automatically maintains $5,000 shop rent reserve in USYC earning 5.15% APY ($0.71/day = ~₦1,065/day passive yield).
5. **CCTP Multichain Cross-Border Settlement**:
   - Enables seamless Cotonou ⇄ Lagos cross-border supply payments with zero slippage.
6. **TestMint Testnet Faucet (`https://testmint.myproceeds.xyz/`)**:
   - Interactive 1-click testnet USDC faucet claims built directly into the [Infrastructure Rails Page](http://localhost:3000/infrastructure).

---

## 🎯 4 Scoring Criteria Alignment (Why OLOWO Dominates 1st–3rd)

### 1. Agentic Sophistication (30%)
- **Real Decision Autonomy**: OLOWO doesn't just display data; it makes autonomous payment decisions bounded by a strict deterministic policy engine.
- **Explainable Reasoning Traces**: Every action produces a multi-step deliberation trace: `State Observed ➔ Mandate Evaluated ➔ Risk Assessed ➔ Decision Reached`.
- **Euthyna Audit Time-Machine**: Step-by-step playback of past decisions for instant regulatory or owner review.

### 2. Traction & Real-World Use Case (30%)
- **Market Trader Hub**: Tailored for Nigerian grain merchants, food distributors, and market women.
- **Interactive WhatsApp Simulator**: Real scenarios tested in the app:
  1. *Alhaji Sani 100 Bags Rice*: Auto-cleared in 340ms against purchase order #PO-1049.
  2. *Duplicate Waybill Fraud Detection*: Catches resubmitted waybill #WB-9042 and saves ₦720,000.
  3. *Cotonou Haulage Limit Exceeded*: Holds $1,400 bill exceeding $1,000 mandate for human approval.
- **Voice-First Accessibility**: Studio neural voice synthesis in Nigerian Pidgin and Simple English.

### 3. Circle Tool Usage (20%)
- Deep, creative usage of Circle Wallets, Paymaster, Gateway, USYC yield tokens, and Arc settlement rails.
- Built-in live infrastructure telemetry dashboard at `/infrastructure`.

### 4. Innovation (20%)
- Grounded in Byzantine treasury history (*Tameion*).
- Solves the $100B African informal trade settlement gap with modern agentic crypto rails.
- First AI finance operator to combine voice-first WhatsApp commerce with gasless USDC on Arc.

---

## 🎬 3-Minute Video Pitch Script (Judges' Walkthrough)

- **[0:00 - 0:30] Hook & Problem**:
  *"Judges, this is Mama Ngozi. She runs a wholesale grain business in Balogun Market, Lagos. She manages 24 farmers in Kano and truckers in Cotonou. She loses 18% of her revenue every month to duplicate waybills, currency devaluation, and banking bottlenecks. Meet OLOWO: the autonomous AI finance operator named after the Byzantine Tameion treasury."*
- **[0:30 - 1:15] Real-World WhatsApp Commerce & Voice**:
  *"Watch how it works in real life. Alhaji Sani delivers 100 bags of rice and sends a waybill photo on WhatsApp. OLOWO instantly extracts the items, verifies PO-1049, confirms the milestone, and checks our $5,000 reserve floor. 5/5 checks pass! OLOWO settles $750 in USDC on the Arc Network in under 380ms with 0 gas fees using Circle Paymaster — and sends Alhaji a voice note in Nigerian Pidgin confirming receipt."*
- **[1:15 - 1:55] Mandate Boundary & Fraud Prevention**:
  *"Next, a duplicate waybill arrives trying to claim ₦720,000 twice. OLOWO catches the duplicate hash and rejects it instantly. Then, a $1,400 Cotonou haulage bill arrives. It's valid, but exceeds OLOWO's $1,000 autonomous mandate. OLOWO doesn't hallucinate — it pauses the payment and asks Madam Ngozi for WhatsApp signature."*
- **[1:55 - 2:35] Athenian Euthyna & Circle Infrastructure**:
  *"Under the hood, OLOWO implements the Athenian Euthyna: click any decision in the log to replay the 4-stage audit trace. On our Infrastructure page, see our Circle Wallets, Paymaster telemetry, and USYC yield engine earning 5.15% APY on our idle shop rent reserve."*
- **[2:35 - 3:00] Conclusion & Traction**:
  *"OLOWO turns Circle and Arc into everyday financial infrastructure for the real world. OLOWO watches the money, so African merchants can run their business. Thank you!"*

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18+ (tested on v20 and v24)
- npm or yarn

### Installation & Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/nwhator/olowo.git
cd olowo

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- **Landing Page**: [http://localhost:3000](http://localhost:3000) (Interactive Pitch & WhatsApp Simulator)
- **Market Trader Hub**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard) (Pidgin Voice + Naira/USDC Hub)
- **Circle & Arc Infrastructure**: [http://localhost:3000/infrastructure](http://localhost:3000/infrastructure) (Live Tooling & Telemetry)
- **Decision Audit Log & Euthyna Replay**: [http://localhost:3000/decisions](http://localhost:3000/decisions)
- **Deterministic Policy Editor**: [http://localhost:3000/policy](http://localhost:3000/policy)

---

## 📦 Submission Deliverables

- **Live Deployed App**: Hosted on Vercel
- **Public GitHub Repo**: [`https://github.com/nwhator/olowo`](https://github.com/nwhator/olowo)
- **Demo Video (3 mins)**: Walkthrough of WhatsApp Simulator, Pidgin Voice, Euthyna Replay, and Circle Rails.
- **Hackathon Track**: Tameion Agents Hackathon 2026 (Circle & Arc Rails).

---

## 📄 License

MIT © 2026 OLOWO Finance. All rights reserved.
