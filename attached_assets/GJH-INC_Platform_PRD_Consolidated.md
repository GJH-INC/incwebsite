# GJH-INC.COM — AI-Powered Business Development Platform
## Consolidated Product Requirements Document
**Version:** 1.1 (Partner Ecosystem Intelligence Added)
**Prepared:** March 2026
**Domain:** gjh-inc.com
**Company:** GJH INC — Strategic Consulting, Technology Services, Managed Services
**Platform:** Replit (hosting, auth, database) + Cloudflare (DNS, CDN, edge, SSL)
**Repository:** GitHub — GJH_platform

---

## DOCUMENT NOTES: CONFLICTS RESOLVED

The three source documents (Replit Agent Prompt, PRD.docx, Requirements PDF) were largely consistent but contained the following conflicts and errors — all resolved in this document:

| # | Issue Found | Resolution |
|---|-------------|------------|
| 1 | Claude model version listed as `claude-sonnet-4-20250514` (malformed) | Use `claude-sonnet-4-5` (current Anthropic production model) |
| 2 | Scheduling tool: "Cal.com or Calendly" listed inconsistently | **Standardize on Cal.com** — open source, self-hostable, no vendor lock-in |
| 3 | Email service: "SendGrid or Resend" listed inconsistently | **Standardize on Resend** — modern API, better developer experience, generous free tier |
| 4 | Analytics: "Plausible or PostHog" listed inconsistently | **Standardize on Plausible** — simpler, GDPR-compliant, no cookie banner required |
| 5 | Partners section: Current site has 17-logo animated carousel; docs say 6–8 badge grid | **Revised decision: all 17 partners are retained and expanded** — each partner now has a dedicated profile page, service offering, and AI-powered routing capability. About page shows a clean 6–8 featured badge grid. Full partner catalog lives at `/partners`. |
| 6 | Terms page incorrectly references `info@gjhconsulting.net` | **Use `info@gjh-inc.com` everywhere, no exceptions** |
| 7 | Product pricing listed as "Fixed fee" with no amounts | **Gap — actual prices must be confirmed by GJH INC** before launch |
| 8 | Team bios listed as About page requirement | **Content gap — team content must be supplied by client** |
| 9 | Apollo integration mentioned but no API or workflow details | **Treat as Wave 3 / optional** until Apollo account and API key are confirmed |
| 10 | Docs treat current site as fully static/broken — several fixes already done | **Current state accounted for below** |

---

## SECTION 1: CURRENT STATE (AS-BUILT)

The following improvements have already been made to the static HTML site and should be **preserved and migrated** into the Next.js rebuild:

**Already completed:**
- `about.html`, `data-services.html`, `automation.html`, `genai.html` — pages exist and are live
- All 13 HTML pages have consistent navbar with GJH-icon.png stacked logo
- Partners section upgraded with 17 real logos (animated ticker) — **to be replaced with 6–8 badge grid per spec**
- All emoji icons replaced with SVGs in `services.html`
- Broken `href="#"` links fixed across `services.html` and `index.html`
- `sitemap.xml` updated with all current pages
- Contact email corrected to `info@gjh-inc.com`

**Still required (target of this PRD):**
- Full platform rebuild in Next.js
- Five AI agents
- Admin dashboard
- Blog/Insights section
- Case studies
- Products/digital storefront
- Stripe payments
- Lead nurture automation
- SEO monitoring

---

## SECTION 2: EXECUTIVE SUMMARY

This document defines requirements to transform gjh-inc.com from a static HTML site into an **AI-powered, autonomous revenue-generation platform** — operating 24 hours a day, 7 days a week — through five coordinated AI agents.

The platform's strategic purpose is dual: it functions as an active business development system *and* as a live proof-of-concept that GJH INC sells exactly what it demonstrates.

**Core thesis:** When a government contracting officer visits gjh-inc.com at 11pm doing vendor due diligence, an intelligent system greets them, answers their questions, qualifies them as a lead, delivers a capability statement, schedules a meeting, and begins a personalized nurture sequence — without any human intervention.

---

## SECTION 3: TECHNOLOGY STACK

| Layer | Technology | Decision Rationale |
|-------|------------|--------------------|
| Frontend | Next.js 14 + React + Tailwind CSS | SSR/SSG for SEO; App Router for streaming |
| Backend | Node.js API routes (Next.js) | Unified codebase, no separate server needed |
| Database | PostgreSQL on Replit | Structured relational data for leads/orders/events |
| AI / LLM | Anthropic Claude API (`claude-sonnet-4-5`) | Content, chatbot, lead analysis |
| CDN / Edge | Cloudflare — DNS, CDN, DDoS, SSL, edge cache | Performance + security layer |
| Email | Resend | Transactional + nurture sequences |
| Payments | Stripe | Product checkout, order management |
| Analytics | Plausible | Privacy-first, no cookie banner, lightweight |
| Scheduling | Cal.com embed | Meeting booking, no vendor lock-in |
| Auth | Replit Auth | Admin dashboard protection |
| Enrichment | Apollo (Wave 3) | Prospect data enrichment, outbound sequencing |
| Source Control | GitHub (GJH_platform repo) | Synced with Replit |

---

## SECTION 4: AI AGENTS (7 TOTAL)

### Agent 1 — Content Strategist

**Purpose:** Automate the content engine that closes the SEO gap with gjhconsulting.net (100+ indexed articles vs. current ~8).

**Inputs:**
- RSS feeds: SAM.gov, FedBizOpps, GSA announcements, industry publications
- Keyword gap data from Agent 4 (`content_brief_needed` events)
- Manual topic requests from admin

