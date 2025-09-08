import { type SimpleIcon as SimpleIconType } from 'simple-icons';

import { cn } from '@/lib/utils';

type SimpleIconProp = {
  icon: SimpleIconType;
  size?: number;
  className?: string;
};

export const SimpleIcon: React.FC<SimpleIconProp> = ({
  icon: { path, title, hex },
  className,
  size = 24,
}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`0 0 ${size} ${size}`}
      height={size}
      width={size}
      style={{ '--inline-icon-color': `#${hex}` } as React.CSSProperties}
      className={cn(
        'm-1 inline fill-current hover:cursor-pointer hover:fill-[var(--inline-icon-color)]',
        className,
      )}
    >
      <title>{title}</title>
      <path d={path} />
    </svg>
  );
};

// some icons removed from simple-icons, use with discretion
// https://github.com/simple-icons/simple-icons/issues/11236

export const siGithub: SimpleIconType = {
  guidelines: 'https://brand.github.com/policies',
  hex: '24292E',
  path: 'M12 2.247a10 10 0 0 0-3.162 19.487c.5.088.687-.212.687-.475 0-.237-.012-1.025-.012-1.862-2.513.462-3.163-.613-3.363-1.175a3.64 3.64 0 0 0-1.025-1.413c-.35-.187-.85-.65-.013-.662a2 2 0 0 1 1.538 1.025 2.137 2.137 0 0 0 2.912.825 2.1 2.1 0 0 1 .638-1.338c-2.225-.25-4.55-1.112-4.55-4.937a3.9 3.9 0 0 1 1.025-2.688 3.6 3.6 0 0 1 .1-2.65s.837-.262 2.75 1.025a9.43 9.43 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025a3.6 3.6 0 0 1 .1 2.65 3.87 3.87 0 0 1 1.025 2.688c0 3.837-2.338 4.687-4.562 4.937a2.37 2.37 0 0 1 .674 1.85c0 1.338-.012 2.413-.012 2.75 0 .263.187.575.687.475A10.005 10.005 0 0 0 12 2.247',
  slug: 'github',
  source: 'https://brand.github.com',
  svg: '<svg width="600" height="600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="M12 2.247a10 10 0 0 0-3.162 19.487c.5.088.687-.212.687-.475 0-.237-.012-1.025-.012-1.862-2.513.462-3.163-.613-3.363-1.175a3.64 3.64 0 0 0-1.025-1.413c-.35-.187-.85-.65-.013-.662a2 2 0 0 1 1.538 1.025 2.137 2.137 0 0 0 2.912.825 2.1 2.1 0 0 1 .638-1.338c-2.225-.25-4.55-1.112-4.55-4.937a3.9 3.9 0 0 1 1.025-2.688 3.6 3.6 0 0 1 .1-2.65s.837-.262 2.75 1.025a9.43 9.43 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025a3.6 3.6 0 0 1 .1 2.65 3.87 3.87 0 0 1 1.025 2.688c0 3.837-2.338 4.687-4.562 4.937a2.37 2.37 0 0 1 .674 1.85c0 1.338-.012 2.413-.012 2.75 0 .263.187.575.687.475A10.005 10.005 0 0 0 12 2.247"/></svg>',
  title: 'GitHub',
};

export const siLinkedin: SimpleIconType = {
  guidelines: 'https://brand.linkedin.com/policies',
  hex: '0A66C2',
  path: 'M19.959 11.719v7.379h-4.278v-6.885c0-1.73-.619-2.91-2.167-2.91-1.182 0-1.886.796-2.195 1.565-.113.275-.142.658-.142 1.043v7.187h-4.28s.058-11.66 0-12.869h4.28v1.824l-.028.042h.028v-.042c.568-.875 1.583-2.126 3.856-2.126 2.815 0 4.926 1.84 4.926 5.792M2.421.026C.958.026 0 .986 0 2.249c0 1.235.93 2.224 2.365 2.224h.028c1.493 0 2.42-.989 2.42-2.224C4.787.986 3.887.026 2.422.026zM.254 19.098h4.278V6.229H.254z',
  slug: 'linkedin',
  source: 'https://brand.linkedin.com',
  svg: '<svg width="600" height="600" viewBox="-2 -2 24 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" class="jam jam-linkedin"><path d="M19.959 11.719v7.379h-4.278v-6.885c0-1.73-.619-2.91-2.167-2.91-1.182 0-1.886.796-2.195 1.565-.113.275-.142.658-.142 1.043v7.187h-4.28s.058-11.66 0-12.869h4.28v1.824l-.028.042h.028v-.042c.568-.875 1.583-2.126 3.856-2.126 2.815 0 4.926 1.84 4.926 5.792M2.421.026C.958.026 0 .986 0 2.249c0 1.235.93 2.224 2.365 2.224h.028c1.493 0 2.42-.989 2.42-2.224C4.787.986 3.887.026 2.422.026zM.254 19.098h4.278V6.229H.254z"/></svg>',
  title: 'LinkedIn',
};

export const siPortafolio: SimpleIconType = {
  hex: '28E98C',
  path: "M21 9H3v10h18zm0-2V5H3v2zM3 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z",
  slug: 'portafolio',
  source: 'https://brand.com',
  svg: '<svg width="600" height="600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Portafolio</title><path fill-rule="evenodd" d="M21 9H3v10h18zm0-2V5H3v2zM3 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"/></svg>',
  title: 'Portafolio',
};