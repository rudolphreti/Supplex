"use client";

import type { ReactNode } from "react";

type ConfirmDeleteButtonProps = {
  children: ReactNode;
  className?: string;
};

export default function ConfirmDeleteButton({
  children,
  className,
}: ConfirmDeleteButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!window.confirm("Sind Sie sicher?")) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
