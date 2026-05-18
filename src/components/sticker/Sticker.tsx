import React from "react";

export type StickerMode = "preview" | "print";

const wrapTextStyle = {
  wordBreak: "break-word",
  overflowWrap: "break-word",
  whiteSpace: "normal" as const,
  lineHeight: 1.2,
} as const;

export function Sticker({
  mode,
  productId,
  eximcode,
  price,
  companyName,
  companyEmail,
}: {
  mode: StickerMode;
  productId: string;
  eximcode?: string;
  price: string;
  companyName: string;
  companyEmail: string;
}) {
  const safeCompany = companyName || "—";
  const safeEmail = companyEmail || "—";
  const safePid = productId || "—";
  const safeExim = eximcode?.trim() ? eximcode : "";
  const safeMrp = price || "0";

  if (mode === "print") {
    return (
      <div
        className="sticker sticker-print"
        data-sticker-mode="print"
        style={{
          width: "36mm",
          height: "30mm",
          boxSizing: "border-box",
          background: "#ffffff",
          color: "#000000",
          border: "none",
          boxShadow: "none",
          display: "flex",
          flexDirection: "column",
          padding: "2mm 2mm",
          fontFamily: "Times New Roman, serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.72mm",
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
              fontSize: "5.0pt",
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
              fontSize: "6.8pt",
              letterSpacing: "0.02em",
              lineHeight: 1.05,
              textAlign: "left",
              paddingRight: "0.2mm",
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
              fontSize: "5.0pt",
              color: "#222222",
              lineHeight: 1.1,
              textAlign: "left",
              paddingRight: "0.2mm",
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
              fontSize: "5.7pt",
              letterSpacing: "0.05em",
              lineHeight: 1.12,
              textAlign: "left",
              paddingRight: "0.2mm",
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
                fontSize: "5.7pt",
                color: "#222222",
                lineHeight: 1.12,
                textAlign: "left",
                paddingRight: "0.2mm",
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
              fontSize: "7.0pt",
              letterSpacing: "0.01em",
              lineHeight: 1,
              textAlign: "left",
              marginTop: "0.25mm",
              paddingRight: "0.2mm",
            }}
            title={`MRP: Rs. ${safeMrp}`}
          >
            MRP: Rs. {safeMrp}
          </div>
        </div>
      </div>
    );
  }

  // PREVIEW MODE (px sizing, responsive and premium)
  return (
    <div
      className="sticker sticker-preview"
      data-sticker-mode="preview"
      style={{
        width: 460,
        maxWidth: "92vw",
        minWidth: 300,
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "rgba(255,255,255,0.95)",
        boxShadow: "0 14px 34px rgba(0,0,0,0.10)",
        padding: 18,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        overflow: "visible",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 9,
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
            fontWeight: 500,
            fontSize: 13,
            letterSpacing: "0.02em",
            lineHeight: 1.1,
            textAlign: "left",
            color: "rgba(0,0,0,0.65)",
            opacity: 0.95,
            paddingRight: 2,
          }}
          title="Imported and Distributed by:"
        >
          Imported and Distributed by:
        </div>

        <div
          className="sticker-line sticker-company"
          style={{
            ...wrapTextStyle,
            fontWeight: 900,
            fontSize: 26,
            letterSpacing: "0.01em",
            lineHeight: 1.06,
            textAlign: "left",
            paddingRight: 2,
          }}
          title={safeCompany}
        >
          {safeCompany}
        </div>

        <div
          className="sticker-line sticker-email"
          style={{
            ...wrapTextStyle,
            fontWeight: 500,
            fontSize: 13,
            color: "rgba(0,0,0,0.60)",
            lineHeight: 1.2,
            textAlign: "left",
            paddingRight: 2,
          }}
          title={safeEmail}
        >
          {safeEmail}
        </div>

        <div
          className="sticker-line sticker-pid"
          style={{
            ...wrapTextStyle,
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: "0.06em",
            lineHeight: 1.2,
            textAlign: "left",
            paddingRight: 2,
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
              fontWeight: 600,
              fontSize: 16,
              color: "rgba(0,0,0,0.62)",
              lineHeight: 1.2,
              textAlign: "left",
              paddingRight: 2,
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
            fontWeight: 950,
            fontSize: 23,
            letterSpacing: "0.01em",
            lineHeight: 1.04,
            textAlign: "left",
            marginTop: 2,
            paddingRight: 2,
          }}
          title={`MRP: Rs. ${safeMrp}`}
        >
          MRP: Rs. {safeMrp}
        </div>
      </div>
    </div>
  );
}
