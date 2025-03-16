

import FooterComponent from "./_components/FooterComponent";
import Hero from "./_components/Hero";
import Locations from "./_components/Locations";
import Services from "./_components/Services";
import SubHero from "./_components/SubHero";


const LandingPage = () => {
  return (
    <div className="">
        <Hero/>
        <SubHero/>
        <Services/>
        <Locations/>
        <FooterComponent/>
    </div>
  )
}
export default LandingPage;