export type SurveyResponse = {
  section: string;
  items: {
    question: string;
    answer: string | string[];
    icon?: React.ReactNode;
  }[];
};

export type Review = {
  id: string;
  siteName: string;
  submitted_by: string;
  submitted_at: string;
  status: "pending" | "approved" | "rejected";
};
