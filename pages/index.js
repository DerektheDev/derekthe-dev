import { useEffect, useState } from "react";
import Head from "next/head";
import Nav from "./home/Nav";
import Hero from "./home/Hero";
import WorkCards from "./home/WorkCards";
import Footer from "./home/Footer";
import styles from "./index.module.css";

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let rafId;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const el = document.documentElement;
        const scrolled = el.scrollTop || document.body.scrollTop;
        const total = el.scrollHeight - el.clientHeight;
        setProgress(total > 0 ? scrolled / total : 0);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);
  return progress;
}

export default function Home() {
  const scrollProgress = useScrollProgress();

  return (
    <>
      <Head>
        <title>Derek Montgomery — Software Engineer</title>
        <meta name="description" content="Senior Software Engineer specializing in Rails, React, and AI." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </Head>

      <div className={`page-wrap space-mono ${styles.pageWrap}`}>

        {/* Scroll progress bar */}
        <div className={styles.progressBar} style={{ '--progress': scrollProgress }} />

        {/* Ambient glow */}
        <div className={styles.ambientGlow} />

        <Nav />
        <Hero />
        <WorkCards />
        <Footer />

      </div>
    </>
  );
}
