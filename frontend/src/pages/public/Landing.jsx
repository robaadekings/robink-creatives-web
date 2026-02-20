import { Button } from "@/components/ui/button"

export default function Landing() {
  return (
    <section className="relative overflow-hidden">

      {/* Decorative Background Blur */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--brand-gold)] opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[var(--brand-red)] opacity-10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Crafting Bold
            <span className="block text-[var(--brand-red)]">
              Creative Experiences
            </span>
          </h1>

          <p className="mt-6 text-lg text-[var(--brand-muted)] max-w-xl">
            Robink Creatives blends strategy, design, and technology to build
            remarkable digital brands, websites, and creative solutions for ambitious businesses.
          </p>

          <div className="mt-10 flex gap-4">
            <Button className="bg-[var(--brand-red)] hover:bg-[var(--brand-red)]/90 text-white px-8 py-6 text-base">
              View Portfolio
            </Button>

            <Button
              variant="outline"
              className="border-[var(--brand-gold)] text-[var(--brand-gold)] hover:bg-[var(--brand-gold)] hover:text-white px-8 py-6 text-base"
            >
              Our Services
            </Button>
          </div>
        </div>

        {/* Right Visual Placeholder */}
        <div className="hidden md:block">
          <div className="bg-white shadow-xl rounded-2xl p-10 border">
            <h3 className="text-lg font-semibold mb-4 text-[var(--brand-red)]">
              Why Choose Robink?
            </h3>
            <ul className="space-y-3 text-[var(--brand-muted)] text-sm">
              <li>✔ Premium Branding Strategy</li>
              <li>✔ Custom Web Development</li>
              <li>✔ High-Impact Creative Design</li>
              <li>✔ Reliable Project Delivery</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  )
}