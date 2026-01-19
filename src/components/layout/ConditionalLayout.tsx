'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen">
            {/* Mobile Sidebar Toggle - Floating Action Button */}
            {!isLoginPage && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden fixed bottom-6 left-4 z-50 p-4 bg-gradient-to-br from-orange-500 to-red-600 backdrop-blur-md rounded-2xl border-2 border-orange-400/50 text-white shadow-2xl shadow-orange-500/50 active:scale-95 transition-all hover:shadow-orange-500/70 animate-pulse"
                    aria-label="Open menu"
                >
                    <Menu size={28} strokeWidth={2.5} />
                </button>
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className={`flex-1 transition-all duration-300 ${isLoginPage ? '' : 'md:ml-72 p-0 md:p-8 overflow-y-auto min-h-screen'}`}>
                {isLoginPage ? (
                    children
                ) : (
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                )}
            </main>
        </div>
    );
}
