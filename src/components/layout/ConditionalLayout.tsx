'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Swipe gesture detection
    const touchStartX = useRef<number>(0);
    const touchStartY = useRef<number>(0);
    const touchEndX = useRef<number>(0);
    const touchEndY = useRef<number>(0);

    useEffect(() => {
        if (isLoginPage) return;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
            // Reset end coordinates to prevent stale references if no move happens
            touchEndX.current = e.touches[0].clientX;
            touchEndY.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            touchEndX.current = e.touches[0].clientX;
            touchEndY.current = e.touches[0].clientY;
        };

        const handleTouchEnd = () => {
            const swipeDistanceX = touchEndX.current - touchStartX.current;
            const swipeDistanceY = Math.abs(touchEndY.current - touchStartY.current);

            // Check if swiped right at least 150px
            // and vertical movement is less than horizontal (to avoid conflicts with scrolling)
            if (
                swipeDistanceX > 150 &&
                swipeDistanceY < Math.abs(swipeDistanceX)
            ) {
                setIsSidebarOpen(true);
            }
        };

        // Add event listeners
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Cleanup
        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isLoginPage]);

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
