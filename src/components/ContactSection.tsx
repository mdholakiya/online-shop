import { formatAddress } from "@/lib/format";
import { SHOP, formatPhone, telHref } from "@/lib/shop";
import { MailIcon, PhoneIcon, PinIcon } from "./icons";

const cardClass = "h-full rounded-2xl bg-paper/5 p-5 ring-1 ring-paper/10";
const linkClass =
  "underline decoration-paper/30 underline-offset-4 transition hover:text-blush hover:decoration-blush focus-visible:outline-2 focus-visible:outline-blush";

// Shop contact block shown on the home page (details from src/lib/shop.ts)
export default function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="mt-20 scroll-mt-24 rounded-3xl bg-ink px-6 py-12 text-paper sm:px-12 sm:py-16"
    >
      <p className="text-xs tracking-[0.3em] text-blush/80 uppercase">
        Love a dress?
      </p>
      <h2 id="contact-heading" className="mt-3 font-serif text-4xl sm:text-5xl">
        Get in touch
      </h2>
      <p className="mt-3 max-w-md text-sm text-paper/70">
        Call or email us to order, ask about sizes, or visit our shop.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-3">
        {/* Phone numbers (each one tappable) */}
        <li className={cardClass}>
          <CardHeader icon={<PhoneIcon />} label="Call us" />
          <ul className="mt-1 space-y-1.5">
            {SHOP.phones.map((phone) => (
              <li key={phone}>
                <a href={telHref(phone)} className={`text-base ${linkClass}`}>
                  {formatPhone(phone)}
                </a>
              </li>
            ))}
          </ul>
        </li>

        {/* Email */}
        <li className={cardClass}>
          <CardHeader icon={<MailIcon />} label="Email us" />
          <a href={`mailto:${SHOP.email}`} className={`mt-1 inline-block text-base break-all ${linkClass}`}>
            {SHOP.email}
          </a>
        </li>

        {/* Address */}
        <li className={cardClass}>
          <CardHeader icon={<PinIcon />} label="Visit us" />
          <p className="mt-1 text-base">{formatAddress(SHOP.address)}</p>
        </li>
      </ul>
    </section>
  );
}

function CardHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <>
      <span className="flex size-11 items-center justify-center rounded-full bg-accent text-paper">
        {icon}
      </span>
      <span className="mt-4 block text-xs tracking-wider text-paper/60 uppercase">
        {label}
      </span>
    </>
  );
}
