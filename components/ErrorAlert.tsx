type ErrorAlertProps = {
  message: string;
  onDismiss?: () => void;
};

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-red-800">
            Something went wrong
          </p>
          <p className="mt-1 text-sm text-red-700">{message}</p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 text-sm font-medium text-red-700 underline hover:text-red-900"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