**Outputs:**
- Blog post drafts (stored as `draft` status in `blog_posts` table — never auto-published)
- SEO metadata: title tag, meta description, OG image prompt, Schema.org Article JSON-LD
- LinkedIn social snippet for each approved post
- Editorial calendar with seasonality-based publish date suggestions

**Content pillars:**
1. Government Contracting — RFP strategies, SAM.gov, SBIR/STTR, compliance checklists
2. GSA Schedules — Application walkthroughs, pricing strategies, renewals
3. Cybersecurity & Compliance — NIST 800-171, CMMC readiness, FedRAMP
4. AI & GenAI Solutions — Federal use cases, ROI of automation, responsible AI frameworks
5. Data & Analytics — Databricks/Snowflake modernization, dashboard design
6. Web Development — AI-optimized design, Section 508 accessibility, performance

**Schedule:** Configurable — default daily scan, weekly draft generation

**Human-in-the-loop rule:** Zero content publishes without admin approval. Draft queue is the only output.

---

### Agent 2 — Prospect Engager (Intelligent Chatbot)

**Purpose:** 24/7 AI chat on every page — answers service questions, demonstrates GJH capabilities, qualifies leads, captures contact info.

**Inputs:**
- Current page URL (context injection)
- GJH knowledge base: services, NAICS codes (541511, 541512, 541519, 541611, 518210), certifications (SBA 8(a), HUBZone), capability statement, past performance summaries
- Visitor session metadata

**Outputs:**
- Qualified lead record in `leads` table
- Conversation transcript in `chatbot_conversations` table
- `lead_captured` event → triggers Agent 3
- `high_value_lead` event → admin email notification

**Lead qualification flow:**
1. Greet based on current page context
2. Identify visitor role: Contracting Officer, Program Manager, CTO, Small Business Owner, Other
3. Identify organization type: Federal, State/Local, Commercial, Non-profit
4. Understand need: which service area
5. Budget range and timeline
6. Capture name, email, organization
7. Tier assignment: Hot (budget + timeline confirmed) / Warm (interest confirmed) / Cold (browsing)

**Escalation rules:**
- Hot lead → immediate email to `info@gjh-inc.com`
- Question outside knowledge base → "Let me connect you with a team member" + email alert
- Hallucination guard: RAG-only responses from verified knowledge base documents

---

### Agent 3 — Lead Nurture & CRM Bridge

**Purpose:** Convert captured leads into pipeline opportunities through automated, personalized follow-up.

**Triggers:**
- `lead_captured` event (from Agent 2 or contact form)
- `product_inquiry` event (from Agent 5)
- `content_published` event (newsletter queue)

**Email sequences by tier:**

| Tier | Day 0 | Day 2 | Day 5 | Day 7 | Ongoing |
|------|-------|-------|-------|-------|---------|
| Hot | Personal email + capability statement PDF + Cal.com link | — | — | — | Monthly newsletter |
| Warm | Welcome + intro email | Value content (relevant service article) | — | CTA: schedule consultation | Monthly newsletter |
| Cold | — | — | — | — | Monthly newsletter only |

**Personalization signals:**
- Pages visited before lead capture
- Chatbot conversation topics
- Product pages viewed

**Additional functions:**
- Pipeline dashboard (Kanban: New → Contacted → Qualified → Proposal → Won/Lost)
- Bi-weekly newsletter digest auto-assembled from published blog content
- Apollo enrichment (Wave 3): enrich lead record with company size, LinkedIn, funding data
- Follow-up reminder system for admin

---

### Agent 4 — SEO & Performance Monitor

**Purpose:** Continuously audit site health, track rankings, enforce technical SEO standards, and feed keyword intelligence back to Agent 1.

**Scheduled tasks (weekly by default, configurable):**
1. Crawl all pages — detect broken links (404s, dead anchors, missing images)
2. Pull Core Web Vitals via PageSpeed Insights API — flag pages below 90 score
3. Validate Schema.org structured data on all public pages
4. Track target keywords across all six content pillars
5. Monitor gjhconsulting.net: indexed page count, new content, estimated rankings
6. Regenerate XML sitemap when pages are added, removed, or changed
7. Generate weekly health report for admin dashboard

**Event emissions:**
- `content_brief_needed` — when keyword gap detected → Agent 1 generates draft
- `seo_alert` — when broken links found or Core Web Vitals drop below threshold

**Targets:** 90+ PageSpeed on mobile and desktop; 95+ sustained at 90 days

---

### Agent 5 — Product & Service Showcase Engine

**Purpose:** Operate a 24/7 digital storefront for productized GJH offerings — from browsing through purchase to fulfillment tracking.

**Product catalog (pricing TBD by GJH INC):**

| Product | Description | Delivery Format | Price |
|---------|-------------|-----------------|-------|
| CMMC Readiness Assessment | Gap analysis against CMMC Level 1/2 with remediation roadmap | PDF report + consultation call | Fixed fee |
| AI Readiness Audit | Evaluate org readiness for AI adoption across data, infrastructure, and talent | PDF report + presentation deck | Fixed fee |
| Data Maturity Assessment | Score data governance, quality, architecture, and analytics capabilities | Scorecard + roadmap document | Fixed fee |
| GovCon Bid Strategy Package | RFP response strategy, win theme development, compliance matrix template | Document package | Fixed fee |
| Website AI Optimization Audit | AI search readiness, traditional SEO, and conversion optimization evaluation | PDF report + action plan | Fixed fee |

**Functions:**
- Individual landing page per product with full description, deliverables, timeline, and purchase/inquiry options
- Stripe Checkout for direct purchase — order record created on completion
- Inquiry form ("Ask about this") → feeds `product_inquiry` event to Agent 3
- Dynamic case studies automatically linked to relevant products
- Order status tracking (Pending → In Progress → Delivered)
- Proposal template pre-population: client name, selected product, scope, pricing

