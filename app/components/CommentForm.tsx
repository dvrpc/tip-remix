import { useState, FormEvent } from "react";
import { useParams } from "remix";
import Input from "./Input";
import { VisibilityProps } from "./Modal";
import Spinner from "./Spinner";

export default function CommentForm({
  isVisible,
  setIsVisible,
}: VisibilityProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const { id } = useParams();

  const clear = (arr = [setComment, setError]) => {
    arr.forEach((func) => {
      func("");
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));

    try {
      const createdComment = {
        Name: fullName,
        email,
        comment_text: comment,
        ...(!isVisible.isGeneral && { MPMS: id }),
      };

      const request = await fetch(
        "https://www2.dvrpc.org/data/tip/2025/comments",
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
        clear();
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
          Leave a Comment{!isVisible.isGeneral && <> for Project {id}</>}
        </h2>
        <span
          className="close cursor-pointer ml-auto text-2xl"
          onClick={() => {
            clear();
            setSuccess("");
            setIsVisible((prev: any) => {
              return {
                ...prev,
                visibility: !prev.visibility,
              };
            });
          }}
        >
          &times;
        </span>
      </div>
      <form
        className="flex flex-col p-4 relative"
        onSubmit={handleSubmit}
        id="test"
      >
        <Input
          label={"Full name"}
          value={fullName}
          setValue={setFullName}
          required={true}
          disabled={loading}
        />
        <Input
          label={"Email"}
          value={email}
          type="email"
          setValue={setEmail}
          required={true}
          disabled={loading}
        />
        {!isVisible.isGeneral && <input type="hidden" value={id} />}
        <label>
          Comment{" "}
          {!isVisible.isGeneral ? (
            <>
              {" "}
              for Project {id}{" "}
              <small
                className="cursor-pointer hover:text-stone-300 underline"
                onClick={() =>
                  setIsVisible((prev) => {
                    return {
                      ...prev,
                      isGeneral: true,
                      visibility: true,
                    };
                  })
                }
              >
                (Want to leave a general comment instead?)
              </small>
            </>
          ) : id ? (
            <small
              className="cursor-pointer hover:text-stone-300 underline"
              onClick={() =>
                setIsVisible((prev) => {
                  return {
                    ...prev,
                    isGeneral: false,
                    visibility: true,
                  };
                })
              }
            >
              (Want to leave a comment about Project {id}?)
            </small>
          ) : null}
          <textarea
            disabled={loading}
            required={true}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="appearance-none bg-stone-600 disabled:bg-transparent disabled:border-2 disabled:border-stone-600 disabled:shadow-transparent flex-1 h-36 p-2 placeholder:text-stone-300 rounded shadow-[inset_0_0_0_1000px] shadow-stone-600 w-full"
          />
        </label>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        <button
          type="submit"
          className="bg-yellow-400 disable:bg-yellow-600 disabled:cursor-auto disabled:opacity-75 enabled:hover:bg-yellow-500 font-bold inline-block mb-4 mt-2 no-underline p-2 rounded text-stone-700"
          disabled={loading}
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
