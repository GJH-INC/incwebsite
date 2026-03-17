# REPLIT AGENT 4 PROMPT — GJH-INC AI-POWERED WEBSITE PLATFORM
# Paste this directly into Replit Agent 4's Plan Mode

---

## INSTRUCTION

Build an AI-powered business development platform for gjh-inc.com. This is a government contracting and technology consulting company (GJH INC) that needs to transform from a static brochure site into an autonomous revenue-generation platform with five AI agents.

The site deploys via Cloudflare for DNS/CDN/SSL. Replit handles the application, database, authentication, and hosting. The AI layer uses Anthropic's Claude API.

**Use Plan Mode first to break this into parallel tasks before building.**

---

## TECH STACK

- **Frontend:** Next.js with React, Tailwind CSS, server-side rendering for SEO
- **Backend:** Node.js API routes
- **Database:** Replit Database or PostgreSQL — tables for: leads, blog_posts, products, orders, chatbot_conversations, agent_events, newsletter_subscribers, seo_reports
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514) for content generation, chatbot, lead analysis
- **Auth:** Replit Auth for admin dashboard protection
- **Email:** Resend or SendGrid for transactional + nurture sequences
- **Payments:** Stripe for product purchases
- **Analytics:** Plausible or PostHog (privacy-friendly)
- **Scheduling:** Cal.com embed for meeting bookings

---

## PAGES TO BUILD

### Public Pages

1. **Homepage (`/`)** — Hero section with single value proposition: "Strategic Consulting. Technology Solutions. AI-Powered Results." Primary CTA: "Request a Proposal". Secondary CTA: "Download Capability Statement". Six service cards linking to individual service pages. Social proof section with testimonials. Newsletter signup. Embedded short contact form. Chatbot widget (bottom-right corner).

2. **About (`/about`)** — Mission statement, company story, team bios section, certifications displayed as clean badges (SBA 8(a), HUBZone, etc.), technology partnerships (max 6-8 logos in grid format — include Databricks, Apollo, Anthropic, etc.), company video placeholder.

3. **Services Overview (`/services`)** — Overview page with cards linking to five dedicated service pages.

4. **Service Pages** — Each gets its own route with unique content, benefits, process overview, related case studies, and CTA:
   - `/services/government-contracting` — RFP support, bid strategy, contract management
   - `/services/web-development` — AI-optimized websites, Section 508 compliance
   - `/services/data-services` — Data engineering, Databricks/Snowflake, dashboards
   - `/services/automation` — Process automation, system integration, workflow optimization
   - `/services/genai` — AI strategy, chatbots, document intelligence, predictive analytics

5. **Products (`/products`)** — Digital storefront grid showing 5 productized offerings with pricing. Each links to detail page.

6. **Product Detail (`/products/[slug]`)** — Individual product page with full description, what's included, delivery timeline, pricing, purchase button (Stripe), and inquiry form. Products:
   - CMMC Readiness Assessment
   - AI Readiness Audit
   - Data Maturity Assessment
   - GovCon Bid Strategy Package
   - Website AI Optimization Audit

7. **Blog / Insights (`/insights`)** — Article listing with topic tag filters (Government Contracting, GSA Schedules, Cybersecurity, AI & GenAI, Data & Analytics, Web Development), search bar, pagination. Each article card shows title, excerpt, topic tag, date, read time.

8. **Blog Post (`/insights/[slug]`)** — Full article with heading hierarchy, author, date, related posts sidebar, newsletter CTA at bottom, social share buttons.

9. **Case Studies (`/case-studies`)** — Grid of 3-5 project showcases.

10. **Case Study Detail (`/case-studies/[slug]`)** — Problem → Solution → Results format with metrics.

11. **Capability Statement (`/capability-statement`)** — Interactive web version showing NAICS codes, certifications, core competencies, past performance. Downloadable PDF button.

12. **Contact (`/contact`)** — Contact form (name, email, org, message), phone number, email address, embedded map, Cal.com scheduling widget.

13. **Careers (`/careers`)** — Open positions listing.

