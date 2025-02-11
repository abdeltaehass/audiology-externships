"use client";

import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Check,
  Eye,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { Fragment, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { surveyService } from "@/service";
// import { SurveyResponse } from "@/types";
import { ReviewModel } from "@/types/models";

export default function ExternshipReviewsPage() {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewModel | null>(
    null
  );
  const getReviewsQuery = useQuery({
    queryKey: ["reviews"],
    queryFn: surveyService.getReviews,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Externship Reviews Management
        </h1>
        <Button
          size="icon"
          variant="outline"
          onClick={() => getReviewsQuery.refetch()}
          disabled={getReviewsQuery.isLoading || getReviewsQuery.isRefetching}
        >
          <RefreshCw
            className={
              getReviewsQuery.isRefetching ? "animate-spin" : undefined
            }
          />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Site Name</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getReviewsQuery.isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={5} className="w-full space-x-2 p-2">
                  <Skeleton className="h-8" />
                </TableCell>
              </TableRow>
            ))
          ) : getReviewsQuery.data?.length ? (
            getReviewsQuery.data.map((review) => (
              <ReviewRow
                key={review.docId as string}
                review={review}
                getReviewsQuery={getReviewsQuery}
                setSelectedReview={setSelectedReview}
                setIsViewDialogOpen={setIsViewDialogOpen}
              />
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground py-8"
              >
                No reviews found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Submitted by{" "}
              <em className="font-semibold">
                {selectedReview?.user?.name || selectedReview?.user?.email}
              </em>{" "}
              {selectedReview?.createdAt && "on "}
              <em className="font-semibold">
                {selectedReview?.createdAt &&
                  format(selectedReview.createdAt.toDate(), "Pp")}
              </em>
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-4 h-[60vh]">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Site Name</h3>
                <p className="text-muted-foreground">
                  {selectedReview?.siteName}
                </p>
              </div>
              <div className="space-y-6">
                {selectedReview?.surveyResult.map((section, idx) => (
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
                    {idx < selectedReview.surveyResult.length - 1 && (
                      <Separator />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type ReviewRowProps = {
  review: ReviewModel;
  getReviewsQuery: UseQueryResult;
  setSelectedReview: (review: ReviewModel | null) => void;
  setIsViewDialogOpen: (value: boolean) => void;
};
function ReviewRow({
  review,
  getReviewsQuery,
  setSelectedReview,
  setIsViewDialogOpen,
}: ReviewRowProps) {
  const updateStatusMutation = useMutation({
    mutationFn: surveyService.updateReview,
    onSuccess: () => {
      getReviewsQuery.refetch();
      toast.success("Review status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update review status");
    },
  });
  const deleteReviewMutation = useMutation({
    mutationFn: surveyService.deleteReview,
    onSuccess: () => {
      getReviewsQuery.refetch();
      toast.success("Review deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete review");
    },
  });

  return (
    <TableRow key={review.docId}>
      <TableCell>{review.siteName}</TableCell>
      <TableCell>{review.user?.name || review.user?.email || "-"}</TableCell>
      <TableCell>{format(review.createdAt.toDate(), "Pp")}</TableCell>
      <TableCell>
        <Badge
          variant={
            review.status === "approved"
              ? "outline"
              : review.status === "rejected"
              ? "destructive"
              : "default"
          }
          className="rounded-full"
        >
          {review.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setIsViewDialogOpen(true);
              setSelectedReview(review);
            }}
          >
            <Eye className="size-4" />
          </Button>
          {review.status === "pending" && (
            <>
              <Button
                size="icon"
                variant="default"
                onClick={() =>
                  updateStatusMutation.mutate({
                    docId: review.docId as string,
                    review: { status: "approved" },
                  })
                }
                loading={
                  updateStatusMutation.variables?.review.status ===
                    "approved" && updateStatusMutation.isPending
                }
                disabled={updateStatusMutation.isPending}
              >
                <Check className="size-2" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={() =>
                  updateStatusMutation.mutate({
                    docId: review.docId as string,
                    review: { status: "rejected" },
                  })
                }
                loading={
                  updateStatusMutation.variables?.review.status ===
                    "rejected" && updateStatusMutation.isPending
                }
                disabled={updateStatusMutation.isPending}
              >
                <X className="size-2" />
              </Button>
            </>
          )}
          <Button
            size="icon"
            variant="destructive"
            onClick={() => deleteReviewMutation.mutate(review.docId as string)}
            loading={deleteReviewMutation.isPending}
          >
            <Trash2 className="size-2" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