---

## SECTION 5: AGENT EVENT BUS

All agents share a PostgreSQL-backed event table (`agent_events`). Events are written by emitters and polled (or webhook-triggered) by subscribers.

| Event | Emitter | Subscriber(s) | Action Triggered |
|-------|---------|---------------|-----------------|
| `lead_captured` | Agent 2, Contact Form | Agent 3 | Begin email sequence for lead tier |
| `high_value_lead` | Agent 2 | Admin email | Immediate notification to `info@gjh-inc.com` |
| `product_inquiry` | Agent 5 | Agent 3 | Product-specific follow-up sequence |
| `content_brief_needed` | Agent 4 | Agent 1 | Generate blog draft for keyword gap |
| `content_published` | Agent 1 (on admin approve) | Agent 4, Agent 3 | Agent 4: update sitemap. Agent 3: queue for newsletter |
| `seo_alert` | Agent 4 | Admin dashboard | Display alert card in SEO Health section |
| `order_completed` | Agent 5 (Stripe webhook) | Agent 3 | Send confirmation + onboarding sequence |
| `partner_intent_detected` | Agent 7 (via Agent 2) | Agent 7 | Route visitor to partner solution or GJH delivery |
| `partner_referral_clicked` | Agent 7 | Admin dashboard | Log referral, attribute to lead if known |
| `partner_solution_requested` | Agent 7, Contact Form | Agent 3, Agent 7 | Trigger partner-specific follow-up + notify partner if applicable |
| `partner_content_needed` | Agent 7 | Agent 1 | Generate partner co-marketing article or case study draft |

**Safety rules:**
- Events have a `processed` boolean flag — subscribers mark events processed after handling
- Dead-letter queue for failed event processing (events retry up to 3 times)
- Manual event override available in admin Agent Activity Log
- No event triggers a public-facing action without either human approval (content) or defined business rules (email sequences)

---

## SECTION 6: SITE ARCHITECTURE

### Public Routes

| Route | Page | Key Elements |
|-------|------|-------------|
| `/` | Home | Hero (single value prop + "Request a Proposal" CTA + "Download Capability Statement" CTA), 6 service cards, social proof/testimonials carousel, newsletter signup, short embedded contact form, chatbot widget |
| `/about` | About | Mission statement, company story, team bios *(content needed from client)*, certifications as badge grid (SBA 8(a), HUBZone, etc.), 6–8 partner logos in static badge grid, company video placeholder |
| `/services` | Services Overview | 5 cards linking to dedicated service pages |
| `/services/government-contracting` | Government Contracting | RFP support, bid strategy, contract management, CTA |
| `/services/web-development` | Web Development | AI-optimized websites, Section 508 compliance, CTA |
| `/services/data-services` | Data Services | Data engineering, Databricks/Snowflake, dashboards, CTA |
| `/services/automation` | Automation & Integration | Process automation, system integration, workflow optimization, CTA |
| `/services/genai` | GenAI Solutions | AI strategy, chatbots, document intelligence, predictive analytics, CTA |
| `/products` | Products | Grid of 5 products with price and "Buy / Inquire" CTAs |
| `/products/[slug]` | Product Detail | Full description, deliverables, timeline, Stripe purchase, inquiry form |
| `/insights` | Blog / Insights | Article grid with topic tag filters, search bar, pagination, newsletter CTA |
| `/insights/[slug]` | Blog Post | Full article, author, date, related posts, newsletter CTA, social share |
| `/case-studies` | Case Studies | 3–5 project showcases (grid) |
| `/case-studies/[slug]` | Case Study | Problem → Solution → Results with measurable metrics |
| `/capability-statement` | Capability Statement | Interactive web version (NAICS codes, certifications, past performance) + downloadable PDF |
| `/contact` | Contact | Short form (name, email, org, message), phone, email, map, Cal.com scheduling embed |
| `/careers` | Careers | Open positions listing |
| `/partners` | Partner Ecosystem | All 17 partner profiles in a searchable, filterable catalog — each card shows partner name, service domain, what GJH delivers with that partner, and dual CTAs: "Work with us" and "Visit Partner Portal" |
| `/partners/[slug]` | Partner Detail | Dedicated page per partner — full service description, GJH value-add, past engagement examples, relevant case studies, "Request a Solution" form, and direct partner portal link |
| `/privacy` | Privacy Policy | Contact: `info@gjh-inc.com` |
| `/terms` | Terms of Service | Contact: `info@gjh-inc.com` (NOT gjhconsulting.net — this is a critical fix) |

### Protected Routes

| Route | Page | Key Elements |
|-------|------|-------------|
| `/admin` | Admin Dashboard | Protected by Replit Auth — unified view across all agents |
| `/admin/content` | Content Manager | Draft queue (approve/edit/reject/schedule), editorial calendar, published analytics |
| `/admin/leads` | Lead Pipeline | Kanban board (New → Contacted → Qualified → Proposal → Won/Lost), lead detail drawer |
| `/admin/seo` | SEO Health | Broken links, PageSpeed scores, keyword ranking chart, competitor comparison |
| `/admin/products` | Products & Orders | Product catalog CRUD, order list, revenue chart |
| `/admin/chatbot` | Chatbot Config | Knowledge base editor, conversation review, FAQ analytics |
| `/admin/agents` | Agent Activity Log | Real-time feed of all agent actions with timestamps and status |
| `/admin/partners` | Partner Manager | Partner catalog CRUD — add/edit/remove partners, manage portal links, view referral click and conversion data, configure per-partner routing rules |

---

## SECTION 7: DESIGN SYSTEM

