import { Form, Link } from "react-router";
import { useState } from "react";
import InitialsAvatar from "./initials-avatar";
import DeleteConfirmModal from "./delete-confirm-modal";

type TweetCardProps = {
  tweet: {
    id: string;
    content: string;
    createdAt: string;
    profileId: string;
    username: string;
    avatarUrl: string | null;
    likeCount: number;
    isLiked: boolean;
  };
  currentUserId: string;
};

const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return `${diffSecs}s`;
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function TweetCard({ tweet, currentUserId }: TweetCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isOwner = tweet.profileId === currentUserId;

  return (
    <>
      <article className="bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50/50 transition-colors">
        <div className="flex gap-3">
          <Link to={`/profile/${tweet.username}`} className="shrink-0">
            <InitialsAvatar
              username={tweet.username}
              avatarUrl={tweet.avatarUrl}
              size="md"
            />
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${tweet.username}`}
                className="font-semibold text-gray-900 hover:underline text-sm truncate"
              >
                @{tweet.username}
              </Link>
              <span className="text-gray-400 text-sm shrink-0">
                &middot; {formatTimestamp(tweet.createdAt)}
              </span>
              {isOwner && (
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Delete tweet"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>

            <p className="text-gray-900 mt-1 text-sm whitespace-pre-wrap break-words">
              {tweet.content}
            </p>

            <div className="mt-3">
              <Form method="post" className="inline">
                <input type="hidden" name="_action" value="like" />
                <input type="hidden" name="tweetId" value={tweet.id} />
                <button
                  type="submit"
                  className={`flex items-center gap-1.5 text-sm transition-colors ${
                    tweet.isLiked
                      ? "text-red-500 hover:text-red-600"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                  aria-label={tweet.isLiked ? "Unlike tweet" : "Like tweet"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill={tweet.isLiked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={tweet.isLiked ? 0 : 1.5}
                    className="w-4 h-4"
                  >
                    <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.723.723 0 01-.692 0l-.003-.002z" />
                  </svg>
                  <span>{tweet.likeCount}</span>
                </button>
              </Form>
            </div>
          </div>
        </div>
      </article>

      <DeleteConfirmModal
        tweetId={tweet.id}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </>
  );
}