14. **Privacy Policy (`/privacy`)** and **Terms (`/terms`)** — Standard legal pages. Contact email: info@gjh-inc.com (NOT gjhconsulting.net).

### Protected Admin Pages

15. **Admin Dashboard (`/admin`)** — Protected by Replit Auth. Sections:
   - **Overview:** KPI cards (leads this week, articles published, PageSpeed score, revenue, active conversations)
   - **Content Manager:** Draft queue with approve/edit/reject/schedule buttons. Editorial calendar. Published content analytics.
   - **Lead Pipeline:** Kanban board (New → Contacted → Qualified → Proposal → Won/Lost). Lead detail drawer with conversation history, pages viewed, contact info.
   - **SEO Health:** Broken link report. Keyword ranking chart. Core Web Vitals metrics. Competitor comparison section.
   - **Products & Orders:** Product catalog CRUD. Order list with status. Revenue chart.
   - **Chatbot Config:** Knowledge base text editor. Conversation review list. FAQ analytics (most common questions bar chart).
   - **Agent Activity Log:** Real-time feed showing all agent actions with timestamps.

---

## FIVE AI AGENTS

Build these as background services/automations that the admin dashboard controls.

### Agent 1: Content Strategist
- Scheduled task (daily or configurable) that scans for trending topics in government contracting, cybersecurity, data, and AI verticals
- Uses Claude API to generate blog post drafts with SEO metadata (title tag, meta description, OG tags, Schema.org)
- Drafts go into a queue visible in admin Content Manager — nothing publishes without human approval
- Generates LinkedIn social snippets for each approved article
- Maintains editorial calendar with suggested publish dates

### Agent 2: Prospect Engager (Chatbot)
- Chat widget component rendered on every public page
- Context-aware: knows which page the visitor is on and adjusts suggestions
- Knowledge base includes: all GJH service descriptions, NAICS codes (541511, 541512, 541519, etc.), certifications (8(a), HUBZone, etc.), capability statement content
- Lead qualification flow: asks role, organization type, needs, timeline, budget range
- Stores conversations in database with visitor metadata
- Sends email alert to admin when high-value lead detected
- Falls back to "a team member will follow up" for questions outside knowledge base

### Agent 3: Lead Nurture & CRM Bridge
- Triggered by `lead_captured` events from Agent 2 and contact forms
- Sends automated email sequences based on lead tier:
  - **Hot:** Immediate personal follow-up email + capability statement PDF + calendar link
  - **Warm:** 3-email sequence over 7 days (intro → value content → CTA)
  - **Cold:** Monthly newsletter only
- Personalizes emails based on pages viewed and chatbot conversation topics
- Pipeline dashboard in admin with Kanban view
- Generates bi-weekly newsletter digest from published blog content

### Agent 4: SEO & Performance Monitor
- Scheduled task (weekly) that:
  - Crawls all site pages checking for broken links (404s, dead anchors)
  - Checks Core Web Vitals via PageSpeed Insights API
  - Tracks target keywords against competitor (gjhconsulting.net)
  - Validates Schema.org structured data on all pages
  - Regenerates XML sitemap when pages change
- Stores reports in database, surfaced in admin SEO Health section
- Emits `content_brief_needed` event when keyword gap detected → Agent 1 picks up

### Agent 5: Product & Service Showcase
- Manages product catalog (CRUD via admin)
- Each product has: title, slug, description, what's included, delivery, price, Stripe price ID
- Product pages render dynamically from database
- Purchase flow: Stripe Checkout → order record → confirmation email
- Inquiry form for "Contact us about this" option (feeds into Agent 3)
- Links relevant case studies to products dynamically

---

## AGENT EVENT BUS

All agents communicate through a shared event system using the database:

| Event | Emitter | Subscriber(s) | Action |
|-------|---------|---------------|--------|
| `lead_captured` | Agent 2, Contact Form | Agent 3 | Trigger email sequence |
| `content_brief_needed` | Agent 4 | Agent 1 | Generate draft |
| `content_published` | Agent 1 | Agent 4, Agent 3 | Update sitemap, queue newsletter |
| `product_inquiry` | Agent 5 | Agent 3 | Follow-up sequence |
| `high_value_lead` | Agent 2 | Admin email | Notification |
| `seo_alert` | Agent 4 | Admin dashboard | Display alert |

