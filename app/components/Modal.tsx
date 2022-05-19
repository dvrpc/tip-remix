import React, { useState } from "react";
import CommentForm from "./CommentForm";

export interface VisibilityProps {
  isVisible: { visibility: boolean; isGeneral: boolean };
  setIsVisible: React.Dispatch<
    React.SetStateAction<{ visibility: boolean; isGeneral: boolean }>
  >;
}

export default function Modal({ isVisible, setIsVisible }: VisibilityProps) {
  return (
    <div
      className="bg-stone-700 fixed modal mt-4 p-2 rounded text-white w-1/3"
      style={{
        display: isVisible.visibility ? "" : "none",
        zIndex: 1000,
      }}
    >
      <CommentForm isVisible={isVisible} setIsVisible={setIsVisible} />
    </div>
  );
}
