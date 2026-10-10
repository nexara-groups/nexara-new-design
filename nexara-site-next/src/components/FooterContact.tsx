import React from 'react';
import { Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { DATA } from '@/lib/data';

export default function FooterContact() {
  const { phone, address, social, legal } = DATA.contact;
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
    <div className="footer-contact-block__social">
      <span className="footer-contact-block__label">Find Nexara</span>
      <ul>{social.map(link => <li key={link.href}><a href={link.href} target="_blank" rel="noopener noreferrer me">{link.label} <ArrowUpRight size={15} aria-hidden="true" /></a></li>)}</ul>
    </div>
    <p className="footer-contact-block__legal">
      {legal.name} · CIN {legal.cin} · GSTIN {legal.gstin}
    </p>
  </div>;
}
