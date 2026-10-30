# Travel Planner

Travel Planner is a web application for planning and organizing trips. Create trips with dates, descriptions, and cover images; add destinations to each itinerary; and view locations on interactive maps. A personal dashboard keeps planned trips together, while a 3D globe visualizes destinations and the countries you have visited.

## Features

- Sign in with GitHub.
- Create and manage personal trips with dates, descriptions, and images.
- Add destinations using location search and geocoding.
- Organize itinerary locations with drag-and-drop ordering.
- Explore trip locations on interactive maps.
- View your destinations and visited countries on a 3D globe.
- Browse trips in a responsive interface with light and dark themes.

## Tech stack

- Next.js 16 with React 19 and TypeScript
- Auth.js with GitHub OAuth
- PostgreSQL and Prisma
- MapTiler geocoding, Leaflet maps, and `react-globe.gl`
- UploadThing for trip image uploads
- Tailwind CSS

## Requirements

- Node.js and pnpm
- A PostgreSQL database
- A GitHub OAuth application
- API credentials for MapTiler and UploadThing

## Getting started

1. Install dependencies:

```bash
pnpm install
```

2. Create a `.env` file in the project root and configure the required environment variables:

```dotenv
DATABASE_URL="postgresql://localhost:5432/travel_planner?schema=public"
AUTH_SECRET="your-auth-secret"
AUTH_GITHUB_ID="your-github-oauth-client-id"
AUTH_GITHUB_SECRET="your-github-oauth-client-secret"
MAPTILER_KEY="your-maptiler-api-key"
UPLOADTHING_TOKEN="your-uploadthing-token"
```

Configure your GitHub OAuth application's callback URL as
`http://localhost:3000/api/auth/callback/github` for local development. Use the corresponding URL for your deployed application in production.

3. Apply the database migrations and generate the Prisma client:

```bash
pnpm exec prisma migrate dev
pnpm exec prisma generate
```

4. Start the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Start the development server         |
| `pnpm build`        | Build the application for production |
| `pnpm start`        | Start the production server          |
| `pnpm lint`         | Run ESLint                           |
| `pnpm format:check` | Check formatting with Prettier       |

## Project structure

- `app/` — Next.js pages and API routes
- `components/` — Shared UI, trip, itinerary, and map components
- `lib/actions/` — Server actions for authentication, trips, locations, geocoding, and images
- `prisma/` — Prisma schema and database migrations

## Deployment

Deploy the application to a platform that supports Next.js and configure the production environment variables listed above. Point `DATABASE_URL` to a reachable PostgreSQL database, set the GitHub OAuth callback URL to the deployed domain, and use production credentials for MapTiler and UploadThing. Apply database migrations before serving traffic:

```bash
pnpm exec prisma migrate deploy
pnpm build
pnpm start
```

## Credits

https://www.youtube.com/watch?v=j7Qu65rUcsY
