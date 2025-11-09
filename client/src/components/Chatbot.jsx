// // src/components/ChatBot.jsx
// import React, { useState, useRef, useEffect, useContext } from "react";
// import { createPortal } from "react-dom";
// import { Context } from "../main";
// import { io } from "socket.io-client";

// const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const ChatBot = () => {
//   const { user } = useContext(Context);
//   const [chatOpen, setChatOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef(null);
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     if (!user) return;

//     const s = io(SOCKET_URL, { transports: ["websocket"], withCredentials: true });
//     setSocket(s);

//     s.emit("join_room", { room: "career-bot", userId: user._id, userName: user.name });

//     s.on("receive_message", (msg) => setMessages((prev) => [...prev, msg]));

//     return () => s.disconnect();
//   }, [user]);

//   const sendMessage = () => {
//     if (!input.trim() || !socket) return;

//     const now = new Date().toISOString();
//     const msg = { room: "career-bot", text: input, senderId: user._id, senderName: user.name, createdAt: now };
//     socket.emit("send_message", msg);
//     setMessages((prev) => [...prev, msg]);
//     setInput("");
//   };

//   const widget = (
//   <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2147483647, pointerEvents: "auto" }}>
//       {!chatOpen ? (
//         <button
//           onClick={() => setChatOpen(true)}
//           className="bg-blue-600 text-white p-5 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 flex items-center justify-center"
//           style={{ fontSize: 22 }}
//           aria-label="Open chat"
//         >
//           {/* SVG chat icon (larger, formal) */}
//           <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" fill="white" />
//           </svg>
//         </button>
//       ) : (
//         <div
//             className="w-72 h-[520px] rounded-lg flex flex-col overflow-hidden border"
//             style={{
//               width: 288, // enforce fixed width so long text can't expand the panel
//               backgroundColor: "rgba(255,255,255,0.98)",
//               boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
//               borderColor: "rgba(0,0,0,0.08)",
//               minWidth: 280,
//             }}
//           >
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 flex justify-between items-center text-white rounded-t-2xl">
//             <span className="font-semibold text-lg">CareerBot</span>
//             <button onClick={() => setChatOpen(false)} className="hover:bg-slate-800 p-1 rounded-full transition">✖️</button>
//           </div>

//     <div className="flex-1 px-0 py-3 overflow-y-auto rounded-xl flex flex-col space-y-2"
//       style={{ backgroundColor: "#ffffff" }}>
//             {messages.map((msg, index) => {
//               const isUser = msg.senderId === user?._id;
//               // consider messages with senderId 'bot' or senderName 'CareerBot' as bot responses
//               const isBot = msg.senderId === "bot" || (msg.senderName && String(msg.senderName).toLowerCase().includes("careerbot"));
//               return (
//                 <div key={index} className="w-full flex flex-col">
//                   <div className={`w-full flex ${isUser ? "justify-end items-end" : "justify-start items-start"}`}>
//                     {isUser ? (
//                       // user (question) - bubble with icon inside at the start
//                       <div
//                         className={`px-3 py-2 rounded-md max-w-[95%] text-sm bg-blue-600 text-white flex items-center`}
//                         style={{
//                           boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//                           whiteSpace: "pre-wrap",
//                           wordBreak: "break-word",
//                           overflowWrap: "anywhere",
//                           maxWidth: "95%",
//                           borderRadius: 10,
//                         }}
//                       >
//                         <span className="flex-shrink-0 mr-2 mt-0.5" aria-hidden="true">
//                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
//                             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.88 17h-1.75v-1.75h1.75V19zM15.07 9.75c-.17.61-.66 1.09-1.27 1.33-.37.15-.62.52-.62.93v.5h-1.75v-.5c0-.96.61-1.82 1.48-2.14.86-.32 1.41-.99 1.58-1.78.17-.78-.06-1.6-.6-2.15C14.02 5.19 13.06 5 12.12 5c-1.16 0-2.21.46-3.01 1.21l-1.22-1.22C8.52 4.31 10.25 3.5 12.12 3.5c1.42 0 2.78.49 3.8 1.39.98.86 1.5 2.07 1.16 3.36z" fill="currentColor" />
//                           </svg>
//                         </span>
//                         <span className="text-sm break-words">{msg.text}</span>
//                       </div>
//                     ) : (
//                       // bot or other - bubble with icon inside at the start
//                       <div
//                         className={`px-3 py-2 rounded-md max-w-[95%] text-sm flex items-center ${isBot ? "bg-emerald-600 text-white" : "bg-gray-300 text-gray-800"}`}
//                         style={{
//                           boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//                           whiteSpace: "pre-wrap",
//                           wordBreak: "break-word",
//                           overflowWrap: "anywhere",
//                           maxWidth: "95%",
//                           borderRadius: 10,
//                         }}
//                       >
//                         <span className="flex-shrink-0 mr-2 mt-0.5" aria-hidden="true">
//                           {isBot ? (
//                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
//                               <path d="M12 2a2 2 0 0 0-2 2v1H6a2 2 0 0 0-2 2v3h14V7a2 2 0 0 0-2-2h-4V4a2 2 0 0 0-2-2zM6 14v4a2 2 0 0 0 2 2h8l4 3V14H6z" fill="currentColor" />
//                             </svg>
//                           ) : (
//                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
//                               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.88 17h-1.75v-1.75h1.75V19zM15.07 9.75c-.17.61-.66 1.09-1.27 1.33-.37.15-.62.52-.62.93v.5h-1.75v-.5c0-.96.61-1.82 1.48-2.14.86-.32 1.41-.99 1.58-1.78.17-.78-.06-1.6-.6-2.15C14.02 5.19 13.06 5 12.12 5c-1.16 0-2.21.46-3.01 1.21l-1.22-1.22C8.52 4.31 10.25 3.5 12.12 3.5c1.42 0 2.78.49 3.8 1.39.98.86 1.5 2.07 1.16 3.36z" fill="currentColor" />
//                             </svg>
//                           )}
//                         </span>
//                         <span className="text-sm break-words">{msg.text}</span>
//                       </div>
//                     )}
//                   </div>