| Element | Specification |
|---------|--------------|
| Primary brand color | `#4338CA` (indigo) |
| Dark color | `#1E1B4B` (navy) |
| Accent colors | `#10B981` (emerald), `#8B5CF6` (violet) — maximum 3 accent colors total |
| Background gradient | `blue-50 → violet-50 → white` |
| Primary font | Inter (Google Fonts) |
| Secondary font | JetBrains Mono (code/technical content only) |
| Icons | Lucide React — **no emoji anywhere in the platform** |
| Card style | `backdrop-blur-sm bg-white/60 rounded-2xl p-8 border border-white/20 hover:border-primary/20` |
| Primary CTA | Solid indigo (`bg-primary`) with white text, rounded-full |
| Secondary CTA | Outlined indigo (`border-primary text-primary`), rounded-full |
| Images | Professional SVG illustrations or real photos — no placeholder stock images at launch |
| Logo | `GJH-icon.png` (40×40 favicon/navbar icon) + `GJH-final.png` (full logo for footer/OG) |
| Partner logos | **6–8 maximum, static badge grid** — not scrolling carousel |
| Mobile-first | All layouts responsive, mobile breakpoints primary |
| Accessibility | Section 508 compliant — ARIA labels, keyboard navigation, WCAG AA color contrast |
| Performance target | 90+ Google PageSpeed on both mobile and desktop |

---

## SECTION 8: DATABASE SCHEMA

```sql
-- Lead records from chatbot and forms
leads (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  organization TEXT,
  role TEXT,
  tier TEXT CHECK (tier IN ('hot', 'warm', 'cold')),
  source TEXT,
  pages_viewed JSONB,
  chatbot_topics JSONB,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)

-- Blog content (AI-drafted, human-approved)
blog_posts (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  topic_tag TEXT,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  schema_json JSONB,
  linkedin_snippet TEXT,
  status TEXT CHECK (status IN ('draft', 'scheduled', 'published')),
  author TEXT DEFAULT 'GJH INC',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Productized service catalog
products (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  includes JSONB,
  delivery TEXT,
  price INTEGER,
  stripe_price_id TEXT,
  related_case_study_ids JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Purchase orders (Stripe-confirmed)
orders (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  customer_name TEXT,
  customer_email TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  status TEXT CHECK (status IN ('pending', 'paid', 'in_progress', 'delivered')),
  amount INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Chatbot conversation transcripts
chatbot_conversations (
  id UUID PRIMARY KEY,
  visitor_id TEXT,
  page_url TEXT,
  messages JSONB,
  lead_id UUID REFERENCES leads(id),
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Inter-agent event bus
agent_events (
  id UUID PRIMARY KEY,
  event_type TEXT NOT NULL,
  emitter_agent TEXT NOT NULL,
  payload JSONB,
  processed BOOLEAN DEFAULT false,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Newsletter subscribers
newsletter_subscribers (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- SEO and performance audit reports
seo_reports (
  id UUID PRIMARY KEY,
  report_type TEXT,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Partner registry and routing rules
partners (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_path TEXT,
  category TEXT,
  service_domains JSONB,
  gjh_value_add TEXT,
  portal_url TEXT NOT NULL,
  referral_url TEXT,
  affiliate_id TEXT,
  contact_email TEXT,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Track partner portal referral clicks and conversions
partner_referrals (
  id UUID PRIMARY KEY,
  partner_id UUID REFERENCES partners(id),
  visitor_id TEXT,
  lead_id UUID REFERENCES leads(id),
  clicked_at TIMESTAMPTZ DEFAULT now(),
  converted BOOLEAN DEFAULT false,
  converted_at TIMESTAMPTZ,
  revenue_attributed NUMERIC(10,2),
  notes TEXT
)

-- Intent signals detected by chatbot/agent mapped to partner products
partner_intent_events (
  id UUID PRIMARY KEY,
  visitor_id TEXT,
  lead_id UUID REFERENCES leads(id),
  detected_need TEXT,
  matched_partner_id UUID REFERENCES partners(id),
  matched_service TEXT,
  confidence_score NUMERIC(4,3),
  action_taken TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Case studies (manually authored)
case_studies (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  industry TEXT,
  problem TEXT,
  solution TEXT,
  results JSONB,
  metrics JSONB,
  related_product_ids JSONB,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
)
```

---

## SECTION 9: ENVIRONMENT VARIABLES

```env
ANTHROPIC_API_KEY=               # Claude API key (claude-sonnet-4-5)
STRIPE_SECRET_KEY=               # Stripe live/test secret key
STRIPE_PUBLISHABLE_KEY=          # Stripe publishable key
STRIPE_WEBHOOK_SECRET=           # Stripe webhook signing secret
RESEND_API_KEY=                  # Resend email API key
ADMIN_EMAIL=info@gjh-inc.com     # Admin notification destination
SITE_URL=https://gjh-inc.com     # Canonical base URL
DATABASE_URL=                    # PostgreSQL connection string
NEXTAUTH_SECRET=                 # Next.js auth secret
CALCOM_API_KEY=                  # Cal.com embed (optional — public embed works without key)
PLAUSIBLE_DOMAIN=gjh-inc.com     # Plausible analytics domain
APOLLO_API_KEY=                  # Apollo prospect enrichment (Wave 3)
CLOUDFLARE_API_TOKEN=            # Edge cache purge API (optional)
```

---

## SECTION 10: IMPLEMENTATION WAVES

### Wave 1 — Foundation (Weeks 1–3)
- Complete site rebuild in Next.js with all public routes from Section 6
- PostgreSQL database schema deployed
- Agent 2 (Prospect Engager chatbot) live with GJH knowledge base
- Admin dashboard with Replit Auth
- Cloudflare DNS + SSL + caching rules configured
- Agent 4 (SEO Monitor) running baseline audit
- GitHub sync with GJH_platform repo

