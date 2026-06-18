'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link href="/" className="logo">
          <span>Aman</span>oji
        </Link>
      </div>
    </nav>
  );
}
