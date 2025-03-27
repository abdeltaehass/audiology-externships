// ADMIN PAGE
// This page is used by admin users to manage and moderate externship reviews submitted by students.
// It includes features like viewing detailed survey responses, approving or rejecting submissions,
// and deleting reviews. Data is fetched and mutated using React Query.

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

// UI components
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

// API services and types
import { surveyService } from "@/service";
import { ReviewModel } from "@/types";
import { SiteHeader } from "@/components/layout/site-header"; // Navigation header

export default function ExternshipReviewsPage() {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // controls modal visibility
  const [selectedReview, setSelectedReview] = useState<ReviewModel | null>(null); // stores the selected review

  // Fetch all submitted reviews using React Query
  const getReviewsQuery = useQuery({
    queryKey: ["reviews"],
    queryFn: surveyService.getReviews,
  });

  return (
    <div className="space-y-6">
       <SiteHeader />
      {/* Header and refresh button */}
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
          <RefreshCw className={getReviewsQuery.isRefetching ? "animate-spin" : undefined} />
        </Button>
      </div>

      {/* Reviews Table */}
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
          {/* Loading placeholder */}
          {getReviewsQuery.isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={5}><Skeleton className="h-8" /></TableCell>
              </TableRow>
            ))
          ) : getReviewsQuery.data?.length ? (
            // Map each review to its own row
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
            // No reviews found
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No reviews found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Review Details Modal */}
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
                {selectedReview?.createdAt && format(selectedReview.createdAt.toDate(), "Pp")}
              </em>
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable section with survey responses */}
          <ScrollArea className="mt-4 h-[60vh]">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Site Name</h3>
                <p className="text-muted-foreground">{selectedReview?.siteName}</p>
              </div>

              <div className="space-y-6">
                {/* Render each section and its answered questions */}
                {selectedReview?.surveyResult.map((section, idx) => (
                  <Fragment key={idx}>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold tracking-tight">
                        {section.step.stepTitle}
                      </h3>
                      <div className="space-y-4">
                        {section.questions.map((item, itemIdx) =>
                          (item.response || item.response?.length) && (
                            <div key={itemIdx} className="space-y-0.5">
                              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <span>{itemIdx + 1}. {item.title}</span>
                              </div>
                              {/* Show array of answers as badges */}
                              {Array.isArray(item.response) ? (
                                <div className="flex flex-wrap">
                                  {item.response.map((ans, ansIdx) => (
                                    <Badge key={ansIdx} variant="secondary" className="bg-primary/5">
                                      {ans}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm">{item.response}</p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    {idx < selectedReview.surveyResult.length - 1 && <Separator />}
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

// Component to render a single row of the reviews table
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
  // Mutation to approve or reject a review
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

  // Mutation to delete a review
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
    <TableRow>
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
          {/* View button */}
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

          {/* Approve/Reject buttons (only for pending) */}
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

          {/* Delete button (available in all states) */}
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
