import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// A continuous typewriter loop: types "Every resume, typeset to perfection.",
// holds, erases, and retypes — forever. "typeset" gets its own shimmering
// gradient treatment mid-sentence.
const PRE = "Every resume, ";
const POST = " to perfection.";

const TYPE_MS = 36;
const ERASE_MS = 20;
const HOLD_MS = 2000;
const PAUSE_MS = 450;

export function TypingHeadline() {
  const [preCount, setPreCount] = useState(0);
  const [typesetShown, setTypesetShown] = useState(false);
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) => new Promise<void>((res) => timers.push(setTimeout(res, ms)));

    async function loop() {
      while (!cancelled) {
        // type PRE
        for (let i = 1; i <= PRE.length && !cancelled; i++) {
          setPreCount(i);
          await wait(TYPE_MS);
        }
        await wait(150);
        if (cancelled) break;
        setTypesetShown(true);
        await wait(500);

        // type POST
        for (let i = 1; i <= POST.length && !cancelled; i++) {
          setPostCount(i);
          await wait(TYPE_MS - 6);
        }
        await wait(HOLD_MS);
        if (cancelled) break;

        // erase POST
        for (let i = POST.length; i >= 0 && !cancelled; i--) {
          setPostCount(i);
          await wait(ERASE_MS);
        }
        setTypesetShown(false);
        await wait(200);

        // erase PRE
        for (let i = PRE.length; i >= 0 && !cancelled; i--) {
          setPreCount(i);
          await wait(ERASE_MS);
        }
        await wait(PAUSE_MS);
      }
    }

    loop();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <h1 className="font-display text-4xl font-semibold leading-[1.1] text-slate-bright sm:text-5xl">
      {PRE.slice(0, preCount)}
      <AnimatePresence>
        {typesetShown && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[linear-gradient(90deg,#3E5FE0_0%,#A9803F_25%,#3E5FE0_50%,#A9803F_75%,#3E5FE0_100%)] bg-[length:200%_auto] bg-clip-text italic text-transparent animate-shimmer"
          >
            typeset
          </motion.span>
        )}
      </AnimatePresence>
      {POST.slice(0, postCount)}
      <span className="animate-blink text-cobalt">|</span>
    </h1>
  );
}