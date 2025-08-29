import React, { useState } from "react";

export default function AnimatedTitle({
  children,
  className = "",
  ariaLabel,
  direction = "forward",
  mode = "sequential",
}) {
  const [hovered, setHovered] = useState(false);
  const text = typeof children === "string" ? children : String(children);
  const highlightColors = ["#0ea5e9", "#f59e0b", "#0ea5e9"]; // rose, amber, sky

  let letters = Array.from(text);
  const trailingPunct = ".,:;!?";
  if (
    letters.length > 1 &&
    trailingPunct.includes(letters[letters.length - 1])
  ) {
    const last = letters.pop();
    letters[letters.length - 1] = letters[letters.length - 1] + last;
  }

  const baseDelay = 45; // ms per letter

  return (
    <span
      tabIndex={0}
      aria-label={ariaLabel || text}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={className}
    >
      {letters.map((char, i) => {
        const index = direction === "forward" ? i : letters.length - 1 - i;
        const delay = index * baseDelay;
        const displayChar = char === " " ? "\u00A0" : char;

        let isHighlighted = false;
        if (mode === "alternating") {
          isHighlighted = hovered && i % 2 === 0;
        } else {
          isHighlighted = hovered;
        }

        let main = displayChar;
        let trailing = "";
        if (displayChar.length > 1) {
          const last = displayChar[displayChar.length - 1];
          if (trailingPunct.includes(last)) {
            main = displayChar.slice(0, -1);
            trailing = last;
          }
        }
        const highlightColor = highlightColors[i % highlightColors.length];

        return (
          <span
            key={`${i}-${char}`}
            aria-hidden
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              transition: "color 200ms ease, transform 200ms ease",
              transitionDelay: mode === "alternating" ? "0ms" : `${delay}ms`,
              color: isHighlighted ? highlightColor : undefined,
              transform: isHighlighted ? "scale(1.08)" : "none",
              transformOrigin: "center bottom",
            }}
          >
            {main}
            {trailing ? (
              <span style={{ color: "#facc15" }}>{trailing}</span>
            ) : null}
          </span>
        );
      })}       
    </span>
  );
}
