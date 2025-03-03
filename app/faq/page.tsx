"use client";

import MaxWidthWrapper from "@/components/layout/max-width-wrapper";
import { SiteHeader } from "@/components/layout/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// List of questions and answers (12)
// These will be displayed on the dedicated FAQ page
const faqs =
[
  { question: "What is Audiology Externship?", 
    answer: "The Audiology Externship website is a platform designed to help audiologists manage / review externships, and provide valuable resources for students and professionals alike." 
  },

  { question: "How do I fill out a survey?", 
    answer: "To fill out a survey, navigate to the 'Fill Out Survey' button located in the website navigation bar and follow the on-screen prompts to answer each question."
  },

  { question: "Can I finish filling out a survey at a later time once I have started it?", 
    answer: "No. It will not be possible to revisit your current survey once you have begun answering questions. Please ensure you have set aside sufficient time to answer all questions once you start." 
  },

  { question: "How many questions are there to answer on the survey?", 
    answer: "Users need to answer 68 questions in total for the Externships survey." 
  },
  
  { question: "What happens if I make a mistake on my survey?",
    answer: "Unfortunately, once submitted, survey responses cannot be edited. Please be sure to thoroughly review your answers for each question before submitting the survey."
  },

  { question: "How do I create an account on the Audiology Externship website?", 
    answer: "Located in the website navigation bar, users may find the 'Sign Up' button. Click the button and follow the registration instructions to create a user account. " 
  },

  { question: "How do I view Externships?", 
    answer: "By navigating to the Audiology Externship home page, users may click on the 'Explore Externships' button. Users are then redirected to the desired page, where users can view Externships based on their specified criteria." 
  },

  { question: "What should I do if I forget my password? [Work in Progress]", 
    answer: "If you forget your password, please send an email to the website support team for further assistance in resetting your password." 
  },

  { question: "Can I update my survey responses later?", 
    answer: "No. Once you submit a survey, you will be unable to edit it later. Please ensure all of the information provided is accurate." 
  },

  { question: "Is there any fee associated with using the Audiology Externship platform?", 
    answer: "There is not a fee for browsing through the website normally. However, users may opt to register and pay a $1 weekly subscription, which allows the ability to view Externships ratings and other detailed information." 
  },

  { question: "What happens after I submit my externship survey?", 
    answer: "After successfully submitting a survey to the Audiology Externship platform, the adminstrative user will be notified and carefully review the survey. Once approved, the survey will be displayed on the website." 
  },

  { question: "How is my survey data used?", 
    answer: "Your survey data is used to improve externship data insights. The Audiology Externship platform does not collect personal information of any kind from its users." 
  }
];

// Creating function that dynamically changes state upon user click
// Ensuring only one item is open at a time
export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Rendering the FAQ page
  return (
    // Wrapping content of the page in a layout container
    <MaxWidthWrapper>
      <SiteHeader />
      <div className="max-w-4xl mx-auto p-6">
        
        <h1 className="text-3xl font-bold mb-6 text-center">
          Frequently Asked Questions
        </h1>

        {/* Individual FAQ cards for questions / answers */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (

            <Card key={index} className="cursor-pointer" onClick={() => toggleFAQ(index)}>

              <CardContent className="p-6">
                <div className="flex justify-between items-center">

                  <h2 className="text-lg font-semibold">{faq.question}</h2>

                  {/* Expanding / Collapsing the FAQ card */}
                  {openIndex === index ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}

                </div>
                {openIndex === index && <p className="mt-2 text-muted-foreground">{faq.answer}</p>}
              </CardContent>

            </Card>
          ))}
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
