# RentFlow — Equipment Rental SaaS Demo

A polished, responsive front-end prototype for demonstrating an equipment rental management SaaS to prospective rental businesses.

## What is included

- Overview dashboard with revenue, utilization, and booking snapshots
- Equipment inventory with search, category/status filters, add/edit/remove, and CSV export
- Booking management with booking creation, date/quantity pricing calculation, status changes, and invoice creation
- Customer directory with add-customer workflow and CSV export
- Rental calendar with booking dates and status markers
- Maintenance task list with task creation and status updates
- Invoice list with demo payment-state updates and CSV export
- Reports and analytics screens
- Customer-facing public storefront preview with equipment catalog and quote-request form
- Business settings and sample-data reset
- Browser localStorage persistence so demo changes remain after refresh

## Run locally

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

For a production build of this front-end demo:

```bash
npm run build
npm run preview
```

### Deploy to GitHub Pages

This repository deploys to `https://azhan787.github.io/RentFlow-Demo/`. Vite is configured with the `/RentFlow-Demo/` base path so production JavaScript and CSS assets are loaded from the repository subpath.

The GitHub Actions workflow builds the app and deploys only the generated `dist/` directory. In the repository's **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**. Then push to `main` or run **Deploy RentFlow to GitHub Pages** from the Actions tab. Do not select branch-root deployment, which serves the source `index.html` and causes `/src/main.jsx` to 404.

The app's screens use in-page state rather than URL routes, so no client-side route rewrite is needed.

The HTML supplies a restrictive CSP: scripts are self-hosted and `unsafe-eval` is not allowed. Inline style attributes are permitted for the app's data-driven charts and modal sizing; Google Fonts are the only external resource origin. If your host adds CSP response headers, keep them consistent with this policy (multiple policies are enforced together).

## How to demo it to a business owner

1. Open the Overview dashboard and explain the operational snapshot.
2. Open Inventory and add or edit an equipment item.
3. Open Bookings and create a booking. The form calculates an estimated rental total and updates demo inventory availability.
4. Move a booking between Pending, Confirmed, Checked out, and Returned.
5. Create an invoice from a booking and mark it paid to demonstrate the billing workflow.
6. Open Calendar and Maintenance to show scheduling and fleet-care workflows.
7. Open Online store to show the customer's booking/quote-request experience.
8. Use Settings → Reset sample data before the next prospect meeting.

The sample business is **Summit Equipment Co.** The product concept/brand is **RentFlow**. Replace these with your approved brand and a prospect-specific demo workspace before a sales presentation.

## Important prototype limitations

This is a front-end demo, not a production-ready SaaS. All records are sample data stored in the current browser's localStorage. There is no real login, server, database, tenant isolation, email delivery, payment processing, document signing, or live availability API. Storefront requests and payment updates are simulated in the browser only. Do not enter real customer data or use this prototype for live business operations.

Before selling subscriptions or onboarding real companies, build and test a production backend with server-side authentication/authorization, organization-level data isolation, transactional booking availability, database backups, payment-provider integration, email notifications, audit logs, secure file storage, monitoring, and applicable privacy/tax/legal requirements.

There are currently no API endpoints or API environment variables to configure. A real backend URL and its matching client integration must be provided before server-backed production use; adding a placeholder URL would not make these demo workflows persistent or secure.

## Main stack

- React 18
- Vite 5
- Lucide React icons
- Custom responsive CSS
- Browser localStorage for demo persistence

## Reset demo data

Open **Settings → Reset demo workspace**. This restores the seed sample records in the current browser.
# RentFlow-Demo
