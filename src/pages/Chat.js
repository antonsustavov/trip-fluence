import React, { useEffect, useMemo, useRef, useState } from "react";
import UserHeader from "../components/UserHeader";
import { supabase } from "../supabaseClient";
import {
  useConversations,
  useConversationMessages,
} from "../hooks/useConversations";

const Icon = ({ children, title }) => (
  <span
    title={title}
    className="inline-flex items-center justify-center w-8 h-8 rounded-full cursor-pointer shrink-0"
  >
    {children}
  </span>
);

const Bubble = ({ side, children, avatar }) => (
  <div
    className={`w-full flex ${
      side === "me" ? "justify-end" : "justify-start items-center"
    } items-end gap-2`}
  >
    {side !== "me" && avatar && (
      <img
        src={avatar}
        alt="avatar"
        className="min-w-[25px] max-w-[25px] h-[25px] rounded-full"
      />
    )}
    <div
      className={`${
        side === "me"
          ? "bg-[#4399FF] rounded-[10px] rounded-br-none text-white"
          : "bg-[#DCE8FF] rounded-[10px] rounded-bl-none text-[#000000]"
      } px-4 py-2 max-w-[80] md:max-w-[50%] font-normal text-[15px] leading-[23px]`}
    >
      {children}
    </div>
    {side === "me" && avatar && (
      <img
        src={avatar}
        alt="avatar"
        className="w-[25px] min-w-[25px] min-h-[25px] max-h-[25px] object-cover rounded-full"
      />
    )}
  </div>
);

const DayDivider = ({ label }) => (
  <div className="my-[17px] flex items-center gap-4">
    <hr className="flex-1 border-[#D9D9D9]" />
    <span className="text-[#D9D9D9] text-[15px] leading-[17px] font-normal">
      {label}
    </span>
    <hr className="flex-1 border-[#D9D9D9]" />
  </div>
);

