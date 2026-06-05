export function ScrollDownIcon({ className }: { className?: string }) {
  return (
    <span className={`scroll ${className ?? ""}`}>
      <span className="scroll_arrow top_arrow">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 65.2 34.1"
          style={{ enableBackground: "new 0 0 65.2 34.1" } as React.CSSProperties}
        >
          <style>{`.st0w{fill:none;stroke:#ffffff;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}`}</style>
          <polyline className="st0w" points="5,5 31.8,28.7 59.2,5" />
        </svg>
      </span>
      <span className="scroll_arrow bottom_arrow">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 65.2 34.1"
          style={{ enableBackground: "new 0 0 65.2 34.1" } as React.CSSProperties}
        >
          <style>{`.st0b{fill:none;stroke:#000000;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}`}</style>
          <polyline className="st0b" points="5,5 31.8,28.7 59.2,5" />
        </svg>
      </span>
    </span>
  );
}
