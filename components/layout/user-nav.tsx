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
  const { isAuthenticated, signOut, user } = useAuthStore();
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const getSettingsQuery = useQuery({
    queryKey: ["settings"],
    queryFn: settingService.getSettings,
  });
  const udpateSettingMutation = useMutation({
    mutationFn: settingService.updateSettings,
  });
  const deleteAcctMutation = useMutation({
    mutationFn: async () => {
      try {
        await userService.deleteUser();
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
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <LayoutDashboard className="mr-1 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                </DropdownMenuItem>
              )}
              {isAdmin && <DropdownMenuSeparator />}
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                disabled={
                  getSettingsQuery.isLoading || deleteAcctMutation.isPending
                }
                asChild
              >
                <AlertDialogTrigger className="w-full">
                  <Trash2 className="mr-1 h-4 w-4" />
                  <span>Delete Account</span>
                </AlertDialogTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={signOut}
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="mr-1 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
