import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import News from "@/components/sections/News";
import Events from "@/components/sections/Events";
import Founders from "@/components/sections/Founders";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <News />
        <Events />
        <Founders />
      </main>
      <Footer />
    </>
  );
}
