export function AiTrain() {
  return (
    <>
      <section className="w-full">
        {/* The poster is intentionally rendered at its intrinsic aspect ratio so it
            remains large and readable at every viewport width. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ai-train-poster-v2.png"
          alt="Digital-UNI AI Train connecting Paris, New York, Algiers, Kuala Lumpur, and Santa Monica"
          className="block h-auto w-full"
        />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12">
        <h2 className="mb-8 text-3xl font-bold tracking-tight md:text-5xl">
          Explore AI &amp; Industrial Revolution 4.0 Learning Pathways
        </h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/industrial-revolution-4-showcase.webp"
          alt="Digital-UNI Industrial Revolution 4.0 AI learning pathways"
          className="block h-auto w-full"
        />
      </section>
    </>
  );
}
