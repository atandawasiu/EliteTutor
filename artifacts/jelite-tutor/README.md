# Jelite Tutor

Jelite Tutor is an education platform for learners preparing for exams and building practical academic confidence. It includes exam practice, study tools, community features, learning portals, and administrative content management.

## Tech stack

- React and TypeScript
- Vite
- TanStack Router
- Tailwind CSS
- Supabase authentication and data services
- shadcn/ui components

## Local development

From this directory:

```bash
pnpm install
pnpm dev
```

Useful commands:

```bash
pnpm typecheck
pnpm build
pnpm serve
```

Create a local `.env` file with the Supabase values used by the app:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Deployment

The Vite production output is generated in `dist/public`. The repository-level Vercel configuration points to this output directory and runs the workspace build before deployment.

## Builder

Built by **Wasiu Aduragbemi Atanda**.

## License

All rights reserved unless otherwise stated by the project owner.
