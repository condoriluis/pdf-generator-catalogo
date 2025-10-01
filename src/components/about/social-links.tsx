import { siYoutube } from 'simple-icons';
import { ExternalLink, SimpleIcon, siLinkedin, siGithub, siPortafolio } from '../common';

const getIcon = (social: string) => {
  switch (social) {
    case 'Youtube':
      return siYoutube;
    case 'Github':
      return siGithub;
    case 'Linkedin':
      return siLinkedin;
    case 'My Portafolio':
      return siPortafolio;
    default:
      return null;
  }
};

const profiles = [
  {
    network: 'Youtube',
    url: 'https://www.youtube.com/@lcz-softwaredeveloper3466/videos',
    username: 'lcz-softwaredeveloper',
  },
  {
    network: 'Github',
    url: 'https://github.com/condoriluis',
    username: 'condoriluis',
  },
  {
    network: 'Linkedin',
    url: 'https://www.linkedin.com/in/condoriluis/',
    username: 'condoriluis',
  },
  {
    network: 'My Portafolio',
    url: 'https://luis-portafolio.vercel.app/',
    username: 'luis-portafolio',
  },
];

export const SocialLinks = () => {
  return (
    <>
      {profiles
        .map((p) => ({ ...p, icon: getIcon(p.network) }))
        .filter((p) => p.icon !== null)
        .map((p) => (
          <ExternalLink key={p.network} href={p.url}>
            <SimpleIcon icon={p.icon!} />
            <span className='sr-only'>{p.network}</span>
          </ExternalLink>
        ))}
    </>
  );
};
