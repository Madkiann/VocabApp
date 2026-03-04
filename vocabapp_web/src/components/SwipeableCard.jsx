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
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const controls = useAnimation();
    const isSwipingOut = useRef(false);

    // Dynamic Rotation logic: Tilt based on movement
    const rotate = useTransform(x, [-300, 300], [-15, 15]);
    const rotateY = useTransform(x, [-300, 300], [-10, 10]);
    const rotateX = useTransform(y, [-300, 300], [10, -10]);

    // Opacities for Side Glows
    const opacityLeft = useTransform(x, [0, -150], [0, 1]);
    const opacityRight = useTransform(x, [0, 150], [0, 1]);

    // Icon Overlays Opacities (Moved to top level to fix "Rendered fewer hooks" error)
    const iconLeftOpacity = useTransform(x, [0, -180], [0, 0.8]);
    const iconRightOpacity = useTransform(x, [0, 180], [0, 0.8]);

    // Scale and Border Radius during drag
    const scale = useTransform(x, [-300, 0, 300], [1.05, 1, 1.05]);
    const borderRadius = useTransform(x, [-200, 0, 200], ["1.5rem", "2rem", "1.5rem"]);

    const isDragging = useRef(false);

    useEffect(() => {
        if (!swipeDirection) {
            // Guard: Don't reset if we are currently dragging
            if (isDragging.current) return;

            isSwipingOut.current = false;
            // Explicitly reset position values
            x.set(0);
            y.set(0);
            controls.start({
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
                rotate: 0,
                transition: { type: 'spring', stiffness: 400, damping: 30 }
            });
        } else if (swipeDirection === 'left') {
            isSwipingOut.current = true;
            controls.start({
                x: -800,
                rotate: -45,
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.4, ease: "circOut" }
            }).then(() => onSwipe('left', true));
        } else if (swipeDirection === 'right') {
            isSwipingOut.current = true;
            controls.start({
                x: 800,
                rotate: 45,
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.4, ease: "circOut" }
            }).then(() => onSwipe('right', true));
        }
    }, [swipeDirection, controls, onSwipe, x, y]);

    const handleDragStart = () => {
        isDragging.current = true;
        isSwipingOut.current = false;
        controls.stop();
    };

    const handleDragEnd = (event, info) => {
        isDragging.current = false;

        // Early exit protection
        if (appMode !== 'swipe' || isSwipingOut.current) return;

        const offset = info.offset.x;
        const velocity = info.velocity.x;

        // Değerleri daha hassas hale getirdik (90px eşik, 400 velocity)
        const swipeThreshold = 90;
        const velocityThreshold = 400;

        if (offset > swipeThreshold || velocity > velocityThreshold) {
            isSwipingOut.current = true;
            // Hıza göre dinamik süre: Ne kadar hızlı atarsa o kadar hızlı gider (Momentum)
            const duration = Math.max(0.15, Math.min(0.35, 300 / Math.abs(velocity)));

            controls.start({
                x: 1000,
                y: -300, // Hafif yukarı fırlat (Tinder/Bumble stili)
                rotate: 25,
                opacity: 0,
                scale: 0.95,
                transition: { duration, ease: "easeOut" }
            }).then(() => onSwipe('right', true));
        } else if (offset < -swipeThreshold || velocity < -velocityThreshold) {
            isSwipingOut.current = true;
            const duration = Math.max(0.15, Math.min(0.35, 300 / Math.abs(velocity)));

            controls.start({
                x: -1000,
                y: -300, // Hafif yukarı fırlat
                rotate: -25,
                opacity: 0,
                scale: 0.95,
                transition: { duration, ease: "easeOut" }
            }).then(() => onSwipe('left', true));
        } else {
            // Geri dönüşü daha "snappy" (sert/hızlı) ve istikrarlı yaptık
            controls.start({
                x: 0,
                y: 0,
                scale: 1,
                rotate: 0,
                opacity: 1,
                transition: { type: 'spring', stiffness: 600, damping: 35, mass: 0.8 }
            });
        }
    };

    return (
        <motion.div
            className={`absolute inset-0 z-[50] select-none ${isRevealed ? 'touch-pan-y' : 'touch-none'}`}
            style={{
                x,
                y,
                rotate,
                rotateX,
                rotateY,
                scale,
                borderRadius,
                perspective: 1200,
                cursor: 'grab',
                // --- Zen Browser & Firefox Optimizasyonu ---
                willChange: "transform, opacity",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
                // -------------------------------------------
            }}
            drag={isSwipingOut.current ? false : "x"}
            dragDirectionLock={true}
            dragPropagation={false}
            dragElastic={0.5} // Daha sıkı kontrol için 0.5'e çekildi
            dragMomentum={false} // Gecko motoru için momentum kapatıldı
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.02, transition: { duration: 0.1 } }}
            animate={controls}
            transition={{
                type: 'spring',
                stiffness: 450,
                damping: 35,
                mass: 0.8,
                restDelta: 0.01 // Animasyonun bittiğini tarayıcıya daha hızlı bildirir
            }}
            initial={{ y: 80, opacity: 0, scale: 0.85 }}
        >
            {children}

            {/* Edge Glows - Premium Visual Feedback (Moved after children to be on top) */}
            {appMode === 'swipe' && !isSwipingOut.current && (
                <>
                    {/* Left Swipe Glow (Tekrarla) */}
                    <motion.div
                        className="absolute inset-0 z-[100] rounded-[2rem] pointer-events-none"
                        style={{
                            opacity: opacityLeft,
                            background: isDark
                                ? 'radial-gradient(circle at left, rgba(168, 85, 247, 0.4) 0%, transparent 70%)'
                                : 'radial-gradient(circle at left, rgba(245, 158, 11, 0.3) 0%, transparent 70%)',
                            boxShadow: isDark
                                ? 'inset 15px 0 30px -10px rgba(168, 85, 247, 0.5)'
                                : 'inset 15px 0 30px -10px rgba(245, 158, 11, 0.4)'
                        }}
                    />

                    {/* Right Swipe Glow (Biliyorum) */}
                    <motion.div
                        className="absolute inset-0 z-[100] rounded-[2rem] pointer-events-none"
                        style={{
                            opacity: opacityRight,
                            background: 'radial-gradient(circle at right, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
                            boxShadow: 'inset -15px 0 30px -10px rgba(16, 185, 129, 0.5)'
                        }}
                    />

                    {/* Large Icon Overlays on Deep Swipe */}
                    <motion.div
                        className="absolute inset-0 z-[101] flex items-center justify-center pointer-events-none"
                        style={{ opacity: iconLeftOpacity }}
                    >
                        <div className={`p-6 rounded-full bg-white shadow-2xl ${isDark ? 'text-purple-600' : 'text-amber-600'}`}>
                            <RotateCcw size={48} strokeWidth={3} />
                        </div>
                    </motion.div>

                    <motion.div
                        className="absolute inset-0 z-[101] flex items-center justify-center pointer-events-none"
                        style={{ opacity: iconRightOpacity }}
                    >
                        <div className="p-6 rounded-full bg-white text-emerald-600 shadow-2xl">
                            <Check size={48} strokeWidth={3} />
                        </div>
                    </motion.div>
                </>
            )}
        </motion.div>
    );
};
