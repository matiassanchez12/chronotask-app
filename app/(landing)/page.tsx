import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Footer from "./components/footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
