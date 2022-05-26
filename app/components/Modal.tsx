import CommentForm from "./CommentForm";

export interface VisibilityProps {
  isVisible: { visibility: boolean; isGeneral: boolean };
  setIsVisible: React.Dispatch<
    React.SetStateAction<{ visibility: boolean; isGeneral: boolean }>
  >;
}

export default function Modal({ isVisible, setIsVisible }: VisibilityProps) {
  const display = isVisible.visibility ? "fixed" : "hidden";
  return (
    <div
      className={`${display} bg-stone-700 modal mt-20 p-2 rounded text-white w-1/3 z-50`}
    >
      <CommentForm isVisible={isVisible} setIsVisible={setIsVisible} />
    </div>
  );
}
