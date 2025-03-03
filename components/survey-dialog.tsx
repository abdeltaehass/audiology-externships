/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { db } from "@/lib/firebase/config";
import { getFirestore, collection, addDoc } from "firebase/firestore";
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

import { reviewSurveyJson } from "@/constants/survey";

const evaluateCondition = (condition: string, formData: any) => {
  if (!condition) return true;
  const regex = /{([^}]+)}/g;
  const evaluatedCondition = condition.replace(
    regex,
    (_, key) => formData[key] || "''"
  );
  try {
    return eval(evaluatedCondition);
  } catch (error) {
    console.error("Error evaluating condition:", error);
    return false;
  }
};

// Helper function for validation
const isValidInput = (input: string) => {
  const disallowedPattern = /[<>;&]/;
  return !disallowedPattern.test(input);
};

const isValidYear = (yearString: string) => {
  const year = parseInt(yearString, 10);
  return !isNaN(year) && year >= 1990 && year <= new Date().getFullYear();
};

export function SurveyDialog(props: { buttonClassName?: string }) {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalPages = reviewSurveyJson.pages.length;
  const progress = ((currentPage + 1) / totalPages) * 100;

  const validatePage = () => {
    const newErrors: Record<string, string> = {};
    const currentQuestions = reviewSurveyJson.pages[currentPage].elements;

    currentQuestions.forEach((question: any) => {
      if (
        question.isRequired &&
        !formData[question.name] &&
        evaluateCondition(question.enableIf, formData)
      ) {
        newErrors[question.name] = "This field is required.";
      }

      if (question.validators) {
        question.validators.forEach((validator: any) => {
          if (validator.type === "expression") {
            let isValid = true;
            if (validator.expression === "isValidInput({question})") {
              isValid = isValidInput(formData[question.name]);
            } else if (validator.expression === "isValidYear({question})") {
              isValid = isValidYear(formData[question.name]);
            }
            if (!isValid) {
              newErrors[question.name] = validator.text;
            }
          }
        });
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validatePage() && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

 /* const handleSubmit = () => {
    if (validatePage()) {
      console.log("Form submitted:", formData);
      setOpen(false);
      setCurrentPage(0);
      setFormData({});
      setErrors({});
    }
  };*/
  
const handleSubmit = async () => {
  if (validatePage()) {
    try {
      await addDoc(collection(db, "reviews"), formData);

      console.log("Form submitted and saved to Firebase:", formData)

      setOpen(false);
      setCurrentPage(0);
      setFormData({});
      setErrors({});
    } catch (e) {
      console.error("Error submitting form data:", e);
    }
  }
};

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case "text":
        return (
          <div key={question.name} className="space-y-2">
            <Label htmlFor={question.name}>
              {question.name.replace("question", "")}. {question.title}{" "}
              {question.isRequired && (
                <span className="text-destructive">*</span>
              )}
            </Label>
            <Input
              id={question.name}
              value={formData[question.name] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [question.name]: e.target.value })
              }
              required={question.isRequired}
              maxLength={question.maxLength}
              placeholder={question.placeholder}
            />
            {errors[question.name] && (
              <Alert variant="destructive">
                <AlertDescription>{errors[question.name]}</AlertDescription>
              </Alert>
            )}
          </div>
        );
      case "radiogroup":
        return (
          <div key={question.name} className="space-y-4">
            <Label>
              {question.name.replace("question", "")}. {question.title}{" "}
              {question.isRequired && (
                <span className="text-destructive">*</span>
              )}
            </Label>
            <RadioGroup
              value={formData[question.name] || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, [question.name]: value })
              }
            >
              {question.choices.map(
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
                        id={`${question.name}-${choiceValue}`}
                      />
                      <Label htmlFor={`${question.name}-${choiceValue}`}>
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
                      id={`${question.name}-other`}
                    />
                    <Label htmlFor={`${question.name}-other`}>Other</Label>
                  </div>
                  <Input
                    value={formData[`${question.name}-other`] || ""}
                    className="w-full mt-2"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [`${question.name}-other`]: e.target.value,
                      })
                    }
                    placeholder={question.otherPlaceholder}
                  />
                </div>
              )}
            </RadioGroup>
            {errors[question.name] && (
              <Alert variant="destructive">
                <AlertDescription>{errors[question.name]}</AlertDescription>
              </Alert>
            )}
          </div>
        );
      case "checkbox":
        return (
          <div key={question.name} className="space-y-4">
            <Label>
              {question.name.replace("question", "")}. {question.title}{" "}
              {question.isRequired && (
                <span className="text-destructive">*</span>
              )}
            </Label>
            <div className="grid gap-2">
              {question.choices.map((choice: string) => (
                <div key={choice} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.name}-${choice}`}
                    checked={(formData[question.name] || []).includes(choice)}
                    onCheckedChange={(checked) => {
                      const currentValues = formData[question.name] || [];
                      const newValues = checked
                        ? [...currentValues, choice]
                        : currentValues.filter((v: string) => v !== choice);
                      setFormData({ ...formData, [question.name]: newValues });
                    }}
                  />
                  <Label htmlFor={`${question.name}-${choice}`}>{choice}</Label>
                </div>
              ))}
              {question.showOtherItem && (
                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${question.name}-other`}
                      checked={(formData[question.name] || []).includes(
                        "other"
                      )}
                      onCheckedChange={(checked) => {
                        const currentValues = formData[question.name] || [];
                        const newValues = checked
                          ? [...currentValues, "other"]
                          : currentValues.filter((v: string) => v !== "other");
                        setFormData({
                          ...formData,
                          [question.name]: newValues,
                        });
                      }}
                    />
                    <Label htmlFor={`${question.name}-other`}>Other</Label>
                  </div>
                  <Input
                    value={formData[`${question.name}-other`] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [`${question.name}-other`]: e.target.value,
                      })
                    }
                    placeholder="Please specify"
                  />
                </div>
              )}
            </div>
            {errors[question.name] && (
              <Alert variant="destructive">
                <AlertDescription>{errors[question.name]}</AlertDescription>
              </Alert>
            )}
          </div>
        );
      case "comment":
        return (
          <div key={question.name} className="space-y-2">
            <Label htmlFor={question.name}>
              {question.name.replace("question", "")}. {question.title}{" "}
              {question.isRequired && (
                <span className="text-destructive">*</span>
              )}
            </Label>
            <Textarea
              id={question.name}
              value={formData[question.name] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [question.name]: e.target.value })
              }
              required={question.isRequired}
            />
            {errors[question.name] && (
              <Alert variant="destructive">
                <AlertDescription>{errors[question.name]}</AlertDescription>
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
      <DialogContent className="max-w-2xl px-0 gap-y-2">
        <DialogHeader className="px-6">
          <DialogTitle>{reviewSurveyJson.pages[currentPage].title}</DialogTitle>
          <DialogDescription>
            {reviewSurveyJson.pages[currentPage].description}
          </DialogDescription>
          <Progress value={progress} className="my-4" />
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto px-6 divide-y divide-primary/20 *:py-4">
          {reviewSurveyJson.pages[currentPage].elements.map(renderQuestion)}
        </div>
        <DialogFooter className="flex px-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          {currentPage === totalPages - 1 ? (
            <Button onClick={handleSubmit}>Submit</Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
