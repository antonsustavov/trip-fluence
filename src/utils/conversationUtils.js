import { supabase } from "../supabaseClient";

/**
 * Get or create a conversation between two users
 * @param {string} userId1 - First user's database ID
 * @param {string} userId2 - Second user's database ID
 * @returns {object} - { conversationId, error }
 */
export const getOrCreateConversation = async (userId1, userId2) => {
  try {
    console.log("getOrCreateConversation called with:", { userId1, userId2 });

    if (!userId1 || !userId2) {
      throw new Error("Both user IDs are required");
    }

    if (userId1 === userId2) {
      throw new Error("Cannot create conversation with yourself");
    }

    // Check if conversation already exists
    console.log("Checking for existing conversation...");
    const { data: existing, error: fetchError } = await supabase
      .from("dm_conversations")
      .select("id")
      .or(
        `and(user_id_a.eq.${userId1},user_id_b.eq.${userId2}),and(user_id_a.eq.${userId2},user_id_b.eq.${userId1})`
      )
      .maybeSingle();

    console.log("Existing conversation check result:", {
      existing,
      fetchError,
    });

    if (fetchError) throw fetchError;

    if (existing) {
      console.log("Found existing conversation:", existing.id);
      return { conversationId: existing.id, error: null };
    }

    // Create new conversation
    console.log("Creating new conversation...");
    const { data: newConv, error: createError } = await supabase
      .from("dm_conversations")
      .insert([
        {
          user_id_a: userId1,
          user_id_b: userId2,
          last_message_at: new Date().toISOString(),
        },
      ])
      .select("id")
      .single();

    console.log("New conversation creation result:", { newConv, createError });

    if (createError) throw createError;

    console.log("Successfully created conversation:", newConv.id);
    return { conversationId: newConv.id, error: null };
  } catch (err) {
    console.error("Error getting or creating conversation:", err);
    return { conversationId: null, error: err.message };
  }
};

/**
 * Mark messages as read in a conversation
 * @param {string} conversationId - The conversation ID
 * @param {string} userId - The current user's ID
 * @returns {object} - { success, error }
 */
export const markMessagesAsRead = async (conversationId, userId) => {
  try {
    const { error } = await supabase
      .from("dm_messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", userId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (err) {
    console.error("Error marking messages as read:", err);
    return { success: false, error: err.message };
  }
};
