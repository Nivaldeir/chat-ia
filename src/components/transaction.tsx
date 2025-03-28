"use client";

import { useRef } from "react";
import { TransitionRouter } from "next-transition-router";
import { animate } from "framer-motion/dom";

export default function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null!);

  return (
    <TransitionRouter
      auto
      leave={next => {
        animate(
          wrapperRef.current,
          { y: [0, 20], opacity: [1, 0] },
          { duration: 0.25, ease: "easeOut", onComplete: next },
        );
      }}
      enter={next => {
        animate(
          wrapperRef.current,
          { y: [20, 0], opacity: [0, 1] },
          { duration: 0.25, ease: "easeIn", onComplete: next },
        );
      }}
    >
      <div ref={wrapperRef}>{children}</div>
    </TransitionRouter>
  );
}