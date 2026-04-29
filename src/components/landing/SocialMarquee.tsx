'use client';

export function SocialMarquee() {
  const testimonials = [
    "I won £400 last month and didn't expect it.",
    "Signed up because of the charity option.",
    "The draw is genuinely exciting every month.",
    "My club all subscribed. We track each other's scores.",
    "Finally a golf platform with actual purpose.",
  ];

  return (
    <section className="w-full py-12 bg-background overflow-hidden border-y border-border">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center gap-12 px-6">
            {testimonials.map((text, j) => (
              <div key={j} className="flex items-center gap-12">
                <span className="text-muted italic text-lg">{text}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
