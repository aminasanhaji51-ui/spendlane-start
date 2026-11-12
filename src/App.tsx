import { Link, NavLink, Route, Routes } from 'react-router-dom';
import EnvironmentBanner from './components/EnvironmentBanner';
import Demo from './pages/Demo';
import Home from './pages/Home';

export default function App() {
  return (
    <>
      <EnvironmentBanner />
      <header className="site-header">
        <Link to="/" className="logo">
          Spendlane
        </Link>
        <nav>
          <NavLink to="/demo" className="button button-small">
            Book a demo
          </NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<Demo />} />
        </Routes>
      </main>
      <footer className="site-footer">Spendlane automates expense reports for small and mid-sized companies.</footer>
    </>
  );
}