//                   <div className={`text-[10px] text-gray-500 mt-1 ${isUser ? "text-right pr-2" : "text-left pl-2"}`}>
//                     {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                   </div>
//                 </div>
//               );
//             })}
//             <div ref={messagesEndRef} />
//           </div>

//           <div className="flex border-t border-slate-300 p-2 bg-white">
//             <input type="text" placeholder="Type your message..." className="flex-1 p-2 border rounded-md text-sm outline-none" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
//             <button onClick={sendMessage} className="ml-2 bg-blue-600 text-white px-3 rounded-md hover:bg-blue-700">Send</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   if (typeof document !== "undefined") return createPortal(widget, document.body);
//   return widget;
// };

// export default ChatBot;


// src/components/ChatBot.jsx
// src/components/ChatBot.jsx
import React, { useState, useRef, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import { Context } from "../main";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ChatBot = () => {
  const { user } = useContext(Context);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const greetedRef = useRef(false);
  const messagesEndRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!user) return;

    const s = io(SOCKET_URL, { transports: ["websocket"], withCredentials: true });
    setSocket(s);

    s.emit("join_room", { room: "career-bot", userId: user._id, userName: user.name });

    s.on("receive_message", (msg) => setMessages((prev) => [...prev, msg]));

    return () => s.disconnect();
  }, [user]);

  // greet user once when the chat is opened for the first time
  useEffect(() => {
    if (!chatOpen) return;
    // only greet once per page load/session
    if (greetedRef.current) return;
    greetedRef.current = true;

    const botGreeting = {
      room: "career-bot",
      text: `Hi ${user?.name ? user.name.split(" ")[0] : "there"}! I'm CareerBot — ask me about the site, job postings, or uploading your CV.`,
      senderId: "bot",
      senderName: "CareerBot",
      createdAt: new Date().toISOString(),
    };

  // append greeting locally only (do not send to server). Persisting the greeting
  // can trigger stored-KB responses or create unwanted history; keep greeting
  // ephemeral for UX clarity.
  setMessages((prev) => [...prev, botGreeting]);
  }, [chatOpen, socket, user]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;

    const now = new Date().toISOString();
    const msg = { room: "career-bot", text: input, senderId: user._id, senderName: user.name, createdAt: now };
    socket.emit("send_message", msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  const widget = (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2147483647 }}>
      {!chatOpen ? (
   <button
  onClick={() => setChatOpen(true)}
  className="group rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-200 flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 focus:outline-none"
  style={{
    width: 70,
    height: 70,
    padding: 0,
    border: "none",
    backgroundColor: "transparent",
    boxShadow: "0 14px 40px rgba(76,29,149,0.45)",
    cursor: "pointer",
  }}
  aria-label="Chat Assistant"
  title="Chat Assistant"
>
  <svg
    width="70"
    height="70"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    style={{ display: "block" }}
  >
    <rect x="3" y="5" width="18" height="14" rx="3" fill="#06b6d4" />
    <rect x="7" y="8" width="3" height="3" rx="0.6" fill="#082f49" />
    <rect x="14" y="8" width="3" height="3" rx="0.6" fill="#082f49" />
    <rect x="9.5" y="12" width="5" height="2" rx="1" fill="#082f49" />
    <rect x="8" y="16" width="8" height="1" rx="0.5" fill="#054b66" />
  </svg>
</button>


      ) : (
        <div
          className="rounded-3xl flex flex-col overflow-hidden border"
          style={{
            position: "relative",
            width: 320,
            height: 560,
            // slightly translucent background so the panel blends with the page
            background: "linear-gradient(180deg, rgba(15,23,42,0.78) 0%, rgba(17,24,39,0.62) 100%)",
            color: "#e5e7eb",
            boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
            borderColor: "rgba(255,255,255,0.06)",
            // stronger backdrop blur for the frosted-glass effect
            backdropFilter: "blur(8px)",
            borderRadius: 24,
          }}
        >
          
{/* Header */}
<div
  className="relative flex items-center text-white"
  style={{
    background: "linear-gradient(90deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.88) 100%)",
    padding: "0.75rem 1rem",
    height: "56px",
    overflow: "visible",          // so the button can sit exactly at the edge
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  }}
>
  {/* Left: name only (you can add the avatar back if you want) */}
  <div className="flex items-center gap-2">
    <span className="font-semibold text-base leading-tight">
      CareerBot: <span className="font-normal">Your chat assistant</span>
    </span>
  </div>

  {/* Close — truly extreme top-right */}
  <button
    onClick={() => setChatOpen(false)}
    className="absolute top-0 right-0 rounded-full hover:bg-white/20 transition z-20"
    aria-label="Close chat"
    title="Close"
    style={{
      // reset native button styles that create the white square you see
      position: "absolute",
      background: "transparent",
      border: "none",
      padding: "4px",
      lineHeight: 0,
      cursor: "pointer",
      top: 6,
      right: 6,
      width: 32,
      height: 32,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </button>
</div>




          {/* Messages */}
          <div
            className="flex-1 px-3 py-3 overflow-y-auto space-y-3"
            style={{ background: "radial-gradient(1200px 400px at 90% 0%, rgba(99,102,241,0.10), transparent), radial-gradient(1000px 400px at 0% 100%, rgba(147,51,234,0.10), transparent)" }}
          >
            {messages.map((msg, index) => {
              const isUser = msg.senderId === user?._id;
              const isBot =
                msg.senderId === "bot" ||
                (msg.senderName && String(msg.senderName).toLowerCase().includes("careerbot"));

              return (
                <div key={index} className={`w-full flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[90%] text-sm shadow-md ring-1 ${isUser
                        ? "bg-gradient-to-br from-sky-600 to-sky-500 text-white shadow-sky-900/30 ring-white/10"
                        : isBot
                        ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-violet-900/30 ring-white/10"
                        : "bg-zinc-200 text-zinc-900 shadow-zinc-900/10 ring-zinc-300/60"
                      }`}
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "anywhere" }}
                    title={isUser ? (msg.senderName || "You") : (isBot ? "CareerBot" : (msg.senderName || "Guest"))}
                  >
                    <div className="flex items-start gap-2">
                      {/* Q/A icons */}
                      <span className="mt-0.5 flex-shrink-0" aria-hidden="true">
                        {isUser ? (
                          // user = Q icon
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="white" opacity="0.2"/>
                            <path d="M12 7a3 3 0 1 0 0 6m0 4v1" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                            <circle cx="12" cy="16.5" r="1" fill="white"/>
                          </svg>
                        ) : (
                          // bot = A icon (robot)
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <rect x="4" y="8" width="16" height="10" rx="3" fill="white" opacity="0.95"/>
                            <path d="M9 6h6" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="10" cy="13" r="1.6" fill="#4f46e5"/>
                            <circle cx="14" cy="13" r="1.6" fill="#22c55e"/>
                            <path d="M8 19a4 4 0 0 0 8 0" fill="#e5e7eb"/>
                          </svg>
                        )}
                      </span>
                      <span className="text-[13px] leading-5">{msg.text}</span>
                    </div>
                  </div>

                  <div className={`text-[10px] mt-1 ${isUser ? "text-right text-white/60 pr-1" : "text-left text-white/60 pl-1"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input + Send (fixed at bottom of panel as normal flow element) */}
          <div className="p-3 border-t border-white/10" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.08))" }}>
            <div className="max-w-full mx-auto flex items-center gap-3" style={{ alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 text-sm text-white placeholder-white/60 bg-white/6 focus:outline-none transition-shadow"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                aria-label="Type your message"
                style={{
                  height: 44,
                  padding: '0 18px',
                  minWidth: 260,
                  boxSizing: 'border-box',
                  flex: '1 1 260px',
                  lineHeight: '20px',
                  borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              />

              <button
                onClick={sendMessage}
                className="text-sm font-semibold text-white flex items-center justify-center"
                style={{
                  background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
                  boxShadow: "0 10px 26px rgba(59,130,246,0.22)",
                  minWidth: 46,
                  height: 44,
                  padding: '0 12px',
                  borderRadius: 12,
                }}
                aria-label="Send message"
                title="Send"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 11.5 21 3l-8.5 18-1.5-7-8-2.5Z" fill="white"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (typeof document !== "undefined") return createPortal(widget, document.body);
  return widget;
};

export default ChatBot;

