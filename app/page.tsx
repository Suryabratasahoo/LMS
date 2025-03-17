import Image from "next/image";
import CTA from "../components/LandingPage/CTA";
import Features from "../components/LandingPage/Features";
import Footer from "../components/LandingPage/Footer";
import Header from "../components/LandingPage/Header";
import Testimonials from "../components/LandingPage/Testimonials";
import Hero from "@/components/LandingPage/Hero";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
