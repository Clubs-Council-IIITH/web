import Link from "next/link";

export default function CellLink({ href, children, target }) {
  return (
    <Link
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
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