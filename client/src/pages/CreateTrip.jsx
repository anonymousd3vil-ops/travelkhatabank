import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FiPlus,
  FiTrash2,
  FiCopy,
  FiMapPin,
  FiUsers,
  FiUser,
  FiPhone,
  FiDollarSign,
  FiArrowRight,
  FiArrowLeft,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { createTrip } from "../store/tripSlice.js";
import { inr } from "../utils/format.js";

const blank = { name: "", phone: "", username: "", existing: false };

export default function CreateTrip() {
  const d = useDispatch();
  const nav = useNavigate();

  const [destination, setDestination] = useState("");
  const [perHead, setPerHead] = useState("");
  const [members, setMembers] = useState([{ ...blank }]);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  const upd = (i, k, v) => {
    setMembers((prev) =>
      prev.map((m, j) => (j === i ? { ...m, [k]: v } : m))
    );
  };

  const heads = members.length + 1;

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    const payload = {
      destination,
      perHead: Number(perHead),
      members: members.map((m) =>
        m.existing
          ? { username: m.username }
          : { name: m.name, phone: m.phone }
      ),
    };

    try {
      const r = await toast.promise(d(createTrip(payload)).unwrap(), {
        loading: "Creating trip...",
        success: "Trip created successfully!",
        error: (m) => String(m),
      });

      if (r.credentials.length) {
        setResult(r);
      } else {
        nav(`/trips/${r.trip._id}`);
      }
    } catch (m) {
      setErr(String(m));
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        result.credentials
          .map((c) => `${c.name}: ${c.username} / ${c.password}`)
          .join("\n")
      );
      toast.success("Credentials copied!");
    } catch {
      toast.error("Unable to copy. Please copy the credentials manually.");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  // Credentials screen
  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
          <div className="bg-gradient-to-br from-teal-800 to-emerald-600 p-7 text-white sm:p-9">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <FiCheckCircle className="text-3xl" />
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-teal-100">
              Trip created successfully
            </p>

            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Member logins
            </h1>

            <p className="mt-3 text-sm leading-6 text-teal-50">
              Share these login details with your travellers so they can
              access the trip.
            </p>
          </div>

          <div className="space-y-5 p-5 sm:p-8">
            <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              <FiShield className="mt-1 shrink-0 text-lg" />
              <p>
                <strong>Important:</strong> Save these credentials now.
                Passwords are shown only once. Existing accounts keep their
                own login credentials.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  New member credentials
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {result.credentials.length} member
                  {result.credentials.length !== 1 ? "s" : ""}
                </p>
              </div>

              <FiUsers className="text-2xl text-teal-700" />
            </div>

            <div className="space-y-3">
              {result.credentials.map((c, i) => (
                <div
                  key={c.username}
                  className="rounded-2xl border border-slate-200 p-4 transition hover:border-teal-300 sm:p-5"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 font-bold text-teal-800">
                      {c.name?.charAt(0)?.toUpperCase() || (
                        <FiUser />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="break-words font-bold text-slate-900">
                        {c.name}
                      </p>
                      <p className="break-words text-xs text-slate-500">
                        {c.phone}
                      </p>
                    </div>

                    <span className="text-xs text-slate-400">
                      #{i + 1}
                    </span>
                  </div>

                  <div className="space-y-3 rounded-xl bg-slate-50 p-4">
                    <div>
                      <p className="mb-1 text-xs text-slate-500">
                        Username
                      </p>
                      <p className="break-all font-mono text-sm font-semibold text-slate-800">
                        {c.username}
                      </p>
                    </div>

                    <div className="border-t border-slate-200 pt-3">
                      <p className="mb-1 text-xs text-slate-500">
                        Password
                      </p>
                      <p className="break-all font-mono text-sm font-semibold text-teal-800">
                        {c.password}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={copy}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50"
              >
                <FiCopy />
                Copy all
              </button>

              <button
                type="button"
                onClick={() => nav(`/trips/${result.trip._id}`)}
                className="flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white transition hover:bg-teal-800"
              >
                Go to trip
                <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create trip screen
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-600">
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border-[40px] border-white/5" />

        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          <button
            type="button"
            onClick={() => nav(-1)}
            className="mb-8 flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/20"
          >
            <FiArrowLeft />
            Go back
          </button>

          <div className="flex items-start gap-4">
            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex">
              <FiMapPin className="text-3xl text-white" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-100">
                Plan your next adventure
              </span>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Create your trip
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-teal-50 sm:text-base">
                Choose your destination, set the budget, and bring your
                travellers together. We’ll help you keep the expenses
                organized.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_310px]">
        <form onSubmit={submit} className="min-w-0 space-y-6">
          {/* Trip details */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 p-5 sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-xl text-teal-700">
                <FiMapPin />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Trip details
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Start with the basics
                </p>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div>
                <label htmlFor="destination" className={labelClass}>
                  Destination <span className="text-red-500">*</span>
                </label>

                <input
                  id="destination"
                  className={inputClass}
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Meghalaya, Goa, Manali"
                />
              </div>

              <div>
                <label htmlFor="perHead" className={labelClass}>
                  Budget per person (₹){" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="perHead"
                  className={inputClass}
                  type="number"
                  min="1"
                  required
                  value={perHead}
                  onChange={(e) => setPerHead(e.target.value)}
                  placeholder="Enter amount per traveller"
                />

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Set the planned contribution for each traveller.
                </p>
              </div>
            </div>
          </section>

          {/* Travellers */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600">
                  <FiUsers />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Travellers
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Who is coming along?
                  </p>
                </div>
              </div>

              <span className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-slate-100 px-3 text-sm font-bold text-slate-700">
                {heads}
              </span>
            </div>

            <div className="space-y-4 p-4 sm:p-6">
              {/* Manager */}
              <div className="flex items-center gap-3 rounded-xl border border-teal-100 bg-teal-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-lg text-teal-700">
                  <FiCheckCircle />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900">
                    You — Expense Manager
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    You are automatically included in the trip.
                  </p>
                </div>
              </div>

              {members.map((m, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 p-4 sm:p-5"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <FiUser />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          Traveller {i + 1}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {m.existing ? "Existing member" : "New member"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={members.length === 1}
                      onClick={() =>
                        setMembers(members.filter((_, j) => j !== i))
                      }
                      aria-label={`Remove traveller ${i + 1}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>

                  {m.existing ? (
                    <div>
                      <label
                        htmlFor={`username-${i}`}
                        className={labelClass}
                      >
                        Existing username{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        id={`username-${i}`}
                        className={inputClass}
                        required
                        value={m.username}
                        onChange={(e) =>
                          upd(i, "username", e.target.value)
                        }
                        placeholder="Enter their username"
                      />
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="min-w-0">
                        <label
                          htmlFor={`name-${i}`}
                          className={labelClass}
                        >
                          Full name <span className="text-red-500">*</span>
                        </label>

                        <input
                          id={`name-${i}`}
                          className={inputClass}
                          required
                          value={m.name}
                          onChange={(e) => upd(i, "name", e.target.value)}
                          placeholder="Traveller name"
                        />
                      </div>

                      <div className="min-w-0">
                        <label
                          htmlFor={`phone-${i}`}
                          className={labelClass}
                        >
                          Contact number{" "}
                          <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                          <FiPhone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                          <input
                            id={`phone-${i}`}
                            className={`${inputClass} pl-10`}
                            required
                            inputMode="tel"
                            value={m.phone}
                            onChange={(e) => upd(i, "phone", e.target.value)}
                            placeholder="Phone number"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-teal-50">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 shrink-0 accent-teal-700"
                      checked={m.existing}
                      onChange={(e) =>
                        upd(i, "existing", e.target.checked)
                      }
                    />

                    <span>
                      <span className="block text-sm font-medium text-slate-700">
                        Already has an account
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        Use an existing username instead of creating new
                        login credentials.
                      </span>
                    </span>
                  </label>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setMembers([...members, { ...blank }])
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-teal-300 bg-teal-50/50 px-4 py-3.5 text-sm font-bold text-teal-800 transition hover:border-teal-500 hover:bg-teal-50"
              >
                <FiPlus className="text-lg" />
                Add traveller
              </button>
            </div>
          </section>

          {err && (
            <div
              role="alert"
              className="break-words rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {err}
            </div>
          )}

          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-4 font-bold text-white shadow-lg shadow-teal-700/15 transition hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-xl"
          >
            Create trip
            <FiArrowRight className="text-lg transition-transform group-hover:translate-x-1" />
          </button>

          <p className="text-center text-xs text-slate-500">
            Review the trip details and traveller information before
            submitting.
          </p>
        </form>

        {/* Live summary */}
        <aside className="space-y-5 lg:sticky lg:top-6">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-br from-teal-800 to-teal-700 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-100">
                Trip overview
              </p>

              <h2 className="mt-2 break-words text-xl font-extrabold">
                {destination.trim() || "Your next adventure"}
              </h2>

              <div className="mt-4 flex items-center gap-2 text-sm text-teal-50">
                <FiUsers />
                {heads} traveller{heads !== 1 ? "s" : ""} in total
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-500">
                  Added members
                </span>
                <span className="font-bold text-slate-900">
                  {members.length}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <FiDollarSign />
                  Per person
                </span>
                <span className="font-bold text-slate-900">
                  {Number(perHead) > 0 ? inr(Number(perHead)) : "—"}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-sm text-slate-500">
                  Estimated total fund
                </p>

                <p className="mt-2 break-words text-3xl font-extrabold tracking-tight text-teal-800">
                  {Number(perHead) > 0
                    ? inr(Number(perHead) * heads)
                    : inr(0)}
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Per-person amount multiplied by all travellers, including
                  you.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-700">
                <FiShield />
              </div>
              <h3 className="font-bold text-slate-900">
                How it works
              </h3>
            </div>

            <div className="mt-5 space-y-4">
              {[
                "Set your destination and budget.",
                "Add new or existing members.",
                "Create your trip and share access.",
              ].map((text, i) => (
                <div key={text} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-700">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm leading-5 text-slate-600">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