### Wave 2 — Content & Revenue Engine (Weeks 3–5)
- Agent 1 (Content Strategist) activated with 4–6 seed blog articles across content pillars
- Blog/Insights section live with topic filters and search
- Agent 5 (Product Showcase) with full product catalog
- Stripe Checkout integration for all 5 products
- 3 case studies published
- Newsletter signup across all pages — email service connected

### Wave 3 — Automation & Scale (Weeks 5–8)
- Agent 3 (Lead Nurture) with full email sequences for all tiers
- Full agent event bus — all cross-agent events wired and tested
- Apollo integration for prospect enrichment
- Automated bi-weekly newsletter digest
- Proposal template auto-generation
- Competitor monitoring feeding into content brief pipeline
- Performance tuning based on first 30 days of live data

---

## SECTION 11: SUCCESS METRICS

| Metric | 30-Day Target | 90-Day Target |
|--------|--------------|---------------|
| Indexed pages | 25+ (from ~8) | 50+ |
| Blog posts published | 6 seed articles | 18+ across all pillars |
| Chatbot conversations | 50+ | 200+ (15%+ lead capture rate) |
| Leads captured | 10+ qualified | 40+ with active nurture |
| Product inquiries | 5+ product page views | 3+ purchases or consultations |
| PageSpeed score | 90+ mobile and desktop | 95+ sustained |
| Newsletter subscribers | 25+ | 100+ |
| Revenue (products) | First paid order | Recurring monthly product revenue |

---

## SECTION 12: ENHANCEMENTS — RECOMMENDED ADDITIONS

The following requirements are proposed to strengthen the platform for genuine end-to-end, 24/7 autonomous revenue generation. These are not in the original documents and are recommended for inclusion.

### 12.1 Agent 6: Proposal Generator (NEW)

A dedicated agent that auto-generates draft Statement of Work (SOW) documents from product purchases and lead qualification data. When a visitor buys a CMMC Assessment, Agent 6 pre-populates a branded proposal with their company name, scope, timeline, and pricing. Human reviews before sending.

- Input: order record + lead record + product template
- Output: PDF SOW stored in order record, emailed to client via Resend
- Admin reviews final document before it sends (human-in-the-loop)

### 12.2 Knowledge Base Version Control

The chatbot knowledge base should be versioned. When GJH wins a new certification, adds a service, or changes pricing, the knowledge base should be updateable in the admin dashboard with an audit log of what changed and when — preventing outdated information from being served.

### 12.3 Live Dashboard Metrics Widget (Homepage)

A subtle "live" credibility widget on the homepage showing real-time or near-real-time stats:
- "47 government agencies served"
- "12 active consulting engagements"
- Values driven from the database — credible, not fabricated

### 12.4 Structured Content for AI Search (Answer Engine Optimization)

Beyond traditional SEO, structure all service pages and blog posts for AI search engines (Perplexity, ChatGPT search, Google AI Overviews). This means:
- FAQ sections in Schema.org `FAQPage` format on every service page
- Concise "What is [X]?" answer blocks at top of articles
- Entity markup for GJH INC as an organization
- Agent 1 trained to write in answer-first format, not keyword-stuffed format

### 12.5 Capability Statement as Dynamic Document

Instead of a static PDF, the capability statement page at `/capability-statement` should render from the database (NAICS codes, certifications, past performance, contract vehicles). Admin can update fields in the dashboard. A "Download PDF" button generates a fresh PDF on demand using the current database content — always up to date.

### 12.6 GovCon Opportunity Tracker (Revenue Intelligence)

Agent 4 enhanced with SAM.gov API integration: monitor for new RFPs and contract opportunities matching GJH NAICS codes. When a relevant opportunity is found:
- Display in admin dashboard "Opportunity Feed"
- Emit `rfp_opportunity` event
- Agent 1 generates a targeted blog post about the opportunity area (thought leadership)
- Agent 3 can optionally alert lead contacts in relevant pipeline stages

### 12.7 Multi-Channel Outreach (Not Just Email)

Agent 3 enhanced with:
- **LinkedIn connection requests** via Apollo integration when prospect is identified on LinkedIn
- **SMS follow-up** (via Twilio) for hot leads who opt in during chatbot qualification
- Both require explicit opt-in from the prospect during qualification

### 12.8 Content Performance Feedback Loop

When Agent 1's published articles are tracked by Agent 4 for performance (traffic, ranking, conversions), that performance data should feed back to Agent 1's next topic selection. High-performing topics get re-prioritized. This creates a compounding content engine where the platform learns what resonates with GJH's audience.

### 12.9 A/B Testing for CTAs (Conversion Optimization)

Using Plausible or a simple custom implementation, run A/B tests on:
- Hero CTA text ("Request a Proposal" vs. "Schedule a Free Consultation")
- Chatbot opening message by page type
- Product page pricing presentation
Results feed into admin dashboard conversion analytics.

### 12.10 Offline Resilience: Capability Statement QR Code

Generate a QR code linking to the live capability statement page. GJH staff can print and hand this out at conferences and government meetings. The QR code always resolves to the latest, live capability statement — not a static PDF that may be outdated.

---

## SECTION 13: RISKS & MITIGATIONS

