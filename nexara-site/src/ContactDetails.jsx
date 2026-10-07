import React from 'react';
import { Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { DATA } from './data.js';

export default function ContactDetails() {
  const { phone, address } = DATA.contact;
  return (
    <div className="contact-details" aria-label="Contact Nexara">
      <div className="contact-details__phone">
        <span className="contact-details__label"><Phone size={17} aria-hidden="true" /> Call us</span>
        <a className="contact-details__number" href={phone.href}>{phone.display}</a>
        <span className="contact-details__note">Let’s talk about your next project.</span>
      </div>
      <div className="contact-details__office">
        <span className="contact-details__label"><MapPin size={17} aria-hidden="true" /> Visit our office</span>
        <address>{address.street}<br />{address.city}</address>
        <a className="contact-details__directions" href={address.mapsHref} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={16} aria-hidden="true" /></a>
      </div>
    </div>
  );
}
