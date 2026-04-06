export default function LandingPage({ onEnter }) {
  return (
    <div 
      className="flex h-screen flex-col items-center justify-center cursor-pointer bg-slate-900"
      onClick={onEnter}
    >
      <h1 className="text-6xl font-bold text-white tracking-tighter">TRINITY DUEL</h1>
      <p className="mt-4 text-slate-400 animate-pulse">Click to Enter Game</p>
    </div>
  );
}