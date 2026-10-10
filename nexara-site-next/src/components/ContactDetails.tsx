import React from 'react';
import { Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { DATA } from '@/lib/data';
import { COPY } from '@/lib/copy';
import { voiced, type Theme } from '@/lib/site';

export default function ContactDetails({
  theme,
  className = 'contact-details',
}: {
  theme?: Theme;
  className?: string;
}) {
  const { phone, address } = DATA.contact;
  const label = theme
    ? {
        phone: voiced(COPY.contact.phone, theme),
        note: voiced(COPY.contact.note, theme),
        office: voiced(COPY.contact.office, theme),
        directions: voiced(COPY.contact.directions, theme),
      }
    : {
        phone: 'Call us',
        note: 'Let us talk about the next project.',
        office: 'Visit the office',
        directions: 'Get directions',
      };
  return (
    <div className={className} aria-label="Contact Nexara">
      <div className="contact-details__phone">
        <span className="contact-details__label"><Phone size={17} aria-hidden="true" /> {label.phone}</span>
        <a className="contact-details__number" href={phone.href}>{phone.display}</a>
        <span className="contact-details__note">{label.note}</span>
      </div>
      <div className="contact-details__office">
        <span className="contact-details__label"><MapPin size={17} aria-hidden="true" /> {label.office}</span>
        <address>{address.street}<br />{address.city}</address>
        <a className="contact-details__directions" href={address.mapsHref} target="_blank" rel="noopener noreferrer">
          {label.directions} <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
