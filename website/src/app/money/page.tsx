
import Link from 'next/link';
import { ArrowLeft, Split, PieChart } from 'lucide-react';
import QuickAdd from '@/components/money/QuickAdd';
import TransactionList from '@/components/money/TransactionList';
import { getCategories, getTransactions } from './actions';

export default async function MoneyPage() {
  const categories = await getCategories();
  const transactions = await getTransactions(10);

  return (
    <div className="min-h-screen p-6 md:p-12 pb-32 space-y-8 relative max-w-7xl mx-auto">
      {/* Minimal Nav Bar */}
      <div className="flex items-center justify-between pointer-events-auto">
        <Link href="/" className="p-3 bg-white/5  hover:bg-white/10 rounded-2xl transition-all group border border-white/5 hover:border-white/10">
          <ArrowLeft size={20} className="text-zinc-400 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
        </Link>

        <div className="flex gap-3">
          <Link href="/money/splits" className="flex items-center gap-3 px-4 py-3 bg-[#111] hover:bg-[#161616] rounded-2xl border border-white/5 transition-all group">
            <Split size={18} className="text-teal-500" />
            <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 hidden md:block">Splitwise</span>
          </Link>
          <Link href="/money/analytics" className="p-3 bg-[#111] hover:bg-[#161616] rounded-2xl border border-white/5 transition-all text-zinc-400 hover:text-white">
            <PieChart size={20} />
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mt-8">

        {/* Left: Input Island (Sticky on desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Add Transaction</h1>
              <p className="text-zinc-500 font-medium">Log expenses instantly.</p>
            </div>
            <div className="transform transition-all shadow-2xl shadow-black/40 rounded-3xl overflow-hidden border border-white/5 ring-1 ring-white/5 backdrop-blur-xl bg-black/40">
              <QuickAdd categories={categories} />
            </div>
          </div>
        </div>

        {/* Right: History Feed */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-end justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">History</h2>
              <p className="text-xs text-zinc-500 mt-1">Your recent financial activity</p>
            </div>
            <Link href="/money/history" className="text-xs font-bold text-furnace-primary hover:text-white transition-colors">
              VIEW FULL HISTORY
            </Link>
          </div>

          <div className="space-y-4">
            <TransactionList transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
