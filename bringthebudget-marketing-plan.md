# BringTheBudget — Alpha Launch Marketing Plan

**Stage:** Alpha Testing Launch  
**Domain:** bringthebudget.com  
**Primary Audience:** Budget-conscious individuals  
**Goal:** Recruit engaged alpha testers, generate structured feedback, build waitlist for public launch

---

## Product Reality: What BringTheBudget Actually Does

Before any marketing message is written, the team needs to understand and agree on what the product is. This isn't a simple budget tracker. Based on a full codebase review, BringTheBudget is a **comprehensive personal financial management platform** built around one core idea: you should never have to manually type financial data.

### Full Feature Inventory

**Document Ingestion & AI Parsing**
Upload any financial document — bank statements, credit card statements, loan agreements, mortgage docs, medical bills, collection notices — in any format: CSV, OFX, QFX, TXT, PDF, PNG, JPEG, WebP, or GIF. Azure OpenAI (vision-capable gpt-4.1-mini) reads the document and extracts every transaction, balance, debt detail, contact, address, and payment history entry. The user reviews pre-filled forms and confirms. The AI results are client-cached so uploading the same file again skips the parse entirely.

**Camera Capture**
On mobile and modern browsers, users can take a photo of a paper statement or letter and upload it directly. The vision model reads handwritten or printed documents.

**Plaid Bank Linking**
Users can connect their live bank accounts via Plaid (web and native implementations). Transactions sync in, accounts are created, and the integration uses a step-up re-authentication flow for high-security operations.

**Net Worth Dashboard**
Real-time calculation of: total assets, credit/loan liabilities, tracked debt total, and net worth. Includes a financial health score (Stable / Watch / Tight) based on cash-flow margin and debt pressure ratio, six-month income vs. expense trend bar chart, and top spending categories with visual breakdowns.

**Transaction Management**
130+ default spending categories (from Groceries to Business Travel to Therapy/Mental Health), full search and filter, per-transaction merchant detection, debit/credit type classification, and per-category spending totals.

**Custom Categories**
Users can create custom categories with a name, color, icon, and emoji — and mark them as income or expense categories.

**Budget Builder**
Create weekly, monthly, or yearly budgets with per-category spending limits. View live actuals vs. limits for any active budget. The recurring budget summary cross-references your recurring items against budget lines so you can see how much of your budget is already pre-committed before you spend anything.

**Recurring Items**
Track bills, subscriptions, loans, and any recurring expense or income — manually or auto-detected from transaction history. Cadences: weekly, biweekly, monthly, quarterly, yearly. Includes next due date, auto-pay flag, and payee. Auto-detection scans transactions and identifies patterns using merchant normalization (strips noise words, recognizes known services like Netflix, Spotify, Adobe, GitHub, Zoom, etc.).

**Debt Tracker**
Track any debt: credit card, personal loan, student loan, auto loan, mortgage, medical debt, or collections. For each debt: creditor name, collector name, account last 4, APR, minimum payment, due day of month, original amount, current balance, estimated payoff date. Full payment history (payment, charge, interest, fee, credit, other entries). Document history (every statement or notice that touched that debt). Avalanche and snowball payoff planning.

**Smart Account Matching & Deduplication**
When a new document is uploaded, the system scores potential account matches using last 4 digits (50%), account name (35%), institution, and type. Newer documents update balances, APRs, and minimums. Older documents contribute contact info and history without overwriting current balances. Manual override is always available. One-click auto-dedupe for accounts created from duplicate uploads.

**Document Vault**
Every uploaded document is stored in Azure Blob Storage. Each account and debt maintains a full document timeline — when each statement was uploaded, what it contained, what changed. Documents can be downloaded, previewed, and audited.

**Audit Trail**
Every user action is logged with a timestamp. Users can review their full audit history. This creates a complete record of what changed, when, and from which document.

**AI Usage Transparency**
Every LLM call is logged: provider, model, purpose, prompt tokens, completion tokens, duration, estimated cost in USD. Users see a usage dashboard showing total spend, cost by purpose (statement parsing, debt parsing, etc.), and a full recent call log. This is a feature no consumer finance app offers.

**Privacy Architecture**
Microsoft Entra External ID sign-in via a backend-for-frontend (BFF) flow — no credentials stored client-side. Server-side sessions in Azure SQL with encrypted HttpOnly cookies. No plaintext bank credentials. RBAC permission layer. PII protection built into the data layer.

