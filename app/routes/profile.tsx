import { data, Link } from "react-router";
import type { Route } from "./+types/profile";
import { requireAuth } from "~/utils/auth.server";
import sql from "~/utils/db.server";
import InitialsAvatar from "~/components/initials-avatar";
import TweetCard from "~/components/tweet-card";

export function meta({ data: loaderData }: Route.MetaArgs) {
  const username = loaderData?.profile?.username ?? "Profile";
  return [{ title: `@${username} - Tweeter` }];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const currentUser = await requireAuth(request);
  const { username } = params;

  const [profile] = await sql`
    SELECT id, username, email, bio, avatar_url, created_at
    FROM profiles
    WHERE username = ${username}
  `;

  if (!profile) {
    throw data("User not found", { status: 404 });
  }

  const tweets = await sql`
    SELECT
      t.id,
      t.content,
      t.created_at,
      t.profile_id,
      p.username,
      p.avatar_url,
      COUNT(l.profile_id)::int AS like_count,
      BOOL_OR(l.profile_id = ${currentUser.id}) AS is_liked
    FROM tweets t
    JOIN profiles p ON p.id = t.profile_id
    LEFT JOIN likes l ON l.tweet_id = t.id
    WHERE t.profile_id = ${profile.id}
    GROUP BY t.id, t.content, t.created_at, t.profile_id, p.username, p.avatar_url
    ORDER BY t.created_at DESC
  `;

  const [{ count: tweetCount }] = await sql`
    SELECT COUNT(*)::int AS count FROM tweets WHERE profile_id = ${profile.id}
  `;

  return { profile, tweets, tweetCount, currentUser };
}

export async function action({ request }: Route.ActionArgs) {
  const currentUser = await requireAuth(request);
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "like") {
    const tweetId = String(formData.get("tweetId") ?? "");
    if (!tweetId) return data({ error: "Missing tweetId" }, { status: 400 });

    const [existingLike] = await sql`
      SELECT tweet_id FROM likes
      WHERE tweet_id = ${tweetId} AND profile_id = ${currentUser.id}
    `;

    if (existingLike) {
      await sql`
        DELETE FROM likes
        WHERE tweet_id = ${tweetId} AND profile_id = ${currentUser.id}
      `;
    } else {
      await sql`
        INSERT INTO likes (tweet_id, profile_id)
        VALUES (${tweetId}, ${currentUser.id})
      `;
    }

    return { ok: true };
  }

  if (actionType === "delete") {
    const tweetId = String(formData.get("tweetId") ?? "");
    if (!tweetId) return data({ error: "Missing tweetId" }, { status: 400 });

    const [tweet] = await sql`
      SELECT id, profile_id FROM tweets WHERE id = ${tweetId}
    `;

    if (!tweet || tweet.profileId !== currentUser.id) {
      return data({ error: "Not authorized" }, { status: 403 });
    }

    await sql`DELETE FROM tweets WHERE id = ${tweetId}`;
    return { ok: true };
  }

  return data({ error: "Unknown action" }, { status: 400 });
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const { profile, tweets, tweetCount, currentUser } = loaderData;
  const isOwnProfile = profile.id === currentUser.id;
  const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <InitialsAvatar
            username={profile.username}
            avatarUrl={profile.avatarUrl}
            size="lg"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">
                @{profile.username}
              </h1>
              {isOwnProfile && (
                <Link
                  to="/profile/edit"
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-1.5 px-4 rounded-full text-sm transition-colors"
                >
                  Edit profile
                </Link>
              )}
            </div>
            {profile.bio && (
              <p className="text-gray-700 mt-2 text-sm">{profile.bio}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span>Joined {joinDate}</span>
              <span>
                <strong className="text-gray-900">{tweetCount}</strong>{" "}
                {tweetCount === 1 ? "Tweet" : "Tweets"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tweets */}
      <div className="space-y-3">
        {tweets.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No tweets yet</p>
            {isOwnProfile && (
              <p className="text-sm mt-1">
                <Link to="/" className="text-twitter hover:underline">
                  Go to your timeline
                </Link>{" "}
                to post your first tweet!
              </p>
            )}
          </div>
        ) : (
          (tweets as any[]).map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              currentUserId={currentUser.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
