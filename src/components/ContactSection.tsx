import type { Product } from "@/lib/types";
import { formatAddress } from "@/lib/format";
import { MailIcon, PhoneIcon, PinIcon } from "./icons";

type Contact = Pick<Product, "phone" | "email" | "address">;

// Shop contact block shown on the home page (uses the latest product's details)
export default function ContactSection({ contact }: { contact: Contact }) {
  const items = [
    {
      label: "Call us",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s+/g, "")}`,
      icon: <PhoneIcon />,
    },
    {
      label: "Email us",
      value: contact.email,
      href: `mailto:${contact.email}`,
      icon: <MailIcon />,
    },
    { label: "Visit us", value: formatAddress(contact.address), icon: <PinIcon /> },
  ];

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
        Call or email us to order, ask about sizes, or book a visit.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-3">
        {items.map((item) => {
          const content = (
            <>
              <span className="flex size-11 items-center justify-center rounded-full bg-accent text-paper">
                {item.icon}
              </span>
              <span className="mt-4 block text-xs tracking-wider text-paper/60 uppercase">
                {item.label}
              </span>
              <span className="mt-1 block break-words text-base">
                {item.value}
              </span>
            </>
          );
          return (
            <li key={item.label}>
              {item.href ? (
                <a
                  href={item.href}
                  className="block h-full rounded-2xl bg-paper/5 p-5 ring-1 ring-paper/10 transition hover:bg-paper/10 focus-visible:outline-2 focus-visible:outline-blush"
                >
                  {content}
                </a>
              ) : (
                <div className="h-full rounded-2xl bg-paper/5 p-5 ring-1 ring-paper/10">
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
