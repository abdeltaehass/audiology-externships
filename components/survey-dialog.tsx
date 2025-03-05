/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import { Loader } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";
import { settingService, surveyService } from "@/service";
import { useAuthStore } from "@/store/auth-store";
import {
  BaseSurveyAnswers,
  ReviewModel,
  SurveyQuestion,
  SurveyResult,
} from "@/types";

// const evaluateCondition = (condition: string, formData: any) => {
//   if (!condition) return true;
//   const regex = /{([^}]+)}/g;
//   const evaluatedCondition = condition.replace(
//     regex,
//     (_, key) => formData[key] || "''"
//   );
//   try {
//     return eval(evaluatedCondition);
//   } catch (error) {
//     console.error("Error evaluating condition:", error);
//     return false;
//   }
// };

// const isValidInput = (input: string) => {
//   const disallowedPattern = /[<>;&]/;
//   return !disallowedPattern.test(input);
// };

// const isValidYear = (yearString: string) => {
//   const year = parseInt(yearString, 10);
//   return !isNaN(year) && year >= 1990 && year <= new Date().getFullYear();
// };

export function SurveyDialog(props: { buttonClassName?: string }) {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getStepsQuery = useQuery({
    queryKey: ["survey-steps"],
    queryFn: surveyService.getSteps,
  });
  const getQuestionsQuery = useQuery({
    queryKey: ["survey-questions"],
    queryFn: surveyService.getQuestions,
  });
  const getSettingsQuery = useQuery({
    queryKey: ["settings"],
    queryFn: settingService.getSettings,
  });

  const addReviewMutation = useMutation({
    mutationFn: surveyService.addReview,
    onSuccess: () => {
      setOpen(false);
      setCurrentStep(0);
      setFormData({});
      setErrors({});
      toast.success("Thank you for your feedback!", {
        description: "Your feedback has been submitted successfully.",
      });
    },
    onError: () => {
      toast.error("Failed to submit feedback");
    },
  });

  const totalSteps = getStepsQuery.data?.length || 0;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const currentStepQuestions = useMemo(() => {
    if (!getStepsQuery.data || !getQuestionsQuery.data) {
      return [];
    }

    return getQuestionsQuery.data.filter(
      (q) => q.stepId === getStepsQuery.data[currentStep].stepId
    );
  }, [getQuestionsQuery.data, getStepsQuery.data, currentStep]);

  const validatePage = () => {
    if (!getStepsQuery.data || !getQuestionsQuery.data) {
      console.log("Loading steps or questions...");
      return;
    }

    const newErrors: Record<string, string> = {};
    const currentQuestions = getQuestionsQuery.data.filter(
      (q) => q.stepId === getStepsQuery.data[currentStep].stepId
    );

    currentQuestions.forEach((question: SurveyQuestion) => {
      if (
        question.isRequired &&
        !formData[question.questionId]
        // && evaluateCondition(question.enableIf, formData)
      ) {
        newErrors[question.questionId] = "This field is required.";
      }

      // if (question.validators) {
      //   question.validators.forEach((validator: any) => {
      //     if (validator.type === "expression") {
      //       let isValid = true;
      //       if (validator.expression === "isValidInput({question})") {
      //         isValid = isValidInput(formData[question.questionId]);
      //       } else if (validator.expression === "isValidYear({question})") {
      //         isValid = isValidYear(formData[question.questionId]);
      //       }
      //       if (!isValid) {
      //         newErrors[question.questionId] = validator.text;
      //       }
      //     }
      //   });
      // }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validatePage() && currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!getSettingsQuery.data) {
      toast.error("Failed to submit feedback", {
        description: "Please try again later.",
      });
      return;
    }

    if (validatePage()) {
      const steps = getStepsQuery.data!;
      const questions = getQuestionsQuery.data!;

      const surveyResult: SurveyResult[] = steps.map((step) => {
        const stepQuestions = questions.filter((q) => q.stepId === step.stepId);

        return {
          step: {
            id: step.id,
            stepId: step.stepId,
            stepTitle: step.stepTitle,
          },
          questions: stepQuestions.map((question) => {
            const response = formData[question.questionId];
            let processedResponse = response;

            // Handle "other" responses
            if (question.showOtherItem) {
              if (question.type === "radiogroup" && response === "other") {
                processedResponse = formData[`${question.questionId}-other`];
              }
              if (question.type === "checkbox" && response?.includes("other")) {
                processedResponse = [
                  ...response.filter((v: string) => v !== "other"),
                  formData[`${question.questionId}-other`],
                ];
              }
            }

            return {
              questionId: question.questionId,
              title: question.title,
              type: question.type,
              response: processedResponse || null,
              choices: question.choices,
              isRequired: question.isRequired,
              showOtherItem: question.showOtherItem,
              otherText: question.otherText,
              otherPlaceholder: question.otherPlaceholder,
            };
          }),
        };
      });

      const allQuestions = surveyResult.map((s) => s.questions).flat();
      const baseAnswers: BaseSurveyAnswers = allQuestions.reduce(
        (acc, q) => {
          const answer = Array.isArray(q.response)
            ? q.response.join(", ")
            : q.response || "";

          if (q.questionId === getSettingsQuery.data.siteNameQuestionId)
            return { ...acc, siteName: answer };
          else if (q.questionId === getSettingsQuery.data.locationQuestionId)
            return { ...acc, location: answer };
          else if (q.questionId === getSettingsQuery.data.durationQuestionId)
            return { ...acc, duration: answer };
          else if (
            q.questionId === getSettingsQuery.data.compensationQuestionId
          )
            return { ...acc, compensation: answer };

          return acc;
        },
        { siteName: "", location: "", duration: "", compensation: "" }
      );

      const reviewPayload: ReviewModel = {
        ...getSettingsQuery.data,
        ...baseAnswers,
        status: "pending",
        surveyResult,
        user: user
          ? {
              uid: user.uid,
              name: user.name,
              profileImage: user.profileImage,
              email: user.email,
            }
          : null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      addReviewMutation.mutate(reviewPayload);
    }
  };

  const renderQuestion = (question: SurveyQuestion, index: number) => {
    // if (!evaluateCondition(question.enableIf, formData)) {
    //   return null;
    // }

    switch (question.type) {
      case "text":
        return (
          <div key={question.questionId} className="space-y-2">
            <Label htmlFor={question.questionId}>
              {index + 1}. {question.title}{" "}
              {question.isRequired && (
                <span className="text-destructive">*</span>
              )}
            </Label>
            <Input
              id={question.questionId}
              value={formData[question.questionId] || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [question.questionId]: e.target.value,
                })
              }
              required={question.isRequired}
              // maxLength={question.maxLength}
              // placeholder={question.placeholder}
            />
            {errors[question.questionId] && (
              <Alert variant="destructive">
                <AlertDescription>
                  {errors[question.questionId]}
                </AlertDescription>
              </Alert>
            )}
          </div>
        );
      case "radiogroup":
        return (
          <div key={question.questionId} className="space-y-4">
            <Label>
              {index + 1}. {question.title}{" "}
              {question.isRequired && (
                <span className="text-destructive">*</span>
              )}
            </Label>
            <RadioGroup
              value={formData[question.questionId] || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, [question.questionId]: value })
              }
            >
              {question.choices?.map(
                (choice: string | { value: string; text: string }) => {
                  const choiceValue =
                    typeof choice === "string" ? choice : choice.value;
                  const choiceText =
                    typeof choice === "string" ? choice : choice.text;
                  return (
                    <div
                      key={choiceValue}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={choiceValue}
                        id={`${question.questionId}-${choiceValue}`}
                      />
                      <Label htmlFor={`${question.questionId}-${choiceValue}`}>
                        {choiceText}
                      </Label>
                    </div>
                  );
                }
              )}
              {question.showOtherItem && (
                <div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="other"
                      id={`${question.questionId}-other`}
                    />
                    <Label htmlFor={`${question.questionId}-other`}>
                      Other
                    </Label>
                  </div>
                  <Input
                    value={formData[`${question.questionId}-other`] || ""}
                    className="w-full mt-2"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [`${question.questionId}-other`]: e.target.value,
                      })
                    }
                    placeholder={question.otherPlaceholder}
                  />
                </div>
              )}
            </RadioGroup>
            {errors[question.questionId] && (
              <Alert variant="destructive">
                <AlertDescription>
                  {errors[question.questionId]}
                </AlertDescription>
              </Alert>
            )}
          </div>
        );
      case "checkbox":
        return (
          <div key={question.questionId} className="space-y-4">
            <Label>
              {index + 1}. {question.title}{" "}
              {question.isRequired && (
                <span className="text-destructive">*</span>
              )}
            </Label>
            <div className="grid gap-2">
              {question.choices?.map((choice: string) => (
                <div key={choice} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.questionId}-${choice}`}
                    checked={(formData[question.questionId] || []).includes(
                      choice
                    )}
                    onCheckedChange={(checked) => {
                      const currentValues = formData[question.questionId] || [];
                      const newValues = checked
                        ? [...currentValues, choice]
                        : currentValues.filter((v: string) => v !== choice);
                      setFormData({
                        ...formData,
                        [question.questionId]: newValues,
                      });
                    }}
                  />
                  <Label htmlFor={`${question.questionId}-${choice}`}>
                    {choice}
                  </Label>
                </div>
              ))}
              {question.showOtherItem && (
                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${question.questionId}-other`}
                      checked={(formData[question.questionId] || []).includes(
                        "other"
                      )}
                      onCheckedChange={(checked) => {
                        const currentValues =
                          formData[question.questionId] || [];
                        const newValues = checked
                          ? [...currentValues, "other"]
                          : currentValues.filter((v: string) => v !== "other");
                        setFormData({
                          ...formData,
                          [question.questionId]: newValues,
                        });
                      }}
                    />
                    <Label htmlFor={`${question.questionId}-other`}>
                      Other
                    </Label>
                  </div>
                  <Input
                    value={formData[`${question.questionId}-other`] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [`${question.questionId}-other`]: e.target.value,
                      })
                    }
                    placeholder="Please specify"
                  />
                </div>
              )}
            </div>
            {errors[question.questionId] && (
              <Alert variant="destructive">
                <AlertDescription>
                  {errors[question.questionId]}
                </AlertDescription>
              </Alert>
            )}
          </div>
        );
      case "comment":
        return (
          <div key={question.questionId} className="space-y-2">
            <Label htmlFor={question.questionId}>
              {index + 1}. {question.title}{" "}
              {question.isRequired && (
                <span className="text-destructive">*</span>
              )}
            </Label>
            <Textarea
              id={question.questionId}
              value={formData[question.questionId] || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [question.questionId]: e.target.value,
                })
              }
              required={question.isRequired}
            />
            {errors[question.questionId] && (
              <Alert variant="destructive">
                <AlertDescription>
                  {errors[question.questionId]}
                </AlertDescription>
              </Alert>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={props.buttonClassName} variant="ghost">
          Fill Out Survey
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn("max-w-2xl px-0 gap-y-2", {
          "justify-center items-center h-[60vh]":
            getStepsQuery.isLoading || getQuestionsQuery.isLoading,
        })}
      >
        {getStepsQuery.isLoading || getQuestionsQuery.isLoading ? (
          <Loader className="size-6 animate-spin text-muted-foreground" />
        ) : (
          <>
            <DialogHeader className="px-6">
              <DialogTitle>
                {getStepsQuery.data![currentStep].stepTitle}
              </DialogTitle>
              <DialogDescription className="sr-only">
                This is a survey dialog. Please fill out the survey to proceed.
              </DialogDescription>
              <Progress value={progress} className="my-4" />
            </DialogHeader>
            <div
              className={cn(
                "max-h-[70vh] overflow-y-auto px-6 divide-y divide-primary/20 *:py-4 min-h-[30vh]"
              )}
            >
              {currentStepQuestions.map(renderQuestion)}
            </div>
            <DialogFooter className="flex px-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              {currentStep === totalSteps - 1 ? (
                <Button
                  onClick={handleSubmit}
                  loading={addReviewMutation.isPending}
                >
                  Submit
                </Button>
              ) : (
                <Button onClick={handleNext}>Next</Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
