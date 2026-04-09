import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef } from "react";
import Home      from "./pages/Home";
import Analyze   from "./pages/Analyze";
import Dashboard from "./pages/Dashboard";
import Research  from "./pages/Research";
import Login     from "./pages/Login";
import Signup    from "./pages/Signup";
import NotFound  from "./pages/NotFound";

function CustomCursor() {
  const dot  = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    let rx = 0, ry = 0;

    const onMove = (e) => {
      const x = e.clientX, y = e.clientY;
      if (dot.current) {
        dot.current.style.left = x + "px";
        dot.current.style.top  = y + "px";
      }
      rx += (x - rx) * 0.12;
      ry += (y - ry) * 0.12;
      if (ring.current) {
        ring.current.style.left = rx + "px";
        ring.current.style.top  = ry + "px";
      }
    };

    const onEnter = () => {
      if (dot.current)  dot.current.style.transform  = "translate(-50%,-50%) scale(2)";
      if (ring.current) ring.current.style.transform = "translate(-50%,-50%) scale(1.5)";
    };

    const onLeave = () => {
      if (dot.current)  dot.current.style.transform  = "translate(-50%,-50%) scale(1)";
      if (ring.current) ring.current.style.transform = "translate(-50%,-50%) scale(1)";
    };

    window.addEventListener("mousemove", onMove);

    const clickables = document.querySelectorAll("a, button, [role='button']");
    clickables.forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      clickables.forEach(el => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={dot} style={{
        position: "fixed", width: 8, height: 8,
        background: "#c8f060", borderRadius: "50%",
        pointerEvents: "none", zIndex: 99999,
        transform: "translate(-50%,-50%)",
        transition: "transform 0.15s cubic-bezier(0.16,1,0.3,1)",
        mixBlendMode: "difference",
        display: window.innerWidth <= 768 ? "none" : "block",
      }} />
      <div ref={ring} style={{
        position: "fixed", width: 36, height: 36,
        border: "1px solid rgba(200,240,96,0.5)",
        borderRadius: "50%", pointerEvents: "none",
        zIndex: 99998, transform: "translate(-50%,-50%)",
        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
        display: window.innerWidth <= 768 ? "none" : "block",
      }} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Routes>
        <Route path="/"          element={<Home />}      />
        <Route path="/analyze"   element={<Analyze />}   />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/research"  element={<Research />}  />
        <Route path="/login"     element={<Login />}     />
        <Route path="/signup"    element={<Signup />}    />
        <Route path="*"          element={<NotFound />}  />
      </Routes>
    </BrowserRouter>
  );
}

//final commit 