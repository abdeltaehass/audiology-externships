// USER NAV COMPONENT
// This component manages the user navigation dropdown in the site header.
// It conditionally renders options like Settings, Admin Dashboard (for admin users),
// Logout, and Delete Account. If the user is not authenticated, it shows Sign In and Sign Up buttons.
// Deleting an account removes it from Firebase and updates the settings admin list if applicable.

"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { LayoutDashboard, Loader, LogOut, Trash2, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { authErrors } from "@/constants/errors";
import { settingService, userService } from "@/service";
import { useAuthStore } from "@/store/auth-store";

export function UserNav() {
  const { isAuthenticated, signOut, user } = useAuthStore(); // get user and auth actions from store
  const [isAlertOpen, setIsAlertOpen] = React.useState(false); // controls delete confirmation dialog

  // Fetch app-wide settings (includes adminUsers)
  const getSettingsQuery = useQuery({
    queryKey: ["settings"],
    queryFn: settingService.getSettings,
  });

  // Mutation to update settings (used for removing admin on account delete)
  const udpateSettingMutation = useMutation({
    mutationFn: settingService.updateSettings,
  });

  // Mutation for deleting the current user account
  const deleteAcctMutation = useMutation({
    mutationFn: async () => {
      try {
        // Delete user in auth + db
        await userService.deleteUser();

        // Remove user from admin list in settings (if applicable)
        await udpateSettingMutation.mutateAsync({
          docId: getSettingsQuery.data?.docId || "",
          settings: {
            adminUsers: getSettingsQuery.data?.adminUsers.filter(
              (uid) => uid !== user?.uid
            ),
          },
        });

        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    onSuccess: () => {
      // On success: reset state, refetch settings, show toast, log out
      setIsAlertOpen(false);
      getSettingsQuery.refetch();
      toast.success("Account deleted successfully");
      signOut();
    },
    onError: (error) => {
      console.error("Error deleting account:", error);
      let message = "Error deleting account. Please try again later.";
      if (error instanceof Error) {
        message = authErrors?.[error.code] || message;
      }
      toast.error(message);
    },
  });

  // Determine if user is an admin
  const isAdmin = React.useMemo(
    () =>
      getSettingsQuery.data && user
        ? getSettingsQuery.data.adminUsers.includes(user.uid)
        : [],
    [getSettingsQuery.data, user]
  );

  return (
    <div className="flex items-center space-x-4">
      {isAuthenticated ? (
        // If logged in, show dropdown menu with avatar
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative size-10 rounded-full">
                <Avatar className="size-10">
                  <AvatarImage src={user.profileImage} alt="User avatar" />
                  <AvatarFallback>
                    <User className="size-5 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
              {/* User info */}
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* Settings */}
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>

              {/* Admin Dashboard */}
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <LayoutDashboard className="mr-1 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                </DropdownMenuItem>
              )}

              {isAdmin && <DropdownMenuSeparator />}

              {/* Delete Account */}
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                disabled={getSettingsQuery.isLoading || deleteAcctMutation.isPending}
                asChild
              >
                <AlertDialogTrigger className="w-full">
                  <Trash2 className="mr-1 h-4 w-4" />
                  <span>Delete Account</span>
                </AlertDialogTrigger>
              </DropdownMenuItem>

              {/* Logout */}
              <DropdownMenuItem
                onClick={signOut}
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="mr-1 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Delete account confirmation dialog */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteAcctMutation.isPending}>
                Cancel
              </AlertDialogCancel>
              <Button
                onClick={() => deleteAcctMutation.mutate()}
                variant="destructive"
                className="min-w-[75px]"
                disabled={deleteAcctMutation.isPending}
              >
                {deleteAcctMutation.isPending ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        // If logged out, show sign in / sign up buttons
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
