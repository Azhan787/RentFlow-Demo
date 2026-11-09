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

## Main stack

- React 18
- Vite 5
- Lucide React icons
- Custom responsive CSS
- Browser localStorage for demo persistence

## Reset demo data

Open **Settings → Reset demo workspace**. This restores the seed sample records in the current browser.
# RentFlow-Demo
