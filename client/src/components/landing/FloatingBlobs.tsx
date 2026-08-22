export function FloatingBlobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-[420px] w-[420px] animate-drift-slow rounded-full bg-cobalt/[0.07] blur-3xl" />
      <div className="absolute -right-24 top-40 h-[380px] w-[380px] animate-drift rounded-full bg-gold/[0.08] blur-3xl" />
      <div className="absolute left-1/3 top-[900px] h-[350px] w-[350px] animate-drift-slow rounded-full bg-cobalt/[0.05] blur-3xl" />
      <div className="absolute right-1/4 top-[1500px] h-[300px] w-[300px] animate-drift rounded-full bg-gold/[0.06] blur-3xl" />
    </div>
  );
}