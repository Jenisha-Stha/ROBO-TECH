import React, { useRef, useEffect, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './Shuffle.css';

gsap.registerPlugin(ScrollTrigger);

export interface ShuffleProps {
    text: string;
    className?: string;
    style?: React.CSSProperties;
    shuffleDirection?: 'left' | 'right' | 'up' | 'down';
    duration?: number;
    ease?: string;
    threshold?: number;
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
    textAlign?: React.CSSProperties['textAlign'];
    onShuffleComplete?: () => void;
    shuffleTimes?: number;
    animationMode?: 'random' | 'evenodd';
    loop?: boolean;
    loopDelay?: number;
    stagger?: number;
    triggerOnce?: boolean;
    triggerOnHover?: boolean;
}

const Shuffle: React.FC<ShuffleProps> = ({
    text,
    className = '',
    style = {},
    shuffleDirection = 'right',
    duration = 0.35,
    ease = 'power3.out',
    threshold = 0.1,
    tag = 'p',
    textAlign = 'center',
    onShuffleComplete,
    shuffleTimes = 1,
    animationMode = 'evenodd',
    loop = false,
    loopDelay = 0,
    stagger = 0.03,
    triggerOnce = true,
    triggerOnHover = true
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const playingRef = useRef(false);
    const hasPlayedRef = useRef(false);
    const [isReady, setIsReady] = useState(false);

    const chars = useMemo(() => text.split(''), [text]);

    const getStartPosition = () => {
        const offset = 30;
        switch (shuffleDirection) {
            case 'up': return { y: offset, x: 0 };
            case 'down': return { y: -offset, x: 0 };
            case 'left': return { x: offset, y: 0 };
            case 'right': return { x: -offset, y: 0 };
            default: return { x: -offset, y: 0 };
        }
    };

    const playAnimation = () => {
        if (playingRef.current) return;

        const charElements = charsRef.current.filter((el): el is HTMLSpanElement => el !== null);
        if (!charElements.length) return;

        playingRef.current = true;
        hasPlayedRef.current = true;

        // Kill existing timeline
        if (tlRef.current) {
            tlRef.current.kill();
        }

        const startPos = getStartPosition();

        // Reset to start position
        charElements.forEach(el => {
            gsap.set(el, {
                opacity: 0,
                x: startPos.x,
                y: startPos.y,
                filter: 'blur(8px)'
            });
        });

        const tl = gsap.timeline({
            repeat: loop ? -1 : 0,
            repeatDelay: loopDelay,
            onComplete: () => {
                playingRef.current = false;
                onShuffleComplete?.();
            }
        });

        if (animationMode === 'evenodd') {
            const oddChars = charElements.filter((_, i) => i % 2 === 1);
            const evenChars = charElements.filter((_, i) => i % 2 === 0);

            if (oddChars.length) {
                tl.to(oddChars, {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    filter: 'blur(0px)',
                    duration,
                    ease,
                    stagger
                }, 0);
            }

            if (evenChars.length) {
                const oddDuration = duration + Math.max(0, oddChars.length - 1) * stagger;
                tl.to(evenChars, {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    filter: 'blur(0px)',
                    duration,
                    ease,
                    stagger
                }, oddDuration * 0.7);
            }
        } else {
            charElements.forEach((char) => {
                const randomDelay = Math.random() * shuffleTimes * 0.15;
                tl.to(char, {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    filter: 'blur(0px)',
                    duration,
                    ease
                }, randomDelay);
            });
        }

        tlRef.current = tl;
    };

    // Set refs ready after mount
    useEffect(() => {
        const timeout = setTimeout(() => setIsReady(true), 50);
        return () => clearTimeout(timeout);
    }, []);

    // Setup scroll trigger and hover
    useGSAP(() => {
        if (!containerRef.current || !isReady) return;

        const scrollStart = `top ${(1 - threshold) * 100}%`;

        const st = ScrollTrigger.create({
            trigger: containerRef.current,
            start: scrollStart,
            once: triggerOnce,
            onEnter: () => {
                playAnimation();
            }
        });

        return () => {
            st.kill();
            if (tlRef.current) tlRef.current.kill();
        };
    }, {
        dependencies: [isReady, threshold, triggerOnce],
        scope: containerRef
    });

    // Hover handler
    const handleMouseEnter = () => {
        if (triggerOnHover && hasPlayedRef.current && !playingRef.current) {
            playAnimation();
        }
    };

    const Tag = tag as keyof React.JSX.IntrinsicElements;

    return (
        <div
            ref={containerRef}
            className={`shuffle-wrapper ${className}`}
            style={{ textAlign, ...style }}
            onMouseEnter={handleMouseEnter}
        >
            <Tag className="shuffle-text-element">
                {chars.map((char, index) => (
                    <span
                        key={index}
                        ref={el => { charsRef.current[index] = el; }}
                        className="shuffle-char-span"
                        style={{
                            display: char === ' ' ? 'inline' : 'inline-block',
                            opacity: 0
                        }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </Tag>
        </div>
    );
};

export default Shuffle;
