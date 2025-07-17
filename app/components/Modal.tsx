import CommentForm from "./CommentForm";

export interface ModalProps {
  visibility: boolean;
  setVisibility: React.Dispatch<
    React.SetStateAction<{ visibility: boolean; isGeneral: boolean }>
  >;
  children: ReactNode | ReactNode[];
}

export default function Modal({
  visibility,
  setVisibility,
  children,
}: ModalProps) {
  const display = visibility ? "fixed" : "hidden";
  return (
    <div
      className={`${display} bg-stone-700 rounded text-white w-1/3 m-auto left-0 right-0 mt-20 p-2 z-50`}
    >
      {children}
    </div>
  );
}
