"use client";

import { useEffect, useMemo, useState } from "react";

type Doctor = {
  id: string;
  name: string;
  title: string;
  specialty: string;
  location: string;
  rating: number;
  reviews: number;
  yearsExp: number;
  nextAvailable: string;
  initials: string;
  gradient: string;
  accepting: boolean;
  bio: string;
};

const DOCTORS: Doctor[] = [
  {
    id: "chen",
    name: "Dr. Maya Chen",
    title: "MD, FACC",
    specialty: "Cardiology",
    location: "Boston, MA",
    rating: 4.9,
    reviews: 412,
    yearsExp: 14,
    nextAvailable: "Today",
    initials: "MC",
    gradient: "from-rose-500 to-pink-600",
    accepting: true,
    bio: "Board-certified cardiologist specializing in preventive care and women's heart health.",
  },
  {
    id: "okafor",
    name: "Dr. Daniel Okafor",
    title: "MD",
    specialty: "Family Medicine",
    location: "Boston, MA",
    rating: 4.8,
    reviews: 328,
    yearsExp: 11,
    nextAvailable: "Tomorrow",
    initials: "DO",
    gradient: "from-amber-500 to-orange-600",
    accepting: true,
    bio: "Primary care for adults and families. Same-day sick visits and annual physicals.",
  },
  {
    id: "iyer",
    name: "Dr. Priya Iyer",
    title: "MD, MPH",
    specialty: "Dermatology",
    location: "Cambridge, MA",
    rating: 4.9,
    reviews: 521,
    yearsExp: 9,
    nextAvailable: "Today",
    initials: "PI",
    gradient: "from-fuchsia-500 to-purple-600",
    accepting: true,
    bio: "Medical and cosmetic dermatology. Skin cancer screening, acne, and eczema care.",
  },
  {
    id: "whittaker",
    name: "Dr. Sam Whittaker",
    title: "DO",
    specialty: "Orthopedics",
    location: "Brookline, MA",
    rating: 4.7,
    reviews: 264,
    yearsExp: 16,
    nextAvailable: "Fri, Apr 17",
    initials: "SW",
    gradient: "from-sky-500 to-indigo-600",
    accepting: true,
    bio: "Sports medicine and joint care. Former team physician for collegiate athletics.",
  },
  {
    id: "romero",
    name: "Dr. Lia Romero",
    title: "MD",
    specialty: "Pediatrics",
    location: "Boston, MA",
    rating: 5.0,
    reviews: 617,
    yearsExp: 12,
    nextAvailable: "Tomorrow",
    initials: "LR",
    gradient: "from-emerald-500 to-teal-600",
    accepting: true,
    bio: "Pediatric care from newborn to teen. Fluent in English and Spanish.",
  },
  {
    id: "grossman",
    name: "Dr. Ben Grossman",
    title: "MD, PhD",
    specialty: "Neurology",
    location: "Cambridge, MA",
    rating: 4.8,
    reviews: 189,
    yearsExp: 19,
    nextAvailable: "Mon, Apr 20",
    initials: "BG",
    gradient: "from-cyan-500 to-blue-600",
    accepting: false,
    bio: "Headache, migraine, and movement disorder specialist. Research affiliate at MIT.",
  },
];

const SPECIALTIES = [
  "All specialties",
  "Cardiology",
  "Family Medicine",
  "Dermatology",
  "Orthopedics",
  "Pediatrics",
  "Neurology",
];

function nextNDays(n: number) {
  const out: { date: Date; label: string; weekday: string; day: number }[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push({
      date: d,
      label:
        i === 0
          ? "Today"
          : i === 1
          ? "Tomorrow"
          : d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      weekday: d.toLocaleDateString(undefined, { weekday: "short" }),
      day: d.getDate(),
    });
  }
  return out;
}

const TIME_SLOTS: Record<string, string[]> = {
  morning: [
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
  ],
  afternoon: [
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
  ],
};

type Step = 1 | 2 | 3;

