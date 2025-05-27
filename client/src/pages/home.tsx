import { Helmet } from "react-helmet-async";
import WatchConfigurator from "@/components/watch/WatchConfigurator";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Seiko Watch Customizer | Design Your Perfect Watch</title>
        <meta
          name="description"
          content="Customize your perfect Seiko watch with our interactive 3D watch configurator. Mix and match cases, dials, hands, and bezels to create your unique timepiece."
        />
      </Helmet>
      <div className="min-h-screen bg-white">
        <WatchConfigurator />
      </div>
    </>
  );
}
