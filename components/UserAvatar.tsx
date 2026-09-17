import React from 'react';

interface UserAvatarProps {
  name: string;
  email?: string;
  photoUrl?: string; // Mantido para compatibilidade de tipos, mas ignorado conforme solicitado
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showM365Badge?: boolean;
  className?: string;
}

// Extrai estritamente as iniciais do Primeiro Nome e Último Sobrenome (Padrão Oficial Microsoft Teams)
export const getNameAndSurnameInitials = (fullName: string): string => {
  if (!fullName) return 'M3';

  const clean = fullName.trim();

  // Trata formato corporativo com vírgula (ex: "Popayan, Oscar" ou "Rodriguez, Carlos")
  if (clean.includes(',')) {
    const parts = clean.split(',').map(s => s.trim().replace(/[^\w\sÀ-ÿ]/g, '')).filter(Boolean);
    if (parts.length >= 2) {
      const surnameWord = parts[0].split(/\s+/)[0] || '';
      const nameWord = parts[1].split(/\s+/)[0] || '';
      if (nameWord && surnameWord) {
        return (nameWord[0] + surnameWord[0]).toUpperCase();
      }
    }
  }

  // Remove caracteres especiais mantendo acentuação e espaços
  const words = clean
    .replace(/[^\w\sÀ-ÿ]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return 'M3';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  const firstName = words[0];
  const lastName = words[words.length - 1]; // Sobrenome

  return (firstName[0] + lastName[0]).toUpperCase();
};

// Paleta oficial de avatares com iniciais do Microsoft Teams (tons suaves e alta legibilidade)
const TEAMS_PALETTES = [
  { bg: 'bg-[#DCE0FA] dark:bg-[#32365A]', text: 'text-[#202452] dark:text-[#DCE0FA]', border: 'border-[#C8CEF5] dark:border-[#434878]' }, // Periwinkle (exato da imagem "OP" do Teams)
  { bg: 'bg-[#E8D5F5] dark:bg-[#3C284C]', text: 'text-[#4A1663] dark:text-[#E8D5F5]', border: 'border-[#D9BCF0] dark:border-[#523769]' }, // Soft Lilac
  { bg: 'bg-[#D2EFF8] dark:bg-[#1E3B46]', text: 'text-[#0E495C] dark:text-[#D2EFF8]', border: 'border-[#B4E3F3] dark:border-[#2C5261]' }, // Soft Azure
  { bg: 'bg-[#D2F2E4] dark:bg-[#1C3E30]', text: 'text-[#0E5434] dark:text-[#D2F2E4]', border: 'border-[#B5E8D1] dark:border-[#2A5743]' }, // Soft Mint
  { bg: 'bg-[#FDE2D6] dark:bg-[#48281E]', text: 'text-[#7A2A12] dark:text-[#FDE2D6]', border: 'border-[#F8C4B0] dark:border-[#603629]' }, // Soft Coral
  { bg: 'bg-[#F9DFEE] dark:bg-[#452136]', text: 'text-[#6D1B4B] dark:text-[#F9DFEE]', border: 'border-[#F3BEDF] dark:border-[#5E2E4B]' }, // Soft Rose
  { bg: 'bg-[#E9E4FA] dark:bg-[#342D56]', text: 'text-[#3E297A] dark:text-[#E9E4FA]', border: 'border-[#D5CBF5] dark:border-[#4A3F78]' }, // Soft Iris
  { bg: 'bg-[#E1DFDD] dark:bg-[#323130]', text: 'text-[#201F1E] dark:text-[#E1DFDD]', border: 'border-[#D2D0CE] dark:border-[#484644]' }, // Soft Neutral
];

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  email,
  size = 'md',
  showM365Badge = false,
  className = ''
}) => {
  const cleanName = (name || email || 'Colaborador').trim();
  const initials = getNameAndSurnameInitials(cleanName);

  // Seleciona cor determinística baseada no nome e email
  let hash = 0;
  const seed = (name || email || '').toLowerCase();
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorTheme = TEAMS_PALETTES[Math.abs(hash) % TEAMS_PALETTES.length];

  // Tamanhos normatizados conforme padrão Microsoft Teams
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-14 h-14 text-lg'
  }[size];

  // Badge de presença do Teams (status Disponível: círculo verde com visto branco)
  const badgeClasses = {
    xs: 'w-2 h-2 -bottom-0.5 -right-0.5 ring-1',
    sm: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5 ring-1.5',
    md: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5 ring-2',
    lg: 'w-4 h-4 -bottom-0.5 -right-0.5 ring-2',
    xl: 'w-4.5 h-4.5 bottom-0 right-0 ring-2'
  }[size];

  return (
    <div 
      className={`relative inline-flex shrink-0 select-none ${className}`} 
      title={`${cleanName}${email ? ` (${email})` : ''} - Iniciais Teams: ${initials}`}
    >
      <div 
        className={`${sizeClasses} rounded-full overflow-hidden flex items-center justify-center font-bold tracking-wider ${colorTheme.bg} ${colorTheme.text} border ${colorTheme.border} shadow-xs select-none transition-transform duration-150`}
      >
        <span className="font-semibold select-none leading-none">
          {initials}
        </span>
      </div>

      {/* Badge Oficial Microsoft Teams: Status Disponível (Verde #107C41 com Checkmark Branco) */}
      {showM365Badge && (
        <span 
          className={`absolute ${badgeClasses} bg-[#107C41] ring-white dark:ring-slate-900 rounded-full flex items-center justify-center shadow-xs pointer-events-none z-10`}
          title="Microsoft Teams: Colaborador Ativo / Disponível"
        >
          <svg 
            viewBox="0 0 10 10" 
            className="w-[70%] h-[70%] text-white fill-none stroke-current stroke-[2.2] stroke-linecap-round stroke-linejoin-round"
          >
            <polyline points="2 5.2 4.2 7.5 8 2.5" />
          </svg>
        </span>
      )}
    </div>
  );
};
