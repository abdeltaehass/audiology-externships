/* eslint-disable react/no-unescaped-entities */
"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

import { surveyService } from "@/service";
import { SurveyQuestion, SurveyStep } from "@/types";

export default function SurveyManagementPage() {
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [isStepDialogOpen, setIsStepDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<SurveyQuestion | null>(
    null
  );
  const [currentStep, setCurrentStep] = useState<SurveyStep | null>(null);
  const [addStepState, setAddStepState] = useState({
    stepId: "",
    stepTitle: "",
  });
  const [addQuestionState, setAddQuestionState] = useState({
    stepId: "",
    type: "text" as SurveyQuestion["type"],
    questionId: "",
    title: "",
    isRequired: false,
    choices: [] as SurveyQuestion["choices"],
    showOtherItem: false,
    otherText: "",
    otherPlaceholder: "",
  });
  const [isEditingStep, setIsEditingStep] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);

  const getStepsQuery = useQuery({
    queryKey: ["survey-steps"],
    queryFn: surveyService.getSteps,
  });
  const getQuestionsQuery = useQuery({
    queryKey: ["survey-questions"],
    queryFn: surveyService.getQuestions,
  });

  // question mutations
  const addQuestionMutation = useMutation({
    mutationFn: surveyService.addQuestion,
    onSuccess: () => {
      toast.success("Question added successfully");
      setIsQuestionDialogOpen(false);
      getQuestionsQuery.refetch();
    },
    onError: () => {
      toast.error("Failed to add question");
    },
  });
  const updateQuestionMutation = useMutation({
    mutationFn: surveyService.updateQuestion,
    onSuccess: () => {
      toast.success("Question updated successfully");
      setIsQuestionDialogOpen(false);
      getQuestionsQuery.refetch();
    },
    onError: () => {
      toast.error("Failed to update question");
    },
  });
  const deleteQuestionMutation = useMutation({
    mutationFn: surveyService.deleteQuestion,
    onSuccess: () => {
      toast.success("Question deleted successfully");
      getQuestionsQuery.refetch();
    },
    onError: () => {
      toast.error("Failed to delete question");
    },
  });

  // step mutations
  const addStepMutation = useMutation({
    mutationFn: surveyService.addStep,
    onSuccess: () => {
      toast.success("Step added successfully");
      setIsStepDialogOpen(false);
      getStepsQuery.refetch();
    },
    onError: () => {
      toast.error("Failed to add step");
    },
  });
  const updateStepMutation = useMutation({
    mutationFn: surveyService.updateStep,
    onSuccess: () => {
      toast.success("Step updated successfully");
      setIsStepDialogOpen(false);
      getStepsQuery.refetch();
    },
    onError: () => {
      toast.error("Failed to update step");
    },
  });
  const deleteStepMutation = useMutation({
    mutationFn: surveyService.deleteStep,
    onSuccess: () => {
      toast.success("Step deleted successfully");
      getStepsQuery.refetch();
    },
    onError: () => {
      toast.error("Failed to delete step");
    },
  });

  const addQuestion = (
    question: Omit<SurveyQuestion, "id" | "createdAt" | "updatedAt">
  ) => {
    addQuestionMutation.mutate(question);
  };

  const updateQuestion = (updatedQuestion: SurveyQuestion) => {
    updateQuestionMutation.mutate({
      question: updatedQuestion,
      questionId: updatedQuestion.id,
    });
  };

  const deleteQuestion = (id: string) => {
    deleteQuestionMutation.mutate(id);
  };

  const addStep = (
    step: Omit<SurveyStep, "id" | "createdAt" | "updatedAt">
  ) => {
    addStepMutation.mutate(step);
  };

  const updateStep = (updatedStep: SurveyStep) => {
    updateStepMutation.mutate({ step: updatedStep, stepId: updatedStep.id });
  };

  const deleteStep = (id: string) => {
    deleteStepMutation.mutate(id);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4 w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Survey Steps</h2>
          <Button
            onClick={() => {
              setCurrentStep(null);
              setIsStepDialogOpen(true);
              setIsEditingStep(false);
            }}
          >
            <PlusCircle className="h-4 w-4" />
            Add Step
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getStepsQuery.isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="">
                  <TableCell colSpan={3} className="w-full space-x-2 p-2">
                    <Skeleton className="h-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : getStepsQuery.data?.length ? (
              getStepsQuery.data.map((step) => (
                <TableRow key={step.stepId}>
                  <TableCell>{step.stepId}</TableCell>
                  <TableCell>{step.stepTitle}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setCurrentStep(step);
                          setIsStepDialogOpen(true);
                          setIsEditingStep(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        loading={deleteStepMutation.isPending}
                        onClick={() => deleteStep(step.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground py-8"
                >
                  No steps found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-4 w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Survey Questions</h2>
          <Button
            onClick={() => {
              setCurrentQuestion(null);
              setIsQuestionDialogOpen(true);
              setIsEditingQuestion(false);
            }}
          >
            <PlusCircle className="h-4 w-4" />
            Add Question
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Step</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Required</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getQuestionsQuery.isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="">
                  <TableCell colSpan={6} className="w-full space-x-2 p-2">
                    <Skeleton className="h-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : getQuestionsQuery.data?.length ? (
              getQuestionsQuery.data.map((question) => (
                <TableRow key={question.questionId}>
                  <TableCell>
                    {(getStepsQuery.data || []).find(
                      (s) => s.stepId === question.stepId
                    )?.stepTitle || question.stepId}
                  </TableCell>
                  <TableCell>{question.questionId}</TableCell>
                  <TableCell>{question.title}</TableCell>
                  <TableCell>{question.type}</TableCell>
                  <TableCell>{question.isRequired ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setCurrentQuestion(question);
                          setIsQuestionDialogOpen(true);
                          setIsEditingQuestion(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        loading={deleteQuestionMutation.isPending}
                        onClick={() => deleteQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  No questions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={isQuestionDialogOpen}
        onOpenChange={setIsQuestionDialogOpen}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentQuestion ? "Edit Question" : "Add Question"}
            </DialogTitle>
          </DialogHeader>
          <form
            id="question-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (isEditingQuestion) {
                if (currentQuestion) updateQuestion(currentQuestion);
              } else {
                addQuestion(addQuestionState);
              }
            }}
            className="grid gap-4 py-4"
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="step" className="text-right">
                Step
              </Label>
              <Select
                defaultValue={currentQuestion?.stepId}
                onValueChange={(value) =>
                  isEditingQuestion
                    ? setCurrentQuestion((prev) =>
                        prev
                          ? {
                              ...prev,
                              stepId: value,
                            }
                          : null
                      )
                    : setAddQuestionState((prev) => ({
                        ...prev,
                        stepId: value,
                      }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select step" />
                </SelectTrigger>
                <SelectContent>
                  {(getStepsQuery.data || []).map((step) => (
                    <SelectItem key={step.stepId} value={step.stepId}>
                      {step.stepTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue={currentQuestion?.questionId}
                className="col-span-3"
                onChange={(e) =>
                  isEditingQuestion
                    ? setCurrentQuestion((prev) =>
                        prev
                          ? {
                              ...prev,
                              questionId: e.target.value,
                            }
                          : null
                      )
                    : setAddQuestionState((prev) => ({
                        ...prev,
                        questionId: e.target.value,
                      }))
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                defaultValue={currentQuestion?.title}
                className="col-span-3"
                onChange={(e) =>
                  isEditingQuestion
                    ? setCurrentQuestion((prev) =>
                        prev
                          ? {
                              ...prev,
                              title: e.target.value,
                            }
                          : null
                      )
                    : setAddQuestionState((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                defaultValue={currentQuestion?.type}
                onValueChange={(value) =>
                  isEditingQuestion
                    ? setCurrentQuestion((prev) =>
                        prev
                          ? {
                              ...prev,
                              type: value as SurveyQuestion["type"],
                            }
                          : null
                      )
                    : setAddQuestionState((prev) => ({
                        ...prev,
                        type: value as SurveyQuestion["type"],
                      }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="radiogroup">Radio Group</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="comment">Comment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="required" className="text-right">
                Required
              </Label>
              <Checkbox
                id="required"
                checked={currentQuestion?.isRequired}
                onCheckedChange={(checked) =>
                  isEditingQuestion
                    ? setCurrentQuestion((prev) =>
                        prev
                          ? {
                              ...prev,
                              isRequired: checked as boolean,
                            }
                          : null
                      )
                    : setAddQuestionState((prev) => ({
                        ...prev,
                        isRequired: checked as boolean,
                      }))
                }
              />
            </div>
            {(currentQuestion?.type === "radiogroup" ||
              currentQuestion?.type === "checkbox") && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="choices" className="text-right">
                    Choices
                  </Label>
                  <Textarea
                    id="choices"
                    defaultValue={currentQuestion?.choices?.join("\n")}
                    className="col-span-3"
                    onChange={(e) =>
                      isEditingQuestion
                        ? setCurrentQuestion((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  choices: e.target.value.split("\n"),
                                }
                              : null
                          )
                        : setAddQuestionState((prev) => ({
                            ...prev,
                            choices: e.target.value.split("\n"),
                          }))
                    }
                    placeholder="Enter choices, one per line"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="showOtherItem" className="text-right">
                    Show "Other" Option
                  </Label>
                  <Checkbox
                    id="showOtherItem"
                    checked={currentQuestion?.showOtherItem}
                    onCheckedChange={(checked) =>
                      isEditingQuestion
                        ? setCurrentQuestion((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  showOtherItem: checked as boolean,
                                }
                              : null
                          )
                        : setAddQuestionState((prev) => ({
                            ...prev,
                            showOtherItem: checked as boolean,
                          }))
                    }
                  />
                </div>
                {currentQuestion?.showOtherItem && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="otherText" className="text-right">
                        "Other" Text
                      </Label>
                      <Input
                        id="otherText"
                        defaultValue={currentQuestion?.otherText}
                        className="col-span-3"
                        onChange={(e) =>
                          isEditingQuestion
                            ? setCurrentQuestion((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      otherText: e.target.value,
                                    }
                                  : null
                              )
                            : setAddQuestionState((prev) => ({
                                ...prev,
                                otherText: e.target.value,
                              }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="otherPlaceholder" className="text-right">
                        "Other" Placeholder
                      </Label>
                      <Input
                        id="otherPlaceholder"
                        defaultValue={currentQuestion?.otherPlaceholder}
                        className="col-span-3"
                        onChange={(e) =>
                          isEditingQuestion
                            ? setCurrentQuestion((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      otherPlaceholder: e.target.value,
                                    }
                                  : null
                              )
                            : setAddQuestionState((prev) => ({
                                ...prev,
                                otherPlaceholder: e.target.value,
                              }))
                        }
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </form>
          <DialogFooter>
            <Button
              type="submit"
              form="question-form"
              loading={
                addQuestionMutation.isPending ||
                updateQuestionMutation.isPending
              }
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isStepDialogOpen} onOpenChange={setIsStepDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentStep ? "Edit Step" : "Add Step"}</DialogTitle>
          </DialogHeader>
          <form
            id="step-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (isEditingStep) {
                if (currentStep) updateStep(currentStep);
              } else {
                addStep(addStepState);
              }
            }}
            className="grid gap-4 py-4"
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stepId" className="text-right">
                ID
              </Label>
              <Input
                id="stepId"
                defaultValue={currentStep?.stepId}
                className="col-span-3"
                onChange={(e) =>
                  isEditingStep
                    ? setCurrentStep((prev) =>
                        prev
                          ? {
                              ...prev,
                              stepId: e.target.value,
                            }
                          : null
                      )
                    : setAddStepState((prev) => ({
                        ...prev,
                        stepId: e.target.value,
                      }))
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stepTitle" className="text-right">
                Title
              </Label>
              <Input
                id="stepTitle"
                defaultValue={currentStep?.stepTitle}
                className="col-span-3"
                onChange={(e) =>
                  isEditingStep
                    ? setCurrentStep((prev) =>
                        prev
                          ? {
                              ...prev,
                              stepTitle: e.target.value,
                            }
                          : null
                      )
                    : setAddStepState((prev) => ({
                        ...prev,
                        stepTitle: e.target.value,
                      }))
                }
              />
            </div>
          </form>
          <DialogFooter>
            <Button
              type="submit"
              form="step-form"
              loading={
                addStepMutation.isPending || updateStepMutation.isPending
              }
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
