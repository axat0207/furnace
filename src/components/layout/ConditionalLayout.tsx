'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className={`flex-1 transition-all duration-300 ${isLoginPage ? '' : 'ml-16 md:ml-72 p-0 md:p-8 overflow-y-auto h-screen'}`}>
                {isLoginPage ? (
                    children
                ) : (
                    <div className="max-w-4xl mx-auto w-full">
                        {children}
                    </div>
                )}
            </main>
        </div>
    );
}