| Risk | Impact | Mitigation |
|------|--------|-----------|
| AI content quality inconsistency | Poor content damages credibility with GovCon prospects who read carefully | Human approval for all published content; detailed style guide enforced in Claude prompts |
| Chatbot hallucination about certifications or capabilities | Incorrect claims create legal and trust risk | Strict RAG-only responses; all factual claims grounded in verified knowledge base documents; escalation path for unknown queries |
| Government contact data privacy | Sensitive prospect data from federal contacts | Data stored in US-based Replit/PostgreSQL; clear privacy policy; FedRAMP-readiness pathway documented for future |
| Replit platform dependency | Outages affect availability | Cloudflare edge caching for static content; GitHub backup of all code; documented migration path to standalone VPS |
| Agent coordination failure | Infinite event loops or conflicting outputs | Dead-letter queue for failed events; 3-retry max; manual override in admin Agent Activity Log; event deduplication by ID |
| Stripe payment failure | Lost revenue, poor UX | Stripe webhook retry logic; failed payment email to customer; order status set to `pending` until webhook confirms |
| Content pillar drift | Agent 1 generates off-brand topics | Topic allowlist enforced in Agent 1 prompt; admin configures approved pillars; all drafts require approval |
| Outdated knowledge base | Chatbot answers questions about old certifications or services | Admin dashboard knowledge base editor with versioning; Agent 2 prompts include knowledge base date, agent declines if question is outside base |

---

## SECTION 14: OPEN ITEMS (NEED CLIENT INPUT)

These items require GJH INC to provide information before the platform can be fully built:

1. **Product pricing** — Exact dollar amounts for all 5 productized offerings
2. **Team bios** — Names, titles, photos, and bios for About page
3. **Past performance** — 3–5 project summaries for case studies (problem, solution, measurable results)
4. **Certifications confirmed** — Current active certifications to display (SBA 8(a), HUBZone, etc. — any expiry dates to be aware of?)
5. **NAICS codes confirmed** — Full list of all active NAICS codes for capability statement
6. **Partner logos approved** — Selection of 6–8 partners from current 17 for the badge grid
7. **Company video** — Placeholder or real video for About page
8. **Stripe account** — Stripe account must be created and connected before product purchases go live
9. **Apollo account** — Needed for Wave 3 prospect enrichment (optional)
10. **Cal.com embed code** — Specific scheduling link for consultation bookings

---

## SECTION 15: PARTNER ECOSYSTEM INTELLIGENCE ENGINE

### Strategic Purpose

Every partner relationship GJH INC holds is a potential revenue avenue. When a visitor, prospect, or client needs something that a partner technology delivers, the platform should:

1. **Detect the need** — intelligently identify the partner-relevant intent
2. **Qualify the fit** — determine whether GJH delivers it directly, jointly with the partner, or via a referral
3. **Route it correctly** — sell the GJH-delivered engagement, or redirect to the partner portal with tracked attribution
4. **Follow up autonomously** — trigger the right nurture sequence without human intervention
5. **Track the revenue** — attribute referral commissions, co-sell credits, and pipeline value back to each partner relationship

The result: every partner badge on the site is an active, AI-powered revenue node — not just a logo.

---

### Partner Catalog — All 17 Partners (Categorized)

**Data & AI (GJH Core Differentiators)**

| Partner | Service Domain | GJH Delivery Mode | Revenue Mechanism |
|---------|---------------|-------------------|-------------------|
| Databricks | Data engineering, lakehouse architecture, AI/ML pipelines | GJH implements and manages Databricks environments for clients — especially federal data modernization | Professional services revenue + Databricks partner referral |
| Snowflake | Cloud data warehouse, data sharing, Cortex AI | GJH architects and migrates clients to Snowflake — data governance, pipeline design | Professional services + Snowflake partner credits |
| Sigma Computing | Business intelligence, collaborative analytics on cloud data | GJH deploys Sigma on top of Snowflake/Databricks for federal dashboards and reporting | Professional services + Sigma referral |
| NVIDIA | GPU infrastructure, AI acceleration, CUDA-based ML | GJH recommends and integrates NVIDIA infrastructure for AI/GenAI deployments | Referral to NVIDIA partner portal for hardware/cloud |

**Cloud & Infrastructure**

| Partner | Service Domain | GJH Delivery Mode | Revenue Mechanism |
|---------|---------------|-------------------|-------------------|
| AWS | Cloud infrastructure, migration, security, managed services | GJH delivers AWS cloud migrations, Well-Architected reviews, and managed cloud operations | AWS Partner Network referral + professional services |
| Microsoft | Azure, Microsoft 365, Teams, Power Platform, Copilot | GJH deploys Azure AI, M365 governance, and Power Platform automations for government/commercial clients | Microsoft Partner Network referral + services |
| Google | Google Cloud Platform, Google Workspace, Gemini AI | GJH implements GCP data stacks and Workspace deployments | Google Cloud Partner referral + services |

**Business Operations**

| Partner | Service Domain | GJH Delivery Mode | Revenue Mechanism |
|---------|---------------|-------------------|-------------------|
| Salesforce | CRM, Sales Cloud, Government Cloud | GJH configures and customizes Salesforce for government contractors and commercial clients | Salesforce Partner referral + implementation services |
| Zoho | CRM, HR, Finance, Marketing automation — small-mid business | GJH recommends and implements Zoho suite for SMB clients who need integrated business operations | Zoho Partner referral + setup services |
| Apollo | Sales intelligence, prospect enrichment, outbound sequencing | GJH uses Apollo internally AND recommends it to clients building outbound sales capabilities | Apollo affiliate referral |
| MailChimp | Email marketing, audience management | GJH implements MailChimp for clients needing marketing automation at accessible price points | Referral to MailChimp + setup services |

**Automation & Workflow**

| Partner | Service Domain | GJH Delivery Mode | Revenue Mechanism |
|---------|---------------|-------------------|-------------------|
| Make.com | No-code/low-code process automation, workflow integration | GJH builds Make.com automations for clients — connecting CRMs, ERPs, and data sources | Make.com Partner referral + automation delivery services |

