import Link from "next/link";

export default function CellLink({ href, children, target, align = "left" }) {
  return (
    <Link
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: align === "center" ? "center" : "start",
        width: "100%",
        height: "100%",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {children}
    </Link>
  );
}