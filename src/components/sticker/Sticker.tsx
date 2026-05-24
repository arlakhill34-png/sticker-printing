import React from "react";

export type StickerMode = "preview" | "print";

const wrapTextStyle = {
  wordBreak: "break-word",
  overflowWrap: "break-word",
  whiteSpace: "normal" as const,
  lineHeight: 1.2,
} as const;

const BASE_WIDTH = 36;
const BASE_HEIGHT = 30;

const PREVIEW_TYPOGRAPHY = {
  topHeading: 5.0,
  company: 6.8,
  email: 5.0,
  pid: 5.7,
  exim: 5.7,
  mrp: 7.0,
};

const PREVIEW_SPACING = {
  gap: 0.72,
  padding: 2,
  marginRight: 0.2,
  marginTop: 0.25,
};

export function Sticker({
  mode,
  productId,
  eximcode,
  price,
  companyName,
  companyEmail,
  width = BASE_WIDTH,
  height = BASE_HEIGHT,
}: {
  mode: StickerMode;
  productId: string;
  eximcode?: string;
  price: string;
  companyName: string;
  companyEmail: string;
  width?: number;
  height?: number;
}) {
  const safeCompany = companyName || "—";
  const safeEmail = companyEmail || "—";
  const safePid = productId || "—";
  const safeExim = eximcode?.trim() ? eximcode : "";
  const safeMrp = price || "0";

  if (mode === "print") {
    const scaleFactor = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);

    const typography = {
      topHeading: Math.max(3.8, 5.0 * scaleFactor),
      company: Math.max(5.5, 6.8 * scaleFactor),
      email: Math.max(3.8, 5.0 * scaleFactor),
      pid: Math.max(4.5, 5.7 * scaleFactor),
      exim: Math.max(4.5, 5.7 * scaleFactor),
      mrp: Math.max(5.5, 7.0 * scaleFactor),
    };

    const spacing = {
      gap: Math.max(0.4, 0.72 * scaleFactor),
      padding: Math.max(1.2, 2 * scaleFactor),
      marginRight: Math.max(0.15, 0.2 * scaleFactor),
      marginTop: Math.max(0.15, 0.25 * scaleFactor),
    };

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
              lineHeight: 1.05,
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
              lineHeight: 1.05,
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
              lineHeight: 1.1,
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
              lineHeight: 1.12,
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
                lineHeight: 1.12,
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
              lineHeight: 1,
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

  return (
    <div
      className="sticker sticker-preview"
      data-sticker-mode="preview"
      style={{
        width: `${BASE_WIDTH}mm`,
        height: `${BASE_HEIGHT}mm`,
        borderRadius: 2,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "rgba(255,255,255,0.95)",
        boxShadow: "0 14px 34px rgba(0,0,0,0.10)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        overflow: "visible",
        padding: `${PREVIEW_SPACING.padding}mm`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `${PREVIEW_SPACING.gap}mm`,
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
            fontSize: `${PREVIEW_TYPOGRAPHY.topHeading}pt`,
            letterSpacing: "0.02em",
            lineHeight: 1.05,
            textAlign: "left",
            color: "#222222",
            opacity: 0.9,
            paddingRight: `${PREVIEW_SPACING.marginRight}mm`,
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
            fontSize: `${PREVIEW_TYPOGRAPHY.company}pt`,
            letterSpacing: "0.02em",
            lineHeight: 1.05,
            textAlign: "left",
            paddingRight: `${PREVIEW_SPACING.marginRight}mm`,
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
            fontSize: `${PREVIEW_TYPOGRAPHY.email}pt`,
            color: "#222222",
            lineHeight: 1.1,
            textAlign: "left",
            paddingRight: `${PREVIEW_SPACING.marginRight}mm`,
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
            fontSize: `${PREVIEW_TYPOGRAPHY.pid}pt`,
            letterSpacing: "0.05em",
            lineHeight: 1.12,
            textAlign: "left",
            paddingRight: `${PREVIEW_SPACING.marginRight}mm`,
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
              fontSize: `${PREVIEW_TYPOGRAPHY.exim}pt`,
              color: "#222222",
              lineHeight: 1.12,
              textAlign: "left",
              paddingRight: `${PREVIEW_SPACING.marginRight}mm`,
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
            fontSize: `${PREVIEW_TYPOGRAPHY.mrp}pt`,
            letterSpacing: "0.01em",
            lineHeight: 1,
            textAlign: "left",
            marginTop: `${PREVIEW_SPACING.marginTop}mm`,
            paddingRight: `${PREVIEW_SPACING.marginRight}mm`,
          }}
          title={`MRP: Rs. ${safeMrp}`}
        >
          MRP: Rs. {safeMrp}
        </div>
      </div>
    </div>
  );
}
