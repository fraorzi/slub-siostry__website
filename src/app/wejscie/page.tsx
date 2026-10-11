import { wedding } from "@/content/wedding";
import { ACCESS_PARAM } from "@/lib/access";

export default async function Entry({ searchParams }: PageProps<"/wejscie">) {
  const error = (await searchParams).blad === "1";

  return (
    <main className="grid min-h-svh place-items-center px-gutter">
      <form action="/" method="get" className="w-full max-w-sm text-center">
        <p className="font-serif text-[clamp(2.5rem,8vw,4rem)] leading-none">
          {wedding.bride} <span className="text-accent">&</span> {wedding.groom}
        </p>
        <label htmlFor="key" className="mt-10 block text-[0.8125rem] uppercase tracking-[0.12em] text-muted">
          Hasło z zaproszenia
        </label>
        <input
          id="key"
          name={ACCESS_PARAM}
          type="password"
          required
          autoComplete="off"
          aria-invalid={error}
          aria-describedby={error ? "key-error" : undefined}
          className="mt-2 w-full rounded-none border-0 border-b border-fg bg-transparent py-2 text-center font-serif text-2xl focus:border-accent focus:outline-none"
        />
        {error && <p id="key-error" className="mt-3 text-sm text-muted">To hasło nie pasuje. Sprawdź zaproszenie albo zeskanuj kod QR.</p>}
        <button type="submit" className="mt-8 cursor-pointer rounded-full bg-accent px-7 py-3 font-medium text-night">Wejdź</button>
      </form>
    </main>
  );
}
