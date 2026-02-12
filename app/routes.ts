import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("signup", "routes/signup.tsx"),
  route("signin", "routes/signin.tsx"),
  route("signout", "routes/signout.tsx"),
  route("profile/edit", "routes/profile-edit.tsx"),
  route("profile/:username", "routes/profile.tsx"),
] satisfies RouteConfig;
