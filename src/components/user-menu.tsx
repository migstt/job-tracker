"use client";

import { LogOutIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";

import { IconButton } from "@/components/icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { signOut } from "@/features/auth/actions";

type UserMenuProps = {
  name: string | null;
  email: string | null;
};

export function UserMenu({ name, email }: UserMenuProps) {
  const label = name ?? email ?? "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<IconButton label="Account menu" className="rounded-full" />}>
        <UserAvatar name={name} email={email} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">{label}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/settings" />}>
            <SettingsIcon />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOutIcon />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
