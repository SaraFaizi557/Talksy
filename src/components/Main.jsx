import { MessageSquare, Reply, Send, Smile, Trash, Trash2 } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";

const Main = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(null);
  const [profilesMap, setProfilesMap] = useState({});
  const [myProfile, setMyProfile] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const MY_ID = "654b4bef-12c4-458e-a859-45e03b226d79";

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

  const fetchProfile = async (userId) => {
    if (!userId) return null;

    if (profilesMap[userId]) return profilesMap[userId];

    const { data, error } = await supabase
      .from("profiles")
      .select("display_name, avatar")
      .eq("id", userId)
      .single();

    if (error) return null;

    setProfilesMap((prev) => ({ ...prev, [userId]: data }));
    return data;
  };


  const send = async () => {
    const msg = text.trim();
    if (!msg) return;

    setText("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const user_name = myProfile?.display_name ?? `User-${user.id.slice(0, 5)}`;
    const avatar = myProfile?.avatar ?? "/assets/user.jpg";

    const { data, error } = await supabase
      .from("messages")
      .insert({
        user_id: user.id,
        user_name,
        avatar,
        text: msg,
        reply_to: replyTo?.id ?? null,
      })
      .select()
      .single();

    if (error) return console.error(error);

    setMessages((prev) => (prev.some((x) => x.id === data.id) ? prev : [...prev, data]));
    setReplyTo(null);
  };


  const ensureAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) return session.user.id;

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;

    return data.user.id;
  };


  useEffect(() => {
    (async () => {
      try {
        const uid = await ensureAuth();
        setMyId(uid);
        const prof = await fetchProfile(uid);
        setMyProfile(prof);

      } catch (e) {
        console.error("Auth init failed:", e?.message || e);
      }
    })();
  }, []);

  const formatDateTime = (created_at) => {
    const d = new Date(created_at);

    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear() % 100;

    const time = d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${day}/${month}/${year}, ${time}`;
  };

  const bottomRef = useRef(null);

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages.length])

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, text, created_at, user_id, profiles(display_name, avatar)")

        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      setMessages(data ?? []);

      const map = {};
      (data ?? []).forEach((m) => {
        if (m.user_id && m.profiles) map[m.user_id] = m.profiles;
      });
      setProfilesMap(map);
    })();
  }, []);

  useEffect(() => {
    const ch = supabase
      .channel("messages-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const newMsg = payload.new;

          let prof = profilesMap[newMsg.user_id];
          if (!prof) prof = await fetchProfile(newMsg.user_id);

          const enriched = { ...newMsg, profiles: prof ?? null };

          setMessages((prev) =>
            prev.some((x) => x.id === enriched.id) ? prev : [...prev, enriched]
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, [profilesMap]);

  const deleteMessage = async (messageId) => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("messages")
      .delete()
      .eq("id", messageId)
      .select("id");

    if (error) {
      return;
    }


    if (!data || data.length === 0) {
      return;
    }

    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  const startReply = (m) => {
    setReplyTo({
      id: m.id,
      user_name: m.user_name ?? m.profiles?.display_name ?? "Anonymous",
      text: m.text ?? "",
    });
    teRef.current?.focus();
  };

  const cancelReply = () => setReplyTo(null);

  useEffect(() => {
  (async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("getUser error:", error);
      return;
    }
    console.log("USER ID:", data?.user?.id);
  })();
}, []);


  return (
    <>
      <div
        id="text"
        className="flex flex-col h-full items-end justify-end-safe min-h-20 overflow-y-auto"
      >
        {messages.map((m) => {

          const name = m.profiles?.display_name ?? "Anonymous";
          const avatar = m.avatar ?? m.profiles?.avatar ?? "/assets/user.jpg";

          return (
            <div key={m.id} className="group relative w-full flex px-4 md:px-7 justify-between hover:bg-(--Surface-light)">
              <div className=" flex gap-3 md:gap-4 py-1">
                <img
                  className="w-10 cursor-pointer mt-1 h-10 rounded-full"
                  src={avatar}
                  alt="profile pic"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="cursor-pointer text-(--Text) md:text-md font-medium">
                      {name}
                    </h3>
                    <p className="text-(--Text)/70 mt-1 text-xs">
                      {formatDateTime(m.created_at)}
                    </p>
                  </div>
                  <p className="text-(--Text) text-md whitespace-pre-wrap break-words">{m.text}</p>
                </div>
              </div>
              <div className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 group-hover:-translate-y-2 flex items-center cursor-pointer -translate-y-3 justify-center gap-2 h-fit rounded-lg px-2 py-1 bg-(--Surface) border border-(--Border)">
                <Smile fill="--Text" className="w-5 h-5 sm:w-5.5 sm:h-5.5 hover:scale-110 transition-all duration-100 rounded cursor-pointer text-(--Surface) fill-(--Text)" />
                <Reply onClick={() => startReply(m)} className="w-5 h-5 sm:w-5.5 sm:h-5.5 hover:scale-110 hover:bg-(--Text)/6 transition-all duration-100 rounded text-(--Text)/70" />
                {myId === MY_ID && <Trash2 onClick={() => deleteMessage(m.id)} className="w-4 h-4 sm:w-4.5 sm:h-4.5 hover:scale-110 hover:bg-(--Text)/6 transition-all duration-100 rounded text-(--Trash)" />}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
      <div className="w-screen text-white px-2 md:px-5 py-3 border-(--Border)">
        {replyTo && (
            <div className="mb-1 w-full flex items-center justify-between rounded-lg bg-(--Surface) border border-(--Border) px-3 py-2">
              <div className="min-w-0">
                <p className="text-xs text-(--Text)/70">
                  Replying to <span className="font-medium text-(--Text)">{replyTo.user_name}</span>
                </p>
                <p className="text-sm text-(--Text)/80 truncate">
                  {replyTo.text}
                </p>
              </div>

              <button
                type="button"
                onClick={cancelReply}
                className="px-2 text-(--Text)/70 hover:text-(--Text)"
              >
                ✕
              </button>
            </div>
          )}
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
          <div className="hover:bg-(--Text)/20 hover:scale-110 transition-all duration-100 rounded">
            <Smile
              fill="--Text"
              className="w-5.5 h-5.5 sm:w-6 sm:h-6 cursor-pointer text-(--Surface) fill-(--Text)"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