---

## DESIGN SYSTEM

- **Brand Color:** #4338CA (indigo)
- **Dark Color:** #1E1B4B (navy)
- **Fonts:** Inter (primary), JetBrains Mono (code/technical content)
- **Style:** Glassmorphism cards (frosted glass, backdrop-blur, semi-transparent backgrounds), generous white space, gradient backgrounds (blue-50 → violet-50 → white)
- **Icons:** Lucide React icons (no emoji anywhere)
- **Images:** Professional SVG illustrations or real photos
- **CTA Buttons:** Primary = solid indigo with white text. Secondary = outlined indigo.
- **Cards:** `backdrop-blur-sm bg-white/60 rounded-2xl p-8 border border-white/20 hover:border-primary/20`
- **Mobile-first responsive**
- **Section 508 accessible** (ARIA labels, keyboard nav, color contrast ratios)
- **Logo files:** Use GJH-icon.png (40x40 favicon) and GJH-final.png (full logo) from assets directory

---

## DATABASE SCHEMA (Key Tables)

```
leads: id, name, email, organization, role, tier (hot/warm/cold), source, pages_viewed, status, created_at, updated_at
blog_posts: id, title, slug, content, excerpt, topic_tag, seo_title, seo_description, og_image, schema_data, status (draft/scheduled/published), author, published_at, created_at
products: id, title, slug, description, includes, delivery, price, stripe_price_id, related_case_studies, active
orders: id, product_id, customer_name, customer_email, stripe_session_id, status, amount, created_at
chatbot_conversations: id, visitor_id, page_url, messages (JSON), lead_id (nullable), created_at
agent_events: id, event_type, emitter_agent, payload (JSON), processed, created_at
newsletter_subscribers: id, email, source, active, created_at
seo_reports: id, report_type, data (JSON), created_at
```

---

## ENVIRONMENT VARIABLES NEEDED

```
ANTHROPIC_API_KEY=<Claude API key>
STRIPE_SECRET_KEY=<Stripe secret>
STRIPE_PUBLISHABLE_KEY=<Stripe publishable>
RESEND_API_KEY=<email service key>
ADMIN_EMAIL=info@gjh-inc.com
SITE_URL=https://gjh-inc.com
```

---

## PRIORITY ORDER FOR PARALLEL TASKS

Break this into parallel agent tasks in this order:

**Track 1 (Frontend):** Build all public pages with design system, responsive layout, SEO meta tags
**Track 2 (Backend):** Database schema, API routes, authentication, event bus
**Track 3 (Chatbot):** Agent 2 — chat widget component, Claude API integration, knowledge base, lead capture
**Track 4 (Admin):** Dashboard with all sections, content management CRUD, lead pipeline Kanban
**Track 5 (Integrations):** Stripe payments, email service, scheduling embed, analytics

After Tracks 1-5 are stable:
**Track 6 (Content Agent):** Agent 1 scheduled task, draft generation, editorial calendar
**Track 7 (SEO Agent):** Agent 4 crawler, PageSpeed integration, sitemap generation
**Track 8 (Nurture Agent):** Agent 3 email sequences, newsletter automation
**Track 9 (Products):** Agent 5 catalog, product pages, purchase flow

---

## CRITICAL NOTES

1. **Human-in-the-loop:** No AI-generated content publishes without admin approval. All drafts go to queue.
2. **Contact email:** Use info@gjh-inc.com everywhere (current terms.html incorrectly references info@gjhconsulting.net)
3. **No broken links:** Every nav item and service card must link to a real, dedicated page. The current site has multiple links pointing to `#` or `/services` — this must not happen.
4. **Performance:** Target 90+ Google PageSpeed score. Lazy load images. Optimize all assets.
5. **SEO:** Every page needs unique title tag, meta description, canonical URL, Open Graph tags. Blog posts need Schema.org Article markup.
6. **The website IS the proof of concept:** GJH sells AI consulting services. This AI-powered website demonstrates those capabilities to prospects. Build it like a showcase.