**Cross-Platform**
Expo + React Native Web — works on iOS, Android, and all modern browsers from a single codebase.

---

## Positioning

### The One-Sentence Pitch
BringTheBudget is the personal finance app that does the data entry for you — upload any financial document, and your accounts, transactions, debts, and budgets update automatically.

### What Makes It Different

| Competitor Approach | BringTheBudget Approach |
|---|---|
| Scrape bank credentials via Plaid (required) | Plaid available *and* credential-free document upload |
| Manual transaction entry or sync only | AI extracts from photos, PDFs, CSVs, OFX |
| Generic budget categories | 130+ categories + full customization |
| Basic debt listing | Full debt profiles: APR, minimums, contacts, collectors, payment history, document history |
| No document storage | Every statement stored and auditable |
| Black-box AI | Token-by-token cost visibility |
| No audit history | Every action logged and reviewable |

### Brand Voice
Direct. Honest. Zero fluff. The app was built by developers who were annoyed by financial data entry — that authenticity should come through in every message.

### Tagline Options
- *"Your finances, without the typing."*
- *"Drop in a statement. We'll read it."*
- *"Stop entering data. Start understanding it."*

---

## Alpha Goals (First 60 Days)

| Goal | Target | Measurement |
|---|---|---|
| Recruit engaged alpha testers | 50–150 users | Signups with verified logins |
| Stress-test AI parsing across document types | 500+ document uploads | API usage dashboard |
| Identify top 5 friction points | From structured feedback | Survey + in-app feedback |
| Validate messaging resonance | 3+ messages tested | Landing page A/B |
| Build waitlist for public launch | 500 emails | Email platform subscriber count |
| Surface 2–3 power users for case studies | 2–3 identified | Personal outreach |

Alpha is **not** about volume. It is about finding the people who will push every feature, report every bug, and tell you exactly what needs to change before a broader launch. Every action below is optimized for quality over scale.

---

## Channel Strategy

---

### Channel 1: Direct Personal Outreach (Week 1 — Do This First)

**Why first:** The first alpha users should be people who already trust you. Cold strangers won't give you the honest, detailed feedback you need. Warm contacts will.

**Who to contact:**
- Friends and family who have mentioned money stress, debt, or financial chaos in the past year
- Former colleagues in finance, accounting, or tech
- Anyone who has ever complained about Mint shutting down, YNAB's price, or spreadsheet maintenance
- LinkedIn connections who work in personal finance, fintech, or HR (benefits)

**How to do it — step by step:**

1. Write a personal message, not a marketing blast. Example DM/text:
   > *"Hey [Name] — I've been building a personal finance app that uses AI to read your bank statements and credit card bills so you don't have to type anything. It handles budgets, debt tracking, net worth — the whole picture. I'm opening alpha access to a small group and thought of you. Want to try it? I'd honestly love brutal feedback. Here's the link: [URL]"*

2. Send to no more than 5–10 people at a time so you can respond to each one personally.

3. Follow up in 5 days if no response — one follow-up only.

4. When someone signs up, send a personal thank-you and ask: "What's the first thing you tried to do?" — this is your first UX data point.

5. Keep a simple spreadsheet: Name | Invited | Signed Up | Feedback Given | Status

**Target:** 20–30 invites → 10–15 active alpha testers from personal network in week 1.

---

### Channel 2: Targeted Reddit Seeding

**Why:** r/personalfinance has 18M+ members. r/povertyfinance, r/frugal, r/debtfree, and r/YNAB are filled with exactly your target user — people who care deeply about financial tools, have opinions, and will give you honest feedback. They hate spam but love genuine tools.

**Important rules before you start:**
- Never post promotional content on a fresh account — accounts get shadowbanned instantly
- Read each subreddit's rules before posting anything. r/personalfinance prohibits self-promotion in most forms; r/povertyfinance is more open to tool sharing if framed correctly
- Always lead with value

**Step-by-step setup:**

1. **Create a Reddit account** if you don't have one. Use a real-seeming username, not your company name.

2. **Spend 1–2 weeks building karma before any app mentions.** Post genuinely helpful comments on posts about budgeting questions, debt questions, tools people are using. Answer questions with real substance.

3. **Identify the right posts to engage on.** Search these terms weekly:
   - "mint alternative"
   - "best budgeting app"
   - "how to track expenses"
   - "OFX import"
   - "debt payoff tracker"
   - "statement import"
   - "YNAB alternative"

