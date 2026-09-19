import { interviewAgent } from "./../agents/interview.agent.js";
import { feedbackAgent } from "./../agents/feedback.agent.js";
import { summaryAgent } from "./../agents/summary.agent.js";

export async function interviewNode(state) {
  const rawQuestions = await interviewAgent({
    role: state.role,
    type: state.type,
    useResume: state.useResume,
    resume: state.resume,
  });

  const questions = rawQuestions.map((q) => ({
    questions: q.question,
    difficulty: q.difficulty,
    timer: q.timer,
  }));

  return {
    questions,
  };
}

export async function feedbackNode(state) {
  const feedback = await feedbackAgent({
    question: state.question,
    answer: state.answer,
    difficulty: state.difficulty,
  });

  return {
    feedback,
  };
}

export async function summaryNode(state) {
  const report = await summaryAgent({
    role: state.role,
    type: state.type,
    questions: state.questions,
  });
  return {
    report,
  };
}