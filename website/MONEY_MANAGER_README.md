# FURNACE Money Manager - Complete Feature Set

## 🎨 **New Visual Design System**

### Color Palette
- **Primary**: Deep purple/violet (#0a0118, #1a0b2e, #2d1b4e)
- **Accents**: 
  - Purple: #a855f7
  - Blue: #00d4ff
  - Pink: #ec4899
  - Cyan: #06b6d4
  - Green: #10b981
  - Gold: #fbbf24

### Visual Effects
- ✨ Glassmorphism with backdrop blur
- 🌈 Animated gradient backgrounds
- 💫 Neon glow effects on text and borders
- 🎯 Smooth hover animations and transitions
- 🔮 Pulsing background orbs

## 💰 **Core Features**

### 1. **Personal Finance Tracking**
- ✅ Quick Add transactions (Income/Expense)
- ✅ Category management with default categories
- ✅ Transaction history with search
- ✅ Monthly balance calculations
- ✅ INR currency (₹)
- ✅ Date-based tracking

**Default Categories:**
- Travel, Food, Rent, Shopping, Entertainment, Health (Expenses)
- Salary (Income)

### 2. **Shared Expenses (Splitwise-like)**
**Location:** `/money/splits`

**Features:**
- 👥 Split bills with multiple users by username
- 💸 Equal splitting (automatic calculation)
- 📊 Balance tracking (who owes you, who you owe)
- 💰 Net balance calculation
- ✅ Settlement system (mark as paid)
- 🏷️ Category support for shared expenses
- 📅 Date-based expense tracking

**How it works:**
1. Add shared expense with description, amount, category
2. Enter participant usernames (comma-separated)
3. System automatically splits equally
4. Track balances in real-time
5. Settle up when paid

### 3. **Analytics Dashboard**
**Location:** `/money/analytics`

**Features:**
- 📈 Monthly income/expense summaries
- 📊 Interactive charts (recharts)
- 📅 Date-wise breakdown
- 💹 Category-wise analysis
- 🎯 Visual data representation

## 🔐 **Authentication System**

- **Username-only** authentication (no passwords)
- **Auto-create** users on first login
- **Persistent sessions** (JWT with 1-year expiration)
- **Platform-wide** protection via middleware
- **Logout** functionality in sidebar

## 🗄️ **Database Schema**

### Models:
1. **User** - username, name, settings, relations
2. **Transaction** - amount, type, category, date, description
3. **Category** - name, type, icon, color, isDefault
4. **SharedExpense** - description, totalAmount, paidBy, splits, category
5. **ExpenseSplit** - individual shares, payment status

## 🎯 **UI/UX Highlights**

### Money Manager Page
- Hero section with animated background
- Balance cards (Income, Expenses, Net Balance)
- Quick Add with smooth animations
- Recent transactions list
- Navigation to Splits and Analytics

### Quick Add Component
- Gradient toggle buttons (Expense/Income)
- Large amount input with ₹ symbol
- Category grid with hover effects
- Optional description field
- Smooth expand/collapse animation

### Transaction List
- Glass cards with hover scale
- Gradient icon backgrounds
- Date badges
- Category labels
- Amount with +/- indicators

### Shared Expenses Page
- Balance summary (Owed to you, You owe, Net)
- Add expense form
- Active balances section
- Complete expense history
- Settlement buttons

## 🚀 **Technical Stack**

- **Framework**: Next.js 16.1.1 (App Router, Turbopack)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 5.22.0
- **Auth**: Jose (JWT)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Icons**: Lucide React
- **Date**: date-fns

## 📱 **Navigation Structure**

```
/
├── /login (Username-only auth)
├── /money (Main dashboard)
│   ├── /splits (Shared expenses)
│   └── /analytics (Charts & insights)
├── /habits
├── /communication
├── /learning
└── /review
```

## 🎨 **Generated Assets**

1. **money_hero_bg.png** - Financial tech background with 3D coins
2. **splits_hero_bg.png** - Network nodes for collaboration
3. **analytics_hero_bg.png** - Holographic charts and graphs

## 🔧 **Environment Setup**

Required in `.env`:
```
DATABASE_URL="postgresql://..."
```

## 📝 **Future Enhancement Ideas**

1. **Custom Split Amounts** - Not just equal, but custom percentages
2. **Recurring Expenses** - Monthly rent, subscriptions
3. **Group Creation** - Save groups like "Roommates", "Trip"
4. **Expense Comments** - Add notes/receipts
5. **Settlement History** - Track past settlements
6. **Export to CSV** - Download reports
7. **Notifications** - Remind about pending payments
8. **Multi-currency** - Support USD, EUR alongside INR
9. **Simplify Debts** - Optimize who owes whom
10. **Advanced Analytics** - Spending by category, person, time

## 🎯 **Key Commands**

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Start dev server
npm run dev

# Build for production
npm run build
```

## ✨ **Design Philosophy**

- **Premium First**: Every element feels expensive and polished
- **Fast & Intuitive**: Quick actions, minimal clicks
- **Visual Feedback**: Animations confirm every action
- **Consistent Theme**: Purple/Blue/Pink throughout
- **Glassmorphism**: Modern, depth-filled UI
- **Responsive**: Works on all screen sizes

---

**Status**: ✅ Fully Functional
**Last Updated**: January 13, 2026
**Version**: 3.0 (Vibrant Edition)
