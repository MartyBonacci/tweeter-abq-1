import { data, Form, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/profile-edit";
import { requireAuth } from "~/utils/auth.server";
import { profileEditSchema } from "~/utils/validation";
import { uploadAvatar } from "~/utils/cloudinary.server";
import sql from "~/utils/db.server";
import InitialsAvatar from "~/components/initials-avatar";

export function meta() {
  return [{ title: "Edit Profile - Tweeter" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  return { user };
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireAuth(request);
  const formData = await request.formData();

  const bio = String(formData.get("bio") ?? "");
  const avatarFile = formData.get("avatar") as File | null;

  const result = profileEditSchema.safeParse({ bio: bio || undefined });
  if (!result.success) {
    return data(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  let avatarUrl = user.avatarUrl;

  if (avatarFile && avatarFile.size > 0) {
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (avatarFile.size > maxSize) {
      return data(
        { errors: { avatar: ["File must be under 2MB"] } },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(avatarFile.type)) {
      return data(
        { errors: { avatar: ["Only JPEG, PNG, and WebP images are allowed"] } },
        { status: 400 }
      );
    }

    avatarUrl = await uploadAvatar(avatarFile);
  }

  await sql`
    UPDATE profiles
    SET bio = ${bio || null}, avatar_url = ${avatarUrl}
    WHERE id = ${user.id}
  `;

  return redirect(`/profile/${user.username}`);
}

export default function ProfileEdit({ loaderData, actionData }: Route.ComponentProps) {
  const { user } = loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const errors = actionData?.errors as Record<string, string[]> | undefined;

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h1>

        <Form method="post" encType="multipart/form-data" className="space-y-6">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Profile Photo
            </label>
            <div className="flex items-center gap-4">
              <InitialsAvatar
                username={user.username}
                avatarUrl={user.avatarUrl}
                size="lg"
              />
              <div>
                <input
                  type="file"
                  name="avatar"
                  accept="image/jpeg,image/png,image/webp"
                  className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  JPEG, PNG, or WebP. Max 2MB.
                </p>
                {errors?.avatar && (
                  <p className="mt-1 text-sm text-red-600">{errors.avatar[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              maxLength={160}
              defaultValue={user.bio ?? ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-twitter focus:ring-1 focus:ring-twitter outline-none resize-none"
              placeholder="Tell us about yourself..."
            />
            <p className="text-xs text-gray-500 mt-1">
              160 characters max
            </p>
            {errors?.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio[0]}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-twitter hover:bg-twitter-dark text-white font-medium py-2 px-6 rounded-full text-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <a
              href={`/profile/${user.username}`}
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-6 rounded-full text-sm transition-colors inline-block"
            >
              Cancel
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}
