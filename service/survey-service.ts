import { db } from "@/lib/firebase";
import { SurveyStep, SurveyQuestion } from "@/types/models";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const getSteps = async () => {
  const steps = await getDocs(collection(db, "survey_steps"));

  return steps.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SurveyStep));
};

const addStep = async (
  step: Omit<SurveyStep, "id" | "createdAt" | "updatedAt">
) => {
  const stepsRef = collection(db, "survey_steps");
  await addDoc(stepsRef, step);
};

const updateStep = async (params: {
  stepId: string;
  step: Partial<SurveyStep>;
}) => {
  console.log("params", params);
  const stepRef = doc(db, "survey_steps", params.stepId);
  await updateDoc(stepRef, params.step);
};

const deleteStep = async (stepId: string) => {
  const stepRef = doc(db, "survey_steps", stepId);
  await deleteDoc(stepRef);
};

const getQuestions = async () => {
  const questions = await getDocs(collection(db, "survey_questions"));

  return questions.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as SurveyQuestion)
  );
};

const addQuestion = async (
  question: Omit<SurveyQuestion, "id" | "createdAt" | "updatedAt">
) => {
  console.log("question", question);
  const questionsRef = collection(db, "survey_questions");
  await addDoc(questionsRef, question);
};

const updateQuestion = async (params: {
  questionId: string;
  question: Partial<SurveyQuestion>;
}) => {
  const questionRef = doc(db, "survey_questions", params.questionId);
  await updateDoc(questionRef, params.question);
};

const deleteQuestion = async (questionId: string) => {
  const questionRef = doc(db, "survey_questions", questionId);
  await deleteDoc(questionRef);
};

export const surveyService = {
  getSteps,
  updateStep,
  deleteStep,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  addStep,
  addQuestion,
};
