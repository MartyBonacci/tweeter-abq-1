import { Form } from "react-router";

type DeleteConfirmModalProps = {
  tweetId: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function DeleteConfirmModal({
  tweetId,
  isOpen,
  onClose,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />
      <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Delete Tweet?
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          This can&apos;t be undone and it will be removed from your profile and
          the timeline.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <Form method="post" className="flex-1">
            <input type="hidden" name="_action" value="delete" />
            <input type="hidden" name="tweetId" value={tweetId} />
            <button
              type="submit"
              onClick={onClose}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
