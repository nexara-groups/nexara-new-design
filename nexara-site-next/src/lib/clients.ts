// Client helpers shared by every place a client is shown (home strip, home work, proof page).
import { DATA } from './data';

export type ClientTeam = 'marketing' | 'labs';

export interface ClientWork {
  name: string;
  url: string;
  logo: string;
  sector: string;
  place: string;
  /** Which Proof filters this case belongs to. Set explicitly — do not infer from scope tags. */
  teams: ClientTeam[];
  /** One line: what Nexara did. */
  line: string;
  /** Longer home write-up: what shipped on the live site. */
  story: { neo: string; trust: string };
  /** Client context: who they are and what they do. */
  does: string;
  /** Optional problem framing for the Proof case view. Only set when the brief is clear and approved. */
  problem?: { neo: string; trust: string };
  scope: string[];
  built: string[];
  badge?: string;
  /** Default selected case on the Proof page when the All filter is active. */
  featured?: boolean;
  /** Optional outcome line. Only set when there is a real, approved result. Omitted otherwise. */
  result?: string;
}

export const CLIENTS: ClientWork[] = DATA.work.live as ClientWork[];

export function clientTeams(client: ClientWork): ClientTeam[] {
  return client.teams;
}

export const clientDomain = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
