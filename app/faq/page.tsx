// FAQ PAGE 
// This component displays a list of frequently asked questions (FAQs)
// for users of the Audiology Externship website. Each FAQ can be expanded or
// collapsed to reveal or hide the answer. The page is wrapped in a layout and
// includes a site header for navigation.

"use client";

import MaxWidthWrapper from "@/components/layout/max-width-wrapper"; // Layout container
import { SiteHeader } from "@/components/layout/site-header"; // Top navigation/header
import { Card, CardContent } from "@/components/ui/card"; // UI card component
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // Icons for toggling FAQ state

// Array of FAQs with question and answer pairs
const faqs = [
  {
    question: "What is Audiology Externship?",
    answer:
      "The Audiology Externship website is a platform designed to help audiology students manage/review exernships, and provide valuable resources for potential audiology externs.",
  },
  {
    question: "How do I fill out a survey?",
    answer:
      "To fill out a survey, navigate to the 'Fill Out Survey' button located in the website navigation bar and follow the on-screen prompts to answer each question.",
  },
  {
    question:
      "Can I finish filling out a survey at a later time once I have started it?",
    answer:
      "No. It will not be possible to revisit your current survey once you have begun answering questions. Please ensure you have set aside sufficient time to answer all questions once you start.",
  },
  {
    question: "How many questions are there to answer on the survey?",
    answer:
      "Users need to answer 68 questions in total for the Externships survey.",
  },
  {
    question: "What happens if I make a mistake on my survey?",
    answer:
      "Unfortunately, once submitted, survey responses cannot be edited. Please be sure to thoroughly review your answers for each question before submitting the survey.",
  },
  {
    question: "How do I create an account on the Audiology Externship website?",
    answer:
      "Located in the website navigation bar, users may find the 'Sign Up' button. Click the button and follow the registration instructions to create a user account.",
  },
  {
    question: "How do I view Externships?",
    answer:
      "By navigating to the Audiology Externship home page, users may click on the 'Explore Externships' button. Users are then redirected to the desired page, where users can view Externships based on their specified criteria.",
  },
  {
    question: "What should I do if I forget my password?",
    answer:
      "If you forget your password, please navigate to the Sign-In page and click the 'Forgot Password link where you can then reset your password by following the on-screen prompts",
  },
  {
    question: "Can I update my survey responses later?",
    answer:
      "No. Once you submit a survey, you will be unable to edit it later. Please ensure all of the information provided is accurate.",
  },
  {
    question: "What happens after I submit my externship survey?",
    answer:
      "After successfully submitting a survey to the Audiology Externship platform, the adminstrative user will be notified and carefully review the survey. Once approved, the survey will be displayed on the website.",
  },
  {
    question: "How is my survey data used?",
    answer:
      "Your survey data is used to improve externship data insights. The Audiology Externship platform does not collect personal information of any kind from its users.",
  },
];

export default function FAQPage() {
  // State to keep track of which FAQ is open
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Toggles an FAQ open or closed by index
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* Global navigation/header */}
      <SiteHeader />

      {/* Page wrapper for content width and spacing */}
      <MaxWidthWrapper>
        <div className="max-w-4xl mx-auto p-6">
          {/* Page title */}
          <h1 className="text-3xl font-bold mb-6 text-center">
            Frequently Asked Questions
          </h1>

          {/* Render each FAQ in its own clickable Card */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    {/* Question text */}
                    <h2 className="text-lg font-semibold">{faq.question}</h2>

                    {/* Icon toggles up/down depending on state */}
                    {openIndex === index ? (
                      <ChevronUp className="size-5" />
                    ) : (
                      <ChevronDown className="size-5" />
                    )}
                  </div>

                  {/* Answer is shown if the index is open */}
                  {openIndex === index && (
                    <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
