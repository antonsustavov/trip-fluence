import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

/**
 * Hook to fetch conversations for the current user
 * @param {string} userId - The current user's ID
 * @returns {object} - { conversations, loading, error }
 */
export const useConversations = (userId) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch conversations where the user is either user_id_a or user_id_b
        const { data, error: fetchError } = await supabase
          .from("dm_conversations")
          .select(
            `
            id,
            user_id_a,
            user_id_b,
            last_message_at,
            created_at,
            dm_messages (
              id,
              content,
              sender_id,
              created_at,
              is_read,
              attachment_url,
              attachment_type
            )
          `
          )
          .or(`user_id_a.eq.${userId},user_id_b.eq.${userId}`)
          .order("last_message_at", { ascending: false });

        if (fetchError) throw fetchError;

        // Fetch user details for each conversation
        const conversationsWithUsers = await Promise.all(
          (data || []).map(async (conv) => {
            const otherUserId =
              conv.user_id_a === userId ? conv.user_id_b : conv.user_id_a;

            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("id, first_nmae, last_name, avatar, is_verified")
              .eq("id", otherUserId)
              .single();

            if (userError) throw userError;

            const lastMessage = conv.dm_messages?.[0];
            const unreadCount = (conv.dm_messages || []).filter(
              (m) => !m.is_read && m.sender_id !== userId
            ).length;

            return {
              id: conv.id,
              userId: otherUserId,
              name: `${userData?.first_nmae || ""} ${
                userData?.last_name || ""
              }`.trim(),
              avatar: userData?.avatar || "/assets/default-avatar.jpg",
              last: lastMessage?.content || "No messages yet",
              time: lastMessage?.created_at
                ? formatTime(new Date(lastMessage.created_at))
                : "",
              unread: unreadCount,
              online: false, // TODO: Implement online status
              favorite: false, // TODO: Add favorite field to conversations table
              notify: true, // TODO: Add notification preference to conversations table
              messages: (conv.dm_messages || [])
                .map((msg) => ({
                  id: msg.id,
                  author: msg.sender_id === userId ? "me" : "them",
                  text: msg.content,
                  time: formatTime(new Date(msg.created_at)),
                  image:
                    msg.attachment_type === "image" ? msg.attachment_url : null,
                  audio:
                    msg.attachment_type === "audio" ? msg.attachment_url : null,
                }))
                .reverse(),
            };
          })
        );

        setConversations(conversationsWithUsers);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userId]);

  return { conversations, loading, error };
};

/**
 * Hook to subscribe to real-time message updates for a conversation
 * @param {string} conversationId - The conversation ID
 * @param {string} userId - The current user's ID
 * @returns {object} - { messages, loading, error }
 */
export const useConversationMessages = (conversationId, userId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!conversationId || !userId) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("dm_messages")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });

        if (fetchError) throw fetchError;

        const formattedMessages = (data || []).map((msg) => ({
          id: msg.id,
          author: msg.sender_id === userId ? "me" : "them",
          text: msg.content,
          time: formatTime(new Date(msg.created_at)),
          image: msg.attachment_type === "image" ? msg.attachment_url : null,
          audio: msg.attachment_type === "audio" ? msg.attachment_url : null,
          file: msg.attachment_type === "file" ? msg.attachment_url : null,
          fileName: msg.attachment_name,
          fileSize: msg.attachment_size,
        }));

        setMessages(formattedMessages);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "dm_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = {
            id: payload.new.id,
            author: payload.new.sender_id === userId ? "me" : "them",
            text: payload.new.content,
            time: formatTime(new Date(payload.new.created_at)),
            image:
              payload.new.attachment_type === "image"
                ? payload.new.attachment_url
                : null,
            audio:
              payload.new.attachment_type === "audio"
                ? payload.new.attachment_url
                : null,
            file:
              payload.new.attachment_type === "file"
                ? payload.new.attachment_url
                : null,
            fileName: payload.new.attachment_name,
            fileSize: payload.new.attachment_size,
          };
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId, userId]);

  return { messages, loading, error };
};

/**
 * Format time for display
 */
const formatTime = (date) => {
  if (!date) return "";

  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) {
    const h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    return `${displayH}:${m} ${ampm}`;
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};
