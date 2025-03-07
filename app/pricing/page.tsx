import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteHeader } from "@/components/layout/site-header";
import MaxWidthWrapper from "@/components/layout/max-width-wrapper";
import Link from "next/link";

const features = [
  "Unlimited externship reviews access",
  "Comprehensive user feedback",
  "Real-time updates and notifications",
  "Flexible subscription management",
  "Community insights and tips",
  "Direct communication with reviewers",
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <MaxWidthWrapper className="py-12 md:py-24 max-w-6xl">
          <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tighter text-center md:text-4xl">
              Join Our Audiology Survey Community
            </h1>
            <Card className="border-2 lg:flex overflow-hidden">
              <div className="lg:w-2/5 relative max-lg:h-96">
                <Image
                  src="./examing-patient.jpg"
                  alt="Audiologist examining patient"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="lg:w-3/5">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Audiology Membership Plan
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Unlock the Power of Externship Reviews
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="text-3xl font-bold">$1 / Week</div>
                  <div className="text-zinc-600">
                    Enjoy the freedom to access an unlimited number of reviews,
                    receiving continuous and comprehensive feedback from users
                    to stay informed. Plus, take control of your subscription
                    with the flexibility to pause or cancel anytime.
                  </div>
                  <div className="grid gap-2">
                    {features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-teal-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Link href="/checkout">
                      Subscribe Now
                    </Link>
                  </Button>
                </CardFooter>
              </div>
            </Card>
          </div>
        </MaxWidthWrapper>
      </main>
    </div>
  );
}
