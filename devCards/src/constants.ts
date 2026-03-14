import type { PlayerClass, ClassTheme } from './types';

export const CLASS_THEMES: Record<PlayerClass, ClassTheme> = {
  Frontend: {
    primaryColor: '#3B82F6',
    secondaryColor: '#1D4ED8',
    icon: '🎨',
    backgroundGradient: 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 50%, #93C5FD 100%)',
  },
  Backend: {
    primaryColor: '#10B981',
    secondaryColor: '#065F46',
    icon: '⚙️',
    backgroundGradient: 'linear-gradient(135deg, #065F46 0%, #10B981 50%, #6EE7B7 100%)',
  },
  Fullstack: {
    primaryColor: '#8B5CF6',
    secondaryColor: '#5B21B6',
    icon: '⚡',
    backgroundGradient: 'linear-gradient(135deg, #5B21B6 0%, #8B5CF6 50%, #C4B5FD 100%)',
  },
  DevOps: {
    primaryColor: '#F59E0B',
    secondaryColor: '#92400E',
    icon: '🚀',
    backgroundGradient: 'linear-gradient(135deg, #92400E 0%, #F59E0B 50%, #FCD34D 100%)',
  },
};

export const TECH_LIST: string[] = [
  // Frontend
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Svelte',
  'Next.js', 'Nuxt', 'Astro', 'Remix', 'Vite', 'Webpack', 'Tailwind', 'Sass',
  'GraphQL', 'Redux', 'Zustand', 'React Query',
  // Backend
  'Node.js', 'Express', 'NestJS', 'Fastify', 'Python', 'Django', 'FastAPI', 'Flask',
  'Java', 'Spring Boot', 'Kotlin', 'Go', 'Rust', 'C#', '.NET', 'PHP', 'Laravel',
  'Ruby', 'Rails', 'Elixir', 'Phoenix', 'Scala', 'Haskell',
  // Bases de datos
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Prisma', 'TypeORM',
  'Elasticsearch', 'Cassandra', 'DynamoDB', 'Supabase', 'Firebase',
  // DevOps & Cloud
  'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions',
  'AWS', 'GCP', 'Azure', 'Vercel', 'Netlify', 'Nginx', 'Linux',
  'Prometheus', 'Grafana', 'Datadog',
  // Otros
  'Git', 'Vim', 'WebAssembly', 'gRPC', 'Kafka', 'RabbitMQ',
  'C', 'C++', 'Assembly', 'Bash',
].sort();

export const LEGENDARY_COMBOS: string[][] = [
  // Frontend
  ['React', 'TypeScript', 'Node.js'],
  ['Vue', 'TypeScript', 'Vite'],
  ['Next.js', 'TypeScript', 'Tailwind'],
  ['React', 'GraphQL', 'TypeScript'],
  ['Svelte', 'TypeScript', 'Vite'],
  // Backend
  ['Python', 'Docker', 'Kubernetes'],
  ['Rust', 'WebAssembly', 'Docker'],
  ['Go', 'Kubernetes', 'gRPC'],
  ['Java', 'Spring Boot', 'Kafka'],
  ['Node.js', 'PostgreSQL', 'Redis'],
  // Fullstack
  ['React', 'Node.js', 'PostgreSQL'],
  ['Next.js', 'Prisma', 'PostgreSQL'],
  ['Vue', 'Laravel', 'MySQL'],
  ['Angular', 'NestJS', 'MongoDB'],
  // DevOps
  ['Docker', 'Kubernetes', 'Terraform'],
  ['Ansible', 'Terraform', 'Jenkins'],
  ['GitHub Actions', 'Docker', 'AWS'],
  ['Prometheus', 'Grafana', 'Kubernetes'],
  // Wildcards míticos
  ['Linux', 'Vim', 'Git'],
  ['Assembly', 'C', 'Rust'],
];
