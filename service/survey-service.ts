// SURVEY SERVICES
// This module provides utility functions for managing survey-related data in Firestore.
// It includes CRUD operations for survey steps, survey questions, and externship reviews.

import { db } from "@/lib/firebase";
import { ReviewModel, SurveyQuestion, SurveyStep } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";


// ----------------------
// Survey Step Management
// ----------------------

// Get all survey steps
export const getSteps = async () => {
  const steps = await getDocs(collection(db, "survey_steps"));
  return steps.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SurveyStep));
};

// Add a new survey step
export const addStep = async (
  step: Omit<SurveyStep, "id" | "createdAt" | "updatedAt">
) => {
  const stepsRef = collection(db, "survey_steps");
  await addDoc(stepsRef, step);
};

// Update an existing survey step
export const updateStep = async (params: {
  stepId: string;
  step: Partial<SurveyStep>;
}) => {
  const stepRef = doc(db, "survey_steps", params.stepId);
  await updateDoc(stepRef, params.step);
};

// Delete a survey step
export const deleteStep = async (stepId: string) => {
  const stepRef = doc(db, "survey_steps", stepId);
  await deleteDoc(stepRef);
};


// -------------------------
// Survey Question Management
// -------------------------

// Get all survey questions
export const getQuestions = async () => {
  const questions = await getDocs(collection(db, "survey_questions"));
  return questions.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SurveyQuestion));
};

// Add a new survey question
export const addQuestion = async (
  question: Omit<SurveyQuestion, "id" | "createdAt" | "updatedAt">
) => {
  const questionsRef = collection(db, "survey_questions");
  await addDoc(questionsRef, question);
};

// Update a survey question
export const updateQuestion = async (params: {
  questionId: string;
  question: Partial<SurveyQuestion>;
}) => {
  const questionRef = doc(db, "survey_questions", params.questionId);
  await updateDoc(questionRef, params.question);
};

// Delete a survey question
export const deleteQuestion = async (questionId: string) => {
  const questionRef = doc(db, "survey_questions", questionId);
  await deleteDoc(questionRef);
};


// -------------------------
// Survey Review Management
// -------------------------

// Get only approved reviews
export const getApprovedReviews = async () => {
  const reviews = await getDocs(
    query(collection(db, "reviews"), where("status", "==", "approved"))
  );
  return reviews.docs.map((doc) => doc.data() as ReviewModel);
};

// Get all reviews regardless of status
export const getReviews = async () => {
  const reviews = await getDocs(collection(db, "reviews"));
  return reviews.docs.map((doc) => doc.data() as ReviewModel);
};

// Add a new review
export const addReview = async (review: ReviewModel) => {
  const docRef = await addDoc(collection(db, "reviews"), review);
  await updateDoc(docRef, { docId: docRef.id }); // Update the document with its own ID
};

// Update an existing review
export const updateReview = async (params: {
  docId: string;
  review: Partial<ReviewModel>;
}) => {
  const reviewRef = doc(db, "reviews", params.docId);
  await updateDoc(reviewRef, params.review);
};

// Delete a review
export const deleteReview = async (docId: string) => {
  const reviewRef = doc(db, "reviews", docId);
  await deleteDoc(reviewRef);
};
