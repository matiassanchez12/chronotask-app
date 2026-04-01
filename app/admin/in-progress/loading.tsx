import { InProgressLayout } from "./components/in-progress-layout";

export default function Loading() {
  return (
    <InProgressLayout>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    </InProgressLayout>
  );
}
