import { MessageSquare, Send, Trash2 } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { useEffect } from "react";
import { supabase } from "../supabaseClient";


const Main = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const teRef = useRef(null);

  const resize = () => {
    const el = teRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = el.scrollHeight + "px";
  };

  useLayoutEffect(() => {
    resize();
  }, [text]);

  const send = async () => {
  const msg = text.trim();
  if (!msg) return;

  setText("");

  const { data, error } = await supabase
    .from("messages")
    .insert({
      user_name: "Sara",
      avatar: "/assets/profile.jpg",
      text: msg,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return;
  }

  setMessages((prev) => [...prev, data]);
};


  const formatTime = (created_at) =>
  new Date(created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });


  const bottomRef = useRef(null);

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages.length])

  useEffect(() => {
  (async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setMessages(data ?? []);
  })();
}, []);

// const deleteMessage = async (id) => {
//   const { error } = await supabase.from("messages").delete().eq("id", id);

//   if (error) {
//     console.error("Delete error:", error);
//     return;
//   }

//   // UI se bhi remove
//   setMessages((prev) => prev.filter((m) => m.id !== id));
// };


  return (
    <>
      <div
        id="text"
        className="flex flex-col h-full items-end justify-end-safe min-h-20 overflow-y-auto"
      >
        {messages.map((m) => (
          <div key={m.id} className="relative w-full flex px-4 md:px-7 justify-between hover:bg-(--Surface-light)">
            <div className="flex gap-3 md:gap-4 py-1">
              <img
                className="w-10 cursor-pointer mt-1 h-10 rounded-full"
                src={m.avatar}
                alt="profile pic"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="cursor-pointer text-(--Text) text-md md:text-lg font-semibold">
                    Sara
                  </h3>
                  <p className="text-(--Text)/70 text-sm">
                    {formatTime(new Date(m.created_at).getTime())}
                  </p>
                </div>
                <p className="text-(--Text) text-md">{m.text}</p>
              </div>
            </div>
            {/* <Trash2 onClick={() => deleteMessage(m.id)} className="absolute right-4 md:right-7 w-5 h-5 md:w-5 md:h-5 text-(--Trash) cursor-pointer mt-2" /> */}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="w-screen text-white px-2 md:px-5 py-3 border-(--Border)">
        <div className="w-full flex items-end gap-3 rounded-lg bg-(--Surface) px-3 py-3 md:py-4 border border-(--Border)">
          <MessageSquare
            size={25}
            fill="var(--Primary)"
            className="text-(--Primary) cursor-pointer"
          />
          <textarea
            id="text"
            onKeyDown={(e) => {
              if (e.key == "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            onChange={(e) => setText(e.target.value)}
            ref={teRef}
            value={text}
            className="w-full max-h-[40vh] text-(--Text) resize-none outline-none bg-transparent"
            rows={1}
            placeholder="Type a message..."
          />
          <Send
            onClick={() => {
              send();
            }}
            size={25}
            className="text-(--Primary) cursor-pointer"
          />
        </div>
      </div>
    </>
  );
};

export default Main;
