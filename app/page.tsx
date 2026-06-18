'use client';

import Navbar from './components/Navbar';
import SearchHero from './components/SearchHero';

export default function HomePage() {
  return (
    <>
      <Navbar
        onLogoClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          window.location.reload();
        }}
      />
      <SearchHero />
      <footer className="footer">
        <p><span>&copy;</span> <span>Aman</span>oji</p>
      </footer>
    </>
  );
}
