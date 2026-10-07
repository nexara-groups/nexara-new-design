import React from 'react';
import { Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { DATA } from './data.js';

export default function FooterContact() {
  const { phone, address } = DATA.contact;
  return <div className="footer-contact-block">
    <div className="footer-contact-block__phone">
      <span className="footer-contact-block__label"><Phone size={16} aria-hidden="true" /> Call Nexara</span>
      <a href={phone.href}>{phone.display}</a>
    </div>
    <div className="footer-contact-block__office">
      <span className="footer-contact-block__label"><MapPin size={16} aria-hidden="true" /> Our office</span>
      <address>{address.street}<br />{address.city}</address>
      <a href={address.mapsHref} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={15} aria-hidden="true" /></a>
    </div>
  </div>;
}
