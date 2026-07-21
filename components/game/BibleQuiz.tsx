"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Portal from "../Portal";
import CaptainGoodness from "./CaptainGoodness";
import { QUIZZES, type Quiz } from "@/lib/game";
import { Check } from "@/components/icons";

export function QuizList({ done, onOpen }: { done: string[]; onOpen: (q: Quiz) => void }) {
  return (
    <div className="space-y-2.5">
      {QUIZZES.map((q) => {
        const isDone = done.includes(q.id);
        return (
          <button
            key={q.id}
            onClick={() => onOpen(q)}
            className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition active:scale-[0.99] ${
              isDone ? "border-emerald-400/30 bg-emerald-500/10" : "border-white/10 bg-white/5"
            }`}
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple-600/40 to-navy-800 text-2xl">{q.emoji}</span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="font-display text-[15px] font-bold text-white">{q.title}</span>
                <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-purple-200">{q.level}</span>
              </span>
              <span className="block text-[12px] text-white/55">{q.blurb} · 5 questions</span>
            </span>
            {isDone ? <span className="shrink-0 text-emerald-300">★</span> : <span className="shrink-0 text-xs font-bold text-gold-400">+{q.points}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function QuizModal({ quiz, done, onComplete, onClose }: { quiz: Quiz; done: boolean; onComplete: () => void; onClose: () => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const q = quiz.questions[i];

  const claim = () => {
    if (claimed) return; // block double-tap during the exit animation
    setClaimed(true);
    onComplete();
  };

  function pick(idx: number) {
    if (picked !== null) return;
    setPicked(idx);
    const right = idx === q.answer;
    setTimeout(() => {
      if (right) {
        const nCorrect = correct + 1;
        setCorrect(nCorrect);
        if (i + 1 >= quiz.questions.length) setFinished(true);
        else {
          setI((v) => v + 1);
          setPicked(null);
        }
      } else {
        // No losing screen — gentle retry of the same question.
        setPicked(null);
      }
    }, 850);
  }

  return (
    <Portal>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/70 backdrop-blur-sm" onClick={onClose}>
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 320, damping: 34 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-white/10 bg-gradient-to-b from-navy-900 to-ink p-5 pb-8 safe-bottom"
        >
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />

          {!finished ? (
            <>
              <div className="mb-1 flex items-center justify-between">
                <span className="rounded-lg bg-purple-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-purple-200">
                  {quiz.emoji} {quiz.title}
                </span>
                <span className="text-xs font-bold text-white/50">
                  {i + 1} / {quiz.questions.length}
                </span>
              </div>
              {/* progress dots */}
              <div className="mb-5 flex gap-1.5">
                {quiz.questions.map((_, idx) => (
                  <span key={idx} className={`h-1.5 flex-1 rounded-full ${idx < i ? "bg-gold" : idx === i ? "bg-gold/50" : "bg-white/12"}`} />
                ))}
              </div>

              {/* No exit-dependent swap — must advance even when rAF is throttled */}
              <motion.div key={i} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
                  <p className="mb-5 text-center font-display text-[22px] font-bold leading-snug text-white">{q.q}</p>
                  <div className="space-y-2.5">
                    {q.options.map((opt, idx) => {
                      const isPick = picked === idx;
                      const right = idx === q.answer;
                      return (
                        <button
                          key={opt}
                          onClick={() => pick(idx)}
                          className={`w-full rounded-2xl border p-4 text-left text-[15px] font-semibold transition active:scale-[0.99] ${
                            isPick ? (right ? "border-emerald-400 bg-emerald-500/20 text-white" : "border-rose-400 bg-rose-500/15 text-white") : "border-white/12 bg-white/5 text-white/85"
                          }`}
                        >
                          {opt}
                          {isPick && right && " ✅"}
                          {isPick && !right && " — try again! 💛"}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
            </>
          ) : (
            <div className="flex flex-col items-center py-4 text-center">
              <CaptainGoodness size={104} reaction="celebrate" />
              <h3 className="mt-2 font-display text-2xl font-extrabold text-white">All 5 correct! 🎉</h3>
              <p className="mt-1 max-w-xs text-sm text-white/70">
                &ldquo;Your word is a lamp for my feet, a light on my path.&rdquo; — Psalm 119:105
              </p>
              {!done ? (
                <button onClick={claim} disabled={claimed} className="mt-6 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-7 py-3.5 font-extrabold text-navy-950 shadow-glow active:scale-95 disabled:opacity-60">
                  {claimed ? "Claimed! ✨" : `Claim +${quiz.points} Light Points`}
                </button>
              ) : (
                <button onClick={onClose} className="mt-6 flex items-center gap-2 rounded-2xl bg-white/10 px-7 py-3.5 font-bold text-white active:scale-95">
                  <Check width={16} height={16} /> Done
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </Portal>
  );
}