**E-Commerce & Web**

| Partner | Service Domain | GJH Delivery Mode | Revenue Mechanism |
|---------|---------------|-------------------|-------------------|
| Shopify | E-commerce platform, storefront development | GJH builds Shopify stores for government suppliers and commercial clients | Shopify Partner referral + development services |
| WP Engine | WordPress managed hosting, enterprise web performance | GJH recommends WP Engine for clients who need managed WordPress hosting | WP Engine affiliate + hosting setup |
| GoDaddy | Domain registration, DNS management, basic hosting | GJH manages domain portfolio and DNS for clients through GoDaddy | GoDaddy affiliate + domain management services |

**Communications & Support**

| Partner | Service Domain | GJH Delivery Mode | Revenue Mechanism |
|---------|---------------|-------------------|-------------------|
| Zoom | Video conferencing, Zoom Phone, Zoom AI Companion | GJH deploys and manages Zoom for organizations transitioning from legacy conferencing | Zoom Partner referral + deployment services |
| Tawk.to | Live chat, customer support widget | GJH implements Tawk.to for clients who need real-time website visitor engagement | Referral + implementation |

---

### Agent 7 — Partner Ecosystem Engine

**Purpose:** The intelligence layer that monitors every visitor interaction, detects partner-relevant needs in real time, routes them to the correct delivery model (GJH-direct, co-sell, or partner referral), tracks every attribution point, and generates partner-specific content and proposals — autonomously, 24/7.

**This is not a passive directory. Every partner relationship is an active revenue system.**

---

#### 7.1 Partner Intent Detection

Agent 7 works alongside Agent 2 (chatbot) by monitoring conversation context in real time for signals that map to partner products or services.

**Detection triggers (examples):**

| Visitor Signal | Detected Need | Matched Partner(s) | Action |
|---------------|---------------|-------------------|--------|
| "We need to move our data warehouse to the cloud" | Cloud data warehouse migration | Snowflake, Databricks, AWS | Offer GJH-delivered migration + partner tool recommendation |
| "We need a CRM for our contracting team" | CRM for government contractor | Salesforce, Zoho | Ask budget/scale → route to appropriate partner + GJH setup |
| "Can you automate our procurement workflows?" | Process automation | Make.com, Microsoft Power Platform | Offer GJH automation services using Make.com or Power Platform |
| "We need a new website for our 8(a) firm" | Web development | Shopify (e-commerce) or WP Engine (content) | GJH web development service + hosting recommendation |
| "We're evaluating AI infrastructure for our agency" | AI/GPU infrastructure | NVIDIA, AWS, Google Cloud | GJH AI Readiness Audit product + infrastructure partner referral |
| "We need help with email outreach to contracting officers" | Outbound sales + email | Apollo, MailChimp | GJH BD strategy + Apollo/MailChimp implementation |

**Detection mechanism:**
- Agent 2 passes conversation context to Agent 7 at each message exchange
- Agent 7 uses Claude API to classify intent against the partner service catalog
- Confidence threshold required before action (configurable, default: 0.75)
- Low-confidence signals are logged but do not trigger automatic routing

---

#### 7.2 Routing Decision Logic

Once partner intent is detected, Agent 7 applies a three-path routing decision:

```
IF GJH can deliver the service directly using the partner tool:
  → Surface GJH service offering (e.g., "We implement Databricks for federal agencies")
  → Capture as lead → Agent 3 triggers relevant nurture sequence
  → CTA: "Request a Proposal"

ELSE IF GJH delivers jointly (co-sell) with the partner:
  → Surface GJH-led engagement mentioning the partner
  → Capture as lead → flag for sales follow-up
  → CTA: "Schedule a Consultation"

ELSE (pure referral — partner delivers directly):
  → Surface partner product recommendation with GJH context
  → Log referral intent
  → CTA: "Visit [Partner] Portal" → tracked referral link
  → If visitor provides email: capture as lead → route to warm nurture
```

**Admin can configure per-partner routing rules** in the `/admin/partners` dashboard — setting whether each partner is "GJH Delivery," "Co-Sell," or "Referral Only."

---

#### 7.3 Partner-Specific Nurture Sequences (Agent 3 Integration)

When a partner solution is requested, Agent 3 triggers a partner-contextual email sequence:

| Tier | Email 1 (Immediate) | Email 2 (Day 3) | Email 3 (Day 7) |
|------|---------------------|-----------------|-----------------|
| GJH Delivery | "Here's how GJH implements [Partner] for organizations like yours" + capability statement | Case study relevant to their need | Schedule consultation CTA |
| Co-Sell | Introduction to GJH + partner combined solution | Partner tool overview with GJH's role | Proposal offer |
| Referral | "We recommend [Partner] for this need — here's why and how to get started" | Optional: "GJH can help you implement it" | Light CTA |

---

#### 7.4 Partner Pages — Public-Facing

**`/partners` — Partner Ecosystem Page**
- Filterable grid of all 17 partner cards
- Filter categories: Data & AI, Cloud, Business Operations, Automation, Web, Communications
- Each card: logo, partner name, one-line GJH value statement, service tags, "Learn More" and "Work With Us" CTAs
- Search bar for partner name or service type
- Intro section: "GJH INC works with industry-leading technology partners to deliver end-to-end solutions. Whether you need implementation, integration, or a direct path to a partner portal — we connect you with the right solution."

