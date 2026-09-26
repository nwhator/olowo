# OLOWO — AI Finance Operator

> **"OLOWO watches the money. You run the business."**  
> *Autonomous finance. Within your rules.*

OLOWO is an autonomous AI finance operator for modern businesses. It allows a business owner to give an AI operator a clearly defined financial mandate. OLOWO continuously monitors business financial activity, verifies invoices and obligations, evaluates deterministic company policies, executes permitted USDC payments via Circle and Arc network, requests human approval when an action exceeds its authority, monitors treasury health, and maintains a complete decision/audit trail.

---

## ⚡ The Core Product Loop

```text
Invoice received
        ↓
OLOWO verifies vendor
        ↓
OLOWO checks contract
        ↓
OLOWO verifies milestone
        ↓
OLOWO checks duplicate status
        ↓
OLOWO checks treasury solvency
        ↓
OLOWO evaluates policy
        ↓
       ┌───────────────┐
       │               │
    ALLOWED        NOT ALLOWED
       │               │
       ↓               ↓
     PAY          REQUEST APPROVAL
       │
       ↓
 Circle / USDC
       │
       ↓
      Arc
       │
       ↓
  Decision Log & Audit Trail
```

---

## 🛡️ Critical Security Principle

**The LLM never has unrestricted authority to move money.**

The LLM may inspect information, analyze invoices, propose actions, explain actions, and call verification tools. However, payment execution is strictly gated behind a **server-side deterministic policy engine**:
- Vendor whitelist validation
- Duplicate claim protection
- Milestone sign-off verification
- Minimum operating reserve ($5,000 floor)
- Autonomous spending limit ($1,000)
- Daily aggregate autonomous budget ($5,000)
- Emergency killswitch (Pause Autonomous Operations)

---

## 🚀 Key Features

1. **Deterministic Policy Engine (`lib/policy/engine.ts`)**: Enforces hard compliance rules independent of model hallucinations.
2. **Circle Wallets & Arc Settlement (`lib/circle/`, `lib/arc/`)**: High-speed, gasless USDC settlement layer with verifiable transaction hashes.
3. **Interactive Scripted Demo Runner**: 6-step walkthrough demonstrating inbound revenue, contractor milestone verification, $750 autonomous payment, AWS liquidity ring-fencing, $4,800 approval escalation, and 18-day reserve runway warning.
4. **OLOWO Minimal Geometric Mascot**: Derived from the "O" in OLOWO with 4 distinct states:
   - `OPERATING` (Green): "Everything is within policy."
   - `ATTENTION` (Amber): "One payment needs your approval."
   - `BLOCKED` (Red): "I stopped a payment because it violates your mandate."
   - `PROCESSING` (Blue): "I'm verifying this invoice."
5. **Treasury & Runway Forecasting (`lib/treasury/forecast.ts`)**: 30-day projection model with burn analysis and reserve intersection alerts.
6. **Immutable Decision Log**: Comprehensive, explainable audit trail detailing 5/5 policy checks, authorization type, and on-chain proofs.
7. **OLOWO AI Conversational Operator (`lib/ai/operator.ts`)**: Answers financial queries using structured tools (`getTreasury()`, `getInvoices()`, `evaluateInvoicePolicy()`) with zero hallucination.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Custom Institutional Fintech Palette (Navy `#08111F`, Mint `#35E0B2`, Electric Blue `#4D7CFE`, Amber `#F5B942`, Red `#EF5B5B`)
- **Typography**: Inter & IBM Plex Mono
- **Charts**: Recharts
- **Icons**: Lucide React
- **Settlement**: Circle Developer-Controlled Wallets, USDC, Arc Network (Chain ID: 84532)

---

## 🏃 Getting Started

### Prerequisites

- Node.js 18+ (tested on v24.12.0)
- npm or yarn

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/nwhator/olowo.git
cd olowo

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🎬 Hackathon Presentation Script

1. **Introduction**: *"Meet OLOWO. It's an AI finance operator for businesses. The owner gives OLOWO a mandate: pay verified invoices up to $1,000 automatically, but never let operating balance fall below $5,000."*
2. **Autonomous Execution**: A $750 contractor invoice arrives from ABC Design. OLOWO verifies vendor whitelist, contract CT-024, milestone 4, duplicate check, and reserve solvency. Result: **5/5 checks pass -> Paid autonomously in USDC via Arc**.
3. **Mandate Boundary**: A $4,800 invoice arrives. It is verified and valid, but $4,800 > $1,000 limit. OLOWO escalates to the owner with an approval request and AI recommendation. Owner signs off -> Settlement executed.
4. **Liquidity Protection**: AWS obligation ($900 due in 5 days) is ring-fenced in treasury.
5. **Runway Alert**: Treasury engine warns: *"At the current spending rate, available funds may touch the $5,000 reserve within 18 days."*
6. **Explainability**: Open the Decision Log to inspect cryptographic hashes, exact timestamps, and deterministic policy proofs.

---

## 📄 License

MIT © 2026 OLOWO Finance
