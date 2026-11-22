import { Link } from "react-router-dom";
import Logo from "../components/Logo";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center bg-ink text-paper">
      <div className="container-x py-32 text-center">
        <Logo layout="mark" tone="light" className="mx-auto h-20 w-auto" />
        <h1 className="mt-8 text-5xl sm:text-6xl">This page could not be found</h1>
        <p className="mx-auto mt-4 max-w-md text-paper/65">The link may be broken or the page may have moved.</p>
        <Link to="/" className="btn-rose mt-8">Back to home</Link>
      </div>
    </section>
  );
}
