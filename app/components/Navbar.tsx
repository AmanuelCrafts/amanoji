'use client';

export default function Navbar({ onLogoClick }: { onLogoClick: () => void }) {
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <a
          href="#"
          className="logo"
          onClick={(e) => { e.preventDefault(); onLogoClick(); }}
        >
          <span>Aman</span>oji
        </a>
      </div>
    </nav>
  );
}
