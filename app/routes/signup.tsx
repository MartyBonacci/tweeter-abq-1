import { data, Form, Link, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/signup";
import { getOptionalUser, signup, createUserSession } from "~/utils/auth.server";
import { signupSchema } from "~/utils/validation";
import sql from "~/utils/db.server";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getOptionalUser(request);
  if (user) throw redirect("/");
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const raw = {
    username: String(formData.get("username") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const result = signupSchema.safeParse(raw);
  if (!result.success) {
    return data(
      { errors: result.error.flatten().fieldErrors, values: raw },
      { status: 400 }
    );
  }

  const { username, email, password } = result.data;

  // Check uniqueness
  const [existingUsername] = await sql`
    SELECT id FROM profiles WHERE username = ${username}
  `;
  if (existingUsername) {
    return data(
      { errors: { username: ["Username is already taken"] }, values: raw },
      { status: 400 }
    );
  }

  const [existingEmail] = await sql`
    SELECT id FROM profiles WHERE email = ${email}
  `;
  if (existingEmail) {
    return data(
      { errors: { email: ["Email is already registered"] }, values: raw },
      { status: 400 }
    );
  }

  const profile = await signup(username, email, password);
  return createUserSession(profile.id, "/");
}

export default function Signup({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const errors = actionData?.errors as Record<string, string[]> | undefined;
  const values = actionData?.values as Record<string, string> | undefined;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-twitter">Tweeter</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Form method="post" className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                defaultValue={values?.username ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-twitter focus:ring-1 focus:ring-twitter outline-none"
                placeholder="your_username"
                required
              />
              {errors?.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={values?.email ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-twitter focus:ring-1 focus:ring-twitter outline-none"
                placeholder="you@example.com"
                required
              />
              {errors?.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-twitter focus:ring-1 focus:ring-twitter outline-none"
                placeholder="At least 8 characters"
                required
              />
              {errors?.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-twitter hover:bg-twitter-dark text-white font-medium py-2 px-4 rounded-full transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating account..." : "Sign up"}
            </button>
          </Form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="text-twitter hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
