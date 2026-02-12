import { data, redirect } from "react-router";
import type { Route } from "./+types/home";
import { getOptionalUser, requireAuth } from "~/utils/auth.server";
import { tweetSchema } from "~/utils/validation";
import sql from "~/utils/db.server";
import { uuidv7 } from "uuidv7";
import LandingHero from "~/components/landing-hero";
import ComposeBox from "~/components/compose-box";
import TweetCard from "~/components/tweet-card";

export function meta() {
  return [
    { title: "Tweeter" },
    { name: "description", content: "A simplified Twitter clone" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getOptionalUser(request);

  if (!user) {
    return { user: null, tweets: [] };
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
      BOOL_OR(l.profile_id = ${user.id}) AS is_liked
    FROM tweets t
    JOIN profiles p ON p.id = t.profile_id
    LEFT JOIN likes l ON l.tweet_id = t.id
    GROUP BY t.id, t.content, t.created_at, t.profile_id, p.username, p.avatar_url
    ORDER BY t.created_at DESC
  `;

  return { user, tweets };
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireAuth(request);
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "tweet") {
    const result = tweetSchema.safeParse({
      content: String(formData.get("content") ?? ""),
    });

    if (!result.success) {
      return data(
        { error: result.error.flatten().fieldErrors.content?.[0] },
        { status: 400 }
      );
    }

    const id = uuidv7();
    await sql`
      INSERT INTO tweets (id, profile_id, content)
      VALUES (${id}, ${user.id}, ${result.data.content})
    `;

    return redirect("/");
  }

  if (actionType === "like") {
    const tweetId = String(formData.get("tweetId") ?? "");
    if (!tweetId) return data({ error: "Missing tweetId" }, { status: 400 });

    const [existingLike] = await sql`
      SELECT tweet_id FROM likes
      WHERE tweet_id = ${tweetId} AND profile_id = ${user.id}
    `;

    if (existingLike) {
      await sql`
        DELETE FROM likes
        WHERE tweet_id = ${tweetId} AND profile_id = ${user.id}
      `;
    } else {
      await sql`
        INSERT INTO likes (tweet_id, profile_id)
        VALUES (${tweetId}, ${user.id})
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

    if (!tweet || tweet.profileId !== user.id) {
      return data({ error: "Not authorized" }, { status: 403 });
    }

    await sql`DELETE FROM tweets WHERE id = ${tweetId}`;
    return redirect("/");
  }

  return data({ error: "Unknown action" }, { status: 400 });
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { user, tweets } = loaderData;

  if (!user) {
    return <LandingHero />;
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <ComposeBox />

      <div className="mt-6 space-y-3">
        {tweets.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No tweets yet</p>
            <p className="text-sm mt-1">Be the first to share something!</p>
          </div>
        ) : (
          (tweets as any[]).map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              currentUserId={user.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
