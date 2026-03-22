import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

/**
 * QuizPlayer — student-facing MCQ quiz widget
 * Props:
 *   lessonId    (string) — lesson UUID
 *   userId      (string) — authenticated user id
 *   onPass      (fn)     — called when student passes (score >= passing_score)
 */
export default function QuizPlayer({ lessonId, userId, onPass }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quiz attempt state
  const [answers, setAnswers] = useState({}); // { questionId: selectedIndex }
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [prevAttempt, setPrevAttempt] = useState(null);

  useEffect(() => {
    if (!lessonId) return;
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/academy/quizzes?lesson_id=${lessonId}`);
      const data = res.ok ? await res.json() : null;
      setQuiz(data);

      if (data && userId) {
        const { data: attempt } = await supabase
          .from("quiz_attempts")
          .select("score, passed")
          .eq("user_id", userId)
          .eq("quiz_id", data.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        setPrevAttempt(attempt);
      }

      setLoading(false);
    })();
  }, [lessonId, userId]);

  function selectAnswer(questionId, idx) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: idx }));
  }

  async function handleSubmit() {
    if (!quiz) return;
    const questions = quiz.questions ?? [];
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_index) correct++;
    });
    const pct = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    const passed = pct >= (quiz.passing_score ?? 70);
    setScore(pct);
    setSubmitted(true);

    if (userId) {
      await supabase.from("quiz_attempts").insert({
        user_id: userId,
        quiz_id: quiz.id,
        score: pct,
        passed,
      });
    }

    if (passed && onPass) onPass();
  }

  function handleRetry() {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
  }

  if (loading) return null;
  if (!quiz) return null;

  const questions = quiz.questions ?? [];
  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id] !== undefined);
  const passed = score !== null && score >= (quiz.passing_score ?? 70);

  return (
    <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] p-4 md:p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-300 border border-violet-500/30 bg-violet-500/10 rounded-full px-2.5 py-0.5">
            Quiz
          </span>
          <h3 className="text-sm md:text-base font-semibold text-slate-100 mt-2">{quiz.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {questions.length} question{questions.length !== 1 ? "s" : ""}
            {quiz.total_questions_in_bank > questions.length && (
              <span className="text-violet-400"> · drawn from {quiz.total_questions_in_bank}-question bank</span>
            )}
            {" "}· Pass at {quiz.passing_score ?? 70}%
          </p>
        </div>

        {/* Previous attempt badge */}
        {prevAttempt && !submitted && (
          <div className={`text-xs rounded-lg border px-3 py-1.5 ${prevAttempt.passed ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-amber-500/30 bg-amber-500/10 text-amber-200"}`}>
            Last: {prevAttempt.score}% {prevAttempt.passed ? "✓ Passed" : "✗ Failed"}
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-5">
        {questions.map((q, qi) => {
          const chosen = answers[q.id];

          return (
            <div key={q.id} className="flex flex-col gap-2.5">
              <p className="text-sm text-slate-100 font-medium">
                <span className="text-slate-500 mr-1.5">{qi + 1}.</span>
                {q.question}
              </p>

              <div className="flex flex-col gap-1.5">
                {[q.option_a, q.option_b, q.option_c, q.option_d].map((opt, idx) => {
                  if (!opt) return null;
                  const isSelected = chosen === idx;
                  const isCorrectOpt = submitted && idx === q.correct_index;
                  const isWrongOpt = submitted && isSelected && !isCorrectOpt;

                  let cls = "rounded-xl border px-3 py-2.5 text-xs text-left transition w-full ";
                  if (isCorrectOpt) {
                    cls += "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
                  } else if (isWrongOpt) {
                    cls += "border-red-500/40 bg-red-500/10 text-red-300";
                  } else if (isSelected && !submitted) {
                    cls += "border-violet-500/50 bg-violet-500/10 text-violet-100";
                  } else {
                    cls += "border-white/10 bg-white/[0.03] text-slate-300 hover:border-violet-400/30 hover:bg-violet-500/[0.06]";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => selectAnswer(q.id, idx)}
                      disabled={submitted}
                      className={cls}
                    >
                      <span className="font-medium mr-2 text-slate-500">
                        {["A", "B", "C", "D"][idx]}.
                      </span>
                      {opt}
                      {isCorrectOpt && <span className="ml-2">✓</span>}
                      {isWrongOpt && <span className="ml-2">✗</span>}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {submitted && q.explanation && (
                <div className="rounded-lg border border-sky-500/20 bg-sky-500/[0.06] px-3 py-2 text-xs text-sky-200">
                  💡 {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Score result */}
      {submitted && (
        <div className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${
          passed
            ? "border-emerald-500/30 bg-emerald-500/10"
            : "border-amber-500/30 bg-amber-500/10"
        }`}>
          <div className="flex-1">
            <p className={`text-lg font-bold ${passed ? "text-emerald-200" : "text-amber-200"}`}>
              {passed ? "🎉 You passed!" : "Keep going!"}
            </p>
            <p className="text-sm text-slate-300 mt-0.5">
              Score: <strong>{score}%</strong>
              {" "}· Needed: {quiz.passing_score ?? 70}%
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-slate-300 hover:text-slate-100 transition"
          >
            Retry quiz
          </button>
        </div>
      )}

      {/* Submit */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 text-sm font-semibold text-white transition self-start"
        >
          Submit answers →
        </button>
      )}
    </div>
  );
}
