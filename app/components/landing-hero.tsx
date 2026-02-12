import { Link } from "react-router";

export default function LandingHero() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg text-center">
        <h1 className="text-5xl font-bold text-twitter mb-4">Tweeter</h1>
        <p className="text-xl text-gray-600 mb-8">
          See what&apos;s happening in the world right now.
        </p>
        <p className="text-gray-500 mb-8">
          Join the conversation. Share your thoughts in 140 characters or fewer.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/signup"
            className="bg-twitter hover:bg-twitter-dark text-white font-medium py-3 px-8 rounded-full text-base transition-colors"
          >
            Sign up
          </Link>
          <Link
            to="/signin"
            className="border border-twitter text-twitter hover:bg-twitter/5 font-medium py-3 px-8 rounded-full text-base transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
