import React from 'react';

type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
    as?: T;
    className?: string;
    children?: React.ReactNode;
    color?: string;
    speed?: React.CSSProperties['animationDuration'];
    thickness?: number;
};

const StarBorder = <T extends React.ElementType = 'div'>({
    as,
    className = '',
    color = 'white',
    speed = '6s',
    thickness = 0.7,
    children,
    ...rest
}: StarBorderProps<T>) => {
    const Component = as || 'div';

    return (
        <Component
            className={`relative inline-block overflow-hidden rounded-full ${className}`}
            {...(rest as any)}
            style={{
                padding: `${thickness}px`,
                ...(rest as any).style
            }}
        >
            <div
                className="absolute w-[300%] h-[50%] opacity-100 bottom-[-10px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
                style={{
                    background: `radial-gradient(circle, #fff 0%, ${color} 10%, transparent 60%)`,
                    animationDuration: speed,
                    filter: 'blur(2px)'
                }}
            ></div>
            <div
                className="absolute w-[300%] h-[50%] opacity-100 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
                style={{
                    background: `radial-gradient(circle, #fff 0%, ${color} 10%, transparent 60%)`,
                    animationDuration: speed,
                    filter: 'blur(2px)'
                }}
            ></div>
            <div className="relative z-1 bg-inherit rounded-full">
                {children}
            </div>
        </Component>
    );
};

export default StarBorder;
