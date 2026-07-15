# Case Study — InvoiceLoop

## Problem
Freelancers juggling multiple clients often lose track of who has paid and who hasn't. Spreadsheets get
messy fast — no reminders, no single view of outstanding money, and no easy way to hand a client a clean,
professional invoice. InvoiceLoop solves this with a focused dashboard: log a client and an amount, see
your total outstanding at a glance, and export a polished PDF in one click — no more digging through
email threads or guessing what's still unpaid.

## Approach
The stack is intentionally simple: React (Vite) on the frontend, Node/Express + MongoDB on the backend,
JWT for auth. Frontend and backend are deployed separately (Vercel and Render), which was a deliberate
choice to mirror how real production apps are split — and it meant dealing with the real-world problems
that come with that split: environment-driven API URLs instead of hardcoded `localhost`, CORS
configuration between two different origins, and client-side routing (`vercel.json` rewrites) so deep
links like `/dashboard` don't 404 on a static host.

Every invoice is scoped to the logged-in user at the database level, not just hidden in the UI — the
backend checks ownership on every read and write. The dashboard covers all four states a real app needs:
loading skeletons, an empty state with a clear call to action, inline errors with retry, and the
populated table/card view (responsive down to mobile).

## Result
- **Live app:** https://invoiceloop-black.vercel.app
- **Backend:** https://invoiceloop-backend-7634.onrender.com
- **Repo:** https://github.com/nishu0509/invoiceloop

Core features shipped: email/password auth, full invoice CRUD, status toggling (Paid/Pending), search +
filter + sort, per-invoice PDF export, and a stats dashboard (total billed, outstanding, overdue,
unique clients). *(See dashboard and PDF export screenshots in the [README](README.md).)*

Next, I'd add pagination for large invoice lists, recurring invoice scheduling, and automated email
reminders for overdue invoices.

## What I Learned
The code itself was the easy part — the real learning was in **deployment**. Splitting frontend and
backend across two different platforms surfaces problems that never show up on `localhost`: a hardcoded
API URL works fine in dev and silently breaks in production; a client-side route that works with `npm run
dev` returns a 404 on a static host without a rewrite rule. Debugging those required reading actual
browser console errors and network requests rather than guessing, and fixing them properly (environment
variables, `vercel.json`, CORS) instead of patching around them. That process — ship, hit a real error,
trace it to its root cause, fix it at the source — was worth more than getting everything right the first
time would have been. it at the source — was worth more than getting everything right the first
time would have been.
