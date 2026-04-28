'use client';

export function StatsBar() {
  const stats = [
    { value: '£48,000', label: 'Monthly Prize Pool', color: 'text-primary' },
    { value: '3,200+', label: 'Active Players', color: 'text-white' },
    { value: '12', label: 'Partner Charities', color: 'text-accent' },
  ];

  return (
    <section className="w-full bg-surface border-y border-border py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-0">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-1 w-full lg:w-auto items-center justify-center relative">
              <div className="text-center">
                <div className={`text-[64px] font-bold tracking-tighter leading-none ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-[11px] uppercase tracking-[0.1em] text-muted mt-2">
                  {stat.label}
                </div>
              </div>
              {i < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 h-16 w-[1px] bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
