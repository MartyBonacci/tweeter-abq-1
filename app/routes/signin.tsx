import { data, Form, Link, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/signin";
import { getOptionalUser, signin, createUserSession } from "~/utils/auth.server";
import { signinSchema } from "~/utils/validation";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getOptionalUser(request);
  if (user) throw redirect("/");
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const result = signinSchema.safeParse(raw);
  if (!result.success) {
    return data(
      { error: "Invalid email or password", values: { email: raw.email } },
      { status: 400 }
    );
  }

  const profile = await signin(result.data.email, result.data.password);
  if (!profile) {
    return data(
      { error: "Invalid email or password", values: { email: raw.email } },
      { status: 400 }
    );
  }

  return createUserSession(profile.id, "/");
}

export default function Signin({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const error = actionData?.error as string | undefined;
  const values = actionData?.values as Record<string, string> | undefined;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-twitter">Tweeter</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <Form method="post" className="space-y-4">
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
                placeholder="Your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-twitter hover:bg-twitter-dark text-white font-medium py-2 px-4 rounded-full transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </Form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-twitter hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
