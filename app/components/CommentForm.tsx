import { useEffect, useState, FormEvent } from "react";
import { useParams } from "remix";
import Input from "./Input";
import { getProject } from "~/project";
import { VisibilityProps } from "./Modal";

export default function CommentForm({
  isVisible,
  setIsVisible,
}: VisibilityProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [projectId, setProjectId] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { id } = useParams();

  // autofill mpms
  useEffect(() => {
    if (!id) {
      setProjectId("");
      return;
    }

    (async () => {
      const data = await getProject(id);
      setProjectId(data.id);
    })();
  }, [id, setProjectId, getProject]);

  const validate = (params = [projectId, fullName, email, comment]) => {
    let ret = true;
    // only validate the fields required for general comments
    if (isVisible.isGeneral) params = params.slice(2);
    params.forEach((param: string) => {
      if (!param) {
        setError("One or more fields is empty");
        ret = false;
      }
    });
    return ret;
  };

  const clear = (
    arr = [setProjectId, setFullName, setEmail, setComment, setError]
  ) => {
    // if there is a project selected clear all fields except those that have been autofilled ie the first 2
    if (id) arr = arr.slice(2);
    arr.forEach((func) => {
      func("");
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    try {
      const createdComment = {
        Name: fullName,
        email,
        comment_text: comment,
        ...(!isVisible.isGeneral && { MPMS: projectId }),
      };

      const request = await fetch(
        "https://www.dvrpc.org/data/tip/2025/comments",
        {
          method: "post",
          body: JSON.stringify(createdComment),
        }
      );
      if (request.ok) {
        setError("");
        setSuccess("Comment saved successfully!");
        setTimeout(() => {
          setSuccess("");
          clear();
          setIsVisible((prev: any) => {
            return {
              ...prev,
              visibility: false,
            };
          });
        }, 2000);
      }
    } catch (err) {
      setError("An error has occurred");
    }
  };

  return (
    <>
      <div className="flex pt-4 px-4">
        <h2 className="text-xl">
          Leave a Comment{!isVisible.isGeneral && <> for Project {projectId}</>}
        </h2>
        <span
          className="close cursor-pointer ml-auto text-2xl"
          onClick={() => {
            clear();
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
      <form className="flex flex-col p-4" onSubmit={handleSubmit} id="test">
        <Input label={"Full name"} value={fullName} setValue={setFullName} />
        <Input label={"Email"} value={email} type="email" setValue={setEmail} />
        {!isVisible.isGeneral && <input type="hidden" value={projectId} />}
        <label>
          Comment{" "}
          {!isVisible.isGeneral ? (
            <>
              {" "}
              for Project {projectId}{" "}
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
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="appearance-none bg-stone-600 flex-1 h-36 p-2 placeholder:text-stone-300 rounded shadow-[inset_0_0_0_1000px] shadow-stone-600 w-full"
          />
        </label>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        <button
          type="submit"
          className="bg-yellow-400 font-bold hover:bg-yellow-500 inline-block mb-4 mt-2 no-underline p-2 rounded text-stone-700"
        >
          Submit
        </button>
      </form>
    </>
  );
}
