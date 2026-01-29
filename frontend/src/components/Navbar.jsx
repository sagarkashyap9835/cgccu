import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../pages/Appcontext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { token, setToken, userData, searchTerm, setSearchTerm } = useContext(AppContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    setToken(false);
    localStorage.removeItem('token');
    toast.success('Signed Out Successfully');
  };

  const handleLinkClick = (path) => {
    navigate(path);
    setShowMenu(false);
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 py-3' : 'bg-transparent py-5'}`}>
      <nav className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-12 gap-8">

        {/* LOGO SECTION */}
        <Link to="/" className="flex-shrink-0 group relative">
          <div className="flex flex-col">
            <h1 className={`text-2xl md:text-3xl font-black tracking-tighter leading-none flex items-center gap-1 transition-colors duration-500 ${isScrolled ? 'text-black' : 'text-slate-900'}`}>
              RENTAL <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic">HUB</span>
            </h1>
            <span className="text-[8px] font-bold tracking-[0.4em] uppercase opacity-50 text-slate-500 group-hover:tracking-[0.6em] transition-all duration-500">Premium Housing</span>
          </div>
        </Link>

        {/* CENTER SEARCH SECTION */}
        <div className={`hidden md:flex items-center flex-grow max-w-xl px-5 py-2.5 rounded-2xl border transition-all duration-500 group focus-within:ring-4 focus-within:ring-blue-500/10 ${isScrolled ? 'bg-slate-100/50 border-slate-200 focus-within:bg-white' : 'bg-white/10 border-white/20 backdrop-blur-md focus-within:bg-white'}`}>
          <span className="text-lg opacity-40 group-focus-within:opacity-100 transition-opacity">🔍</span>
          <input
            type="text"
            placeholder="Explore by location or type..."
            className="bg-transparent outline-none w-full text-xs font-semibold px-3 text-slate-800 placeholder:text-slate-500/60"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (location.pathname !== '/findhome') navigate('/findhome');
            }}
          />
        </div>

        {/* ACTIONS SECTION */}
        <div className="flex items-center gap-4 md:gap-8">

          {/* Main Navigation - Hidden on Small/Medium screens */}
          <div className="hidden xl:flex items-center gap-10">
            {['Home', 'Findhome', 'About', 'Contact'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className={`text-[11px] font-bold uppercase tracking-[0.25em] transition-all duration-300 relative group overflow-hidden ${location.pathname === (item === 'Home' ? '/' : `/${item.toLowerCase()}`) ? 'text-blue-600' : isScrolled ? 'text-slate-600' : 'text-slate-800'} hover:text-blue-600`}
              >
                {item}
                <span className={`absolute bottom-0 left-0 h-[1.5px] bg-blue-600 transition-all duration-500 ${location.pathname === (item === 'Home' ? '/' : `/${item.toLowerCase()}`) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* CTA BUTTON */}
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-slate-200 border border-slate-700/50"
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              List Your Flat
            </a>

            {/* USER PROFILE / LOGIN */}
            {token && userData ? (
              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer p-0.5 rounded-full border-2 border-transparent hover:border-blue-500 transition-all duration-300">
                  <img className="w-9 h-9 rounded-full object-cover shadow-inner" src={userData.image} alt="User" />
                </div>
                <div className="absolute top-12 right-0 hidden group-hover:block bg-white border border-slate-100 rounded-2xl shadow-2xl z-[200] w-56 overflow-hidden animate-fade-in py-2">
                  <div className="px-6 py-4 border-b border-slate-50 mb-2">
                    <p className="text-xs font-black uppercase text-slate-800 truncate">{userData.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{userData.email}</p>
                  </div>
                  <Link to="/my-profile" className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 transition-all text-[11px] font-bold uppercase tracking-widest text-slate-700">👤 Profile</Link>
                  <Link to="/my-order" className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 transition-all text-[11px] font-bold uppercase tracking-widest text-slate-700">📦 Bookings</Link>
                  <div onClick={logout} className="flex items-center gap-3 px-6 py-3 hover:bg-red-50 hover:text-red-600 transition-all text-[11px] font-bold uppercase tracking-widest text-red-500 cursor-pointer mt-2 border-t border-slate-50">🚪 Sign Out</div>
                </div>
              </div>
            ) : (
              <button
                className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                onClick={() => navigate('/login')}
              >
                Secure Login
              </button>
            )}

            {/* CART (Simplified icon) */}
            <Link to="/cart" className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors hidden md:block">
              <span className="text-xl">🏢</span>
            </Link>

            {/* MOBILE MENU TOGGLE */}
            <button onClick={() => setShowMenu(true)} className="xl:hidden p-4 bg-slate-100 rounded-2xl active:scale-90 transition-all flex flex-col gap-1.5 items-end">
              <div className="w-6 h-0.5 bg-slate-900 rounded-full"></div>
              <div className="w-4 h-0.5 bg-slate-900 rounded-full"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE SEARCH TRAY */}
      <div className={`md:hidden px-6 overflow-hidden transition-all duration-500 ${isScrolled ? 'max-h-20 pb-4' : 'max-h-0'}`}>
        <div className="bg-slate-100 px-4 py-3 rounded-2xl border border-slate-200 flex items-center gap-3">
          <span className="text-sm opacity-50">🔍</span>
          <input
            type="text"
            placeholder="Search Rental Hub..."
            className="bg-transparent outline-none w-full text-xs font-bold text-slate-700"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (location.pathname !== '/findhome') navigate('/findhome');
            }}
          />
        </div>
      </div>

      {/* --- FULLSCREEN MODERN SIDEBAR --- */}
      <div className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[300] transition-all duration-700 ease-in-out ${showMenu ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className={`absolute top-0 right-0 h-full bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] transition-all duration-700 delay-100 flex flex-col ${showMenu ? 'w-full md:w-[450px]' : 'w-0'}`}>
          <div className="flex items-center justify-between px-10 py-12">
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-800">Explore</h2>
              <div className="w-12 h-1 bg-blue-600 rounded-full mt-1"></div>
            </div>
            <button onClick={() => setShowMenu(false)} className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full text-2xl hover:bg-slate-900 hover:text-white transition-all transform hover:rotate-90">✕</button>
          </div>

          <div className="flex flex-col gap-2 mt-4 px-6">
            {['Home', 'Findhome', 'About', 'Contact'].map((item, idx) => (
              <div
                key={item}
                onClick={() => handleLinkClick(item === 'Home' ? '/' : `/${item.toLowerCase()}`)}
                className={`group px-6 py-6 rounded-3xl hover:bg-slate-50 cursor-pointer transition-all duration-500 flex items-center justify-between ${showMenu ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
                style={{ transitionDelay: `${idx * 100 + 200}ms` }}
              >
                <p className="text-4xl font-black uppercase tracking-tighter text-slate-400 group-hover:text-slate-900 group-hover:scale-105 transition-all">
                  {item}
                </p>
                <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">➔</span>
              </div>
            ))}
          </div>

          <div className="mt-auto p-12 space-y-8">
            <div className="flex gap-6 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-8 transition-all duration-1000 delay-500">
              <span className="hover:text-blue-600 cursor-pointer">Instagram</span>
              <span className="hover:text-blue-600 cursor-pointer">Facebook</span>
              <span className="hover:text-blue-600 cursor-pointer">Twitter</span>
            </div>
            <p className="text-[10px] text-slate-300 italic tracking-widest">© 2026 RENTAL HUB PREMIUM SERVICES</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;