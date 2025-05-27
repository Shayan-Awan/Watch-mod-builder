import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./pages/home";
import PartsCatalog from "./pages/parts-catalog";
import JewelryDesigner from "./pages/jewelry-designer";
import CommunityForum from "./pages/community-forum";
import WatchShowcase from "./pages/watch-showcase";
import NotFound from "./pages/not-found";
import { Suspense, useEffect } from "react";
import { useAudio } from "./lib/stores/useAudio";
import Navbar from "./components/Navbar";

function App() {
  // Initialize audio elements
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  useEffect(() => {
    // Set up audio elements
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);

    const hit = new Audio("/sounds/hit.mp3");
    setHitSound(hit);

    const success = new Audio("/sounds/success.mp3");
    setSuccessSound(success);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/parts-catalog" element={<PartsCatalog />} />
            <Route path="/jewelry-designer" element={<JewelryDesigner />} />
            <Route path="/community-forum" element={<CommunityForum />} />
            <Route path="/watch-showcase" element={<WatchShowcase />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