4. **Engage authentically.** When someone asks "what do you use for budgeting?" — answer with your real experience, and mention the app naturally at the end: *"I've actually been building something specifically for this — happy to share if you want to try it."*

5. **Post a "Show HN / Show Reddit" style post** after 2 weeks of karma-building. Best subreddits for this, in order:
   - r/sideprojects — most welcoming to builders
   - r/povertyfinance — very receptive to free tools that solve real problems
   - r/frugal
   - r/debtfree
   - r/personalfinance (read rules — frame as "I built this and need testers")

   Sample post title: *"I built a budgeting app that uses AI to read your statements so you never have to type transactions — looking for alpha testers who want to break it"*

   Sample post body:
   > *A bit of background: I got fed up maintaining a spreadsheet of transactions every month. So I built something that lets you drop in a CSV, OFX, or photo of a statement, and it extracts everything automatically — accounts, transactions, debts, balances, even creditor contact info from collection notices.*
   >
   > *It also tracks net worth, budgets with live actuals, recurring bills (with auto-detection), and debt payoff planning. There's a document vault so every statement is stored and auditable.*
   >
   > *I'm opening alpha access to a small group of people who actually care about this stuff and are willing to give real feedback. Not looking for cheerleaders — I want to know what's broken.*
   >
   > *Link: [URL] | Free during alpha*
   >
   > *Happy to answer any questions.*

6. **Respond to every single comment** — especially the skeptical ones. This builds trust and keeps the thread active.

---

### Channel 3: Hacker News — "Show HN"

**Why:** HN has a high concentration of technically literate, privacy-conscious, financially aware users who will stress-test edge cases and give structured feedback. The AI transparency feature (token-by-token cost logging) will particularly resonate here.

**How to post a Show HN:**

1. Go to [news.ycombinator.com/submit](https://news.ycombinator.com/submit)

2. Title format (strictly enforced by HN culture): `Show HN: BringTheBudget – AI reads your financial statements so you don't have to`

3. The URL should point to your landing page or the app itself.

4. In the comments (your first comment), write a genuine founder note:
   > *"I built this because Mint shut down and I couldn't find anything that would import OFX files from my credit union without also wanting my bank login. BringTheBudget reads CSVs, OFX/QFX, PDFs, and photos using Azure OpenAI — you upload the document, review the pre-filled transactions, and it posts to your accounts.*
   >
   > *Other things it handles: full debt profiles (APR, minimums, payment history, collector contacts), budget vs. actuals, recurring item detection, net worth tracking, and — this part is unusual — every LLM call is logged with its token count and estimated cost so you can see exactly what running it costs.*
   >
   > *Would love feedback, especially from anyone who has weird bank statement formats."*

5. **Best time to post:** Tuesday–Thursday between 8am–10am Eastern. This maximizes HN front-page time.

6. Monitor the comments and respond within the first hour — HN threads move fast, and early engagement keeps the post visible.

7. **What HN users will ask about:** Privacy architecture (have your Microsoft Entra BFF explanation ready), data storage (Azure SQL + Blob), whether AI parsing can be wrong (yes, that's why there's a review step), and cost (explain the token transparency feature).

---

### Channel 4: Niche Finance Communities & Discord Servers

**Why:** These communities are smaller than Reddit but more focused, and their members are more likely to become power users who evangelize to others.

**Communities to join and engage:**

1. **r/YNAB Discord** — YNAB users who want alternatives or are frustrated with its limitations. Many will have tried OFX imports before.

2. **r/debtfree community** — People actively paying off debt will find the avalanche/snowball planner, debt document history, and collector contact tracking immediately valuable.

3. **Personal Finance Discord servers** — Search Discord for "personal finance" — there are several servers with 10K+ members. Join them, be genuinely helpful, and after a few days of participation, share that you're looking for alpha testers.

4. **Fintech Slack communities** — "Fintech Devs," "Money 20/20 Community," and similar spaces have members who evaluate tools professionally.

**How to engage in these spaces:**

- Spend at least 3–5 days being a normal community member before mentioning your app
- Answer questions about budgeting strategies, debt payoff math, and tool comparisons
- When you do share the app, always give people a reason to believe it's different: *"It's the only app I know of that stores and audits every statement you upload and logs every AI call with its cost"*
- Never post the same message in multiple places at once — communities notice

---

### Channel 5: Landing Page & Waitlist Optimization

**Why:** The landing page is the one asset that works 24/7. During alpha, it serves two purposes: recruiting testers from invited traffic and capturing waitlist signups from anyone else who arrives.

**Step-by-step landing page setup:**

1. **Audit the current landing page** against the full feature list above. The hero section should answer: What does it do? Who is it for? What's different? Make sure the AI receipt/statement scanning feature is demonstrated (screenshot or GIF) above the fold.

2. **Add a waitlist form** for visitors who don't get an alpha invite. Use a simple email field: *"Alpha is invite-only right now. Join the waitlist for early access →"* Tool: Beehiiv, ConvertKit, or even a plain Tally form connected to a spreadsheet.

3. **Feature the AI transparency angle prominently.** This is unusual and earns trust: *"Every AI call is logged with its token count and estimated cost — you always know what the tool costs to run."*

4. **Add a "No bank login required" callout.** This is a real differentiator against Plaid-only apps. People are increasingly uncomfortable with credential-sharing apps. Put this front and center.

5. **Add social proof as fast as possible.** As alpha testers give feedback, ask if you can quote them (even anonymously, e.g., *"'I uploaded a 3-year-old collection notice and it pulled out the collector's phone number and address automatically.' — Alpha tester"*).

6. **Set up a meta pixel and Google Analytics 4** before you drive any traffic. You need to know where visitors are coming from and where they drop off.

   **How to set up GA4:**
   - Go to analytics.google.com → Create Property
   - Add the GA4 tag to your React Native Web app's HTML head (use expo's app.json web config or a custom HTML template)
   - Set up a "Conversion" event for signups

