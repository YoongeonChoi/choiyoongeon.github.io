export interface Heading {
  id: string;
  text: string;
  depth: 2 | 3;
}

export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  date: string;
  updated?: string;
  tags: string[];
  category: string;
  featured: boolean;
  readingTimeMinutes: number;
  content: string;
  html: string;
  headings: Heading[];
}

export interface ProjectLinkSet {
  demo?: string;
  repo?: string;
  caseStudy?: string;
}

export interface ProjectEntry {
  slug: string;
  title: string;
  summary: string;
  role: string;
  timeline: string;
  featured: boolean;
  order: number;
  stack: string[];
  impact: string[];
  links: ProjectLinkSet;
  content: string;
  html: string;
  headings: Heading[];
}