const Chat = () => {
  // Get current user
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserDbId, setCurrentUserDbId] = useState(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadUser() {
      try {
        const { data: auth } = await supabase.auth.getUser();
        const authId = auth?.user?.id;
        if (!authId || !active) return;

        setCurrentUserId(authId);

        // Get the user's database ID
        const { data: userData } = await supabase
          .from("users")
          .select("id, avatar")
          .eq("auth_id", authId)
          .maybeSingle();

        if (active && userData?.id) {
          setCurrentUserDbId(userData.id);
          setCurrentUserAvatar(userData.avatar || null);
        }
      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        if (active) setUserLoading(false);
      }
    }
    loadUser();
    return () => {
      active = false;
    };
  }, []);

  // Fetch conversations from database
  const { conversations: dbConversations, loading: convLoading } =
    useConversations(currentUserDbId);
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);

  // Get real-time messages for the active conversation
  const { messages: activeMessages, loading: messagesLoading } =
    useConversationMessages(activeId, currentUserDbId);

  useEffect(() => {
    setConversations(dbConversations);
    if (dbConversations.length > 0 && !activeId) {
      setActiveId(dbConversations[0].id);
    }
  }, [dbConversations, activeId]);

  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [input, setInput] = useState("");
  const fileRef = useRef(null);
  const imgRef = useRef(null);
  const endRef = useRef(null);
  const emojiRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Image preview state
  const [imagePreview, setImagePreview] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [imageCaption, setImageCaption] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [fileCaption, setFileCaption] = useState("");
  const [pendingAttachment, setPendingAttachment] = useState(null); // { file, type, previewUrl, name, size }

  const isImageLike = (nameOrUrl = "", mime = "") => {
    if (mime?.startsWith("image/")) return true;
    return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(nameOrUrl);
  };

  const active = useMemo(() => {
    const conversation = conversations.find((c) => c.id === activeId);
    if (!conversation) return null;

    // Use real-time messages instead of static ones
    return {
      ...conversation,
      messages: activeMessages || [],
    };
  }, [conversations, activeId, activeMessages]);

  const [isMdUp, setIsMdUp] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : true
  );
  const [mobileView, setMobileView] = useState("list");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => setIsMdUp(e.matches);
    mq.addEventListener
      ? mq.addEventListener("change", onChange)
      : mq.addListener(onChange);
    setIsMdUp(mq.matches);
    return () => {
      mq.removeEventListener
        ? mq.removeEventListener("change", onChange)
        : mq.removeListener(onChange);
    };
  }, []);

  useEffect(() => {
    if (isMdUp) setMobileView("thread");
    else setMobileView("list");
  }, [isMdUp]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, active?.messages.length]);

  const filteredConvos = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !showSearch) return active?.messages || [];
    return (active?.messages || []).filter((m) =>
      m.text?.toLowerCase().includes(q)
    );
  }, [active, query, showSearch]);

  const formatTime = (d = new Date()) => {
    try {
      let h = d.getHours();
      const m = d.getMinutes().toString().padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12;
      if (h === 0) h = 12;
      return `${h}:${m} ${ampm}`;
    } catch {
      return "Now";
    }
  };

  const sendMessage = async (text) => {
    console.log("sendMessage called with:", {
      text,
      activeId,
      currentUserDbId,
    });

    if (
      (!text?.trim() && !pendingAttachment) ||
      !activeId ||
      !currentUserDbId
    ) {
      console.log("Missing required data for sending message");
      return;
    }

    try {
      let attachmentFields = {
        attachment_type: null,
        attachment_url: null,
        attachment_name: null,
        attachment_size: null,
      };

      // If a file/image is attached, upload it first
      if (pendingAttachment?.file) {
        const file = pendingAttachment.file;
        const fileExt = file.name.split(".").pop();
        const filePath = `${currentUserDbId}/${activeId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("attachments")
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("attachments")
          .getPublicUrl(filePath);

        attachmentFields = {
          attachment_type: pendingAttachment.type,
          attachment_url: publicUrl?.publicUrl,
          attachment_name: file.name,
          attachment_size: file.size,
        };
      }

      const messageData = {
        conversation_id: activeId,
        sender_id: currentUserDbId,
        content: text.trim(),
        ...attachmentFields,
        is_read: false,
      };

      console.log("Sending message with data:", messageData);

      const { data, error } = await supabase
        .from("dm_messages")
        .insert([messageData]);
      console.log("Message send result:", { data, error });
      if (error) throw error;

      // Update conversation's last_message_at
      const { error: updateError } = await supabase
        .from("dm_conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", activeId);

      console.log("Conversation update result:", { updateError });

      setInput("");
      setShowEmoji(false);
      setPendingAttachment(null);

      console.log("Message sent successfully");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const attachFile = (file) => {
    console.log("attachFile called with:", { file });
    if (!file) return;
    if (isImageLike(file.name, file.type)) {
      // Treat image files as image attachments with inline preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPendingAttachment({
          file,
          type: "image",
          previewUrl: e.target.result,
          name: file.name,
          size: file.size,
        });
      };
      reader.readAsDataURL(file);
      return;
    }
    setPendingAttachment({
      file,
      type: "file",
      previewUrl: null,
      name: file.name,
      size: file.size,
    });
  };

  const sendFileMessage = async () => {
    if (!filePreview || !activeId || !currentUserDbId) return;
    try {
      console.log("Uploading file:", {
        filePreview,
        activeId,
        currentUserDbId,
      });
      const fileExt = filePreview.name.split(".").pop();
      const filePath = `${currentUserDbId}/${activeId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(filePath, filePreview);
      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("attachments")
        .getPublicUrl(filePath);

      const messageData = {
        conversation_id: activeId,
        sender_id: currentUserDbId,
        content: fileCaption.trim(),
        attachment_type: "file",
        attachment_url: publicUrl?.publicUrl,
        attachment_name: filePreview.name,
        attachment_size: filePreview.size,
        is_read: false,
      };

      const { error: msgError } = await supabase
        .from("dm_messages")
        .insert([messageData]);
      if (msgError) throw msgError;

      await supabase
        .from("dm_conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", activeId);

      setFilePreview(null);
      setFileCaption("");
      console.log("File message sent successfully");
    } catch (err) {
      console.error("Error sending file message:", err);
    }
  };

  const attachImage = (file) => {
    console.log("attachImage called with:", { file });
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPendingAttachment({
        file,
        type: "image",
        previewUrl: e.target.result,
        name: file.name,
        size: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  const sendImageMessage = async () => {
    if (!previewFile || !activeId || !currentUserDbId) {
      console.log("Missing required data for image upload");
      return;
    }

    try {
      console.log("Uploading image:", {
        previewFile,
        activeId,
        currentUserDbId,
      });

      // Upload image to storage
      const fileExt = previewFile.name.split(".").pop();
      const filePath = `${currentUserDbId}/${activeId}/${Date.now()}.${fileExt}`;

      console.log("Uploading image to path:", filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(filePath, previewFile);

      console.log("Upload result:", { uploadData, uploadError });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from("attachments")
        .getPublicUrl(filePath);

      console.log("Public URL:", publicUrl);

      // Save message to database with image
      const messageData = {
        conversation_id: activeId,
        sender_id: currentUserDbId,
        content: imageCaption.trim(),
        attachment_type: "image",
        attachment_url: publicUrl?.publicUrl,
        attachment_name: previewFile.name,
        attachment_size: previewFile.size,
        is_read: false,
      };

      console.log("Saving message with data:", messageData);

      const { data: msgData, error: msgError } = await supabase
        .from("dm_messages")
        .insert([messageData]);

      console.log("Message save result:", { msgData, msgError });

      if (msgError) throw msgError;

      // Update conversation's last_message_at
      await supabase
        .from("dm_conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", activeId);

      console.log("Image upload and message save completed successfully");

      // Clear preview
      setImagePreview(null);
      setPreviewFile(null);
      setImageCaption("");
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  const cancelImagePreview = () => {
    setImagePreview(null);
    setPreviewFile(null);
  };

  const emojiList = [
    "😀",
    "😊",
    "😉",
    "😍",
    "👍",
    "👏",
    "🎉",
    "✈️",
    "🏨",
    "📸",
  ];

  useEffect(() => {
    function onClickOutside(e) {
      if (
        showEmoji &&
        emojiRef.current &&
        !emojiRef.current.contains(e.target)
      ) {
        setShowEmoji(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showEmoji]);

  const toggleRecording = async () => {
    try {
      if (!recording) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mr = new MediaRecorder(stream);
        chunksRef.current = [];
        mr.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        mr.onstop = async () => {
          try {
            const blob = new Blob(chunksRef.current, { type: "audio/webm" });

            // Upload audio to storage
            const filePath = `${currentUserDbId}/${activeId}/${Date.now()}.webm`;
            const { error: uploadError } = await supabase.storage
              .from("attachments")
              .upload(filePath, blob);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: publicUrl } = supabase.storage
              .from("attachments")
              .getPublicUrl(filePath);

            // Save message to database with audio
            const { error: msgError } = await supabase
              .from("dm_messages")
              .insert([
                {
                  conversation_id: activeId,
                  sender_id: currentUserDbId,
                  content: "",
                  attachment_type: "audio",
                  attachment_url: publicUrl?.publicUrl,
                  attachment_name: `audio_${Date.now()}.webm`,
                  attachment_size: blob.size,
                  is_read: false,
                },
              ]);

            if (msgError) throw msgError;

            // Update conversation's last_message_at
            await supabase
              .from("dm_conversations")
              .update({ last_message_at: new Date().toISOString() })
              .eq("id", activeId);
          } catch (err) {
            console.error("Error uploading audio:", err);
          }
        };
        mediaRecorderRef.current = mr;
        mr.start();
        setRecording(true);
      } else {
        mediaRecorderRef.current?.stop();
        mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
      }
    } catch (err) {
      console.error("Mic error", err);
      setRecording(false);
    }
  };

  const handleOpenConversation = (id) => {
    setActiveId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  return (
    <>
      <UserHeader />
      <div className="w-full md:px-6 px-4 py-0 pt-4 md:py-[40px]">
        <div className="max-w-[1200px] w-full mx-auto">
          {/* Desktop/Tablet split view */}
          {isMdUp ? (
            <div className="w-full rounded-[16px] overflow-hidden bg-white grid grid-cols-[240px_1fr] lg:grid-cols-[289px_1fr]">
              {/* Left: Conversations */}
              <aside className="bg-[#F0EEEE] p-4 md:p-5">
                <div className="text-[#05162A] text-[18px] font-semibold mb-4">
                  Messages
                </div>
                <div className="space-y-3">
                  {conversations.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleOpenConversation(c.id)}
                      className={`w-full text-left border-b pb-2 border-black/20 transition ${
                        activeId === c.id ? "" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-[32px] h-[32px] rounded-full object-cover bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex flex-col items-start gap-1">
                              <span className="text-[#4399FF] text-[14px] leading-[15px] font-semibold truncate">
                                {c.name}
                              </span>
                              <h3 className="text-[#959595] text-[10px] font-normal max-w-[100px] text-wrap line-clamp-2 truncate">
                                {c.last}
                              </h3>
                            </div>
                            <div className="flex items-end flex-col gap-2">
                              <span className="text-[#BABABA] text-[10px] font-normal">
                                {c.time}
                              </span>
                              {c.unread > 0 ? (
                                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#4399FF] text-white text-[10px] font-normal">
                                  {c.unread}
                                </span>
                              ) : (
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 11 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M7 0.728901C6.52648 0.580177 6.0226 0.5 5.5 0.5C2.73858 0.5 0.5 2.73858 0.5 5.5C0.5 8.26142 2.73858 10.5 5.5 10.5C8.26142 10.5 10.5 8.26142 10.5 5.5C10.5 4.9774 10.4198 4.47352 10.2711 4"
                                    stroke="#4399FF"
                                    stroke-linecap="round"
                                  />
                                  <path
                                    d="M3.75 4.25L5.5 6L10.0001 1"
                                    stroke="#4399FF"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </aside>

              {/* Right: Thread */}
              <section className="relative">
                <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-black/10">
                  <div className="flex items-center gap-3">
                    <img
                      src={active?.avatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover bg-white"
                    />
                    <div>
                      <div className="text-[#4399FF] text-[14px] leading-[20px] font-semibold">
                        {active?.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon title="Search">
                      <svg
                        onClick={() => setShowSearch((v) => !v)}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.55295 17.105C10.4506 17.1046 12.2936 16.4694 13.7884 15.3004L18.4883 20L20 18.4883L15.3002 13.7888C16.4698 12.2938 17.1054 10.4505 17.1059 8.55249C17.1059 3.83686 13.2688 0 8.55295 0C3.83707 0 0 3.83686 0 8.55249C0 13.2681 3.83707 17.105 8.55295 17.105ZM8.55295 2.13812C12.0907 2.13812 14.9677 5.01497 14.9677 8.55249C14.9677 12.09 12.0907 14.9669 8.55295 14.9669C5.01523 14.9669 2.13824 12.09 2.13824 8.55249C2.13824 5.01497 5.01523 2.13812 8.55295 2.13812Z"
                          fill="#BABABA"
                        />
                      </svg>
                    </Icon>
                    <Icon title="Favorite">
                      <svg
                        onClick={() =>
                          setConversations((prev) =>
                            prev.map((c) =>
                              c.id === activeId
                                ? { ...c, favorite: !c.favorite }
                                : c
                            )
                          )
                        }
                        width="20"
                        height="20"
                        viewBox="0 0 24 21"
                        fill={active?.favorite ? "#ef4444" : "none"}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.5 1C3.4629 1 1 3.36095 1 6.27378C1 8.62513 1.9625 14.2057 11.4368 19.8471C11.6065 19.9471 11.8013 20 12 20C12.1987 20 12.3935 19.9471 12.5632 19.8471C22.0375 14.2057 23 8.62513 23 6.27378C23 3.36095 20.5371 1 17.5 1C14.4629 1 12 4.19623 12 4.19623C12 4.19623 9.5371 1 6.5 1Z"
                          stroke="#BABABA"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </Icon>
                    <Icon title="Notifications">
                      <svg
                        onClick={() =>
                          setConversations((prev) =>
                            prev.map((c) =>
                              c.id === activeId
                                ? { ...c, notify: !c.notify }
                                : c
                            )
                          )
                        }
                        width="20"
                        height="20"
                        viewBox="0 0 20 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.7718 17.6344C19.1246 17.0525 18.558 16.3855 18.0872 15.6513C17.5733 14.6378 17.2653 13.531 17.1812 12.3958V9.05238C17.1857 7.26939 16.5443 5.54613 15.3777 4.20638C14.211 2.86662 12.5994 2.0026 10.8456 1.77663V0.903545C10.8456 0.66391 10.7512 0.43409 10.5832 0.264642C10.4152 0.0951948 10.1873 0 9.94967 0C9.71204 0 9.48414 0.0951948 9.31612 0.264642C9.14809 0.43409 9.05369 0.66391 9.05369 0.903545V1.79017C7.31561 2.03242 5.72347 2.90167 4.57217 4.23692C3.42086 5.57217 2.78841 7.28295 2.79195 9.05238V12.3958C2.70789 13.531 2.39985 14.6378 1.88591 15.6513C1.42341 16.3839 0.865903 17.0508 0.228188 17.6344C0.156598 17.6978 0.0992224 17.7759 0.0598775 17.8634C0.0205325 17.9509 0.000120669 18.0459 0 18.142V19.0624C0 19.2419 0.0707093 19.4141 0.196573 19.541C0.322436 19.6679 0.493143 19.7393 0.671141 19.7393H19.3289C19.5069 19.7393 19.6776 19.6679 19.8034 19.541C19.9293 19.4141 20 19.2419 20 19.0624V18.142C19.9999 18.0459 19.9795 17.9509 19.9401 17.8634C19.9008 17.7759 19.8434 17.6978 19.7718 17.6344ZM1.39597 18.3856C2.02041 17.7773 2.5702 17.0956 3.03356 16.3552C3.68095 15.1312 4.05868 13.7806 4.14094 12.3958V9.05238C4.11432 8.25918 4.24626 7.46868 4.52889 6.72797C4.81152 5.98726 5.23907 5.31148 5.78607 4.74087C6.33308 4.17026 6.98835 3.71649 7.71287 3.40659C8.4374 3.09668 9.21635 2.93697 10.0034 2.93697C10.7904 2.93697 11.5693 3.09668 12.2938 3.40659C13.0184 3.71649 13.6736 4.17026 14.2206 4.74087C14.7676 5.31148 15.1952 5.98726 15.4778 6.72797C15.7605 7.46868 15.8924 8.25918 15.8658 9.05238V12.3958C15.948 13.7806 16.3258 15.1312 16.9732 16.3552C17.4365 17.0956 17.9863 17.7773 18.6107 18.3856H1.39597Z"
                          fill="#BABABA"
                        />
                        <path
                          d="M10.0335 21.9998C10.4563 21.99 10.862 21.8297 11.1789 21.5473C11.4958 21.2649 11.7034 20.8786 11.7651 20.4567H8.23486C8.29827 20.89 8.51562 21.2854 8.84648 21.5693C9.17733 21.8531 9.59917 22.0061 10.0335 21.9998Z"
                          fill="#BABABA"
                        />
                      </svg>
                    </Icon>
                  </div>
                </div>

                {showSearch && (
                  <div className="px-4 md:px-6 py-3 border-b border-black/10">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search in conversation..."
                      className="w-full border border-black/10 rounded-lg px-4 py-2 text-[16px] outline-none"
                    />
                  </div>
                )}

                <div className="h-[520px] md:h-[560px] overflow-y-auto px-4 md:px-6 py-4 space-y-4">
                  {filteredConvos.map((m, idx) => (
                    <div key={m.id}>
                      {m.time === "Yesterday" &&
                        (idx === 0 ||
                          filteredConvos[idx - 1]?.time !== "Yesterday") && (
                          <DayDivider label="Yesterday" />
                        )}
                      <Bubble
                        side={m.author}
                        avatar={
                          m.author === "me"
                            ? currentUserAvatar || "/assets/u3.jpg"
                            : active?.avatar
                        }
                      >
                        {(m.image ||
                          (m.file && isImageLike(m.fileName || m.file))) && (
                          <img
                            src={m.image || m.file}
                            alt="attachment"
                            className="rounded-md max-w-[240px] mb-2"
                          />
                        )}
                        {m.audio && (
                          <audio
                            controls
                            src={m.audio}
                            className="max-w-[260px] mb-2"
                          />
                        )}
                        {!m.image &&
                          m.file &&
                          !isImageLike(m.fileName || m.file) && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg max-w-[260px] mb-2">
                              <div className="flex-shrink-0">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
                                    fill="#699BF7"
                                  />
                                  <path d="M14 2V8H20" fill="#ffffff" />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {m.fileName || "File"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {m.fileSize
                                    ? `${(m.fileSize / 1024).toFixed(1)} KB`
                                    : ""}
                                </p>
                              </div>
                              <a
                                href={m.file}
                                download
                                className="flex-shrink-0 text-blue-500 hover:text-blue-700"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                                </svg>
                              </a>
                            </div>
                          )}
                        {m.text && (
                          <div className="whitespace-pre-wrap">{m.text}</div>
                        )}
                      </Bubble>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>

                {/* Composer */}
                <div className="bg-[#DCE8FF] px-3 lg:px-4 py-4 flex items-center gap-2.5">
                  <div className="w-full bg-white rounded-[30px] h-[auto] min-h-[48px] flex items-center gap-3 px-2 lg:px-3 py-2 overflow-visible">
                    <button
                      type="button"
                      onClick={toggleRecording}
                      title={recording ? "Stop recording" : "Start recording"}
                      className={`inline-flex items-center justify-center rounded-full ${
                        recording ? "bg-[#ffefef]" : ""
                      }`}
                    >
                      {recording ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="w-5 h-5 text-red-500"
                        >
                          <rect
                            x="8"
                            y="8"
                            width="8"
                            height="8"
                            rx="1.5"
                            fill="currentColor"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="24"
                          height="26"
                          viewBox="0 0 20 31"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 12.5938C1.26522 12.5938 1.51957 12.6958 1.70711 12.8775C1.89464 13.0592 2 13.3056 2 13.5625V15.5C2 17.5554 2.84285 19.5267 4.34315 20.9801C5.84344 22.4335 7.87827 23.25 10 23.25C12.1217 23.25 14.1566 22.4335 15.6569 20.9801C17.1571 19.5267 18 17.5554 18 15.5V13.5625C18 13.3056 18.1054 13.0592 18.2929 12.8775C18.4804 12.6958 18.7348 12.5938 19 12.5938C19.2652 12.5938 19.5196 12.6958 19.7071 12.8775C19.8946 13.0592 20 13.3056 20 13.5625V15.5C20 17.9016 19.0792 20.2176 17.4162 21.9986C15.7533 23.7797 13.4666 24.8989 11 25.1391V29.0625H17C17.2652 29.0625 17.5196 29.1646 17.7071 29.3462C17.8946 29.5279 18 29.7743 18 30.0312C18 30.2882 17.8946 30.5346 17.7071 30.7163C17.5196 30.8979 17.2652 31 17 31H3C2.73478 31 2.48043 30.8979 2.29289 30.7163C2.10536 30.5346 2 30.2882 2 30.0312C2 29.7743 2.10536 29.5279 2.29289 29.3462C2.48043 29.1646 2.73478 29.0625 3 29.0625H9V25.1391C6.53337 24.8989 4.24675 23.7797 2.58376 21.9986C0.920768 20.2176 -3.11433e-05 17.9016 7.90012e-10 15.5V13.5625C7.90012e-10 13.3056 0.105357 13.0592 0.292893 12.8775C0.48043 12.6958 0.734784 12.5938 1 12.5938Z"
                            fill="#699BF7"
                          />
                          <path
                            d="M14 15.5C14 16.5277 13.5786 17.5133 12.8284 18.24C12.0783 18.9667 11.0609 19.375 10 19.375C8.93913 19.375 7.92172 18.9667 7.17157 18.24C6.42143 17.5133 6 16.5277 6 15.5V5.8125C6 4.78479 6.42143 3.79916 7.17157 3.07246C7.92172 2.34576 8.93913 1.9375 10 1.9375C11.0609 1.9375 12.0783 2.34576 12.8284 3.07246C13.5786 3.79916 14 4.78479 14 5.8125V15.5ZM10 0C8.4087 0 6.88258 0.612387 5.75736 1.70244C4.63214 2.7925 4 4.27093 4 5.8125V15.5C4 17.0416 4.63214 18.52 5.75736 19.6101C6.88258 20.7001 8.4087 21.3125 10 21.3125C11.5913 21.3125 13.1174 20.7001 14.2426 19.6101C15.3679 18.52 16 17.0416 16 15.5V5.8125C16 4.27093 15.3679 2.7925 14.2426 1.70244C13.1174 0.612387 11.5913 0 10 0V0Z"
                            fill="#699BF7"
                          />
                        </svg>
                      )}
                    </button>
                    {pendingAttachment && (
                      <div className="flex items-center gap-2 bg-[#F3F6FF] border border-[#DCE8FF] rounded-[10px] px-2 py-1 max-w-[60%]">
                        {pendingAttachment.type === "image" &&
                        pendingAttachment.previewUrl ? (
                          <img
                            src={pendingAttachment.previewUrl}
                            alt="preview"
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
                              fill="#699BF7"
                            />
                            <path d="M14 2V8H20" fill="#ffffff" />
                          </svg>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate max-w-[160px]">
                            {pendingAttachment.name}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {(pendingAttachment.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <button
                          onClick={() => setPendingAttachment(null)}
                          className="ml-1 inline-flex items-center justify-center w-6 h-6 rounded-full hover:bg-black/5"
                          title="Remove"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18 6L6 18"
                              stroke="#6b7280"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M6 6L18 18"
                              stroke="#6b7280"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(input);
                        }
                      }}
                      placeholder="Write something..."
                      className="flex-1 min-w-0 placeholder:text-[#CDCDCD] outline-none px-2 py-3 text-[16px]"
                    />
                    <input
                      ref={fileRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => attachFile(e.target.files?.[0])}
                    />
                    <input
                      ref={imgRef}
                      accept="image/*"
                      type="file"
                      className="hidden"
                      onChange={(e) => attachImage(e.target.files?.[0])}
                    />
                    <Icon title="Attach file">
                      <svg
                        onClick={() => fileRef.current?.click()}
                        width="24"
                        height="24"
                        viewBox="0 0 25 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.6862 9.58182L15.8737 7.68054L6.81118 17.1945C6.45426 17.5693 6.17117 18.0144 5.97805 18.5042C5.78493 18.9939 5.68558 19.5188 5.68566 20.0489C5.68575 20.579 5.78526 21.1039 5.97853 21.5936C6.1718 22.0833 6.45504 22.5282 6.81207 22.903C7.1691 23.2778 7.59294 23.575 8.05938 23.7778C8.52582 23.9806 9.02573 24.0849 9.53057 24.0848C10.0354 24.0847 10.5353 23.9802 11.0017 23.7773C11.468 23.5744 11.8918 23.2769 12.2487 22.9021L23.1237 11.485C24.3253 10.2231 25.0002 8.51174 25 6.72736C24.9998 4.94298 24.3246 3.23175 23.1228 1.97012C21.9211 0.708499 20.2912 -0.000175786 18.5918 3.27069e-08C16.8924 0.000175851 15.2627 0.709187 14.0612 1.97106L2.64331 13.9581L2.61831 13.9825C-0.87277 17.6482 -0.87277 23.5883 2.61831 27.2521C6.10939 30.916 11.7665 30.916 15.2576 27.2521L15.2808 27.2259L15.2826 27.2278L23.0773 19.0451L21.2648 17.1438L13.4701 25.3246L13.4469 25.349C12.2507 26.6025 10.6298 27.3065 8.93976 27.3065C7.24975 27.3065 5.62879 26.6025 4.4326 25.349C3.83967 24.725 3.36987 23.9843 3.05012 23.1693C2.73038 22.3544 2.56698 21.4811 2.56931 20.5997C2.57163 19.7183 2.73962 18.846 3.06366 18.0329C3.38769 17.2198 3.86139 16.4818 4.4576 15.8613L4.45581 15.8594L15.8755 3.87234C17.3737 2.29732 19.813 2.29732 21.313 3.87234C22.813 5.44737 22.8112 8.00679 21.313 9.57995L10.438 20.997C10.1946 21.2321 9.87414 21.3593 9.54354 21.3522C9.21293 21.345 8.89775 21.204 8.66381 20.9586C8.42987 20.7132 8.29527 20.3824 8.28813 20.0353C8.28098 19.6881 8.40185 19.3515 8.62547 19.0957L17.688 9.57995L17.6862 9.58182Z"
                          fill="#699BF7"
                        />
                      </svg>
                    </Icon>
                    <Icon title="Image">
                      <svg
                        onClick={() => imgRef.current?.click()}
                        width="30"
                        height="30"
                        viewBox="0 0 40 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M38.5714 30H1.42857C1.04969 30 0.686328 29.8563 0.418419 29.6006C0.15051 29.3449 0 28.998 0 28.6364V5.45455C0 5.09289 0.15051 4.74604 0.418419 4.49031C0.686328 4.23458 1.04969 4.09091 1.42857 4.09091H10.6571L13.1 0.613636C13.2294 0.426053 13.4054 0.271887 13.6122 0.164836C13.8191 0.0577843 14.0504 0.00116198 14.2857 0H25.7143C25.9496 0.00116198 26.1809 0.0577843 26.3878 0.164836C26.5946 0.271887 26.7706 0.426053 26.9 0.613636L29.3429 4.09091H38.5714C38.9503 4.09091 39.3137 4.23458 39.5816 4.49031C39.8495 4.74604 40 5.09289 40 5.45455V28.6364C40 28.998 39.8495 29.3449 39.5816 29.6006C39.3137 29.8563 38.9503 30 38.5714 30ZM2.85714 27.2727H37.1429V6.81818H28.5714C28.3361 6.81702 28.1048 6.7604 27.8979 6.65335C27.6911 6.5463 27.5151 6.39213 27.3857 6.20455L24.9429 2.72727H15.0571L12.6143 6.20455C12.4849 6.39213 12.3089 6.5463 12.1021 6.65335C11.8952 6.7604 11.6639 6.81702 11.4286 6.81818H2.85714V27.2727Z"
                          fill="#699BF7"
                        />
                        <path
                          d="M20.0001 24.5455C18.3049 24.5455 16.6477 24.0656 15.2381 23.1666C13.8285 22.2675 12.7299 20.9897 12.0812 19.4947C11.4324 17.9997 11.2627 16.3546 11.5934 14.7675C11.9241 13.1803 12.7405 11.7225 13.9392 10.5782C15.138 9.43398 16.6652 8.65474 18.3279 8.33904C19.9906 8.02334 21.7141 8.18537 23.2803 8.80463C24.8465 9.42389 26.1852 10.4726 27.127 11.8181C28.0689 13.1636 28.5716 14.7454 28.5716 16.3636C28.5716 18.5336 27.6685 20.6147 26.0611 22.1491C24.4536 23.6835 22.2734 24.5455 20.0001 24.5455ZM20.0001 10.9091C18.87 10.9091 17.7652 11.229 16.8255 11.8284C15.8857 12.4277 15.1533 13.2796 14.7208 14.2763C14.2883 15.273 14.1752 16.3697 14.3957 17.4278C14.6161 18.4859 15.1604 19.4578 15.9595 20.2206C16.7587 20.9834 17.7769 21.5029 18.8853 21.7134C19.9938 21.9238 21.1428 21.8158 22.1869 21.403C23.2311 20.9901 24.1235 20.291 24.7514 19.394C25.3793 18.497 25.7144 17.4425 25.7144 16.3636C25.7144 14.917 25.1124 13.5296 24.0408 12.5067C22.9691 11.4838 21.5157 10.9091 20.0001 10.9091Z"
                          fill="#699BF7"
                        />
                      </svg>
                    </Icon>
                    <div className="relative">
                      <Icon title="Emoji">
                        <svg
                          onClick={() => setShowEmoji((v) => !v)}
                          width="26"
                          height="26"
                          viewBox="0 0 30 30"
                          className="mt-1"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M6.64479 2.59084C8.27653 1.47979 10.1118 0.703185 12.0449 0.305827C13.9779 -0.0915311 15.9704 -0.101778 17.9074 0.275678C19.8444 0.653134 21.6876 1.41082 23.3307 2.50504C24.9737 3.59925 26.3841 5.00833 27.4805 6.651C28.5769 8.29367 29.3376 10.1374 29.7186 12.0759C30.0997 14.0144 30.0936 16.0092 29.7008 17.9453C29.3079 19.8814 28.5361 21.7205 27.4297 23.3564C26.3234 24.9924 24.9044 26.3928 23.2548 27.477C19.9585 29.6825 15.9221 30.4867 12.0336 29.7126C8.14508 28.9386 4.72296 26.6497 2.52005 23.3496C0.31715 20.0495 -0.486085 16.0085 0.287052 12.1154C1.06019 8.2224 3.34637 4.79631 6.64265 2.59084H6.64479ZM7.83213 25.7004C9.23102 26.6467 10.8029 27.3069 12.4575 27.643C14.112 27.9791 15.8167 27.9846 17.4733 27.6591C19.13 27.3335 20.7061 26.6834 22.111 25.7461C23.5159 24.8088 24.722 23.6028 25.6598 22.1973C26.5977 20.7919 27.2489 19.2147 27.5759 17.5565C27.903 15.8982 27.8995 14.1916 27.5657 12.5348C27.2319 10.8779 26.5743 9.30341 25.6307 7.90179C24.6871 6.50018 23.4762 5.29908 22.0674 4.36751C19.2416 2.49886 15.7918 1.82623 12.4721 2.49666C9.15233 3.16708 6.23273 5.12603 4.35145 7.94529C2.47017 10.7646 1.78024 14.2148 2.43247 17.5419C3.0847 20.8689 5.02604 23.8021 7.83213 25.7004ZM11.7465 12.8959C11.7465 13.463 11.5215 14.0068 11.121 14.4077C10.7206 14.8087 10.1774 15.0339 9.611 15.0339C9.04463 15.0339 8.50146 14.8087 8.10097 14.4077C7.70049 14.0068 7.4755 13.463 7.4755 12.8959C7.4755 12.3289 7.70049 11.7851 8.10097 11.3842C8.50146 10.9832 9.04463 10.758 9.611 10.758C10.1774 10.758 10.7206 10.9832 11.121 11.3842C11.5215 11.7851 11.7465 12.3289 11.7465 12.8959ZM22.4241 12.8959C22.4241 13.463 22.1991 14.0068 21.7986 14.4077C21.3981 14.8087 20.8549 15.0339 20.2885 15.0339C19.7222 15.0339 19.179 14.8087 18.7785 14.4077C18.378 14.0068 18.153 13.463 18.153 12.8959C18.153 12.3289 18.378 11.7851 18.7785 11.3842C19.179 10.9832 19.7222 10.758 20.2885 10.758C20.8549 10.758 21.3981 10.9832 21.7986 11.3842C22.1991 11.7851 22.4241 12.3289 22.4241 12.8959ZM14.9498 21.4479C13.7894 21.4507 12.65 21.138 11.6532 20.543C10.6565 19.9481 9.83994 19.0933 9.29068 18.0699L7.43279 19.0961C8.18053 20.4815 9.2958 21.6332 10.6557 22.4244C12.0156 23.2157 13.5672 23.6156 15.1397 23.5802C16.7121 23.5449 18.2443 23.0755 19.5673 22.2239C20.8903 21.3724 21.9528 20.1716 22.6376 18.754L20.7156 17.8347C20.1903 18.9182 19.371 19.8317 18.3513 20.4707C17.3316 21.1097 16.1528 21.4484 14.9498 21.4479Z"
                            fill="#699BF7"
                          />
                        </svg>
                      </Icon>
                      {showEmoji && (
                        <div
                          ref={emojiRef}
                          className="absolute bottom-12 right-0 z-20 w-[220px] max-h-[200px] overflow-auto bg-white border border-black/30 rounded-lg p-2 grid grid-cols-6 gap-1"
                        >
                          {emojiList.map((e) => (
                            <button
                              key={e}
                              className="text-[18px] leading-none p-1 hover:bg-black/5 rounded"
                              onClick={() => setInput((v) => v + e)}
                            >
                              {e}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => sendMessage(input)}
                    className="bg-[#4399FF] hover:bg-[#3b6cf1] transition-all duration-300 text-white rounded-full w-[45px] h-[45px] flex items-center justify-center shrink-0"
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 31 31"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.7987 15.8135L4.82599 17.8081C4.68834 17.8311 4.55917 17.8899 4.45146 17.9786C4.34375 18.0673 4.26131 18.1829 4.21241 18.3135L0.0842631 29.372C-0.309954 30.3892 0.753478 31.3587 1.72948 30.8692L30.342 16.5653C30.5398 16.4662 30.706 16.314 30.8222 16.1258C30.9385 15.9376 31 15.7208 31 15.4996C31 15.2785 30.9385 15.0617 30.8222 14.8735C30.706 14.6853 30.5398 14.5331 30.342 14.434L1.72948 0.130099C0.753478 -0.357823 -0.309954 0.611664 0.0842631 1.62724L4.214 12.6857C4.2629 12.8164 4.34534 12.9319 4.45305 13.0207C4.56076 13.1094 4.68993 13.1682 4.82758 13.1912L16.8003 15.1858C16.875 15.1977 16.943 15.2358 16.9921 15.2934C17.0412 15.3509 17.0681 15.424 17.0681 15.4996C17.0681 15.5753 17.0412 15.6484 16.9921 15.7059C16.943 15.7635 16.875 15.8016 16.8003 15.8135H16.7987Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
              </section>
            </div>
          ) : (
            // Mobile: step views
            <div className="w-full rounded-[12px] overflow-hidden border border-black/10 bg-white">
              {mobileView === "list" && (
                <aside className="bg-[#F0EEEE] p-4">
                  <div className="text-[#05162A] text-[18px] font-semibold mb-4">
                    Messages
                  </div>
                  <div className="space-y-3">
                    {conversations.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          handleOpenConversation(c.id);
                          setMobileView("thread");
                        }}
                        className={`w-full text-left rounded-lg pl-3 pr-4 py-3 bg-white hover:bg-white transition`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-10 h-10 rounded-full object-cover bg-white"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex flex-col items-start gap-1">
                                <span className="text-[#4399FF] text-[14px] leading-[15px] font-semibold truncate">
                                  {c.name}
                                </span>
                                <h3 className="text-[#959595] text-[10px] font-normal max-w-[100px] text-wrap line-clamp-2 truncate">
                                  {c.last}
                                </h3>
                              </div>
                              <div className="flex items-end flex-col gap-2">
                                <span className="text-[#BABABA] text-[10px] font-normal">
                                  {c.time}
                                </span>
                                {c.unread > 0 ? (
                                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#4399FF] text-white text-[10px] font-normal">
                                    {c.unread}
                                  </span>
                                ) : (
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 11 11"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M7 0.728901C6.52648 0.580177 6.0226 0.5 5.5 0.5C2.73858 0.5 0.5 2.73858 0.5 5.5C0.5 8.26142 2.73858 10.5 5.5 10.5C8.26142 10.5 10.5 8.26142 10.5 5.5C10.5 4.9774 10.4198 4.47352 10.2711 4"
                                      stroke="#4399FF"
                                      stroke-linecap="round"
                                    />
                                    <path
                                      d="M3.75 4.25L5.5 6L10.0001 1"
                                      stroke="#4399FF"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </aside>
              )}
              {mobileView === "thread" && (
                <section className="relative">
                  <div className="flex items-center justify-between px-3 py-3 border-b border-black/10">
                    <div className="flex items-center gap-0">
                      <button
                        onClick={() => setMobileView("list")}
                        className="mr-1 inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="w-5 h-5 text-[#1B2B5D]"
                        >
                          <path
                            d="M15 19l-7-7 7-7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div className="flex items-center gap-2.5">
                        <img
                          src={active?.avatar}
                          alt="avatar"
                          className="w-9 h-9 rounded-full object-cover bg-white"
                        />
                        <div>
                          <div className="text-[#1B2B5D] text-[14px] font-semibold">
                            {active?.name}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon title="Search">
                        <svg
                          onClick={() => setShowSearch((v) => !v)}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.55295 17.105C10.4506 17.1046 12.2936 16.4694 13.7884 15.3004L18.4883 20L20 18.4883L15.3002 13.7888C16.4698 12.2938 17.1054 10.4505 17.1059 8.55249C17.1059 3.83686 13.2688 0 8.55295 0C3.83707 0 0 3.83686 0 8.55249C0 13.2681 3.83707 17.105 8.55295 17.105ZM8.55295 2.13812C12.0907 2.13812 14.9677 5.01497 14.9677 8.55249C14.9677 12.09 12.0907 14.9669 8.55295 14.9669C5.01523 14.9669 2.13824 12.09 2.13824 8.55249C2.13824 5.01497 5.01523 2.13812 8.55295 2.13812Z"
                            fill="#BABABA"
                          />
                        </svg>
                      </Icon>
                      <Icon title="Favorite">
                        <svg
                          onClick={() =>
                            setConversations((prev) =>
                              prev.map((c) =>
                                c.id === activeId
                                  ? { ...c, favorite: !c.favorite }
                                  : c
                              )
                            )
                          }
                          width="20"
                          height="20"
                          viewBox="0 0 24 21"
                          fill={active?.favorite ? "#ef4444" : "none"}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.5 1C3.4629 1 1 3.36095 1 6.27378C1 8.62513 1.9625 14.2057 11.4368 19.8471C11.6065 19.9471 11.8013 20 12 20C12.1987 20 12.3935 19.9471 12.5632 19.8471C22.0375 14.2057 23 8.62513 23 6.27378C23 3.36095 20.5371 1 17.5 1C14.4629 1 12 4.19623 12 4.19623C12 4.19623 9.5371 1 6.5 1Z"
                            stroke="#BABABA"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Icon>
                      <Icon title="Notifications">
                        <svg
                          onClick={() =>
                            setConversations((prev) =>
                              prev.map((c) =>
                                c.id === activeId
                                  ? { ...c, notify: !c.notify }
                                  : c
                              )
                            )
                          }
                          width="20"
                          height="20"
                          viewBox="0 0 20 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19.7718 17.6344C19.1246 17.0525 18.558 16.3855 18.0872 15.6513C17.5733 14.6378 17.2653 13.531 17.1812 12.3958V9.05238C17.1857 7.26939 16.5443 5.54613 15.3777 4.20638C14.211 2.86662 12.5994 2.0026 10.8456 1.77663V0.903545C10.8456 0.66391 10.7512 0.43409 10.5832 0.264642C10.4152 0.0951948 10.1873 0 9.94967 0C9.71204 0 9.48414 0.0951948 9.31612 0.264642C9.14809 0.43409 9.05369 0.66391 9.05369 0.903545V1.79017C7.31561 2.03242 5.72347 2.90167 4.57217 4.23692C3.42086 5.57217 2.78841 7.28295 2.79195 9.05238V12.3958C2.70789 13.531 2.39985 14.6378 1.88591 15.6513C1.42341 16.3839 0.865903 17.0508 0.228188 17.6344C0.156598 17.6978 0.0992224 17.7759 0.0598775 17.8634C0.0205325 17.9509 0.000120669 18.0459 0 18.142V19.0624C0 19.2419 0.0707093 19.4141 0.196573 19.541C0.322436 19.6679 0.493143 19.7393 0.671141 19.7393H19.3289C19.5069 19.7393 19.6776 19.6679 19.8034 19.541C19.9293 19.4141 20 19.2419 20 19.0624V18.142C19.9999 18.0459 19.9795 17.9509 19.9401 17.8634C19.9008 17.7759 19.8434 17.6978 19.7718 17.6344ZM1.39597 18.3856C2.02041 17.7773 2.5702 17.0956 3.03356 16.3552C3.68095 15.1312 4.05868 13.7806 4.14094 12.3958V9.05238C4.11432 8.25918 4.24626 7.46868 4.52889 6.72797C4.81152 5.98726 5.23907 5.31148 5.78607 4.74087C6.33308 4.17026 6.98835 3.71649 7.71287 3.40659C8.4374 3.09668 9.21635 2.93697 10.0034 2.93697C10.7904 2.93697 11.5693 3.09668 12.2938 3.40659C13.0184 3.71649 13.6736 4.17026 14.2206 4.74087C14.7676 5.31148 15.1952 5.98726 15.4778 6.72797C15.7605 7.46868 15.8924 8.25918 15.8658 9.05238V12.3958C15.948 13.7806 16.3258 15.1312 16.9732 16.3552C17.4365 17.0956 17.9863 17.7773 18.6107 18.3856H1.39597Z"
                            fill="#BABABA"
                          />
                          <path
                            d="M10.0335 21.9998C10.4563 21.99 10.862 21.8297 11.1789 21.5473C11.4958 21.2649 11.7034 20.8786 11.7651 20.4567H8.23486C8.29827 20.89 8.51562 21.2854 8.84648 21.5693C9.17733 21.8531 9.59917 22.0061 10.0335 21.9998Z"
                            fill="#BABABA"
                          />
                        </svg>
                      </Icon>
                    </div>
                  </div>

                  {showSearch && (
                    <div className="px-3 py-3 border-b border-black/10">
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search in conversation..."
                        className="w-full border border-black/10 rounded-lg px-4 py-2 text-[14px] outline-none"
                      />
                    </div>
                  )}

                  <div className="h-[70vh] overflow-y-auto px-4 py-4 space-y-3">
                    {filteredConvos.map((m, idx) => (
                      <div key={m.id}>
                        {m.time === "Yesterday" &&
                          (idx === 0 ||
                            filteredConvos[idx - 1]?.time !== "Yesterday") && (
                            <DayDivider label="Yesterday" />
                          )}
                        <Bubble
                          side={m.author}
                          avatar={
                            m.author === "me"
                              ? currentUserAvatar || "/assets/u3.jpg"
                              : active?.avatar
                          }
                        >
                          {(m.image ||
                            (m.file && isImageLike(m.fileName || m.file))) && (
                            <img
                              src={m.image || m.file}
                              alt="attachment"
                              className="rounded-md max-w-[240px] mb-2"
                            />
                          )}
                          {m.audio && (
                            <audio
                              controls
                              src={m.audio}
                              className="max-w-[260px] mb-2"
                            />
                          )}
                          {!m.image &&
                            m.file &&
                            !isImageLike(m.fileName || m.file) && (
                              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg max-w-[260px] mb-2">
                                <div className="flex-shrink-0">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
                                      fill="#699BF7"
                                    />
                                    <path d="M14 2V8H20" fill="#ffffff" />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-900 truncate">
                                    {m.fileName || "File"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {m.fileSize
                                      ? `${(m.fileSize / 1024).toFixed(1)} KB`
                                      : ""}
                                  </p>
                                </div>
                                <a
                                  href={m.file}
                                  download
                                  className="flex-shrink-0 text-blue-500 hover:text-blue-700"
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                                  </svg>
                                </a>
                              </div>
                            )}
                          {m.text && (
                            <div className="whitespace-pre-wrap">{m.text}</div>
                          )}
                        </Bubble>
                      </div>
                    ))}
                    <div ref={endRef} />
                  </div>

                  <div className="bg-[#DDE8FF] px-2 py-2 sticky bottom-0 z-10">
                    <div className="bg-white rounded-md flex items-center justify-between gap-0 px-1 pr-1.5 overflow-visible">
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={toggleRecording}
                          title={
                            recording ? "Stop recording" : "Start recording"
                          }
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                            recording ? "bg-[#ffefef]" : "hover:bg-black/5"
                          }`}
                        >
                          {recording ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="w-5 h-5 text-red-500"
                            >
                              <rect
                                x="8"
                                y="8"
                                width="8"
                                height="8"
                                rx="1.5"
                                fill="currentColor"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="w-5 h-5 text-[#1B2B5D]"
                            >
                              <rect
                                x="9"
                                y="2"
                                width="6"
                                height="12"
                                rx="3"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <path
                                d="M5 11v1a7 7 0 0 0 14 0v-1"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <path
                                d="M12 19v3"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                            </svg>
                          )}
                        </button>
                        <input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage(input);
                            }
                          }}
                          placeholder="Write something..."
                          className="flex-1 min-w-0 max-w-[150px] outline-none px-1 py-3 text-[14px]"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          ref={fileRef}
                          type="file"
                          className="hidden"
                          onChange={(e) => attachFile(e.target.files?.[0])}
                        />
                        {pendingAttachment && (
                          <div className="mr-2 flex items-center gap-2 bg-[#F3F6FF] border border-[#DCE8FF] rounded px-2 py-1">
                            {pendingAttachment.type === "image" &&
                            pendingAttachment.previewUrl ? (
                              <img
                                src={pendingAttachment.previewUrl}
                                alt="preview"
                                className="w-8 h-8 rounded object-cover"
                              />
                            ) : (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
                                  fill="#699BF7"
                                />
                                <path d="M14 2V8H20" fill="#ffffff" />
                              </svg>
                            )}
                            <p className="text-[10px] text-gray-700 max-w-[120px] truncate">
                              {pendingAttachment.name}
                            </p>
                            <button
                              onClick={() => setPendingAttachment(null)}
                              className="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-black/5"
                              title="Remove"
                            >
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M18 6L6 18"
                                  stroke="#6b7280"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M6 6L18 18"
                                  stroke="#6b7280"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                        <input
                          ref={imgRef}
                          accept="image/*"
                          type="file"
                          className="hidden"
                          onChange={(e) => attachImage(e.target.files?.[0])}
                        />
                        <Icon title="Attach file">
                          <svg
                            onClick={() => fileRef.current?.click()}
                            width="18"
                            height="18"
                            viewBox="0 0 25 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M17.6862 9.58182L15.8737 7.68054L6.81118 17.1945C6.45426 17.5693 6.17117 18.0144 5.97805 18.5042C5.78493 18.9939 5.68558 19.5188 5.68566 20.0489C5.68575 20.579 5.78526 21.1039 5.97853 21.5936C6.1718 22.0833 6.45504 22.5282 6.81207 22.903C7.1691 23.2778 7.59294 23.575 8.05938 23.7778C8.52582 23.9806 9.02573 24.0849 9.53057 24.0848C10.0354 24.0847 10.5353 23.9802 11.0017 23.7773C11.468 23.5744 11.8918 23.2769 12.2487 22.9021L23.1237 11.485C24.3253 10.2231 25.0002 8.51174 25 6.72736C24.9998 4.94298 24.3246 3.23175 23.1228 1.97012C21.9211 0.708499 20.2912 -0.000175786 18.5918 3.27069e-08C16.8924 0.000175851 15.2627 0.709187 14.0612 1.97106L2.64331 13.9581L2.61831 13.9825C-0.87277 17.6482 -0.87277 23.5883 2.61831 27.2521C6.10939 30.916 11.7665 30.916 15.2576 27.2521L15.2808 27.2259L15.2826 27.2278L23.0773 19.0451L21.2648 17.1438L13.4701 25.3246L13.4469 25.349C12.2507 26.6025 10.6298 27.3065 8.93976 27.3065C7.24975 27.3065 5.62879 26.6025 4.4326 25.349C3.83967 24.725 3.36987 23.9843 3.05012 23.1693C2.73038 22.3544 2.56698 21.4811 2.56931 20.5997C2.57163 19.7183 2.73962 18.846 3.06366 18.0329C3.38769 17.2198 3.86139 16.4818 4.4576 15.8613L4.45581 15.8594L15.8755 3.87234C17.3737 2.29732 19.813 2.29732 21.313 3.87234C22.813 5.44737 22.8112 8.00679 21.313 9.57995L10.438 20.997C10.1946 21.2321 9.87414 21.3593 9.54354 21.3522C9.21293 21.345 8.89775 21.204 8.66381 20.9586C8.42987 20.7132 8.29527 20.3824 8.28813 20.0353C8.28098 19.6881 8.40185 19.3515 8.62547 19.0957L17.688 9.57995L17.6862 9.58182Z"
                              fill="#699BF7"
                            />
                          </svg>
                        </Icon>
                        <Icon title="Image">
                          <svg
                            onClick={() => imgRef.current?.click()}
                            width="20"
                            height="20"
                            viewBox="0 0 40 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M38.5714 30H1.42857C1.04969 30 0.686328 29.8563 0.418419 29.6006C0.15051 29.3449 0 28.998 0 28.6364V5.45455C0 5.09289 0.15051 4.74604 0.418419 4.49031C0.686328 4.23458 1.04969 4.09091 1.42857 4.09091H10.6571L13.1 0.613636C13.2294 0.426053 13.4054 0.271887 13.6122 0.164836C13.8191 0.0577843 14.0504 0.00116198 14.2857 0H25.7143C25.9496 0.00116198 26.1809 0.0577843 26.3878 0.164836C26.5946 0.271887 26.7706 0.426053 26.9 0.613636L29.3429 4.09091H38.5714C38.9503 4.09091 39.3137 4.23458 39.5816 4.49031C39.8495 4.74604 40 5.09289 40 5.45455V28.6364C40 28.998 39.8495 29.3449 39.5816 29.6006C39.3137 29.8563 38.9503 30 38.5714 30ZM2.85714 27.2727H37.1429V6.81818H28.5714C28.3361 6.81702 28.1048 6.7604 27.8979 6.65335C27.6911 6.5463 27.5151 6.39213 27.3857 6.20455L24.9429 2.72727H15.0571L12.6143 6.20455C12.4849 6.39213 12.3089 6.5463 12.1021 6.65335C11.8952 6.7604 11.6639 6.81702 11.4286 6.81818H2.85714V27.2727Z"
                              fill="#699BF7"
                            />
                            <path
                              d="M20.0001 24.5455C18.3049 24.5455 16.6477 24.0656 15.2381 23.1666C13.8285 22.2675 12.7299 20.9897 12.0812 19.4947C11.4324 17.9997 11.2627 16.3546 11.5934 14.7675C11.9241 13.1803 12.7405 11.7225 13.9392 10.5782C15.138 9.43398 16.6652 8.65474 18.3279 8.33904C19.9906 8.02334 21.7141 8.18537 23.2803 8.80463C24.8465 9.42389 26.1852 10.4726 27.127 11.8181C28.0689 13.1636 28.5716 14.7454 28.5716 16.3636C28.5716 18.5336 27.6685 20.6147 26.0611 22.1491C24.4536 23.6835 22.2734 24.5455 20.0001 24.5455ZM20.0001 10.9091C18.87 10.9091 17.7652 11.229 16.8255 11.8284C15.8857 12.4277 15.1533 13.2796 14.7208 14.2763C14.2883 15.273 14.1752 16.3697 14.3957 17.4278C14.6161 18.4859 15.1604 19.4578 15.9595 20.2206C16.7587 20.9834 17.7769 21.5029 18.8853 21.7134C19.9938 21.9238 21.1428 21.8158 22.1869 21.403C23.2311 20.9901 24.1235 20.291 24.7514 19.394C25.3793 18.497 25.7144 17.4425 25.7144 16.3636C25.7144 14.917 25.1124 13.5296 24.0408 12.5067C22.9691 11.4838 21.5157 10.9091 20.0001 10.9091Z"
                              fill="#699BF7"
                            />
                          </svg>
                        </Icon>
                        <div className="relative">
                          <Icon title="Emoji">
                            <svg
                              ref={emojiRef}
                              onClick={() => setShowEmoji((v) => !v)}
                              width="20"
                              height="20"
                              viewBox="0 0 30 30"
                              className="mt-1"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M6.64479 2.59084C8.27653 1.47979 10.1118 0.703185 12.0449 0.305827C13.9779 -0.0915311 15.9704 -0.101778 17.9074 0.275678C19.8444 0.653134 21.6876 1.41082 23.3307 2.50504C24.9737 3.59925 26.3841 5.00833 27.4805 6.651C28.5769 8.29367 29.3376 10.1374 29.7186 12.0759C30.0997 14.0144 30.0936 16.0092 29.7008 17.9453C29.3079 19.8814 28.5361 21.7205 27.4297 23.3564C26.3234 24.9924 24.9044 26.3928 23.2548 27.477C19.9585 29.6825 15.9221 30.4867 12.0336 29.7126C8.14508 28.9386 4.72296 26.6497 2.52005 23.3496C0.31715 20.0495 -0.486085 16.0085 0.287052 12.1154C1.06019 8.2224 3.34637 4.79631 6.64265 2.59084H6.64479ZM7.83213 25.7004C9.23102 26.6467 10.8029 27.3069 12.4575 27.643C14.112 27.9791 15.8167 27.9846 17.4733 27.6591C19.13 27.3335 20.7061 26.6834 22.111 25.7461C23.5159 24.8088 24.722 23.6028 25.6598 22.1973C26.5977 20.7919 27.2489 19.2147 27.5759 17.5565C27.903 15.8982 27.8995 14.1916 27.5657 12.5348C27.2319 10.8779 26.5743 9.30341 25.6307 7.90179C24.6871 6.50018 23.4762 5.29908 22.0674 4.36751C19.2416 2.49886 15.7918 1.82623 12.4721 2.49666C9.15233 3.16708 6.23273 5.12603 4.35145 7.94529C2.47017 10.7646 1.78024 14.2148 2.43247 17.5419C3.0847 20.8689 5.02604 23.8021 7.83213 25.7004ZM11.7465 12.8959C11.7465 13.463 11.5215 14.0068 11.121 14.4077C10.7206 14.8087 10.1774 15.0339 9.611 15.0339C9.04463 15.0339 8.50146 14.8087 8.10097 14.4077C7.70049 14.0068 7.4755 13.463 7.4755 12.8959C7.4755 12.3289 7.70049 11.7851 8.10097 11.3842C8.50146 10.9832 9.04463 10.758 9.611 10.758C10.1774 10.758 10.7206 10.9832 11.121 11.3842C11.5215 11.7851 11.7465 12.3289 11.7465 12.8959ZM22.4241 12.8959C22.4241 13.463 22.1991 14.0068 21.7986 14.4077C21.3981 14.8087 20.8549 15.0339 20.2885 15.0339C19.7222 15.0339 19.179 14.8087 18.7785 14.4077C18.378 14.0068 18.153 13.463 18.153 12.8959C18.153 12.3289 18.378 11.7851 18.7785 11.3842C19.179 10.9832 19.7222 10.758 20.2885 10.758C20.8549 10.758 21.3981 10.9832 21.7986 11.3842C22.1991 11.7851 22.4241 12.3289 22.4241 12.8959ZM14.9498 21.4479C13.7894 21.4507 12.65 21.138 11.6532 20.543C10.6565 19.9481 9.83994 19.0933 9.29068 18.0699L7.43279 19.0961C8.18053 20.4815 9.2958 21.6332 10.6557 22.4244C12.0156 23.2157 13.5672 23.6156 15.1397 23.5802C16.7121 23.5449 18.2443 23.0755 19.5673 22.2239C20.8903 21.3724 21.9528 20.1716 22.6376 18.754L20.7156 17.8347C20.1903 18.9182 19.371 19.8317 18.3513 20.4707C17.3316 21.1097 16.1528 21.4484 14.9498 21.4479Z"
                                fill="#699BF7"
                              />
                            </svg>
                          </Icon>
                          {showEmoji && (
                            <div
                              ref={emojiRef}
                              className="absolute bottom-10 right-0 z-20 w-[220px] max-h-[200px] overflow-auto bg-white border border-black/10 shadow-md rounded py-2 px-1 grid grid-cols-5 gap-1"
                            >
                              {emojiList.map((e) => (
                                <button
                                  key={e}
                                  className="text-[18px] leading-none p-1 hover:bg-black/5 rounded"
                                  onClick={() => setInput((v) => v + e)}
                                >
                                  {e}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => sendMessage(input)}
                          className="ml-1 bg-[#4399FF] hover:bg-[#3b6bf1] text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 31 31"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.7987 15.8135L4.82599 17.8081C4.68834 17.8311 4.55917 17.8899 4.45146 17.9786C4.34375 18.0673 4.26131 18.1829 4.21241 18.3135L0.0842631 29.372C-0.309954 30.3892 0.753478 31.3587 1.72948 30.8692L30.342 16.5653C30.5398 16.4662 30.706 16.314 30.8222 16.1258C30.9385 15.9376 31 15.7208 31 15.4996C31 15.2785 30.9385 15.0617 30.8222 14.8735C30.706 14.6853 30.5398 14.5331 30.342 14.434L1.72948 0.130099C0.753478 -0.357823 -0.309954 0.611664 0.0842631 1.62724L4.214 12.6857C4.2629 12.8164 4.34534 12.9319 4.45305 13.0207C4.56076 13.1094 4.68993 13.1682 4.82758 13.1912L16.8003 15.1858C16.875 15.1977 16.943 15.2358 16.9921 15.2934C17.0412 15.3509 17.0681 15.424 17.0681 15.4996C17.0681 15.5753 17.0412 15.6484 16.9921 15.7059C16.943 15.7635 16.875 15.8016 16.8003 15.8135H16.7987Z"
                              fill="white"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Removed modals; inline preview is used now */}
    </>
  );
};

export default Chat;