export default function PatientPortal() {
  const [step, setStep] = useState<Step>(1);
  const [dark, setDark] = useState(false);
  const [specialty, setSpecialty] = useState("All specialties");
  const [query, setQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patient, setPatient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    reason: "",
    insurance: "Blue Cross Blue Shield",
    newPatient: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("solaris-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("solaris-theme", next ? "dark" : "light");
  };

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((d) => {
      if (specialty !== "All specialties" && d.specialty !== specialty) return false;
      if (
        query &&
        !(
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.specialty.toLowerCase().includes(query.toLowerCase())
        )
      )
        return false;
      return true;
    });
  }, [specialty, query]);

  const days = useMemo(() => nextNDays(14), []);

  const canConfirm =
    patient.firstName.trim().length > 0 &&
    patient.lastName.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email) &&
    patient.phone.trim().length > 6;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 sm:py-10">
      <Header dark={dark} onToggle={toggleDark} step={step} />

      {step === 1 && (
        <section className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Find a doctor, book in seconds.
            </h1>
            <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
              Browse board-certified specialists near you. Real-time availability, no phone calls.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or specialty…"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900"
              />
            </div>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900"
            >
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filteredDoctors.length} doctor
            {filteredDoctors.length === 1 ? "" : "s"} available
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((d) => (
              <DoctorCard
                key={d.id}
                doctor={d}
                onBook={() => {
                  setSelectedDoctor(d);
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setStep(2);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {step === 2 && selectedDoctor && (
        <section className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="flex flex-col gap-8">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              ← All doctors
            </button>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Pick a time
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Select a date and time that works for you.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Available dates
              </h2>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {days.map((d) => {
                  const isSelected =
                    selectedDate?.toDateString() === d.date.toDateString();
                  return (
                    <button
                      key={d.date.toISOString()}
                      type="button"
                      onClick={() => {
                        setSelectedDate(d.date);
                        setSelectedTime(null);
                      }}
                      className={`flex flex-col items-center justify-center rounded-xl border px-2 py-3 text-center transition ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 ring-2 ring-emerald-500/30 dark:text-emerald-300"
                          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                      }`}
                    >
                      <span className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
                        {d.weekday}
                      </span>
                      <span className="mt-1 text-lg font-semibold">{d.day}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDate && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Morning
                  </h2>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {TIME_SLOTS.morning.map((t) => (
                      <TimeSlot
                        key={t}
                        time={t}
                        selected={selectedTime === t}
                        onClick={() => setSelectedTime(t)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Afternoon
                  </h2>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {TIME_SLOTS.afternoon.map((t) => (
                      <TimeSlot
                        key={t}
                        time={t}
                        selected={selectedTime === t}
                        onClick={() => setSelectedTime(t)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedDate && selectedTime && (
              <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div>
                  <h2 className="text-lg font-semibold">Patient information</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Your details are encrypted and never shared.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="First name"
                    value={patient.firstName}
                    onChange={(v) => setPatient({ ...patient, firstName: v })}
                    placeholder="Alex"
                  />
                  <Field
                    label="Last name"
                    value={patient.lastName}
                    onChange={(v) => setPatient({ ...patient, lastName: v })}
                    placeholder="Kim"
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={patient.email}
                    onChange={(v) => setPatient({ ...patient, email: v })}
                    placeholder="alex@example.com"
                  />
                  <Field
                    label="Phone"
                    value={patient.phone}
                    onChange={(v) => setPatient({ ...patient, phone: v })}
                    placeholder="(617) 555-0142"
                  />
                  <div className="sm:col-span-2">
                    <Field
                      label="Reason for visit"
                      value={patient.reason}
                      onChange={(v) => setPatient({ ...patient, reason: v })}
                      placeholder="Annual physical, follow-up, new symptom…"
                      optional
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Insurance
                      </span>
                      <select
                        value={patient.insurance}
                        onChange={(e) =>
                          setPatient({ ...patient, insurance: e.target.value })
                        }
                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900"
                      >
                        <option>Blue Cross Blue Shield</option>
                        <option>Aetna</option>
                        <option>United Healthcare</option>
                        <option>Cigna</option>
                        <option>Self-pay</option>
                      </select>
                    </label>
                  </div>
                  <label className="flex items-center gap-2 text-sm sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={patient.newPatient}
                      onChange={(e) =>
                        setPatient({ ...patient, newPatient: e.target.checked })
                      }
                      className="h-4 w-4 accent-emerald-600"
                    />
                    <span className="text-slate-700 dark:text-slate-300">
                      I'm a new patient at this practice
                    </span>
                  </label>
                </div>

                <button
                  type="button"
                  disabled={!canConfirm}
                  onClick={() => setStep(3)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-teal-500 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none"
                >
                  Confirm appointment
                </button>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <DoctorSummary
              doctor={selectedDoctor}
              date={selectedDate}
              time={selectedTime}
            />
          </aside>
        </section>
      )}

      {step === 3 && selectedDoctor && selectedDate && selectedTime && (
        <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-10 sm:py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              You're booked, {patient.firstName || "there"}.
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              A confirmation is on its way to{" "}
              <span className="font-medium text-slate-900 dark:text-white">
                {patient.email}
              </span>
              .
            </p>
          </div>

          <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-4">
              <Avatar doctor={selectedDoctor} size={52} />
              <div>
                <div className="font-semibold">{selectedDoctor.name}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {selectedDoctor.specialty} · {selectedDoctor.location}
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Date
                </div>
                <div className="mt-1 font-semibold">
                  {selectedDate.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Time
                </div>
                <div className="mt-1 font-semibold">{selectedTime}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Patient
                </div>
                <div className="mt-1 font-semibold">
                  {patient.firstName} {patient.lastName}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Insurance
                </div>
                <div className="mt-1 font-semibold">{patient.insurance}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:gap-4">
            <span>📧 Add to calendar</span>
            <span>📱 Reschedule anytime</span>
            <span>💬 Message your doctor</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setStep(1);
              setSelectedDoctor(null);
              setSelectedDate(null);
              setSelectedTime(null);
            }}
            className="mt-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Book another appointment
          </button>
        </section>
      )}

      <footer className="mt-16 text-center text-xs text-slate-400">
        Demo product — not affiliated with any real medical practice. ©{" "}
        {new Date().getFullYear()} Solaris Health.
      </footer>
    </main>
  );
}

function Header({
  dark,
  onToggle,
  step,
}: {
  dark: boolean;
  onToggle: () => void;
  step: Step;
}) {
  const labels = ["Find doctor", "Pick time", "Confirm"] as const;
  return (
    <header className="mb-10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-lg font-bold text-white shadow-lg shadow-emerald-500/30">
          S
        </span>
        <div className="leading-tight">
          <div className="text-base font-semibold">Solaris Health</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Patient booking
          </div>
        </div>
      </div>
      <nav className="hidden items-center gap-3 sm:flex">
        <ol className="flex items-center gap-2">
          {labels.map((l, i) => {
            const n = (i + 1) as Step;
            const active = step === n;
            const done = step > n;
            return (
              <li key={l} className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition ${
                    done
                      ? "bg-emerald-500 text-white"
                      : active
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                  }`}
                >
                  {done ? "✓" : n}
                </div>
                <span
                  className={`text-xs ${
                    active || done
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {l}
                </span>
                {i < labels.length - 1 && (
                  <span className="h-px w-6 bg-slate-200 dark:bg-slate-800" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <button
        type="button"
        onClick={onToggle}
        aria-label="Toggle dark mode"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
      >
        {dark ? "☀️" : "🌙"}
      </button>
    </header>
  );
}

function Avatar({ doctor, size = 48 }: { doctor: Doctor; size?: number }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${doctor.gradient} font-semibold text-white`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {doctor.initials}
    </div>
  );
}

function DoctorCard({
  doctor,
  onBook,
}: {
  doctor: Doctor;
  onBook: () => void;
}) {
  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="flex items-start gap-4">
        <Avatar doctor={doctor} size={56} />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold leading-tight">{doctor.name}</h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {doctor.title}
              </p>
            </div>
            {doctor.accepting && (
              <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                Accepting
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {doctor.specialty}
        </span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {doctor.yearsExp} yrs
        </span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">{doctor.bio}</p>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <span className="text-amber-500">★</span>
          <span className="font-semibold">{doctor.rating}</span>
          <span className="text-slate-500 dark:text-slate-400">
            ({doctor.reviews})
          </span>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Next:{" "}
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {doctor.nextAvailable}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onBook}
        disabled={!doctor.accepting}
        className="mt-1 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
      >
        {doctor.accepting ? "Book appointment" : "Not accepting new patients"}
      </button>
    </div>
  );
}

function DoctorSummary({
  doctor,
  date,
  time,
}: {
  doctor: Doctor;
  date: Date | null;
  time: string | null;
}) {
  return (
    <>
      <div className="flex items-center gap-4">
        <Avatar doctor={doctor} size={56} />
        <div>
          <div className="font-semibold">{doctor.name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {doctor.specialty} · {doctor.location}
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{doctor.bio}</p>
      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">Date</span>
          <span className="font-semibold">
            {date
              ? date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
              : "—"}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">Time</span>
          <span className="font-semibold">{time ?? "—"}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">Duration</span>
          <span className="font-semibold">30 min</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">Copay (est.)</span>
          <span className="font-semibold">$25.00</span>
        </div>
      </div>
    </>
  );
}

function TimeSlot({
  time,
  selected,
  onClick,
}: {
  time: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
        selected
          ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-500/60 dark:hover:text-emerald-300"
      }`}
    >
      {time}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  optional,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  optional?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {optional && (
          <span className="text-xs font-normal text-slate-400">(optional)</span>
        )}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900"
      />
    </label>
  );
}
