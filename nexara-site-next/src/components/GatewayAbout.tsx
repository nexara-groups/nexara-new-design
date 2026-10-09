import { DATA } from '@/lib/data';
import { getSeo } from '@/lib/seo';
import '@/styles/gateway-about.css';

// Server-rendered brand copy under the gateway chooser, so the homepage says
// what Nexara is in plain text (the chooser itself is mostly visual).
const teams = [
  { name: 'Product Studio', page: 'labs' },
  { name: 'Digital Solutions', page: 'marketing' },
  { name: 'Academy', page: 'academy' },
] as const;

export default function GatewayAbout() {
  const intro = getSeo({ theme: null, page: 'gateway', detail: null });
  const { phone, address, social, legal } = DATA.contact;
  return (
    <section className="gw-about" aria-labelledby="gw-about-title">
      <div className="gw-about__inner">
        <p className="gw-about__eyebrow">About Nexara</p>
        <h2 id="gw-about-title">{intro.heading}</h2>
        <p className="gw-about__lead">{intro.body}</p>
        <ul className="gw-about__teams">
          {teams.map(team => {
            const seo = getSeo({ theme: 'trust', page: team.page, detail: null });
            return (
              <li key={team.page}>
                <h3><a href={'/trust/' + team.page}>{team.name}</a></h3>
                <p>{seo.description}</p>
              </li>
            );
          })}
        </ul>
        <div className="gw-about__meta">
          <address>
            <strong>{legal.name}</strong><br />
            {address.street}, {address.city}<br />
            CIN {legal.cin} · GSTIN {legal.gstin}<br />
            <a href={phone.href}>{phone.display}</a> · <a href="mailto:info@nexaragroups.com">info@nexaragroups.com</a>
          </address>
          <ul className="gw-about__social">
            {social.map(link => <li key={link.href}><a href={link.href} target="_blank" rel="noopener noreferrer me">{link.label}</a></li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
