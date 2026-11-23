import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  HeartHandshake,
  ShieldCheck,
  MessagesSquare,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import Logo from "../components/Logo";
import { site } from "../config/site";
import { generalEnquiryLink } from "../lib/whatsapp";
import WhatsAppIcon from "../components/WhatsAppIcon";

// ── About page copy lives here: edit the text freely ──
const values = [
  {
    Icon: HeartHandshake,
    title: "Care first",
    text: "Every decision, from which product to bring in to how we reply to a message, starts with the person who will use it.",
  },
  {
    Icon: ShieldCheck,
    title: "Quality we can stand behind",
    text: "We choose products carefully and share their details openly, so doctors and pharmacists can decide with confidence.",
  },
  {
    Icon: MessagesSquare,
    title: "Always reachable",
    text: "No call centres or long forms. You message us and someone from the team answers.",
  },
];

export default function About() {
  return (
    <>
      <PageHeader
        title="Built on years in the field, started with a simple idea."
        intro="Natusz Healthcare is a pharmaceutical marketing company focused on skin care and dermatology products."
      />

      <section className="py-14 sm:py-24">
        <div className="container-x grid gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <h2 className="text-3xl leading-tight sm:text-5xl">Who we are</h2>
          </div>
          <div className="space-y-5 text-base leading-[1.75] text-ink/75 sm:text-lg lg:col-span-7">
            <p>
              Natusz Healthcare Pvt Ltd markets skin care medicines and
              dermatology products from Dombivli East, Thane. We work with
              doctors, pharmacists and distributors to make good products easier
              to find and easier to trust.
            </p>
            <p>
              Our team brings years of hands-on experience in the field,
              visiting clinics and chemist shops every day. That time taught us
              what prescribers value in a product, and what patients quietly
              hope for: something that works, and does not complicate their
              life.
            </p>
            <p>
              Natusz is our answer to both. A focused range, clearly described,
              backed by people who pick up the phone.
            </p>
          </div>
        </div>
      </section>

      {/* Team note */}
      <section className="bg-mist py-14 sm:py-24">
        <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <blockquote className="font-display text-2xl leading-[1.3] sm:text-4xl lg:text-5xl">
              “Trust is earned one honest conversation at a time. That is how we
              run Natusz.”
            </blockquote>
            <p className="mt-6 text-sm font-semibold">The Natusz Team</p>
            <p className="text-sm text-ink/60">{site.legalName}</p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Logo
              layout="stacked"
              tone="dark"
              className="mx-auto h-auto w-full max-w-[200px] sm:max-w-[260px]"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ink py-14 text-paper sm:py-24">
        <div className="container-x">
          <h2 className="max-w-xl text-3xl leading-tight sm:text-5xl">
            What we stand for
          </h2>
          <div className="mt-8 grid gap-8 sm:mt-12 md:grid-cols-3 md:gap-10">
            {values.map(({ Icon, title, text }) => (
              <div key={title} className="border-t border-white/15 pt-5">
                <Icon className="h-6 w-6 text-brand" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/65">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company details */}
      <section className="py-14 sm:py-24">
        <div className="container-x grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl leading-tight sm:text-5xl">
              Company details
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={generalEnquiryLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ink"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
              <Link to="/products" className="btn-outline-dark">
                View products
              </Link>
            </div>
          </div>
          <dl className="divide-y divide-ink/10 border-y border-ink/10 text-base lg:col-span-7">
            <div className="grid gap-1 py-4 sm:grid-cols-[170px_1fr] sm:py-5">
              <dt className="text-ink/50">Registered name</dt>
              <dd className="font-medium">{site.legalName}</dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[170px_1fr] sm:py-5">
              <dt className="flex items-center gap-2 text-ink/50">
                <MapPin className="h-4 w-4" /> Address
              </dt>
              <dd className="font-medium">{site.address.lines.join(" ")}</dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[170px_1fr] sm:py-5">
              <dt className="flex items-center gap-2 text-ink/50">
                <Phone className="h-4 w-4" /> Customer care
              </dt>
              <dd className="font-medium">
                <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>
              </dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[170px_1fr] sm:py-5">
              <dt className="flex items-center gap-2 text-ink/50">
                <Mail className="h-4 w-4" /> Email
              </dt>
              <dd className="break-all font-medium">
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
