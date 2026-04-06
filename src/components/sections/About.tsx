import { Shield, TrendingUp, BookOpen, Users } from "lucide-react";

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

export default function About() {
  return (
    <section id="about" className="relative bg-bg-secondary/50">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
              Kenapa Harus{" "}
              <span className="gradient-text">Crypto Madura</span>?
            </h2>
            <p className="text-text-secondary leading-relaxed mb-8">
              Kami adalah komunitas crypto yang berbasis di Madura, berdedikasi
              untuk memberikan edukasi berkualitas dan membangun ekosistem
              trading yang sehat. Dengan pendekatan data-driven dan manajemen
              risiko yang ketat, kami membantu member mencapai tujuan finansial
              mereka.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f.title} className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-accent-blue" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="glass-card p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-cyan/10 rounded-full blur-3xl" />

            <div className="relative space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="w-3 h-3 rounded-full bg-accent-green animate-pulse" />
                <span className="text-sm text-text-secondary">Grup WhatsApp Aktif 24/7</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="w-3 h-3 rounded-full bg-accent-blue" />
                <span className="text-sm text-text-secondary">Sinyal Trading Harian</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="w-3 h-3 rounded-full bg-accent-cyan" />
                <span className="text-sm text-text-secondary">Webinar Mingguan</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="w-3 h-3 rounded-full bg-accent-amber" />
                <span className="text-sm text-text-secondary">Materi Edukasi Lengkap</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="w-3 h-3 rounded-full bg-accent-green" />
                <span className="text-sm text-text-secondary">Event & Meetup Rutin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
