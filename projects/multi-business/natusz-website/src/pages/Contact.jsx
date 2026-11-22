import { useState } from "react";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import PageHeader from "../components/PageHeader";
import WhatsAppIcon from "../components/WhatsAppIcon";
import { site } from "../config/site";
import { whatsappLink } from "../lib/whatsapp";

const topics = ["Product enquiry", "Becoming a stockist or distributor", "Doctor or clinic enquiry", "Something else"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", topic: topics[0], message: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const text =
      `Hello ${site.name},\n` +
      `My name is ${form.name.trim()}.\n` +
      `Topic: ${form.topic}\n\n` +
      `${form.message.trim()}`;
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
  };

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`;

  const details = [
    { Icon: Phone, label: "Customer care", value: site.phoneDisplay, href: `tel:${site.phoneTel}` },
    { Icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { Icon: MapPin, label: "Address", value: site.address.lines.join(" "), href: null },
  ];

  return (
    <>
      <PageHeader title="Let’s talk" intro="Questions about a product, availability or working with us? Send a message and we will get back to you." />

      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          {/* Details */}
          <div className="lg:col-span-5">
            <a
              href={whatsappLink(`Hello ${site.name}, I would like to know more about your products.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl bg-[#25D366] p-6 text-white transition hover:brightness-95"
            >
              <div className="flex items-center gap-4">
                <WhatsAppIcon className="h-9 w-9" />
                <div>
                  <p className="font-display text-2xl">Chat on WhatsApp</p>
                  <p className="text-sm text-white/85">The fastest way to reach us</p>
                </div>
              </div>
              <ArrowUpRight className="h-6 w-6 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
              {details.map(({ Icon, label, value, href }) => (
                <div key={label} className="flex gap-4 py-5">
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-brand-dark" strokeWidth={1.6} />
                  <div className="min-w-0">
                    <dt className="text-sm text-ink/50">{label}</dt>
                    <dd className="mt-1 break-words font-medium">
                      {href ? <a href={href} className="transition hover:text-brand-dark">{value}</a> : value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-10 lg:col-span-7">
            <h2 className="text-3xl sm:text-4xl">Send us a message</h2>
            <p className="mt-2 text-sm text-ink/60">This opens WhatsApp with your message ready to send.</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Your name
                <input
                  required
                  value={form.name}
                  onChange={set("name")}
                  autoComplete="name"
                  className="mt-2 w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <label className="block text-sm font-medium">
                What is this about?
                <select
                  value={form.topic}
                  onChange={set("topic")}
                  className="mt-2 w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  {topics.map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium sm:col-span-2">
                Message
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={set("message")}
                  className="mt-2 w-full resize-y rounded-xl border border-ink/15 bg-paper px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </label>
            </div>

            <button type="submit" className="btn-ink mt-7 w-full sm:w-auto">
              <WhatsAppIcon className="h-4 w-4" /> Send on WhatsApp
            </button>
          </form>
        </div>
      </section>

      {/* Map */}
      <section className="pb-24">
        <div className="container-x">
          <div className="overflow-hidden rounded-3xl border border-ink/10">
            <iframe
              title="Natusz Healthcare location"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[340px] w-full grayscale transition duration-500 hover:grayscale-0 sm:h-[420px]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
