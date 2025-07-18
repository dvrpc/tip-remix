import { useEffect, useState, FormEvent } from "react";
import { useParams, useLoaderData, useOutletContext } from "remix";
import Input from "./Input";
import { getProject } from "~/project";
import { ModalProps } from "./Modal";
import { extractIdFromSplat } from "~/utils";
import Spinner from "./Spinner";

interface CommentFormProps extends ModalProps {
  isGeneral: boolean;
  setIsGeneral: React.Dispatch<
    React.SetStateAction<{ visibility: boolean; isGeneral: boolean }>
  >;
}

export default function CommentForm({
  visibility,
  setVisibility,
  id,
  isGeneral,
  setIsGeneral,
}: CommentFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const clear = (
    arr = [setFullName, setEmail, setComment, setError, setSuccess]
  ) => {
    arr.forEach((func) => {
      func("");
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));

    try {
      let params = [fullName, email, comment];
      let validate = true;
      if (isGeneral) params = params.slice(1);
      params.forEach((param: string) => {
        if (!param) {
          setError("One or more fields is empty");
          validate = false;
        }
      });
      if (!validate) return;

      const createdComment = {
        Name: fullName,
        email,
        comment_text: comment,
        ...(!isGeneral && { MPMS: id }),
      };

      const request = await fetch(
        "https://www2.dvrpc.org/data/tip/2026/comments",
        {
          method: "post",
          body: JSON.stringify(createdComment),
        }
      );
      setError("");
      setSuccess("");
      setLoading(true);
      await timer(1000);

      if (request.ok) {
        setLoading(false);
        setError("");
        setSuccess("Comment saved successfully!");
        await timer(1000);
        clear();
        setVisibility((prev: any) => !prev);
      } else {
        setError(
          "An error has occurred. Please email tip@dvrpc.org with your comments."
        );
        setLoading(false);
      }
    } catch (err) {
      setError(
        "An error has occurred. Please email tip@dvrpc.org with your comments."
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex pt-4 px-4">
        <h2 className="text-xl">
          Leave a Comment{!isGeneral && <> for Project {id}</>}
        </h2>
        <span
          className="close cursor-pointer ml-auto text-2xl"
          onClick={() => {
            clear();
            setVisibility(false);
          }}
        >
          &times;
        </span>
      </div>
      <form className="flex flex-col p-4" onSubmit={handleSubmit} id="test">
        <Input label={"Full name"} value={fullName} setValue={setFullName} />
        <Input label={"Email"} value={email} type="email" setValue={setEmail} />
        {!isGeneral && <input type="hidden" value={id} />}
        <label>
          Comment{" "}
          {!isGeneral ? (
            <>
              {" "}
              for Project {id}{" "}
              <small
                className="cursor-pointer hover:text-stone-300 underline"
                onClick={() => {
                  setVisibility(true);
                  setIsGeneral(true);
                }}
              >
                (Want to leave a general comment instead?)
              </small>
            </>
          ) : id ? (
            <small
              className="cursor-pointer hover:text-stone-300 underline"
              onClick={() => {
                setVisibility(true);
                setIsGeneral(false);
              }}
            >
              (Want to leave a comment about Project {id}?)
            </small>
          ) : null}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="appearance-none bg-stone-600 flex-1 h-36 p-2 placeholder:text-stone-300 rounded shadow-[inset_0_0_0_1000px] shadow-stone-600 w-full"
          />
        </label>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        <button
          type="submit"
          className="bg-yellow-400 disabled:bg-yellow-500 font-bold hover:bg-yellow-500 inline-block mb-4 mt-2 no-underline p-2 rounded text-stone-700"
          disabled={loading || success.length}
        >
          Submit
        </button>

        {loading && (
          <div className="-ml-2.5 absolute left-1/2 top-[35%] transform-y-1/2">
            <Spinner />
          </div>
        )}
      </form>
    </>
  );
}