7. **A/B test your headline.** After you have 200+ visitors, test two versions of the hero headline using a tool like Google Optimize or a simple manual swap every 2 weeks. Candidates:
   - "Upload a statement. Get your finances." (action-focused)
   - "Your finances, without the typing." (pain-focused)
   - "The AI that reads your bank statements." (tech-forward)

---

### Channel 6: Twitter / X (Developer & Finance Audience)

**Why:** Twitter/X has a strong "build in public" community where founder transparency drives genuine followership. Finance Twitter ("FinTwit") has an engaged audience. The combination of "I built this" authenticity and personal finance content works well here.

**Account setup:**

1. Create (or repurpose) a Twitter/X account for BringTheBudget — or post from a personal founder account, which often performs better.

2. Pin a tweet that describes exactly what the app does in plain language:
   > *"Built @BringTheBudget — upload a bank statement (CSV, OFX, photo), and AI extracts every transaction, account balance, and debt detail. No typing. Net worth dashboard, budgets, debt payoff planner, document vault. Alpha access open now: [URL]"*

**Content cadence (3–4 posts/week):**

Rotate across these content types:

- **Build-in-public updates:** *"Just shipped recurring auto-detection — it scans your transaction history and identifies bills, subscriptions, and loans by merchant pattern. Netflix, Spotify, Adobe — it already knows them."*

- **Feature reveals with screenshots:** Post a screenshot of the net worth dashboard, the debt document timeline, or the AI usage cost tracker. Caption it with what you're looking at and why it matters.

- **Engaging questions:** *"If you've ever uploaded a bank statement to a budgeting app, what was the most painful part of the experience? Trying to make this as smooth as possible."*

- **Short data stories:** *"Wild thing about building this: the median bank statement has ~40 fields of useful data — account number, balances, every transaction with merchant and amount. Most apps make you enter that manually. We don't."*

- **Alpha tester milestones:** *"Alpha tester #23 just uploaded their first collection notice and the AI pulled the collector's phone, address, and account number correctly on the first try. Wild to see it work in the real world."*

**How to grow faster on Twitter/X:**

- Reply to tweets from fintech journalists, personal finance creators, and app reviewers with substantive, thoughtful takes — not promotional comments
- Follow and engage with accounts in: #buildinpublic, #indiedev, #fintech, #personalfinance
- Tag relevant accounts when posting features they might find interesting (e.g., fintech journalists who cover alternative tools to Mint)

---

### Channel 7: LinkedIn (Professional Angle)

**Why:** LinkedIn is underutilized for consumer finance apps, but it's where HR professionals, financial advisors, and technically literate adults are active. The employer financial wellness angle is a legitimate B2B2C channel.

**Content approach:**

Post 2x/week. Tone is more professional than Twitter but still founder-authentic.

- **Founder story post:** Write a 200-word post about why you built BringTheBudget. Be specific — what moment made you start? What spreadsheet did you finally give up on?