**`/partners/[slug]` — Individual Partner Page**
Each partner gets a dedicated landing page containing:
1. Partner logo + name + GJH certification/tier badge (if applicable)
2. Service domain overview — what this partner's technology does
3. GJH's role — how GJH delivers value using or alongside this partner
4. What clients typically need (2–3 use cases)
5. Relevant GJH case studies (dynamically linked from `case_studies` table)
6. Relevant GJH products (dynamically linked — e.g., CMMC Assessment links to Microsoft/AWS)
7. Dual CTA section:
   - Primary: "Work with GJH on [Partner] Solutions" → lead capture form
   - Secondary: "Visit the [Partner] Portal" → tracked referral link
8. Related blog articles (Agent 1 generates partner co-marketing content)

---

#### 7.5 Partner Content Engine (Agent 1 Integration)

Agent 7 emits `partner_content_needed` events to Agent 1 when:
- A partner page has no associated blog articles (detected on first crawl)
- A partner product line has a significant search volume but no GJH content exists
- A new partner is added to the catalog

Agent 1 generates co-marketing content drafts such as:
- "How Federal Agencies Are Using Databricks for Data Modernization"
- "Snowflake vs Traditional Data Warehouse: A GovCon Perspective"
- "Implementing Salesforce Government Cloud for 8(a) Firms"
- "Make.com Automations That Save 10 Hours Per Week for Contractors"

All drafts go to the admin content queue — human approval required before publishing.

---

#### 7.6 Referral Attribution & Revenue Tracking

**Every partner portal redirect is tracked:**
- Unique referral link per partner (with UTM parameters or partner affiliate code)
- Click logged to `partner_referrals` table with visitor ID and lead ID (if known)
- Conversion tracking where partner programs allow (Snowflake, AWS, Salesforce, Shopify all have trackable partner programs)
- Admin `/admin/partners` dashboard shows:
  - Clicks per partner (weekly/monthly)
  - Conversions (where trackable)
  - Estimated referral revenue attributed
  - Lead-to-referral conversion rate

**Partner revenue streams:**
1. **Professional services** — GJH delivers implementation using partner tools (primary)
2. **Partner referral credits** — AWS, Microsoft, Snowflake, Salesforce, Shopify pay referral fees
3. **Affiliate commissions** — GoDaddy, WP Engine, Apollo, MailChimp have affiliate programs
4. **Co-sell pipeline** — Microsoft, AWS, Salesforce have formal co-sell programs where GJH can register opportunities

---

#### 7.7 Partner Knowledge Base (Agent 2 Integration)

The chatbot's knowledge base is extended with partner intelligence:

```
For each partner:
  - What the partner technology does (1-paragraph summary)
  - What GJH delivers using this technology
  - Typical client profile for this partner solution
  - Starting price range or engagement model
  - Partner portal URL
  - Key differentiator vs. alternatives
```

The chatbot can therefore answer questions like:
- *"Do you work with Snowflake?"* → "Yes — we architect and migrate data environments to Snowflake, particularly for federal agencies and data-intensive commercial clients. Would you like to tell me about your data environment?"
- *"We need a CRM — what do you recommend?"* → Qualification flow → recommend Salesforce vs. Zoho based on budget/scale → offer GJH implementation
- *"We're looking at Databricks vs Snowflake"* → "That's a common decision point we help clients navigate — can I ask about your workload type?"

---

#### 7.8 Partner Admin Dashboard (`/admin/partners`)

Full management interface for the partner ecosystem:

| Section | Contents |
|---------|----------|
| Partner Catalog | List of all 17 partners — edit name, logo, portal URL, referral URL, affiliate ID, routing mode (GJH delivery / co-sell / referral), active status, featured status |
| Referral Analytics | Clicks per partner, conversions, revenue attributed, top-performing partners |
| Intent Signal Feed | Recent partner intent detections from chatbot — visitor need, matched partner, confidence score, action taken |
| Content Status | Which partners have associated blog articles, which need content (triggers Agent 1) |
| Partner Routing Rules | Configure per-partner: delivery mode, escalation path, chatbot response template |

---

### Summary: Partner Ecosystem Revenue Model

```
Visitor arrives on gjh-inc.com
        ↓
Agent 2 (chatbot) engages — detects partner-relevant need
        ↓
Agent 7 classifies need against partner catalog
        ↓
    ┌───────────────────────────────────────────────────┐
    │  GJH delivers?     Co-sell?      Pure referral?   │
    │       ↓               ↓               ↓           │
    │  Lead capture    Lead capture    Track click      │
    │  + Proposal CTA  + Consult CTA   + Warm nurture  │
    └───────────────────────────────────────────────────┘
        ↓
Agent 3 sends partner-contextual nurture sequence
        ↓
Agent 1 maintains partner co-marketing content pipeline
        ↓
Admin dashboard tracks referral revenue per partner
```

**Every partner relationship becomes a 24/7 revenue channel — whether GJH is delivering the service, co-selling with the partner, or earning a referral commission.**

---

### Open Items — Partner Ecosystem (Needs Client Input)

| # | Item | Required From |
|---|------|--------------|
| 1 | Partner portal URLs and affiliate/referral IDs for each of the 17 partners | GJH INC to confirm which programs are active |
| 2 | GJH's certification tier with each partner (e.g., AWS Tier, Microsoft Gold/Silver) | GJH INC |
| 3 | Which partners are currently driving active client work vs. aspirational | GJH INC |
| 4 | Co-sell program enrollment with Microsoft, AWS, Salesforce | GJH INC to enroll if not already done |
| 5 | Partner contacts — named contacts at each partner for co-sell and referral coordination | GJH INC |

---

*Document consolidates: GJH-INC_Replit_Agent_Prompt.md, GJH-INC_AI_Website_PRD.docx, GJH-INC_Replit_Requirements.pdf*
*Version 1.1 adds: Partner Ecosystem Intelligence Engine (Section 15, Agent 7, 3 new database tables, partner routes, partner admin section, partner events on event bus)*
