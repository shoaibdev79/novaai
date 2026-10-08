import ScrollVideo from './components/ScrollVideo';
import Navbar from './components/Navbar';
import SectionOne from './components/SectionOne';
import SectionTwo from './components/SectionTwo';
import SectionThree from './components/SectionThree';

export default function App() {
  return (
    <div className="relative bg-[#0a0a0a] font-sans text-white">
      <ScrollVideo />
      <div className="relative z-10">
        <Navbar />
        <main>
          <SectionOne />
          <div className="h-[80vh]" aria-hidden="true" />
          <SectionTwo />
          <div className="h-[60vh]" aria-hidden="true" />
          <SectionThree />
        </main>
      </div>
    </div>
  );
}
