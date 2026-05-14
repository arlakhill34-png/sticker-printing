import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Printer, Settings, Moon, Sun, Tag } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const STORE_NAME = "STORE NAME";
const STORE_EMAIL = "storeemail@gmail.com";

function Index() {
  const [productId, setProductId] = useState("A102");
  const [price, setPrice] = useState("450");
  const [qty, setQty] = useState(25);
  const [dark, setDark] = useState(false);
  const [printing, setPrinting] = useState(false);

  const pidRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    pidRef.current?.focus();
    pidRef.current?.select();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 350);
  };

  const onKey =
    (next: "price" | "qty" | "print") =>
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (next === "price") {
          priceRef.current?.focus();
          priceRef.current?.select();
        } else if (next === "qty") {
          qtyRef.current?.focus();
          qtyRef.current?.select();
        } else {
          handlePrint();
        }
      }
    };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md print:hidden">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Tag className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">LabelFlow</div>
              <div className="text-[11px] text-muted-foreground">Smart Sticker Printing</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setDark((d) => !d)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10 print:p-0">
        <div className="grid gap-8 lg:grid-cols-2 print:hidden">
          {/* Left: Inputs */}
          <section className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)]">
            <div className="mb-7">
              <h1 className="text-xl font-semibold tracking-tight">New Sticker Batch</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">Enter</kbd> to move forward.
              </p>
            </div>

            <div className="space-y-5">
              <Field label="Product ID">
                <input
                  ref={pidRef}
                  value={productId}
                  onChange={(e) => setProductId(e.target.value.toUpperCase())}
                  onKeyDown={onKey("price")}
                  placeholder="Enter Product ID"
                  className="h-12 w-full rounded-lg border border-input bg-background px-4 text-base font-medium tracking-wide outline-none transition-all placeholder:text-muted-foreground/60 focus:border-ring focus:ring-4 focus:ring-ring/15"
                />
              </Field>

              <Field label="MRP Price">
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-medium text-muted-foreground">
                    Rs.
                  </span>
                  <input
                    ref={priceRef}
                    value={price}
                    onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
                    onKeyDown={onKey("qty")}
                    inputMode="decimal"
                    placeholder="0.00"
                    className="h-12 w-full rounded-lg border border-input bg-background pl-12 pr-4 text-base font-semibold tabular-nums outline-none transition-all placeholder:text-muted-foreground/60 focus:border-ring focus:ring-4 focus:ring-ring/15"
                  />
                </div>
              </Field>

              <Field label="Quantity">
                <div className="flex h-12 items-center gap-2 rounded-lg border border-input bg-background px-2 transition-all focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/15">
                  <StepperBtn onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    <Minus className="h-4 w-4" />
                  </StepperBtn>
                  <input
                    ref={qtyRef}
                    value={qty}
                    onChange={(e) =>
                      setQty(Math.max(1, parseInt(e.target.value || "1", 10) || 1))
                    }
                    onKeyDown={onKey("print")}
                    inputMode="numeric"
                    className="h-full flex-1 bg-transparent text-center text-base font-semibold tabular-nums outline-none"
                  />
                  <StepperBtn onClick={() => setQty((q) => q + 1)}>
                    <Plus className="h-4 w-4" />
                  </StepperBtn>
                </div>
              </Field>

              <button
                onClick={handlePrint}
                disabled={printing}
                className="group relative mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-80"
              >
                {printing ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                ) : (
                  <Printer className="h-4 w-4" />
                )}
                <span>{printing ? "Preparing…" : `Print ${qty} Sticker${qty > 1 ? "s" : ""}`}</span>
              </button>
            </div>
          </section>

          {/* Right: Preview */}
          <section className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)]">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Live Preview</h2>
                <p className="mt-1 text-sm text-muted-foreground">36mm × 30mm thermal label</p>
              </div>
              <span className="rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                {qty} × copies
              </span>
            </div>

            <div className="flex min-h-[320px] items-center justify-center rounded-xl bg-[radial-gradient(circle_at_center,_oklch(0_0_0/0.04)_1px,_transparent_1px)] [background-size:14px_14px] py-10 dark:bg-[radial-gradient(circle_at_center,_oklch(1_0_0/0.05)_1px,_transparent_1px)]">
              <div style={{ transform: "scale(2.2)", transformOrigin: "center" }}>
                <Sticker productId={productId} price={price} />
              </div>
            </div>
          </section>
        </div>

        {/* Print area: rendered hidden offscreen, shown only when printing */}
        <div id="print-area" className="hidden print:block">
          {Array.from({ length: qty }).map((_, i) => (
            <Sticker key={i} productId={productId} price={price} />
          ))}
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function StepperBtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
    >
      {children}
    </button>
  );
}

function Sticker({ productId, price }: { productId: string; price: string }) {
  return (
    <div className="sticker-label">
      <div className="text-center leading-tight">
        <div style={{ fontSize: "8pt", fontWeight: 700, letterSpacing: "0.02em" }}>
          {STORE_NAME}
        </div>
        <div style={{ fontSize: "5pt", marginTop: "0.5mm", color: "#333" }}>
          {STORE_EMAIL}
        </div>
      </div>

      <div className="text-center">
        <div style={{ fontSize: "7pt", fontWeight: 600, letterSpacing: "0.05em" }}>
          PID: {productId || "—"}
        </div>
      </div>

      <div className="text-center">
        <div
          style={{
            fontSize: "16pt",
            fontWeight: 800,
            letterSpacing: "-0.01em",
            lineHeight: 1,
          }}
        >
          Rs. {price || "0"}
        </div>
      </div>
    </div>
  );
}
