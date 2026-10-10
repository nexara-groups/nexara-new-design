/**
 * Academy overview spine (shared by Neo + Trust).
 * Students lead; colleges and employers are secondary lanes on the same path.
 *
 * Path: Map → Cohort → Proof → Place
 * Lanes: audience → package → subpage
 */
export const ACADEMY_PATH = ['Map', 'Cohort', 'Proof', 'Place'] as const;

export const ACADEMY_LANES = [
  {
    audience: 'Students',
    role: 'primary' as const,
    packageName: 'Career Cohort',
    subpage: 'tracks',
    subpageLabel: 'Tracks',
    neo: {
      body: 'Portfolio that stands up in interviews. Pick a track, ship projects, get placement-ready.',
      map: 'Student → Career Cohort → Tracks',
    },
    trust: {
      body: 'The primary programme: mapped track, cohort delivery, portfolio proof and placement prep.',
      map: 'Student → Career Cohort → Tracks',
    },
  },
  {
    audience: 'Colleges',
    role: 'secondary' as const,
    packageName: 'Internship Batch',
    subpage: 'internships',
    subpageLabel: 'Internships',
    neo: {
      body: 'Internship rhythm colleges can report: weekly demos, scores, completion proof.',
      map: 'College → Internship Batch → Internships',
    },
    trust: {
      body: 'Managed internship batches with weekly reporting the placement cell can show leadership.',
      map: 'College → Internship Batch → Internships',
    },
  },
  {
    audience: 'Employers',
    role: 'secondary' as const,
    packageName: 'Hiring Pipeline',
    subpage: 'placements',
    subpageLabel: 'Placements',
    neo: {
      body: 'Juniors who already shipped. Screened against your written role brief.',
      map: 'Employer → Hiring Pipeline → Placements',
    },
    trust: {
      body: 'Role-fit screening and interview prep against a written hiring brief.',
      map: 'Employer → Hiring Pipeline → Placements',
    },
  },
] as const;

/** Process step → path label → where it opens in the product. */
export const ACADEMY_STEP_LINKS = [
  { path: 'Map', opens: 'tracks' as const, opensLabel: 'Tracks', timing: 'Week 1', outcome: 'Track assigned' },
  { path: 'Cohort', opens: 'internships' as const, opensLabel: 'Internships', timing: 'Weeks 2–8', outcome: 'Weekly demos on record' },
  { path: 'Proof', opens: null, opensLabel: null, timing: 'Weeks 7–10', outcome: 'Interview-ready portfolio' },
  { path: 'Place', opens: 'placements' as const, opensLabel: 'Placements', timing: 'Week 10+', outcome: 'Interview path or report' },
] as const;
