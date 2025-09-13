import AfterHeroSection from "@/components/AfterHeroComponent";
import AllProductsLabel from "@/components/AllProductsLabel";
import Hero from "@/components/Hero";
import NewArrivalsServer from "@/components/NewArrivals.server";



const HomePage = () => {
  return (
    <div className="">
      <Hero />

      {/* after hero new arrivals and comming soon */}

      {/*  */}
      <AfterHeroSection />

      {/* Last added products */}

      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-36">
        <h2 className="text-center text-2xl pb-10">
          <AllProductsLabel />
        </h2>
        <NewArrivalsServer />
      </div>
    </div>
  );
};

export default HomePage;
