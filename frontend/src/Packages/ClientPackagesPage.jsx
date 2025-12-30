import { useMemo } from 'react';

const ClientPackagesPage = () => {
  const packages = useMemo(
    () => [
      {
        id: 'deluxe',
        title: 'Deluxe',
        subtitle: 'Premium coverage for signature celebrations',
        accent: 'from-amber-500/30 via-amber-400/10 to-transparent',
      },
      {
        id: 'gold',
        title: 'Gold',
        subtitle: 'Classic elegance with cinematic storytelling',
        accent: 'from-amber-400/20 via-white/5 to-transparent',
      },
      {
        id: 'platinum',
        title: 'Platinum',
        subtitle: 'Elite experience with full creative direction',
        accent: 'from-gray-500/20 via-white/5 to-transparent',
      },
    ],
    []
  );

  return (
    <div className="relative bg-[#0b0b0b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a1a1a,transparent_60%)]"></div>
      <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl"></div>
      <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl"></div>

      <div className="relative container mx-auto px-4 py-10">
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-300/70 mb-3">
            Curated Packages
          </p>
          <h1 className="text-white text-3xl md:text-4xl font-semibold mb-3 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
            Choose Your Signature Package
          </h1>
          <p className="text-gray-300 font-light tracking-wide leading-relaxed">
            Deluxe, Gold, and Platinum packages are available for all celebrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="group relative rounded-2xl border border-white/10 bg-black/70 p-6 shadow-[0_18px_55px_-35px_rgba(0,0,0,0.8)] transition-all duration-500 hover:-translate-y-1 hover:border-amber-300/60"
            >
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${pkg.accent}`} />
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80">
                  {pkg.title}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{pkg.title} Package</h2>
                <p className="mt-2 text-sm text-white/70">{pkg.subtitle}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-200 border border-amber-300/40 px-3 py-1 rounded-full">
                  Available Now
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-xs uppercase tracking-[0.35em] text-amber-300/60">
          Deluxe · Gold · Platinum
        </div>
      </div>
    </div>
  );
};

export default ClientPackagesPage;
