import { Timestamp } from "firebase/firestore";

export interface UserModel {
  uid: string;
  name: string;
  profileImage: string;
  email: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  subscriber: boolean;
  subscriptionId: string;
  expirationDate: Timestamp | null;
}

export interface SurveyStep {
  id: string;
  stepId: string;
  stepTitle: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SurveyQuestion {
  id: string;
  questionId: string;
  stepId: string;
  title: string;
  type: "radiogroup" | "text" | "comment" | "checkbox";
  choices?: string[];
  isRequired: boolean;
  showOtherItem?: boolean;
  otherText?: string;
  otherPlaceholder?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SettingsDoc {
  docId: string;
  siteNameQuestionId: string;
  locationQuestionId: string;
  durationQuestionId: string;
  compensationQuestionId: string;
  adminUsers: string[];
}

export interface BaseSurveyAnswers {
  siteName: string;
  location: string;
  duration: string;
  compensation: string;
}

export interface ReviewModel extends SettingsDoc, BaseSurveyAnswers {
  docId: string;
  user: {
    uid: string;
    name: string;
    profileImage: string;
    email?: string | null;
  } | null;
  surveyResult: SurveyResult[];
  status: "pending" | "approved" | "rejected";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SurveyResult {
  step: {
    id: string;
    stepId: string;
    stepTitle: string;
  };
  questions: QuestionResult[];
}

export interface QuestionResult {
  questionId: string;
  title: string;
  type: "radiogroup" | "text" | "comment" | "checkbox";
  response: string | string[] | null;
  choices?: string[];
  isRequired: boolean;
  showOtherItem?: boolean;
  otherText?: string;
  otherPlaceholder?: string;
}
