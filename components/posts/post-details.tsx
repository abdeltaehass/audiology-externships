/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  // MapPin,
  // Calendar,
  // DollarSign,
  // Users,
  // Stethoscope,
  // GraduationCap,
  // Clock,
} from "lucide-react";
// import { SurveyResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { surveyService } from "@/service";
import { Fragment } from "react";
import externshipSurveyData from "@/constants/externshipSurveyData.json";
import { ExternshipData } from "@/types/externship-Data";
import { ReviewModel } from "@/types";

// const mockSurveyResponses: SurveyResponse[] = [
//   {
//     section: "Basic Information",
//     items: [
//       {
//         question: "Externship Site Name",
//         answer: "Audiology Center of Excellence",
//         icon: <Building2 className="h-4 w-4" />,
//       },
//       {
//         question: "Location",
//         answer: "San Francisco, California",
//         icon: <MapPin className="h-4 w-4" />,
//       },
//       {
//         question: "Duration",
//         answer: "12 months",
//         icon: <Calendar className="h-4 w-4" />,
//       },
//       {
//         question: "Compensation",
//         answer: "$40,001 - $50,000",
//         icon: <DollarSign className="h-4 w-4" />,
//       },
//     ],
//   },
//   {
//     section: "Clinical Experience",
//     items: [
//       {
//         question: "Patient Population",
//         answer: ["Adults", "Pediatrics", "Geriatrics"],
//         icon: <Users className="h-4 w-4" />,
//       },
//       {
//         question: "Clinical Focus Areas",
//         answer: [
//           "Diagnostic Audiology",
//           "Hearing Aids",
//           "Cochlear Implants",
//           "Vestibular Testing",
//         ],
//         icon: <Stethoscope className="h-4 w-4" />,
//       },
//     ],
//   },
//   {
//     section: "Educational Details",
//     items: [
//       {
//         question: "Supervision Model",
//         answer: "Direct supervision with gradual independence",
//         icon: <GraduationCap className="h-4 w-4" />,
//       },
//       {
//         question: "Weekly Schedule",
//         answer: "40 hours/week, Monday-Friday",
//         icon: <Clock className="h-4 w-4" />,
//       },
//     ],
//   },
// ];

type PostDetailsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postId?: string | null;
};
function isReviewModel(post: ReviewModel | ExternshipData): post is ReviewModel {
  return 'docId' in post && 'surveyResult' in post;
}

function getSiteName(post: ReviewModel | ExternshipData): string {
  if (isReviewModel(post)) {

    if (post.siteName) return post.siteName;
    if (post.surveyResult && post.surveyResult.length > 0) {
      for (const section of post.surveyResult) {
        const siteNameQuestion = section.questions.find(
          q => q.title.toLowerCase().includes("externship site name") ||
               q.title === "Externship Site Name:" ||
               q.questionId === post.siteNameQuestionId
        );
        if (siteNameQuestion?.response) {
          return siteNameQuestion.response as string;
        }
      }
    }
    return "Unnamed Site";
  }
  return post["Externship Site Name"] || "Unnamed Site";
}

function getCity(post: ReviewModel | ExternshipData): string {
  if (isReviewModel(post)) {
    if (post.location) return post.location.split(',')[0].trim();
    return (
      post.surveyResult[0]?.questions.find(q => q.title === "City of Externship?")?.response as string || 
      "Unknown City"
    );
  }
  return post["City of Externship?"] || "Unknown City";
}

function getState(post: ReviewModel | ExternshipData): string {
  if (isReviewModel(post)) {
    if (post.location) {
      const parts = post.location.split(',');
      return parts.length > 1 ? parts[1].trim() : "Unknown State";
    }
    return (
      post.surveyResult[0]?.questions.find(q => q.title === "Externship State or Territory?")?.response as string || 
      "Unknown State"
    );
  }
  return post["Externship State or Territory?"] || "Unknown State";
}

function getDuration(post: ReviewModel | ExternshipData): string {
  if (isReviewModel(post)) {
    if (post.duration) return post.duration;
    return (
      post.surveyResult[0]?.questions.find(q => q.title === "Duration of Externship?")?.response as string || 
      "Unknown Duration"
    );
  }
  return post["Duration of Externship?"] || "Unknown Duration";
}

export function getPostId(post: ReviewModel | ExternshipData): string {
  if (isReviewModel(post)) {
    return post.docId;
  }return `externship-${String(post["Externship Site Name"])
    .toLowerCase()
    .replace(/\s+/g, '-')}-${String(post["City of Externship?"])
    .toLowerCase()
    .replace(/\s+/g, '-')}`;
}


