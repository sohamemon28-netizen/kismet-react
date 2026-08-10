import Hero from "../components/Hero";
import Featured from "../components/Featured";
import Newsletter from "../components/Newsletter";

function Home() {
  return (
    <>
      <Hero />
    <Featured limit={3} />
      <Newsletter />
    </>
  );
}

export default Home;