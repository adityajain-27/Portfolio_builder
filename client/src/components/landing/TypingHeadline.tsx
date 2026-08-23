import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PRE = "Every resume, ";
const POST = " to perfection.";

export function TypingHeadline() {
  const [preCount, setPreCount] = useState(0);
  const [showTypeset, setShowTypeset] = useState(false);
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    let i = 0;
    const t1 = setInterval(() => {
      i++;
      setPreCount(i);
      if (i >= PRE.length) {
        clearInterval(t1);
        setTimeout(() => setShowTypeset(true), 120);
      }
    }, 38);
    return () => clearInterval(t1);
  }, []);

  useEffect(() => {
    if (!showTypeset) return;
    const t2 = setTimeout(() => {
      let j = 0;
      const t3 = setInterval(() => {
        j++;
        setPostCount(j);
        if (j >= POST.length) clearInterval(t3);
      }, 32);
      return () => clearInterval(t3);
    }, 550);
    return () => clearTimeout(t2);
  }, [showTypeset]);

  return (
    <h1 className="font-display text-4xl font-semibold leading-[1.1] text-slate-bright sm:text-5xl">
      {PRE.slice(0, preCount)}
      {preCount < PRE.length && <span className="animate-blink text-cobalt">|</span>}
      {showTypeset && (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[linear-gradient(90deg,#3E5FE0_0%,#A9803F_25%,#3E5FE0_50%,#A9803F_75%,#3E5FE0_100%)] bg-[length:200%_auto] bg-clip-text italic text-transparent animate-shimmer"
        >
          typeset
        </motion.span>
      )}
      {POST.slice(0, postCount)}
      {showTypeset && postCount < POST.length && postCount > 0 && (
        <span className="animate-blink text-cobalt">|</span>
      )}
    </h1>
  );
}