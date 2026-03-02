import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { RotateCcw, Check } from 'lucide-react';

export const SwipeableCard = ({
    children,
    onSwipe,
    isDark,
    appMode,
    swipeDirection,
    isRevealed
}) => {
    const minSwipeDistance = 120; // Increased for better stability on small screens
    const minVelocity = 400; // Require a faster flick if distance is low
    const x = useMotionValue(0);
    const controls = useAnimation();
    const isDragLocked = useRef(false);

    const opacityLeft = useTransform(x, [-minSwipeDistance / 2, -minSwipeDistance], [0, 1]);
    const opacityRight = useTransform(x, [minSwipeDistance / 2, minSwipeDistance], [0, 1]);
    const rotate = useTransform(x, [-300, 300], [-15, 15]);

    // Hint Opacities
    const hintLeftOpacity = useTransform(x, [0, -30], [0, 0.4]);
    const hintRightOpacity = useTransform(x, [0, 30], [0, 0.4]);

    useEffect(() => {
        if (swipeDirection === 'left') {
            controls.start({ x: -600, opacity: 0, scale: 0.9, transition: { duration: 0.3, ease: "easeOut" } }).then(() => onSwipe('left', true));
        } else if (swipeDirection === 'right') {
            controls.start({ x: 600, opacity: 0, scale: 0.9, transition: { duration: 0.3, ease: "easeOut" } }).then(() => onSwipe('right', true));
        }
    }, [swipeDirection, controls, onSwipe]);

    const handleDragStart = (event, info) => {
        isDragLocked.current = false;
    };

    const handleDrag = (event, info) => {
        if (!isDragLocked.current && Math.abs(info.offset.x) > 10) {
            isDragLocked.current = true;
        }
    };

    const handleDragEnd = (event, info) => {
        if (appMode !== 'swipe') {
            controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } });
            return;
        }

        const offset = info.offset.x;
        const velocity = info.velocity.x;

        // Check if movement is significant enough to trigger swipe
        const isRightSwipe = offset > minSwipeDistance || (offset > 50 && velocity > minVelocity);
        const isLeftSwipe = offset < -minSwipeDistance || (offset < -50 && velocity < -minVelocity);

        if (isRightSwipe) {
            controls.start({ x: 600, opacity: 0, scale: 0.9, transition: { duration: 0.25 } }).then(() => onSwipe('right', true));
        } else if (isLeftSwipe) {
            controls.start({ x: -600, opacity: 0, scale: 0.9, transition: { duration: 0.25 } }).then(() => onSwipe('left', true));
        } else {
            controls.start({ x: 0, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 400, damping: 20 } });
        }
    };

    return (
        <motion.div
            className="absolute inset-0 z-[50]"
            style={{
                x,
                rotate,
                touchAction: 'none',
                willChange: 'transform, opacity'
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={isRevealed ? 0.3 : 0.5}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            animate={controls}
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            whileInView={{ y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 30 } }}
            viewport={{ once: true }}
            whileDrag={{ scale: 1.01, transition: { duration: 0.1 } }}
        >
            {/* Overlay Indicator - Left (Remind Me / Amber-Purple) */}
            {appMode === 'swipe' && (
                <motion.div
                    className="absolute inset-0 z-[100] pointer-events-none rounded-[2.5rem] flex items-center justify-center"
                    style={{
                        opacity: opacityLeft,
                        backgroundColor: isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(245, 158, 11, 0.4)',
                    }}
                >
                    <div className={`bg-white p-8 rounded-full shadow-lg transform scale-110 border-4 border-white/50 ${isDark ? 'text-purple-600' : 'text-amber-600'}`}>
                        <RotateCcw size={52} strokeWidth={4} />
                    </div>
                </motion.div>
            )}

            {/* Overlay Indicator - Right (Know / Green) */}
            {appMode === 'swipe' && (
                <motion.div
                    className="absolute inset-0 z-[100] pointer-events-none rounded-[2.5rem] flex items-center justify-center"
                    style={{
                        opacity: opacityRight,
                        backgroundColor: isDark ? 'rgba(5, 150, 105, 0.4)' : 'rgba(16, 185, 129, 0.4)',
                    }}
                >
                    <div className="bg-white text-emerald-600 p-8 rounded-full shadow-lg transform scale-110 border-4 border-white/50">
                        <Check size={52} strokeWidth={4} />
                    </div>
                </motion.div>
            )}

            {/* Swipe Hints - Stationary behind the card */}
            {appMode === 'swipe' && (
                <>
                    <motion.div
                        className="absolute -right-20 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-none transition-colors"
                        style={{ opacity: hintLeftOpacity, color: isDark ? '#a78bfa' : '#f59e0b' }}
                    >
                        <div className="flex flex-col items-center animate-pulse">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] [writing-mode:vertical-lr]">SOLA: TEKRARLA</span>
                        </div>
                    </motion.div>
                    <motion.div
                        className="absolute -left-20 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-none transition-colors"
                        style={{ opacity: hintRightOpacity, color: isDark ? '#34d399' : '#059669' }}
                    >
                        <div className="flex flex-col items-center animate-pulse">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180">SAĞA: BİLİYORUM</span>
                        </div>
                    </motion.div>
                </>
            )}

            {children}
        </motion.div>
    );
};