- **Feature explainers:** *"Most budgeting apps ask you to connect your bank. BringTheBudget lets you upload a statement instead — a CSV, OFX file, or photo. Here's why that matters for privacy: [short explanation of the BFF auth model and no-credential-sharing]"*

- **Process transparency:** *"Here's what happens when you upload a PDF bank statement to BringTheBudget: [numbered list of what the AI extracts]. The whole thing takes about 8 seconds."*

**LinkedIn-specific outreach for alpha users:**

Search LinkedIn for people with titles like "Personal Financial Specialist," "Budget Analyst," "Financial Counselor," or job descriptions mentioning "expense tracking" or "debt management." Send a personalized connection request followed by a short message:

> *"Hey [Name] — I'm building a personal finance app that uses AI to read financial statements (bank statements, credit card bills, collection notices) and extract all the data automatically. I'm looking for alpha testers with real financial management experience who'd be willing to try it and give honest feedback. No charge, and your input would genuinely shape the product. Interested?"*

**Target:** 30–50 LinkedIn outreach messages → 5–10 responses → 3–5 engaged testers with professional financial backgrounds.

---

### Channel 8: TikTok / Instagram Reels (Alpha Awareness)

**Why:** Personal finance content ("FinTok") is one of the highest-engagement categories on TikTok. You don't need scale yet — you need to start building the account and testing what resonates so you have a real channel when the public launch comes.

**Account setup:**

1. Create a TikTok and Instagram account for BringTheBudget. Use the same handle across platforms.
2. In the bio: "AI reads your bank statements so you don't have to | Alpha now open | bringthebudget.com"
3. Link in bio: use Linktree or Beacons to link to both the app and the waitlist.

**Content pillars for alpha phase:**

- **App demo clips (30–60 seconds):** Screen-record the document upload flow. Show: tap "Upload," pick a CSV, watch the AI parse it, review the transactions, hit confirm. Add text overlay: *"Uploaded my bank statement. Didn't type a single thing."* This is your highest-converting content type.

- **"Did you know your statement has this data" clips:** Pick one piece of data the AI extracts (e.g., collector contact info from a collection notice) and explain why it matters. Title: *"I uploaded a debt collection letter and the app found the phone number, address, and account number automatically"*

- **Reaction/commentary videos:** React to common financial frustrations — "spending hours categorizing transactions," "can't find a Mint alternative," "my credit union's OFX file won't import anywhere." End each one with: *"We built something for this."*

- **Build-in-public clips:** *"Here's what we shipped this week: [feature]. Here's why we built it: [one-sentence explanation]."*

**Posting cadence:** 3x/week on TikTok. Cross-post all videos to Instagram Reels and YouTube Shorts with no editing required. Consistency matters more than production quality at this stage.

**Filming setup:** iPhone, good natural light or a $30 ring light. CapCut (free) for editing. Screen recordings can be done with your phone's built-in screen recorder.

---

### Channel 9: Email List (Start Now, Use Forever)

**Why:** Email is the highest-ROI channel at every stage. Start building it on day one even if you have zero subscribers, because the list you build during alpha becomes your launch audience.

**Platform setup — step by step:**

