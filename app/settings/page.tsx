"use client"
import MaxWidthWrapper from "@/components/layout/max-width-wrapper";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; 
import { useState } from "react";

export default function Settings() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmDelete, setConfirmDelete] = useState(false);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (email && password) {
         console.log(email);
      }/*else {
         alert("Please enter both email and password.");
      }*/
   };
// Front end, no backend integration.
   const handleDeleteAccount = () => {
      if (confirmDelete) {
      //
      console.log("Account deleted");
      } /*else {
      alert("Please confirm account deletion!!!");
      }*/
   };

   return (
      <MaxWidthWrapper >
      <SiteHeader />
      <div className="max-w-4xl mx-auto p-6">
         <Card className="mb-6">
            {/*Update your Information card*/}
            <CardContent className = "pt-6">

               <h2 className="text-xl font-bold mb-4">
                  Update Your Information
               </h2>

               {/*Email input */}
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                     <label htmlFor="email" className="block text-sm font-medium">
                        Email
                     </label>
                     <Input
                        id="email"
                        type="email"
                        placeholder="Enter your new email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                     />
                  </div>

                  {/*New password input*/}
                  <div className="space-y-2">
                     <label htmlFor="password" className="block text-sm font-medium">
                        New Password
                     </label>
                     <Input
                        id="password"
                        type="password"
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full"
                     />
                  </div>

                  {/*Save changes button*/}
                  <Button 
                     type="submit"
                     className="w-full bg-green-600 hover:bg-green-700 text-white"
                     disabled={!email || !password}>
                     Save Changes
                  </Button>
               </form>
            </CardContent>
         </Card>

         <Card>
            {/*Delete Account card*/}
            <CardContent className = "pt-6">

               <h2 className="text-xl font-bold mb-4">
                  Delete Account
               </h2>

               <p className="mb-4 text-sm text-muted-foreground">
                  Deleting your account is permanent. Please confirm to continue.
               </p>

               {/*Checkbox to confirm delete account*/}
               <div className="flex items-center space-x-2">
                  <input
                     type="checkbox"
                     id="confirmDelete"
                     checked={confirmDelete}
                     onChange={() => setConfirmDelete(!confirmDelete)}
                     className="h-4 w-4"
                  />
                  <label htmlFor="confirmDelete" className="text-sm">
                     I confirm account deletion
                  </label>
               </div>

               {/*Delete account button*/}
               <Button
                  className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDeleteAccount}
                  disabled={!confirmDelete}
               >
                  Delete My Account
               </Button>

            </CardContent>
         </Card>
      </div>
      </MaxWidthWrapper>
   );
}