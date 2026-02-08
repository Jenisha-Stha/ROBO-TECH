"use client";

import { useEffect, useRef, useState } from "react";

interface Testimonial {
  img: string;
  quote: string;
  name: string;
  role: string;
}

export const TestimonialSlider = ({
  testimonials,
  className,
}: {
  testimonials: Testimonial[];
  className?: string;
}) => {
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number>(0);
  const [autorotate, setAutorotate] = useState<boolean>(true);
  const autorotateTiming = 7000;

  useEffect(() => {
    if (!autorotate || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, autorotateTiming);
    return () => clearInterval(interval);
  }, [autorotate, testimonials.length]);

  const heightFix = () => {
    if (testimonialsRef.current?.parentElement) {
      testimonialsRef.current.parentElement.style.height = `${testimonialsRef.current.clientHeight}px`;
    }
  };

  useEffect(() => {
    heightFix();
  }, [active, testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <div className={`mx-auto w-full max-w-3xl text-center ${className || ""}`}>
      <div className="relative h-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-b before:from-blue-500/25 before:via-blue-500/10 before:via-25% before:to-blue-500/0 before:to-75%">
          <div className="h-32 [mask-image:_linear-gradient(0deg,transparent,theme(colors.white)_20%,theme(colors.white))]">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 -z-10 h-full transition duration-700 ease-[cubic-bezier(0.68,-0.3,0.32,1)] ${
                  active === index
                    ? "opacity-100 rotate-0"
                    : "opacity-0 -rotate-[60deg]"
                }`}
                aria-hidden={active !== index}
              >
                <img
                  className="relative left-1/2 top-11 -translate-x-1/2 rounded-full ring-2 ring-blue-200/70"
                  src={testimonial.img}
                  width={56}
                  height={56}
                  loading="lazy"
                  alt={testimonial.name}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mb-9 transition-all delay-300 duration-150 ease-in-out">
        <div className="relative flex flex-col" ref={testimonialsRef}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`transition duration-500 ease-in-out ${
                active === index
                  ? "opacity-100 translate-x-0 relative"
                  : "opacity-0 translate-x-4 absolute"
              }`}
              aria-hidden={active !== index}
            >
              <div className="text-2xl font-bold text-slate-900 before:content-['\201C'] after:content-['\201D']">
                {testimonial.quote}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="-m-1.5 flex flex-wrap justify-center">
        {testimonials.map((testimonial, index) => (
          <button
            key={index}
            className={`m-1.5 inline-flex justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-xs shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-300 dark:focus-visible:ring-blue-600 ${
              active === index
                ? "bg-blue-600 text-white shadow-blue-950/10"
                : "bg-white text-blue-900 hover:bg-blue-50"
            }`}
            onClick={() => {
              setActive(index);
              setAutorotate(false);
            }}
          >
            <span>{testimonial.name}</span>{" "}
            <span
              className={`${
                active === index ? "text-blue-100" : "text-blue-300"
              }`}
            >
              -
            </span>{" "}
            <span>{testimonial.role}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
