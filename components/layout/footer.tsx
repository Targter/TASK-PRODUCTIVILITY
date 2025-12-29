import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/50 backdrop-blur-sm py-5 text-center text-xs text-muted-foreground transition-colors">
      <p className="flex items-center justify-center gap-1">
        <span className="opacity-80">Built by</span>
        <span className="font-semibold text-foreground">Abhay Bansal</span>
        <span className="opacity-50 mx-1">•</span>
        <Link
          href="https://abhaybansal.in"
          target="_blank"
          className="font-medium text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors"
        >
          Portfolio
        </Link>
      </p>
    </footer>
  );
}
