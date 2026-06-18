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
      <div className="ad-container ad-leaderboard" style={{ maxWidth: 1200, margin: '30px auto 0' }}>
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-6168141382402894"
          data-ad-slot="YOUR_SLOT_ID"
          data-ad-format="auto"
          data-full-width-responsive="true" />
      </div>
      <footer className="footer">
        <p><span>&copy;</span> <span>Aman</span>oji</p>
      </footer>
    </>
  );
}
