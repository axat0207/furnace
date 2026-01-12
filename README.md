# 90-Day Personal OS - Full-Stack Edition

A disciplined, production-ready personal operating system for software developers. Now with PostgreSQL backend via Prisma ORM.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Server-side)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 5
- **Icons**: Lucide React

## 📦 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
The database is already configured with Neon PostgreSQL. The connection string is in `.env`:

```env
DATABASE_URL="postgresql://neondb_owner:npg_X8fMzCkqS2RD@ep-misty-glitter-a1pt22qh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

### 3. Run Migrations
Migrations have already been applied. If you need to reset or modify the schema:

```bash
# Generate migration
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build for Production
```bash
npm run build
npm start
```

## 🗄️ Database Schema

### Models
- **User**: Single user profile with name and start date
- **Settings**: User preferences (minimal mode, theme)
- **DailyLog**: Daily focus items, habits completed, detox logs
- **Habit**: Configurable habits with categories
- **LearningItem**: System design topics tracking
- **Problem**: DSA/debugging problems with explanations
- **Note**: Communication playbook notes
- **PracticeEntry**: Daily communication practice logs

## 🔌 API Endpoints

### User & Settings
- `GET /api/user` - Get or create user
- `PUT /api/user` - Update user settings

### Daily Logs
- `GET /api/daily-logs?date=YYYY-MM-DD` - Get specific or all logs
- `POST /api/daily-logs` - Create/update daily log

### Habits
- `GET /api/habits` - Get all habits
- `POST /api/habits` - Bulk upsert habits

### Learning
- `GET /api/learning` - Get all learning items
- `POST /api/learning` - Create learning item
- `PUT /api/learning` - Update learning item

### Problems
- `GET /api/problems` - Get all problems
- `POST /api/problems` - Create problem
- `PUT /api/problems` - Update problem

### Practice
- `GET /api/practice` - Get practice log
- `POST /api/practice` - Log practice entry

## 🧠 Core Features

### 1. Command Center (Home)
- Today's Focus (max 3 priorities)
- Non-Negotiables checklist
- Urge Defense logger (Fog Habit & Impulse Loop)
- Progress ring

### 2. Habit Protocol (`/habits`)
- 14-day heatmap grid
- Streak calculation with grace period
- Minimal Mode toggle

### 3. Communication Playbook (`/communication`)
- Daily micro-practice (written/verbal)
- Context-specific notes (Office, Social, Relationship)

### 4. Engineering Competence (`/learning`)
- System Design topic tracker
- Problem-solving log with mandatory explanations

### 5. Weekly Review (`/review`)
- Auto-generated identity check
- Wins/Misses reflection

## 🔒 Data Persistence

All data is now persisted to PostgreSQL via Prisma:
- **Optimistic Updates**: UI updates immediately, then syncs to database
- **Automatic Sync**: All changes are saved to the database in real-time
- **Single User**: Currently configured for one user (you)

## 🛠️ Development

### Prisma Commands
```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create new migration
npx prisma migrate dev

# View data in browser
npx prisma studio

# Format schema file
npx prisma format
```

### Database Inspection
```bash
# Connect to database directly
psql 'postgresql://neondb_owner:npg_X8fMzCkqS2RD@ep-misty-glitter-a1pt22qh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
```

## 📝 Notes

- **Privacy**: Data is stored in your Neon PostgreSQL database
- **Terminology**: "Fog Habit" and "Impulse Loop" are used consistently
- **Minimal Mode**: Reduces tracking to essentials (Gym, Deep Work, Clean Day)
- **Grace Period**: 1 missed day allowed in streak calculation

---

*Consistent action creates identity.*
