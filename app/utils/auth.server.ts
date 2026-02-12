import { createCookieSessionStorage, redirect } from "react-router";
import { hash, verify } from "@node-rs/argon2";
import { uuidv7 } from "uuidv7";
import sql from "./db.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable is required");
}

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__tweeter_session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production",
  },
});

const getSession = (request: Request) =>
  sessionStorage.getSession(request.headers.get("Cookie"));

const commitSession = sessionStorage.commitSession;
const destroySession = sessionStorage.destroySession;

export { getSession, commitSession, destroySession };

export const signup = async (
  username: string,
  email: string,
  password: string
) => {
  const passwordHash = await hash(password);
  const id = uuidv7();

  const [profile] = await sql`
    INSERT INTO profiles (id, username, email, password_hash)
    VALUES (${id}, ${username}, ${email}, ${passwordHash})
    RETURNING id, username, email, bio, avatar_url, created_at
  `;

  return profile;
};

export const signin = async (email: string, password: string) => {
  const [profile] = await sql`
    SELECT id, username, email, password_hash, bio, avatar_url, created_at
    FROM profiles
    WHERE email = ${email}
  `;

  if (!profile) return null;

  const isValid = await verify(profile.passwordHash, password);
  if (!isValid) return null;

  const { passwordHash: _, ...profileWithoutPassword } = profile;
  return profileWithoutPassword;
};

export const signout = async (request: Request) => {
  const session = await getSession(request);
  return redirect("/", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
};

export const createUserSession = async (profileId: string, redirectTo: string) => {
  const session = await sessionStorage.getSession();
  session.set("profileId", profileId);
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};

export const requireAuth = async (request: Request) => {
  const session = await getSession(request);
  const profileId = session.get("profileId");

  if (!profileId) {
    throw redirect("/signin");
  }

  const [profile] = await sql`
    SELECT id, username, email, bio, avatar_url, created_at
    FROM profiles
    WHERE id = ${profileId}
  `;

  if (!profile) {
    throw redirect("/signin", {
      headers: { "Set-Cookie": await destroySession(session) },
    });
  }

  return profile;
};

export const getOptionalUser = async (request: Request) => {
  const session = await getSession(request);
  const profileId = session.get("profileId");

  if (!profileId) return null;

  const [profile] = await sql`
    SELECT id, username, email, bio, avatar_url, created_at
    FROM profiles
    WHERE id = ${profileId}
  `;

  return profile ?? null;
};
