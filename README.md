# Spendlane site

Spendlane automates expense reports for small and mid-sized companies. This repository holds its marketing site (a savings calculator and a demo form) and, under `server/`, a small expense repository with its tests.

## Run it

You need Node 24.

```bash
npm ci
npm run dev
```

For local settings, copy `.env.example` to `.env.local`, which Git ignores, and fill in the values for your laptop.

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the site on a local address |
| `npm run lint` | Checks the code with ESLint |
| `npm run typecheck` | Checks the types of the site and of `server/` |
| `npm test` | Runs the unit tests of the site |
| `npm run test:server` | Runs the expense repository tests against `DATABASE_URL` |
| `npm run build` | Builds the site into `dist` |
| `npm run ai -- <instructions> <input>` | Sends a file of instructions and one or more input files to the model, and prints its answer |

## Environment variables

| Name | Production | Preview | Development |
| --- | --- | --- | --- |
| `VITE_APP_ENV` | `production` | `preview` | `development` |
| `VITE_SALES_CALENDAR_URL` | The real sales calendar | A test calendar | Empty |
| `DATABASE_URL` | Not used by the site | Not used by the site | A local Postgres, for `npm run test:server` |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | Not used by the site | Not used by the site | Your model key, for `npm run ai`; never prefixed with `VITE_` |

## User stories

### Savings calculator

As a finance manager, I want to see how much time Spendlane would save my company, so that I can decide whether to book a demo.

- The calculator accepts 1 to 5,000 employees and 1 to 30 expense reports per employee per month, as whole numbers.
- It shows the hours saved per month. A report takes 12 minutes by hand and 2 minutes with Spendlane, so each report saves 10 minutes. The result is rounded to one decimal: 50 employees with 4 reports each save 33.3 hours.
- Outside those ranges, or with an empty field, it shows "Enter 1 to 5000 employees and 1 to 30 reports per employee."

### Demo form

As a finance manager, I want to book a demo, so that the sales team contacts me with a demo that fits my company.

- Full name, work email and company size are required. Each error shows next to its field.
- A full name has 2 characters or more. Otherwise: "Enter your full name."
- A work email looks like `name@domain.tld`. Otherwise: "Enter a valid work email."
- The company size is one of 1 to 10, 11 to 50, 51 to 250, or more than 250 employees. Otherwise: "Choose your company size."
- On success, the page shows "Thank you" and "Our team will contact you within one business day." When `VITE_SALES_CALENDAR_URL` is set, it also offers a link to the sales calendar.

### Phone layout

As a visitor on a phone, I want to use the site without zooming or scrolling sideways.

- At 375 pixels wide, the home page and `/demo` never scroll sideways.
- Every field and button can be reached and used.