export function PostDetails({ postId }: PostDetailsProps) {
  const searchParams = useSearchParams();
  const selectedPost = postId || searchParams.get("post");

  const getReviewsQuery = useQuery({
    queryKey: ["reviews", { status: "accepted" }],
    queryFn: surveyService.getApprovedReviews,
  });

  const submittedSurveys = getReviewsQuery.data || [];
  const externshipData = externshipSurveyData as ExternshipData[];
  const combinedData = [...externshipData, ...submittedSurveys]
  .filter(post => {
    const siteName = isReviewModel(post)
      ? post.siteName || 
        post.surveyResult?.[0]?.questions?.find(
          (q: any) => q.title === "Externship Site Name"
        )?.response as string
      : post["Externship Site Name"];
    return siteName && !/unnamed/i.test(siteName) && siteName.trim() !== "";
  });

  const selectedPostData = combinedData.find(post => {
    if (isReviewModel(post)) {
      return post.docId === selectedPost;
    }
    return `externship-${post["Externship Site Name"]}-${post["City of Externship?"]}` === selectedPost;
  });

  if (!selectedPost || !selectedPostData) {
    return (
      <div className="flex h-full min-h-[50vh] flex-col items-center justify-center p-8 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No externship selected</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Select an externship from the list to view details
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full flex flex-1">
      <div className="p-6 py-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            {isReviewModel(selectedPostData) ? "Survey Responses" : "Externship Details"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Detailed information about the externship experience
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Site Name</h3>
            <p className="text-muted-foreground">
              {getSiteName(selectedPostData)}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Location</h3>
            <p className="text-muted-foreground">
              {getCity(selectedPostData)}, {getState(selectedPostData)}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Duration</h3>
            <p className="text-muted-foreground">
              {getDuration(selectedPostData)}
            </p>
          </div>

          {isReviewModel(selectedPostData) ? (
            // Render database survey results
            <div className="space-y-6">
              {selectedPostData.surveyResult?.map((section, idx) => (
                <Fragment key={idx}>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold tracking-tight">
                      {section.step.stepTitle}
                    </h3>
                    <div className="space-y-4">
                      {section.questions.map(
                        (question, questionIdx) =>
                          (question.response || question.response?.length) && (
                            <div key={questionIdx} className="space-y-0.5">
                              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <span>
                                  {questionIdx + 1}. {question.title}
                                </span>
                              </div>
                              {Array.isArray(question.response) ? (
                                <div className="flex flex-wrap gap-1">
                                  {question.response.map((ans, ansIdx) => (
                                    <Badge
                                      key={ansIdx}
                                      variant="secondary"
                                      className="bg-primary/5"
                                    >
                                      {ans}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm">
                                  {"> "}
                                  {question.response}
                                </p>
                              )}
                            </div>
                          )
                      )}
                    </div>
                  </div>
                  {idx < selectedPostData.surveyResult.length - 1 && (
                    <Separator />
                  )}
                </Fragment>
              ))}
            </div>
          ) : (
            // Render file-based survey fields
            <div className="space-y-6">
              {Object.entries(selectedPostData)
                .filter(([key]) => !key.startsWith("field") && key !== "ID")
                .map(([key, value], idx) => {
                  const displayValue = Array.isArray(value)
                    ? value.join(", ")
                    : String(value);

                  return (
                    <Fragment key={idx}>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold tracking-tight">
                          {key}
                        </h3>
                        <div className="space-y-0.5">
                          <p className="text-sm">
                            {"> "}
                            {displayValue}
                          </p>
                        </div>
                      </div>
                      {idx < Object.keys(selectedPostData).length - 1 && (
                        <Separator />
                      )}
                    </Fragment>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
      
                      {/* {section.questions.map(
                      (item, itemIdx) =>
                        (item.response || item.response?.length) && (
                          <div key={itemIdx} className="space-y-0.5">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                              {/* {item.icon} 
                              <span>
                                {itemIdx + 1}. {item.title}
                              </span>
                            </div>
                            {Array.isArray(item.response) ? (
                              <div className="flex flex-wrap">
                                {"> "}{" "}
                                {item.response.map((ans, ansIdx) => (
                                  <Badge
                                    key={ansIdx}
                                    variant="secondary"
                                    className="bg-primary/5"
                                  >
                                    {ans}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm">
                                {"> "}
                                {item.response}
                              </p>
                            )}
                          </div>
                        )
                    )}
                  </div>
                </div>
                {idx < selectedReviewData.surveyResult.length - 1 && (
                  <Separator />
                )}
              </Fragment>
            ))}
          </div>
        </div>

      <div className="space-y-8">
          {mockSurveyResponses.map((section, idx) => (
            <div key={idx}>
              <h3 className="mb-4 text-lg font-semibold tracking-tight">
                {section.section}
              </h3>
              <div className="space-y-4">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      {item.icon}
                      <span>{item.question}</span>
                    </div>
                    <div className="pl-6">
                      {Array.isArray(item.answer) ? (
                        <div className="flex flex-wrap gap-2">
                          {item.answer.map((ans, ansIdx) => (
                            <Badge
                              key={ansIdx}
                              variant="secondary"
                              className="bg-primary/5"
                            >
                              {ans}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm">{item.answer}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {idx < mockSurveyResponses.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div> */}
