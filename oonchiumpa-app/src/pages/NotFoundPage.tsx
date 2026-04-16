import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="min-h-[60vh] flex items-center justify-center py-20">
      <div className="max-w-lg mx-auto px-6 text-center">
        <p className="text-ochre-600 text-sm uppercase tracking-[0.24em] mb-4">
          Page not found
        </p>
        <h1 className="text-4xl md:text-5xl font-display text-earth-950 mb-6">
          Sorry, that page doesn't exist
        </h1>
        <p className="text-earth-700 text-lg leading-relaxed mb-10">
          The page you're looking for may have been moved or removed.
          Head back to the homepage to find what you need.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="btn-primary px-7"
          >
            Go home
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="btn-secondary px-7"
          >
            Contact us
          </button>
        </div>
      </div>
    </section>
  );
}
