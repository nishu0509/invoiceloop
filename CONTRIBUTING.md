# Contributing to InvoiceLoop

Thanks for your interest in contributing! Here's how to get set up.

## Local Setup

1. Clone the repo
```bash
   git clone https://github.com/nishu0509/invoiceloop.git
   cd invoiceloop
```

2. Backend setup
```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
```

3. Frontend setup (in a new terminal)
```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
```

4. Open http://localhost:5173

## Branching & Commits

- Branch off main using a descriptive name, e.g. feature/invoice-pdf-export or fix/login-cors.
- Use Conventional Commits: feat:, fix:, docs:, refactor:, chore:.
- Keep commits small and focused on one change.

## Before Opening a Pull Request

- Run the app locally and manually verify the flow you changed.
- Run lint: cd frontend && npm run lint
- Make sure no .env files or secrets are included in your diff.
- Write a clear PR description: what changed and why.

## Reporting Bugs / Requesting Features

Please open a GitHub issue with steps to reproduce (for bugs) or a clear use case (for features).