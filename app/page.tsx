// HOME PAGE
// This is the landing page for the Audiology Externships platform.
// It highlights the platform's purpose — to help users discover and share externship experiences.
// The layout includes a hero section, a call-to-action, and two feature cards linking to externship listings and submission.

import { ArrowRight, ClipboardCheck, Search } from "lucide-react";
import Image from "next/image";

import MaxWidthWrapper from "@/components/layout/max-width-wrapper";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top navigation header */}
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden max-lg:pt-20 bg-primary/10">
          <MaxWidthWrapper className="relative z-10 grid gap-8 lg:grid-cols-2 max-lg:px-0 lg:pr-0">
            {/* Text column */}
            <div className="flex flex-col justify-center space-y-8 max-lg:px-3.5">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-5xl/none">
                  Discover & Share Audiology Externships
                </h1>
                <p className="max-w-[600px] text-xl text-gray-600">
                  Explore peer experiences and contribute your own insights to
                  shape the future of audiology education.
                </p>
              </div>

              {/* Call-to-action button */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button className="group" size="lg" asChild>
                  <Link href="/posts">
                    Get Started
                    <ArrowRight className="group-hover:translate-x-1 transition-transform size-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative min-h-[55vh]">
              <Image
                src="/hero-img.jpg"
                alt="Audiologist examining a patient"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </MaxWidthWrapper>
        </section>

        {/* Features Section */}
        <MaxWidthWrapper as="section" className="py-20">
          {/* Section heading */}
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Explore Audiology Externships
            </h2>
            <p className="mx-auto max-w-[600px] text-xl text-gray-600 md:text-2xl">
              Your Gateway to Professional Growth
            </p>
          </div>

          {/* Feature layout: image + two cards */}
          <div className="grid gap-4 grid-cols-2 max-lg:grid-cols-1">
            {/* Left: Image */}
            <Image
              src="/coverAI.png"
              alt="Externship student"
              className="object-cover object-center h-full w-full rounded-xl max-h-[600px]"
              width={500}
              height={500}
            />

            {/* Right: Cards */}
            <div className="grid grid-cols-1 grid-rows-2 gap-4">
              {/* Card 1: Search externships */}
              <Card className="bg-white shadow-lg transition-all hover:shadow-xl">
                <CardContent className="p-6 text-start flex flex-col items-start space-y-4">
                  {/* Icon */}
                  <div className="rounded-full bg-primary/10 p-3">
                    <Search className="w-8 h-8 text-primary" />
                  </div>

                  {/* Title & description */}
                  <h3 className="text-2xl font-semibold">
                    Searching for externships?
                  </h3>
                  <p className="text-gray-600">
                    Audiology Externships is a platform built to help you
                    explore a world of externship opportunities in Audiology.
                    Review these options as you apply and make decisions about
                    your externship.
                  </p>

                  {/* Button linking to externship listings */}
                  <Link href="/posts">
                    <Button className="group">
                      Explore Externships
                      <ArrowRight className="group-hover:translate-x-1 transition-transform size-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Card 2: Submit externship */}
              <Card className="bg-white shadow-lg transition-all hover:shadow-xl">
                <CardContent className="p-6 text-start flex flex-col items-start space-y-4">
                  {/* Icon */}
                  <div className="rounded-full bg-primary/10 p-3">
                    <ClipboardCheck className="w-8 h-8 text-primary" />
                  </div>

                  {/* Title & description */}
                  <h3 className="text-2xl font-semibold">
                    Completed your externship?
                  </h3>
                  <p className="text-gray-600">
                    Join our community and help others advance their careers by
                    sharing your valuable externship experiences on our website.
                  </p>

                  {/* Button (not yet linked) */}
                  <Button className="group">
                    Submit Externship
                    <ArrowRight className="group-hover:translate-x-1 transition-transform size-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </MaxWidthWrapper>
      </main>
    </div>
  );
}
