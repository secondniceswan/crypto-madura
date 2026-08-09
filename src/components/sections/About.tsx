import { Shield, TrendingUp, BookOpen, Users } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const features = [
  {
    icon: BookOpen,
    title: "Edukasi Terstruktur",
    desc: "Materi belajar dari dasar hingga mahir, cocok untuk pemula maupun trader berpengalaman.",
  },
  {
    icon: TrendingUp,
    title: "Sinyal Akurat",
    desc: "Sinyal trading berdasarkan analisis teknikal dan on-chain data dari analis berpengalaman.",
  },
  {
    icon: Users,
    title: "Komunitas Solid",
    desc: "Diskusi aktif dan saling support antar member untuk meningkatkan skill trading.",
  },
  {
    icon: Shield,
    title: "Manajemen Risiko",
    desc: "Fokus pada edukasi risiko dan money management untuk trading yang berkelanjutan.",
  },
];

const statusRows = [
  { color: "bg-accent-green", label: "Grup WhatsApp Aktif 24/7" },
  { color: "bg-accent-blue", label: "Sinyal Trading Harian" },
  { color: "bg-accent-cyan", label: "Webinar Mingguan" },
  { color: "bg-accent-amber", label: "Materi Edukasi Lengkap" },
  { color: "bg-accent-green", label: "Event & Meetup Rutin" },
];

export default function About() {
  return (
    <section id="about" className="relative bg-bg-secondary/40 border-y border-glass-border overflow-hidden">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <Reveal>
            <span className="eyebrow mb-4">{"// Tentang Kami"}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 mt-3">
              Kenapa Harus{" "}
              <span className="gradient-text">Crypto Madura</span>?
            </h2>
            <p className="text-text-secondary leading-relaxed mb-10 text-lg">
              Kami adalah komunitas crypto yang berbasis di Madura, berdedikasi
              untuk memberikan edukasi berkualitas dan membangun ekosistem
              trading yang sehat. Dengan pendekatan data-driven dan manajemen
              risiko yang ketat, kami membantu member mencapai tujuan finansial
              mereka.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((f, i) => (
                <Reveal key={f.title} delay={i * 80} className="group flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-blue/25 to-accent-cyan/10 border border-accent-blue/20 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                    <f.icon className="w-5 h-5 text-accent-cyan" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          {/* Visual */}
          <Reveal delay={120} className="relative">
            <div className="absolute -inset-3 bg-gradient-to-tr from-accent-blue/15 to-accent-cyan/10 blur-2xl rounded-[2rem]" />
            <div className="glass-card card-glow p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent-blue/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-accent-cyan/10 rounded-full blur-3xl" />

              <div className="relative">
                <div className="space-y-3">
                  {statusRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-glass-border hover:border-accent-blue/25 transition-colors"
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
                      <span className="text-sm text-text-secondary">{row.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
