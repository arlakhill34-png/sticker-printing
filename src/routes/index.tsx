import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Printer, Settings, Moon, Sun, Tag, LogOut } from "lucide-react";
import { useAuth } from "../lib/auth-context";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  console.log("USER OBJECT:", user);
  console.log("isLoading:", isLoading);
  console.log("companyName:", user?.companyName);
  console.log("companyEmail:", user?.companyEmail);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const storeName = user?.companyName || "";
  const storeEmail = user?.companyEmail || "";

  const [dark, setDark] = useState(false);
  const [productId, setProductId] = useState("");
  const [eximcode, setEximcode] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState(1);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const pidRef = useRef<HTMLInputElement>(null);
  const eximcodeRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);

  const onKey = (next: string) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const refs: Record<string, React.RefObject<HTMLInputElement | null>> = {
        eximcode: eximcodeRef,
        mrp: priceRef,
        qty: qtyRef,
      };
      if (refs[next]?.current) {
        refs[next].current!.focus();
      } else if (next === "print") {
        handlePrint();
      }
    }
  };

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md print:hidden">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Tag className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">LabelFlow</div>
              <div className="hidden text-[11px] text-muted-foreground sm:block">
                Smart Sticker Printing
              </div>
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
            <button
              onClick={() => logout(() => navigate({ to: "/login" }))}
              className="flex h-9 w-9 items-center justify-center rounded-md text-destructive transition-colors hover:bg-destructive/10"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 print:p-0">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 print:hidden">
          {/* Left: Inputs */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-[var(--shadow-elegant)]">
            <div className="mb-6 sm:mb-7">
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight">New Sticker Batch</h1>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Press{" "}
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                  Enter
                </kbd>{" "}
                to move forward.
              </p>
            </div>

            <div className="space-y-5">
              <Field label="Product ID">
                <input
                  ref={pidRef}
                  value={productId}
                  onChange={(e) => setProductId(e.target.value.toUpperCase())}
                  onKeyDown={onKey("eximcode")}
                  placeholder="Enter Product ID"
                  className="h-12 w-full rounded-lg border border-input bg-background px-4 text-base font-medium tracking-wide outline-none transition-all placeholder:text-muted-foreground/60 focus:border-ring focus:ring-4 focus:ring-ring/15"
                />
              </Field>

              <Field label="Exim Code">
                <input
                  ref={eximcodeRef}
                  value={eximcode}
                  onChange={(e) => setEximcode(e.target.value.toUpperCase())}
                  onKeyDown={onKey("mrp")}
                  placeholder="Enter Exim Code"
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
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1", 10) || 1))}
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
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-[var(--shadow-elegant)]">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Live Preview</h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  36mm × 30mm thermal label
                </p>
              </div>
              <span className="rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-muted-foreground">
                {qty} × copies
              </span>
            </div>

            <div className="flex min-h-[260px] sm:min-h-[320px] items-center justify-center rounded-xl bg-[radial-gradient(circle_at_center,_oklch(0_0_0/0.04)_1px,_transparent_1px)] [background-size:14px_14px] py-8 sm:py-10 dark:bg-[radial-gradient(circle_at_center,_oklch(1_0_0/0.05)_1px,_transparent_1px)]">
              <Sticker
                productId={productId}
                price={price}
                eximcode={eximcode}
                companyName={storeName}
                companyEmail={storeEmail}
              />
            </div>
          </section>
        </div>

        {/* Print area: rendered hidden offscreen, shown only when printing */}
        <div id="print-area" className="hidden print:block">
          {Array.from({ length: qty }).map((_, i) => (
            <Sticker
              key={i}
              productId={productId}
              price={price}
              eximcode={eximcode}
              companyName={storeName}
              companyEmail={storeEmail}
            />
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

function StepperBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
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

function Sticker({
  productId,
  price,
  eximcode,
  companyName,
  companyEmail,
}: {
  productId: string;
  price: string;
  eximcode?: string;
  companyName: string;
  companyEmail: string;
}) {
  const pidLength = productId.length;
  const priceLength = price.length;
  const companyLength = companyName.length;
  const pidFontSize = pidLength > 6 ? "6pt" : pidLength > 4 ? "6.5pt" : "7pt";
  const priceFontSize = priceLength > 5 ? "6pt" : priceLength > 4 ? "6.5pt" : "7pt";
  const companyFontSize = companyLength > 25 ? "6pt" : companyLength > 20 ? "6.5pt" : "7pt";

  return (
    <div
      className="sticker-label"
      style={{
        width: "36mm",
        height: "30mm",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "2mm",
        boxSizing: "border-box",
        fontFamily: "Times New Roman, serif",
      }}
    >
      <div className="text-center">
        <div style={{ fontSize: companyFontSize, fontWeight: 700, letterSpacing: "0.02em" }}>
          {companyName}
        </div>
        <div style={{ fontSize: "5pt", marginTop: "0.5mm", color: "#333" }}>{companyEmail}</div>
      </div>

      <div className="text-center flex-1">
        <div
          style={{
            fontSize: pidFontSize,
            fontWeight: 400,
            letterSpacing: "0.05em",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          PID: {productId || "—"}
        </div>
        {eximcode && (
          <div style={{ fontSize: "5pt", fontWeight: 400, marginTop: "0.5mm", color: "#333" }}>
            EXIM: {eximcode}
          </div>
        )}
      </div>

      <div className="text-center">
        <div
          style={{
            fontSize: priceFontSize,
            fontWeight: 400,
            letterSpacing: "0.02em",
            lineHeight: 1,
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          MRP: Rs. {price || "0"}
        </div>
      </div>
    </div>
  );
}
