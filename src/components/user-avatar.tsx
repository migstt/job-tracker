import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/initials";

type UserAvatarProps = {
  name: string | null;
  email: string | null;
};

export function UserAvatar({ name, email }: UserAvatarProps) {
  return (
    <Avatar size="sm">
      <AvatarFallback>{initials(name, email)}</AvatarFallback>
    </Avatar>
  );
}
