import { ChevronRight } from 'lucide-react';
import Reveal from './Reveal';
import Badge from './Badge';

const principles = [
  {
    title: 'Clear',
    body: 'We map how your work really happens before we automate a single step.',
  },
  {
    title: 'Precise',
    body: 'Every agent and integration is scoped tightly, tested, and measured against a real outcome.',
  },
  {
    title: 'Automated',
    body: 'Once it runs, it runs quietly, so your team spends its time on decisions, not busywork.',
  },
];

export default function SectionThree() {
  return (
    <section
      id="about"
      className="flex min-h-screen flex-col justify-between px-5 pb-12 pt-24 supports-[height:100svh]:min-h-[100svh] sm:px-8 sm:pt-28 md:px-12 md:pb-16"
    >
      <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
        <Reveal delay={120}>
          <Badge>About Us</Badge>
        </Reveal>
        <Reveal delay={220} className="max-w-sm sm:text-right">
          <p className="text-lg leading-relaxed text-white drop-shadow-md sm:text-xl">
            We are a small team of engineers and operators who build automation that disappears into the work.
          </p>
        </Reveal>
      </div>

      <div className="flex flex-1 flex-col justify-end gap-12 md:flex-row md:items-end md:justify-between md:gap-16">
        <div className="max-w-xl">
          <Reveal delay={180}>
            <h2 className="text-5xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
              Calm for
              <br />
              complex work.
            </h2>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-6 max-w-md text-sm text-white/80 drop-shadow-md sm:text-base">
              NovaAI started with a simple belief: the best automation is the kind you stop noticing. We partner with
              growing companies to understand how work gets done, then design AI agents and integrations that remove the
              friction without adding another tool to manage.
            </p>
          </Reveal>
          <Reveal delay={420}>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="flex items-center gap-1 rounded-full bg-white px-5 py-2.5 text-xs font-medium text-black transition-colors duration-300 hover:bg-white/85 sm:text-sm">
                Book 15-mins call
                <ChevronRight size={14} />
              </button>
              <button className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-xs text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/20 sm:text-sm">
                Free consultation
              </button>
            </div>
          </Reveal>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 px-5 backdrop-blur-md sm:px-6">
          <Reveal delay={300} className="flex items-baseline gap-5 border-b border-white/15 py-5">
            <span className="text-4xl font-normal tracking-tight text-white sm:text-5xl">100+</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/60">
              Businesses automated
            </span>
          </Reveal>
          {principles.map((p, i) => (
            <Reveal
              key={p.title}
              delay={410 + i * 110}
              className={`group flex flex-col py-5 ${i < principles.length - 1 ? 'border-b border-white/15' : ''}`}
            >
              <div className="flex items-center gap-1 text-base font-medium text-white sm:text-lg">
                {p.title}
                <ChevronRight
                  size={16}
                  className="text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white"
                />
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-white/70">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