1. Go to [beehiiv.com](https://beehiiv.com) and create a free account (free up to 2,500 subscribers).

2. Choose a newsletter name: *"BringTheBudget Updates"* or *"The Budget Brief"* (a broader personal finance newsletter you can grow independently of the app).

3. Configure your signup form. Fields to collect: Email (required), Name (optional), "What's your biggest financial headache right now?" (optional, freeform — gold for messaging research).

4. Embed the form on:
   - The landing page (hero section below the CTA)
   - A dedicated `/waitlist` page
   - The app's onboarding (prompt users to subscribe for tips and updates)

5. Create your **3-email welcome sequence:**

   **Email 1 (sent immediately on signup):**
   Subject: *"Welcome to BringTheBudget alpha"*
   Content: Who you are, what the app does in 3 bullet points, how to access it, and one specific thing you want them to try first (e.g., "Upload any bank statement — CSV, OFX, or a photo — and tell us what happens").

   **Email 2 (sent on Day 3):**
   Subject: *"The feature most people don't expect"*
   Content: Highlight the debt document feature — most people expect transaction tracking, not full debt profiles with collector contacts and payment history pulled from a document. Show a screenshot. End with: "Have you tried this yet? Reply and tell us what you uploaded."

   **Email 3 (sent on Day 7):**
   Subject: *"Quick question"*
   Content: Three questions, plaintext, no formatting:
   - What did you try first?
   - What did you expect to work that didn't?
   - What's the one thing that would make you use this every week?

6. Send a **biweekly update** to the full list covering: what shipped, what's coming, one alpha tester story (anonymized if needed), and one personal finance tip.

---

### Channel 10: BetaList, Product Hunt Upcoming, and App Directories

**Why:** These platforms have built-in audiences of early adopters who specifically seek out new apps to try. They're free and generate a steady stream of signups during alpha/beta.

**BetaList — do this in Week 1:**

1. Go to [betalist.com/startups/new](https://betalist.com/startups/new)
2. Fill in:
   - Product name: BringTheBudget
   - Tagline (50 chars): *"AI reads your statements. No typing required."*
   - Description: Cover the key features — document ingestion, AI parsing, debt tracking, net worth dashboard
   - Screenshot: Use the dashboard or upload screen
   - Website: bringthebudget.com
3. BetaList sends your app to their newsletter of ~30K startup enthusiasts. Expect 50–200 signups from this single submission.
4. Check your BetaList listing daily for the first week and respond to every comment.

**Product Hunt "Upcoming" Page — do this in Week 2:**

This is separate from a full Product Hunt launch (which you'll do at public launch). The "Upcoming" page lets you collect followers before launch day, which boosts your eventual launch ranking.

1. Go to [producthunt.com/posts/new](https://producthunt.com/posts/new)
2. Select "Upcoming" (not "Post")
3. Add: product name, tagline, short description, a cover image (1270x760px works well)
4. Share the upcoming page link in every channel above — ask people to follow it
5. Product Hunt emails your followers on launch day, so every follower now = a guaranteed notification later

**Other directories to submit to (all free, takes 30 min total):**

- **AlternativeTo.net:** Add BringTheBudget as an alternative to: Mint, YNAB, Personal Capital, Quicken. This drives passive discovery from people actively searching for alternatives.
  - Go to alternativeto.net → Add App → fill in details
  - Then add it as an alternative on the Mint page: alternativeto.net/software/mint — click "Suggest Alternative"

- **Startupbase.io:** Simple directory submission. Takes 5 minutes.

- **Crunchbase:** Create a free company profile. Adds legitimacy when journalists or potential partners look you up.

- **G2:** Free listing. Finance software category. Even with zero reviews, being listed means you appear in "vs" search results.

---

## Alpha Tester Experience

The quality of your alpha depends entirely on what happens *after* someone signs up. A poorly onboarded alpha tester gives you nothing. A well-guided one gives you everything.

### The Alpha Onboarding Flow

**Day 0 — Invite acceptance:**
Send a personal email (not automated) within 24 hours of signup:
> *"You're in. Here's the link: [URL]. To get started, try uploading any bank or credit card statement — we accept CSV, OFX, PDF, or a photo. The AI will extract everything and show you a review screen before anything gets saved. Reply to this email with what you try first — I read every reply."*

**Day 2 — Check-in:**
Short email: *"Quick check — did you get a chance to upload anything? If you hit any issues, just reply. If it worked perfectly, I want to know that too."*

**Day 7 — Structured feedback request:**
Send them to a Tally or Typeform survey (3–5 minutes max):
1. What did you upload first? (Bank statement / Credit card statement / Debt document / Loan statement / Other)
2. Did the AI parse it correctly? (Yes, completely / Mostly yes / Partially / No)
3. What was confusing or broken? (Freeform)
4. Which feature surprised you most? (Freeform)
5. What would make you use this every week? (Freeform)
6. On a scale of 1–10, how likely are you to recommend this to a friend who manages their own finances?

**Day 14 — Feature prompt:**
Email: *"Have you tried [specific feature they likely haven't used yet — e.g., the recurring auto-detection or the net worth dashboard]? Here's how it works: [1-paragraph explanation]. Let me know what you think."*

**Day 30 — Debrief:**
Schedule a 20-minute video call with your top 5–10 alpha testers. Ask open-ended questions. Record with permission. These calls are worth more than 100 survey responses.

### Alpha Feedback Infrastructure

Set up these systems before the first tester signs up:

1. **In-app feedback button:** Add a persistent "Give feedback" button somewhere visible in the app. Link it to a Tally form with two fields: "What were you trying to do?" and "What happened?" Plus a 1–5 star rating. Every submission goes to your email.

2. **Discord server:** Create a "BringTheBudget Alpha" Discord.
   - Channels: `#general`, `#bugs`, `#feature-requests`, `#wins` (share when the AI nails a tricky document), `#random`
   - Invite every alpha tester with a personal note
   - Show up daily. Respond to everything for the first 4 weeks. Early users who feel heard become loyal advocates.

3. **Public roadmap:** Set up a free [Canny.io](https://canny.io) board. Post your top 10 planned features and let users upvote and add their own. Link to it from the app's Settings screen and from your Discord.

4. **Bug tracking:** Use GitHub Issues (you already have GitHub CI/CD) or a shared Notion board. When an alpha tester reports a bug in Discord, log it immediately in your tracking system and post the issue number back to them: *"Logged as #47. Will look at this week."* This builds trust that you're actually acting on feedback.

---

## Specific Messaging by Feature (Use in All Channels)

These are the hooks — the specific angles that will make someone stop scrolling and pay attention. Use them as social post hooks, email subject lines, and talking points.

**For document parsing:**
*"You know how banks let you download your statement as a CSV or OFX file? Most people have no idea what to do with it. We do."*

**For camera capture:**
*"You can literally take a photo of a paper statement — like a bill your landlord slipped under your door — and the AI will read it."*

**For debt documents:**
*"Upload a collection letter and we'll extract the collector's name, phone number, address, account number, current balance, and payment history. Nothing stays locked in the PDF."*

**For AI cost transparency:**
*"Every AI call is logged: model used, tokens in, tokens out, duration, estimated cost. Most apps hide this. We surface it."*

**For the no-bank-login option:**
*"You never have to hand over your bank username and password. Upload a statement file instead. Your credentials stay with you."*

**For net worth:**
*"One dashboard: every account balance, every loan, every debt you're tracking. Your real net worth, updated every time you upload a new statement."*

**For recurring detection:**
*"It scans your transaction history and finds your bills and subscriptions automatically — Netflix, Spotify, Adobe, your gym, your ISP. Then shows you how much of your income is pre-committed before you spend a dollar."*

**For the audit trail:**
*"Every action logged. Every document timestamped. If something looks wrong in six months, you can trace exactly where it came from."*

---

## Paid Acquisition — Do Not Start Yet

During alpha, paid ads waste money. Your conversion data isn't validated, your messaging isn't tested, and the product may still have rough edges that would burn the traffic. Set a rule: no paid spend until:
- ✅ 50+ active alpha users
- ✅ 10+ written testimonials
- ✅ Signup → active user rate above 40%
- ✅ AI parsing success rate validated on at least 100 documents across multiple formats

Once those conditions are met, the highest-ROI paid channels for this app will be:

**Google Search Ads** — Target high-intent queries: "mint alternative," "YNAB alternative," "best budgeting app," "import OFX statement," "debt tracker app." These users are already looking for something.
- Starting budget: $15–$20/day
- Send to a dedicated landing page (not the homepage) that matches the keyword intent

**Reddit Ads** — Highly targeted to r/personalfinance, r/YNAB, r/povertyfinance. Reddit ads are cheap and the audience is perfect.
- Starting budget: $10/day
- Format: Promoted post (looks like an organic post)
- Creative: A feature-focused screenshot with a short honest caption

**Meta (Facebook/Instagram)** — Less intent-based, but useful for retargeting. Set up your Meta pixel on the landing page now so you're building a retargeting audience from day one (even if you don't run ads yet).

---

## Competitive Intelligence & Positioning

Know who you're up against and how to position against each:

**vs. Mint (shut down):**
*"Mint is gone. BringTheBudget imports the same OFX and CSV files Mint used — no bank login required, no scraping."*

**vs. YNAB:**
*"YNAB is $109/year and requires you to manually categorize everything. BringTheBudget reads your statement and categorizes automatically. You review, not type."*

**vs. Personal Capital / Empower:**
*"Empower only works if you link your accounts. BringTheBudget also accepts uploaded documents — useful if your bank doesn't support direct linking or if you don't want to share credentials."*

**vs. Copilot:**
*"Copilot is Apple-only. BringTheBudget works on iOS, Android, and web."*

**vs. Spreadsheets:**
*"We're not replacing your spreadsheet with another spreadsheet. We're replacing it with an app that reads your documents and fills in the numbers itself."*

---

## 60-Day Alpha Action Calendar

### Week 1
- [ ] Set up email platform (Beehiiv) with welcome sequence
- [ ] Submit to BetaList
- [ ] Add in-app feedback button
- [ ] Create Discord server for alpha community
- [ ] Send personal invites to 20–30 warm contacts
- [ ] Create Product Hunt "Upcoming" page
- [ ] Set up GA4 on landing page
- [ ] Set up Meta pixel on landing page (even if no ads yet)

### Week 2
- [ ] Create Reddit account; begin organic participation
- [ ] Create TikTok and Instagram accounts; post first 3 videos
- [ ] Submit to AlternativeTo (add as Mint/YNAB alternative)
- [ ] Submit to Startupbase and Crunchbase
- [ ] Begin LinkedIn founder content (2 posts)
- [ ] Send Day 7 structured survey to first wave of alpha testers
- [ ] Log all feedback into bug tracker and roadmap

### Week 3
- [ ] Post Show HN on Hacker News (Tuesday or Wednesday, 8–10am ET)
- [ ] Post Show Reddit on r/sideprojects
- [ ] Send first biweekly email to list
- [ ] Respond to all HN and Reddit comments personally
- [ ] Schedule first debrief calls with top alpha testers

### Week 4
- [ ] Continue TikTok content (3x/week)
- [ ] Continue Reddit organic engagement
- [ ] Post Show Reddit on r/povertyfinance or r/frugal (different angle than week 3)
- [ ] Set up Canny.io public roadmap
- [ ] Add roadmap link to app settings and Discord
- [ ] Review all alpha feedback; identify top 3 friction points

### Week 5–6
- [ ] Send personal outreach to 30–50 LinkedIn targets
- [ ] Engage in 2–3 Discord finance communities
- [ ] Conduct 5+ alpha tester video debrief calls
- [ ] Publish first alpha summary post (blog or LinkedIn): "Here's what we learned from our first 30 days of alpha"
- [ ] A/B test landing page headline

### Week 7–8
- [ ] Review GA4 data: which channels are converting?
- [ ] Double down on top 2 channels; reduce time on bottom 2
- [ ] Begin collecting testimonials from satisfied alpha testers
- [ ] Add testimonials to landing page
- [ ] Evaluate readiness for broader beta launch
- [ ] Begin planning Product Hunt full launch (assign hunter, prepare assets)

---

## Tools Stack

| Purpose | Tool | Cost | Setup Time |
|---|---|---|---|
| Email / waitlist | Beehiiv | Free to 2,500 subs | 30 min |
| Community | Discord | Free | 20 min |
| Roadmap | Canny.io | Free tier | 15 min |
| In-app feedback forms | Tally | Free | 10 min |
| Video editing | CapCut | Free | 0 (install only) |
| Web analytics | Google Analytics 4 | Free | 45 min |
| Advertising pixel | Meta Pixel | Free | 30 min |
| App directories | BetaList, AlternativeTo, G2 | Free | 1 hour total |
| UTM tracking | Google Campaign URL Builder | Free | 5 min per link |
| Social scheduling | Buffer | Free (3 channels) | 20 min |
| Competitive research | SEMrush / Ahrefs free tiers | Free | As needed |
| Screen recording | Built-in iOS/Android or Loom | Free | 0 |

---

## Alpha Success Metrics — Review Weekly

| Metric | Week 2 Target | Week 4 Target | Week 8 Target |
|---|---|---|---|
| Alpha users signed up | 15 | 40 | 100 |
| Documents uploaded | 30 | 150 | 500 |
| Email waitlist size | 50 | 150 | 400 |
| Survey response rate | — | >60% | >50% |
| Discord members | 10 | 30 | 75 |
| Social followers (combined) | 50 | 150 | 350 |
| NPS (from Day 7 survey) | — | Baseline | >40 |
| AI parse success rate | Tracking only | >80% | >90% |
| Feedback items logged | 10 | 40 | 100 |

---

## The One Non-Negotiable

Every channel, every message, every feature reveal — lead with the same thing: **you never have to type your financial data manually again.**

Everything else in the app (net worth, debt tracking, recurring detection, audit trail) is downstream of that single promise. When that promise lands with someone who has spent hours entering transactions into a spreadsheet, nothing else needs to be said.

Make that moment real with a demo. Record it. Show it in every video, every post, every pitch. The fastest path from viewer to alpha tester is 30 seconds of watching the AI read a statement.
