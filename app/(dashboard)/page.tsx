export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Dashboard
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholders for widgets */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Today's Tasks
          </h3>
          <p className="mt-2 text-sm text-gray-500">Loading...</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Pending
          </h3>
          <p className="mt-2 text-sm text-gray-500">Loading...</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Reminders
          </h3>
          <p className="mt-2 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    </div>
  );
}
