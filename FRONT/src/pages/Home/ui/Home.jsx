import React from "react";
import { Header } from "../../../widgets/Header";
import { HeroSection } from "../../../widgets/HeroSection";
import { ProductCategories } from "../../../features/ProductCategories";
import { ManagingSlider } from "../../../features/ManagingSlider";
import { Portfolio } from "../../../widgets/Portfolio";
import { CaseSlider } from "../../../features/CaseSlider";

function Home() {
  return (
    <div>
      <Header />
      <HeroSection />
      <ProductCategories />
      <ManagingSlider />
      <Portfolio />
      <CaseSlider />
    </div>
  );
}

export default Home;
