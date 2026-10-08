import { Hexagon } from 'lucide-react';
import Reveal from './Reveal';

const links = ['Projects', 'About', 'Blog', 'Contact'];

export default function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 w-full border-b border-white/15">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8 md:px-12">
        <Reveal delay={0}>
          <a href="#" className="flex items-center gap-2 text-lg font-medium tracking-tight text-white sm:text-xl">
            <Hexagon size={24} strokeWidth={1.5} />
            novaai
          </a>
        </Reveal>

        <nav className="hidden items-center gap-8 md:flex lg:gap-10">
          {links.map((label, i) => (
            <Reveal key={label} delay={100 + i * 100}>
              <a
                href={label === 'About' ? '#about' : '#'}
                className="text-sm text-white/85 transition-colors duration-300 hover:text-white"
              >
                {label}
                {label === 'Projects' && (
                  <sup className="ml-0.5 font-mono text-[10px] text-white/60">6</sup>
                )}
              </a>
            </Reveal>
          ))}
        </nav>

        <Reveal delay={500}>
          <a
            href="#"
            className="rounded-md border border-white/20 bg-white/15 px-4 py-2 text-xs text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/25 sm:px-5 sm:text-sm"
          >
            Get Free Consultation
          </a>
        </Reveal>
      </div>
    </header>
  );
}
