# Solaris Health — Patient Booking Portal

A modern patient scheduling portal for independent practices and clinics. Browse doctors by specialty, pick a real time slot, and confirm in under a minute. No phone calls, no fax forms.

**Live demo:** https://shaisolaris.github.io/solaris-patient-portal/

## What it shows

- **Doctor directory** with live search + specialty filter, 6 board-certified providers
- **Real-time availability** — 14-day calendar + morning / afternoon slot picker
- **Patient intake form** with validation, insurance selection, new-patient flag
- **Confirmation screen** with appointment details, doctor info, and add-to-calendar affordances
- **Dark mode** with localStorage persistence
- **Fully responsive** — works on phone, tablet, and desktop
- **Zero backend** — all state is client-side; drop in a real scheduling API (Acuity, Calendly, a custom EHR integration) wherever you see the mock data arrays

## Stack

- Next.js 15 (App Router, static export)
- React 19 + TypeScript
- Tailwind CSS 3
- Deployed to GitHub Pages

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Wiring this to a real system

The mock data in `src/app/page.tsx` is organized so the three integration points are obvious:

- `DOCTORS` — replace with a fetch to your provider directory
- `nextNDays()` + `TIME_SLOTS` — replace with a real availability API call per doctor
- The "Confirm appointment" handler — swap the state transition for a POST to your scheduling backend

Every other piece (validation, the 3-step flow, the UI) stays the same.

## License

MIT.
