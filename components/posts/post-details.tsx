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
export function PostDetails({ postId }: PostDetailsProps) {
  const searchParams = useSearchParams();
  const selectedPost = postId || searchParams.get("post");
  const searchQuery = searchParams.get("query")?.toLowerCase() || "";

  const getReviewsQuery = useQuery({
    queryKey: ["reviews", { status: "accepted" }],
    queryFn: surveyService.getApprovedReviews,
  });

  const filteredReviews = getReviewsQuery.data?.length
    ? getReviewsQuery.data.filter(
        (review) =>
          review.siteName.toLowerCase().includes(searchQuery) ||
          review.location.toLowerCase().includes(searchQuery) ||
          review.duration.toLowerCase().includes(searchQuery)
      )
    : [];
  const selectedReviewData = getReviewsQuery.data?.find(
    (review) => review.docId === selectedPost
  );

  if (!selectedPost || !selectedReviewData || !filteredReviews.length) {
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
            Survey Responses
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Detailed information about the externship experience
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Site Name</h3>
            <p className="text-muted-foreground">
              {selectedReviewData?.siteName}
            </p>
          </div>
          <div className="space-y-6">
            {selectedReviewData?.surveyResult.map((section, idx) => (
              <Fragment key={idx}>
                <div>
                  <h3 className="mb-2 text-lg font-semibold tracking-tight">
                    {section.step.stepTitle}
                  </h3>
                  <div className="space-y-4">
                    {section.questions.map(
                      (item, itemIdx) =>
                        (item.response || item.response?.length) && (
                          <div key={itemIdx} className="space-y-0.5">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                              {/* {item.icon} */}
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

        {/* <div className="space-y-8">
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
      </div>
    </ScrollArea>
  );
}
