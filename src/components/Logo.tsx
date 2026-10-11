import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizes = {
  sm: { box: 'h-8 w-8', text: 'text-lg', sub: 'text-[8px]', letter: 'text-sm' },
  md: { box: 'h-10 w-10', text: 'text-xl', sub: 'text-[9px]', letter: 'text-base' },
  lg: { box: 'h-14 w-14', text: 'text-3xl', sub: 'text-xs', letter: 'text-xl' },
};

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const s = sizes[size];
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className={`${s.box} relative flex items-center justify-center rounded-lg bg-gradient-to-br from-blanco-gold to-blanco-gold-dark shadow-gold transition-all duration-300 group-hover:scale-105 group-hover:shadow-gold-lg`}>
        <span className={`font-display font-bold text-blanco-black ${s.letter}`}>B</span>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-bold tracking-wider text-blanco-white ${s.text} transition-colors duration-300 group-hover:text-blanco-gold`}>BLANCO</span>
          <span className={`font-medium tracking-[0.3em] text-blanco-gold ${s.sub} uppercase`}>Fitness</span>
        </div>
      )}
    </Link>
  );
}
