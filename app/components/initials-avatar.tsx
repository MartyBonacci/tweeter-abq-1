const COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-cyan-500",
  "bg-emerald-500",
];

const getColorFromUsername = (username: string): string => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};

type InitialsAvatarProps = {
  username: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-20 h-20 text-2xl",
};

export default function InitialsAvatar({
  username,
  avatarUrl,
  size = "md",
}: InitialsAvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`${username}'s avatar`}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  }

  const initial = username.charAt(0).toUpperCase();
  const colorClass = getColorFromUsername(username);

  return (
    <div
      className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
      aria-label={`${username}'s avatar`}
    >
      {initial}
    </div>
  );
}
