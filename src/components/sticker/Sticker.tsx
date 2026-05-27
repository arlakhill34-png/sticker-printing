import React from "react";

export type StickerMode = "preview" | "print";

const PREVIEW_LINE_HEIGHT = 1.3;
const PREVIEW_WIDTH_PX = 460;
const PREVIEW_HEIGHT_PX = 385;

const PREVIEW_TYPOGRAPHY = {
  topHeading: 16,
  company: 18,
  email: 14,
  pid: 16,
  exim: 16,
  mrp: 22,
};

const PREVIEW_SPACING = {
  gap: 8,
  padding: 20,
  marginRight: 0,
  marginTop: 10,
};

const wrapTextStyle = {
  whiteSpace: "normal" as const,
  wordBreak: "break-word",
  overflowWrap: "anywhere",
} as const;

const PREVIEW_WRAP = {
  overflow: "hidden",
  textOverflow: "ellipsis",
} as const;

export function Sticker({
  mode,
  productId,
  eximcode,
  price,
  companyName,
  companyEmail,
  width,
  height,
}: {
  mode: StickerMode;
  productId: string;
  eximcode?: string;
  price: string;
  companyName: string;
  companyEmail: string;
  width: number;
  height: number;
}) {
  const safeCompany = companyName || "—";
  const safeEmail = companyEmail || "—";
  const safePid = productId || "—";
  const safeExim = eximcode?.trim() ? eximcode : "";
  const safeMrp = price || "0";

  if (mode === "preview") {
    return (
      <div
        className="sticker sticker-preview"
        data-sticker-mode="preview"
        style={{
          width: `${PREVIEW_WIDTH_PX}px`,
          height: `${PREVIEW_HEIGHT_PX}px`,
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.08)",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 14px 34px rgba(0,0,0,0.10)",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          overflow: "hidden",
          padding: `${PREVIEW_SPACING.padding}px`,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: `${PREVIEW_SPACING.gap}px`,
            textAlign: "left",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <div
            id="e55j5l"
            className="sticker-line sticker-top-heading"
            style={{
              ...PREVIEW_WRAP,
              fontSize: `${PREVIEW_TYPOGRAPHY.topHeading}px`,
              fontWeight: 500,
              letterSpacing: "0.01em",
              lineHeight: PREVIEW_LINE_HEIGHT,
              textAlign: "left",
              color: "#333333",
              opacity: 0.85,
              width: "100%",
            }}
            title="Imported and Distributed by:"
          >
            Imported and Distributed by:
          </div>

          <div
            className="sticker-line sticker-company"
            style={{
              ...PREVIEW_WRAP,
              fontSize: `${PREVIEW_TYPOGRAPHY.company}px`,
              fontWeight: 700,
              letterSpacing: "0.01em",
              lineHeight: PREVIEW_LINE_HEIGHT,
              textAlign: "left",
              color: "#111111",
              width: "100%",
            }}
            title={safeCompany}
          >
            {safeCompany}
          </div>

          <div
            className="sticker-line sticker-email"
            style={{
              ...PREVIEW_WRAP,
              fontSize: `${PREVIEW_TYPOGRAPHY.email}px`,
              fontWeight: 400,
              lineHeight: PREVIEW_LINE_HEIGHT,
              textAlign: "left",
              color: "#444444",
              width: "100%",
            }}
            title={safeEmail}
          >
            {safeEmail}
          </div>

          <div
            className="sticker-line sticker-pid"
            style={{
              ...PREVIEW_WRAP,
              fontSize: `${PREVIEW_TYPOGRAPHY.pid}px`,
              fontWeight: 500,
              letterSpacing: "0.03em",
              lineHeight: PREVIEW_LINE_HEIGHT,
              textAlign: "left",
              color: "#333333",
              width: "100%",
            }}
            title={`PID: ${safePid}`}
          >
            PID: {safePid}
          </div>

          {safeExim ? (
            <div
              className="sticker-line sticker-exim"
              style={{
                ...PREVIEW_WRAP,
                fontSize: `${PREVIEW_TYPOGRAPHY.exim}px`,
                fontWeight: 500,
                letterSpacing: "0.03em",
                lineHeight: PREVIEW_LINE_HEIGHT,
                textAlign: "left",
                color: "#333333",
                width: "100%",
              }}
              title={`EXIM: ${safeExim}`}
            >
              EXIMCODE: {safeExim}
            </div>
          ) : null}

          <div
            className="sticker-line sticker-mrp"
            style={{
              ...PREVIEW_WRAP,
              fontSize: `${PREVIEW_TYPOGRAPHY.mrp}px`,
              fontWeight: 800,
              letterSpacing: "0.02em",
              lineHeight: 1.2,
              textAlign: "left",
              marginTop: `${PREVIEW_SPACING.marginTop}px`,
              color: "#000000",
              width: "100%",
            }}
            title={`MRP: Rs. ${safeMrp}`}
          >
            MRP: Rs. {safeMrp}
          </div>
        </div>
      </div>
    );
  }

  // Print mode: dynamic mm-based sizing
  const BASE_WIDTH = 36;

  // Calculate the number of content lines
  const hasExim = safeExim.length > 0;
  const contentLines = hasExim ? 6 : 5; // topHeading, company, email, pid, mrp (+ exim)

  // Base typography and spacing at scaleFactor = 1
  const BASE_TYPOGRAPHY_PT = {
    topHeading: 5.0,
    company: 6.8,
    email: 5.0,
    pid: 5.7,
    exim: 5.7,
    mrp: 7.0,
  };

  const BASE_SPACING_MM = {
    gap: 0.72,
    padding: 2,
    marginRight: 0.2,
    marginTop: 0.25,
  };

  const BASE_LINE_HEIGHT = 1.05;

  // Calculate base content height at scaleFactor = 1
  const baseContentHeight =
    BASE_SPACING_MM.padding * 2 +
    (BASE_TYPOGRAPHY_PT.topHeading * 0.35 * BASE_LINE_HEIGHT +
      BASE_TYPOGRAPHY_PT.company * 0.35 * BASE_LINE_HEIGHT +
      BASE_TYPOGRAPHY_PT.email * 0.35 * BASE_LINE_HEIGHT +
      BASE_TYPOGRAPHY_PT.pid * 0.35 * BASE_LINE_HEIGHT +
      (hasExim ? BASE_TYPOGRAPHY_PT.exim * 0.35 * BASE_LINE_HEIGHT : 0) +
      BASE_TYPOGRAPHY_PT.mrp * 0.35 * BASE_LINE_HEIGHT) +
    (contentLines - 1) * BASE_SPACING_MM.gap +
    BASE_SPACING_MM.marginTop;

  // Scale factor that ensures content fits in both dimensions
  // Cap at 1.0 to prevent scaling up beyond base design
  const widthScale = width / BASE_WIDTH;
  const heightScale = height / baseContentHeight;
  const scaleFactor = Math.min(widthScale, heightScale, 1);

  // Typography scales proportionally
  const typography = {
    topHeading: BASE_TYPOGRAPHY_PT.topHeading * scaleFactor,
    company: BASE_TYPOGRAPHY_PT.company * scaleFactor,
    email: BASE_TYPOGRAPHY_PT.email * scaleFactor,
    pid: BASE_TYPOGRAPHY_PT.pid * scaleFactor,
    exim: BASE_TYPOGRAPHY_PT.exim * scaleFactor,
    mrp: BASE_TYPOGRAPHY_PT.mrp * scaleFactor,
  };

  // Spacing scales proportionally
  const spacing = {
    gap: BASE_SPACING_MM.gap * scaleFactor,
    padding: BASE_SPACING_MM.padding * scaleFactor,
    marginRight: BASE_SPACING_MM.marginRight * scaleFactor,
    marginTop: BASE_SPACING_MM.marginTop * scaleFactor,
  };

  // Line height - minimum 1.0 for readability
  const lineHeight = Math.max(1.0, BASE_LINE_HEIGHT * scaleFactor);

  return (
    <div
      className="sticker sticker-print"
      data-sticker-mode="print"
      style={{
        width: `${width}mm`,
        height: `${height}mm`,
        boxSizing: "border-box",
        background: "#ffffff",
        color: "#000000",
        border: "none",
        boxShadow: "none",
        display: "flex",
        flexDirection: "column",
        padding: `${spacing.padding}mm ${spacing.padding}mm`,
        fontFamily: "Times New Roman, serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `${spacing.gap}mm`,
          textAlign: "left",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <div
          id="e55j5l"
          className="sticker-line sticker-top-heading"
          style={{
            ...wrapTextStyle,
            fontWeight: 400,
            fontSize: `${typography.topHeading}pt`,
            letterSpacing: "0.02em",
            lineHeight: lineHeight,
            textAlign: "left",
            color: "#222222",
            opacity: 0.9,
          }}
          title="Imported and Distributed by:"
        >
          Imported and Distributed by:
        </div>

        <div
          className="sticker-line sticker-company"
          style={{
            ...wrapTextStyle,
            fontWeight: 800,
            fontSize: `${typography.company}pt`,
            letterSpacing: "0.02em",
            lineHeight: lineHeight,
            textAlign: "left",
            paddingRight: `${spacing.marginRight}mm`,
          }}
          title={safeCompany}
        >
          {safeCompany}
        </div>

        <div
          className="sticker-line sticker-email"
          style={{
            ...wrapTextStyle,
            fontWeight: 400,
            fontSize: `${typography.email}pt`,
            color: "#222222",
            lineHeight: lineHeight,
            textAlign: "left",
            paddingRight: `${spacing.marginRight}mm`,
          }}
          title={safeEmail}
        >
          {safeEmail}
        </div>

        <div
          className="sticker-line sticker-pid"
          style={{
            ...wrapTextStyle,
            fontWeight: 400,
            fontSize: `${typography.pid}pt`,
            letterSpacing: "0.05em",
            lineHeight: lineHeight,
            textAlign: "left",
            paddingRight: `${spacing.marginRight}mm`,
          }}
          title={`PID: ${safePid}`}
        >
          PID: {safePid}
        </div>

        {safeExim ? (
          <div
            className="sticker-line sticker-exim"
            style={{
              ...wrapTextStyle,
              fontWeight: 400,
              fontSize: `${typography.exim}pt`,
              color: "#222222",
              lineHeight: lineHeight,
              textAlign: "left",
              paddingRight: `${spacing.marginRight}mm`,
            }}
            title={`EXIM: ${safeExim}`}
          >
            EXIMCODE: {safeExim}
          </div>
        ) : null}

        <div
          className="sticker-line sticker-mrp"
          style={{
            ...wrapTextStyle,
            fontWeight: 900,
            fontSize: `${typography.mrp}pt`,
            letterSpacing: "0.01em",
            lineHeight: Math.max(1.0, lineHeight - 0.03),
            textAlign: "left",
            marginTop: `${spacing.marginTop}mm`,
            paddingRight: `${spacing.marginRight}mm`,
          }}
          title={`MRP: Rs. ${safeMrp}`}
        >
          MRP: Rs. {safeMrp}
        </div>
      </div>
    </div>
  );
}