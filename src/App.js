import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
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

function RequireRole({ children, role }) {
  const location = useLocation();
  const [status, setStatus] = useState('loading');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    let active = true;
    async function loadRole(session) {
      if (!session?.user?.id) {
        setUserRole('');
        setStatus('unauth');
        return;
      }
      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('auth_id', session.user.id)
        .maybeSingle();
      if (!active) return;
      setUserRole(data?.role || '');
      setStatus('authed');
    }
    async function getInitial() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;
      await loadRole(session);
    }
    getInitial();
    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;
      await loadRole(session);
    });
    return () => { active = false; subscription?.subscription?.unsubscribe?.(); };
  }, []);

  if (status === 'loading') return null;
  if (status === 'unauth') {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  if (!userRole || userRole === role) return children;

  const isOnboardingPath = location.pathname.startsWith('/onboard-');
  const redirectTarget = isOnboardingPath
    ? userRole === 'brand'
      ? '/onboard-brand'
      : '/onboard-creator'
    : userRole === 'brand'
    ? '/brands-account'
    : '/creater-account';

  return <Navigate to={redirectTarget} replace />;
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
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/find-creators" element={<RequireRole role="brand"><FindCreators /></RequireRole>} />
        <Route path="/find-brands" element={<RequireRole role="creator"><FindBrands /></RequireRole>} />
        <Route path="/onboard-creator" element={<RequireRole role="creator"><OnboardCreator /></RequireRole>} />
        <Route path="/onboard-brand" element={<RequireRole role="brand"><OnboardBrand /></RequireRole>} />
        <Route path="/creater-account" element={<RequireRole role="creator"><CreaterAccount /></RequireRole>} />
        <Route path="/creater-account/:id" element={<RequireAuth><CreaterAccount /></RequireAuth>} />
        <Route path="/brands-account" element={<RequireRole role="brand"><BrandsAccount /></RequireRole>} />
        <Route path="/brands-account/:id" element={<RequireAuth><BrandsAccount /></RequireAuth>} />
        <Route path="/chat" element={<RequireAuth><Chat /></RequireAuth>} />
      </Routes>
    </Router>
  );
}

export default App;
