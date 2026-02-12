import { Form, useNavigation } from "react-router";
import { useState } from "react";

const MAX_CHARS = 140;

export default function ComposeBox() {
  const [content, setContent] = useState("");
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "tweet";

  const remaining = MAX_CHARS - content.length;
  const isOverLimit = remaining < 0;
  const isNearLimit = remaining <= 20;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <Form
        method="post"
        onSubmit={() => setContent("")}
      >
        <input type="hidden" name="_action" value="tweet" />
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          rows={3}
          maxLength={MAX_CHARS}
          className="w-full resize-none border-0 focus:ring-0 text-base placeholder-gray-400 outline-none"
        />
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2">
          <span
            className={`text-sm font-medium ${
              isOverLimit
                ? "text-red-500"
                : isNearLimit
                  ? "text-orange-500"
                  : "text-gray-400"
            }`}
          >
            {remaining}
          </span>
          <button
            type="submit"
            disabled={isSubmitting || content.trim().length === 0 || isOverLimit}
            className="bg-twitter hover:bg-twitter-dark text-white font-medium py-1.5 px-5 rounded-full text-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Tweet"}
          </button>
        </div>
      </Form>
    </div>
  );
}
