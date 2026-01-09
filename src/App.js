import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import WelcomeToTripFluence from "./components/WelcomeToTripFluence";
import WhatsNext from "./components/WhatsNext";
import WhyTripFluence from "./components/WhyTripFluence";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import FindCreators from "./pages/FindCreators";
import FindBrands from "./pages/FindBrands";
import OnboardCreator from "./pages/OnboardCreator";
import OnboardBrand from "./pages/OnboardBrand";
import CreaterAccount from "./pages/CreaterAccount";
import BrandsAccount from "./pages/BrandsAccount";
import Chat from "./pages/Chat";
import HowItWorks from "./components/HowItWorks";
import ForBrands from "./components/ForBrands";
import ForTravelCreators from "./components/ForTravelCreators";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function RequireAuth({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    async function getInitial() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;
      setStatus(session ? 'authed' : 'unauth');
    }
    getInitial();
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setStatus(session ? 'authed' : 'unauth');
    });
    return () => { active = false; subscription?.subscription?.unsubscribe?.(); };
  }, []);

  if (status === 'loading') return null;
  if (status === 'authed') return children;
  const next = encodeURIComponent(location.pathname + location.search);
  return <Navigate to={`/login?next=${next}`} replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <Hero />
              <WhyTripFluence />
              <ForBrands/>
              <ForTravelCreators/>
              <HowItWorks/>
              <WhatsNext />
              <WelcomeToTripFluence />
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/find-creators" element={<RequireAuth><FindCreators /></RequireAuth>} />
        <Route path="/find-brands" element={<RequireAuth><FindBrands /></RequireAuth>} />
        <Route path="/onboard-creator" element={<RequireAuth><OnboardCreator /></RequireAuth>} />
        <Route path="/onboard-brand" element={<RequireAuth><OnboardBrand /></RequireAuth>} />
        <Route path="/creater-account" element={<RequireAuth><CreaterAccount /></RequireAuth>} />
        <Route path="/creater-account/:id" element={<RequireAuth><CreaterAccount /></RequireAuth>} />
        <Route path="/brands-account" element={<RequireAuth><BrandsAccount /></RequireAuth>} />
        <Route path="/brands-account/:id" element={<RequireAuth><BrandsAccount /></RequireAuth>} />
        <Route path="/chat" element={<RequireAuth><Chat /></RequireAuth>} />
      </Routes>
    </Router>
  );
}

export default App;
