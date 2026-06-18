import Navbar from './components/Navbar';
import SearchHero from './components/SearchHero';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <SearchHero />
      <footer className="footer">
        <p className='caption'><a href="https://github.com/AmanuelCrafts" target="_blank" rel="noopener noreferrer">AmanuelCrafts {'\uD83D\uDCBB'}</a></p>
      </footer>
    </>
  );
}
