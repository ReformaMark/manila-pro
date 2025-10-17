import CallToAction from "./_components/call-to-action";
import FeaturedProperties from "./_components/featured-properties";
import FooterComponent from "./_components/FooterComponent";
import Hero from "./_components/Hero";
import Locations from "./_components/Locations";
import ParallaxScrollSection from "./_components/parallax-scroll-section";
import ReactLenisContext from "./_components/react-lenis";
import Services from "./_components/Services";

const LandingPage = () => {
  return (
    <ReactLenisContext>
      <Hero />
      <ParallaxScrollSection />
      <CallToAction />
      <FeaturedProperties />
      <div className="min-h-screen flex flex-col justify-around">
        <Services />
        <Locations />
      </div>
      <FooterComponent />
    </ReactLenisContext>
  );
};
export default LandingPage;
