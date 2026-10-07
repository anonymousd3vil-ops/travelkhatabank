# TravelKhataBank

A group travel expense tracker. A friend group pools money into one person's hands, and that person (the Expense Manager) pays for everything on the trip. TravelKhataBank keeps every rupee accountable.

## Features
- Create trips with a per-head budget and add travellers; members get generated logins
- Expense Manager records group spends, selecting who was involved (equal or custom split)
- Add money to the pool, void entries without losing the audit trail
- Members see the live balance, expense log and per-person spending
- Dashboard with Members, Log and Charts sections, plus category pie chart
- PDF export of the expense log
- Personal expense tracker and a profile showing trips and total share
- Join multiple trips with one account
- Responsive, mobile-friendly UI

## Tech Stack
MongoDB, Express, React (Vite), Node.js, Tailwind CSS, Redux Toolkit, React Router, React Hot Toast, Recharts, jsPDF, JWT, Morgan, Nodemon

## Getting Started
**Backend:** `cd server && cp .env.example .env && npm install && npm run dev`
**Frontend:** `cd client && cp .env.example .env && npm install && npm run dev`