import React, { useEffect, useState, useMemo } from "react";
import UserHeader from "../components/UserHeader";
import CustomDropdown from "../components/CustomDropdown";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getOrCreateConversation } from "../utils/conversationUtils";
import { countryOptions, normalizeCountryValue } from "../utils/countryOptions";

const SocialCard = ({
  icon,
  linkLabel,
  followerLabel,
  metric3Label,
  reached,
  engaged,
  total,
  linkValue,
  onLinkChange,
  followersValue,
  onFollowersChange,
  readOnly = false,
}) => (
  <div className="border border-[#05588E29] rounded-xl px-5 md:px-10 py-6 flex flex-col items-center justify-center">
    <div className="mb-8 border border-[#05588E29] rounded-[11px] p-5 w-fit flex items-center justify-center">
      <img src={icon} alt="platform" />
    </div>
    <div className="mb-3.5 flex flex-col gap-2 sm:gap-3 w-full">
      <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
        {linkLabel}
      </label>
      <input
        type="text"
        placeholder="Enter URL ..."
        value={linkValue || ""}
        readOnly={readOnly}
        onChange={(e) => onLinkChange?.(e.target.value)}
        className="border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
      />
    </div>
    <div className="flex flex-col gap-2 sm:gap-3 w-full">
      <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
        {followerLabel}
      </label>
      <input
        type="text"
        placeholder="Enter number ..."
        value={followersValue || ""}
        readOnly={readOnly}
        onChange={(e) => onFollowersChange?.(e.target.value)}
        className="border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
      />
    </div>
    <div className="mt-8 w-full flex flex-col gap-3.5 items-start text-left">
      <h3 className="text-[#05162A] text-[16px] leading-[24px] font-medium">
        Reels Engagement
      </h3>
      <div className="w-full flex items-center justify-between gap-4">
        <h3 className="text-[#05162A] text-[16px] leading-[24px] font-normal">
          Accounts Reached
        </h3>
        <h3 className="text-[#05162A] text-[16px] leading-[24px] font-normal">
          {reached}
        </h3>
      </div>
      <div className="w-full flex items-center justify-between gap-4">
        <h3 className="text-[#05162A] text-[16px] leading-[24px] font-normal">
          Accounts Engaged
        </h3>
        <h3 className="text-[#05162A] text-[16px] leading-[24px] font-normal">
          {engaged}
        </h3>
      </div>
      <div className="w-full flex items-center justify-between gap-4">
        <h3 className="text-[#05162A] text-[16px] leading-[24px] font-normal">
          {metric3Label}
        </h3>
        <h3 className="text-[#05162A] text-[16px] leading-[24px] font-normal">
          {total}
        </h3>
      </div>
    </div>
  </div>
);

const CreaterAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const viewId = params?.id;
  const isViewing = !!viewId;
  const qs = new URLSearchParams(location.search);
  const passed = {
    id: qs.get("id") || "",
    title: qs.get("title") || "",
    location: qs.get("location") || "",
    image: qs.get("image") || "",
  };
  const hasPassed = !!(passed.title || passed.image);
  const initialFirstName = "";
  const initialLastName = "";
  const initialCountry = "";
  const [services, setServices] = useState("creator");
  const [country, setCountry] = useState(initialCountry);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(passed.image || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUserDbId, setCurrentUserDbId] = useState(null);
  // Socials
  const [instaLink, setInstaLink] = useState(qs.get("igLink") || "");
  const [instaFollower, setInstaFollower] = useState(qs.get("igFollowers") || "");
  const [youtubeLink, setYoutubeLink] = useState(qs.get("ytLink") || "");
  const [youtubeFollower, setYoutubeFollower] = useState(qs.get("ytSubscribers") || "");
  const [tiktokLink, setTiktokLink] = useState(qs.get("ttLink") || "");
  const [tiktokFollower, setTiktokFollower] = useState(qs.get("ttFollowers") || "");

  const authId = useMemo(() => {
    try {
      return localStorage.getItem("auth_id") || "";
    } catch {
      return "";
    }
  }, []);
  const email = useMemo(() => {
    try {
      return localStorage.getItem("user_email") || "";
    } catch {
      return "";
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadUser() {
      if (!supabase) return;
      if (isViewing && viewId) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", viewId)
          .maybeSingle();
        if (isMounted && data) {
          setFirstName(data.first_nmae || "");
          setLastName(data.last_name || "");
          setCountry(normalizeCountryValue(data.country || ""));
          setServices(data.role || "creator");
          setCity(data.city || "");
          setDescription(data.description || "");
          setInstaLink(data.insta_link || "");
          setInstaFollower(data.insta_follower || "");
          setYoutubeLink(data.youtube_link || "");
          setYoutubeFollower(data.youtube_follower || "");
          setTiktokLink(data.tiktok_link || "");
          setTiktokFollower(data.tiktok_follower || "");
          if (data.avatar) setAvatarUrl(data.avatar);
        }
        return;
      }
      const identifier = authId
        ? { column: "auth_id", value: authId }
        : email
        ? { column: "email", value: email }
        : null;
      if (!identifier) return;
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq(identifier.column, identifier.value)
        .maybeSingle();
      if (isMounted && data) {
        setFirstName(data.first_nmae || "");
        setLastName(data.last_name || "");
        setCountry(normalizeCountryValue(data.country || ""));
        setServices(data.role || "creator");
        setCity(data.city || "");
        setDescription(data.description || "");
        setInstaLink(data.insta_link || "");
        setInstaFollower(data.insta_follower || "");
        setYoutubeLink(data.youtube_link || "");
        setYoutubeFollower(data.youtube_follower || "");
        setTiktokLink(data.tiktok_link || "");
        setTiktokFollower(data.tiktok_follower || "");
        if (data.avatar) setAvatarUrl(data.avatar);
      }
    }
    loadUser();
    return () => {
      isMounted = false;
    };
  }, [authId, email, isViewing, viewId]);

  // Load current user's database ID for messaging
  useEffect(() => {
    let isMounted = true;
    async function loadCurrentUserDbId() {
      if (!authId) return;
      const identifier = authId
        ? { column: "auth_id", value: authId }
        : email
        ? { column: "email", value: email }
        : null;
      if (!identifier) return;
      const { data } = await supabase
        .from("users")
        .select("id")
        .eq(identifier.column, identifier.value)
        .maybeSingle();
      if (isMounted && data?.id) {
        setCurrentUserDbId(data.id);
      }
    }
    loadCurrentUserDbId();
    return () => {
      isMounted = false;
    };
  }, [authId, email]);

  const socials = {
    ig: {
      link: qs.get("igLink") || "",
      followers: qs.get("igFollowers") || "",
      reached: qs.get("igReached") || "",
      engaged: qs.get("igEngaged") || "",
      total: qs.get("igTotal") || "",
    },
    yt: {
      link: qs.get("ytLink") || "",
      followers: qs.get("ytSubscribers") || "",
      reached: qs.get("ytReached") || "",
      engaged: qs.get("ytEngaged") || "",
      total: qs.get("ytTotal") || "",
    },
    tt: {
      link: qs.get("ttLink") || "",
      followers: qs.get("ttFollowers") || "",
      reached: qs.get("ttReached") || "",
      engaged: qs.get("ttEngaged") || "",
      total: qs.get("ttTotal") || "",
    },
  };

  const servicesOptions = [
    { value: "creator", label: "Creator" },
    { value: "brand", label: "Brand" },
    { value: "agency", label: "Agency" },
  ];

  const countryValue = normalizeCountryValue(country);
  return (
    <>
      <UserHeader />
      <div className="w-full md:px-6 px-4 py-10 md:py-[60px]">
        <div className="max-w-[1240px] w-full mx-auto space-y-8 sm:space-y-12">
          {/* Profile */}
          <div className="flex items-start justify-between sm:flex-row flex-col gap-6 lg:pr-[46px]">
            <div className="w-full sm:w-[230px] md:w-[254px]">
              <div className="p-3.5 sm:p-[21.17px] w-full flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-[214px] h-[214px] rounded-full object-cover border border-black/10"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <svg
                    width="214"
                    height="214"
                    viewBox="0 0 214 214"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="106.583"
                      cy="106.583"
                      r="105.833"
                      fill="#5383FF"
                      stroke="white"
                      stroke-width="1.5"
                    />
                    <path
                      d="M132.99 80.125C132.99 94.7376 121.127 106.583 106.494 106.583C91.8604 106.583 79.9977 94.7376 79.9977 80.125C79.9977 65.5125 91.8604 53.6667 106.494 53.6667C121.127 53.6667 132.99 65.5125 132.99 80.125Z"
                      fill="#5383FF"
                    />
                    <path
                      d="M58.9584 159.5C83.6355 133.654 129.266 132.437 154.208 159.5M132.99 80.125C132.99 94.7376 121.127 106.583 106.494 106.583C91.8604 106.583 79.9977 94.7376 79.9977 80.125C79.9977 65.5125 91.8604 53.6667 106.494 53.6667C121.127 53.6667 132.99 65.5125 132.99 80.125Z"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                )}
              </div>
              {!isViewing && (
                <div className="flex items-center justify-center mt-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  />
                </div>
              )}
              <h2 className="text-[#05162A] text-[24px] leading-[34px] font-normal text-center">
                Profile Picture
              </h2>
            </div>
            <div className="max-w-[844px] w-full">
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
                <div className="flex flex-col gap-2 sm:gap-3">
                  <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First Name..."
                    value={firstName}
                    readOnly={isViewing}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name..."
                    value={lastName}
                    readOnly={isViewing}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
                  />
                </div>
              </div>
              <div className="mt-5 lg:mt-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
                <div className="flex flex-col gap-2 sm:gap-3">
                  <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
                    Services
                  </label>
                  <CustomDropdown
                    options={servicesOptions}
                    value={services}
                    onChange={isViewing ? () => {} : setServices}
                    placeholder="Select"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
                    Coutry of residence
                  </label>
                  <CustomDropdown
                    options={countryOptions}
                    value={countryValue}
                    onChange={isViewing ? () => {} : setCountry}
                    placeholder="Select"
                  />
                </div>
              </div>
              <div className="mt-5 lg:mt-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
                <div className="flex flex-col gap-2 sm:gap-3">
                  <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="City..."
                    value={city}
                    readOnly={isViewing}
                    onChange={(e) => setCity(e.target.value)}
                    className="border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe yourself..."
                    value={description}
                    readOnly={isViewing}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[52px] border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Platforms */}
          <div>
            <h2 className="text-[#05162A] text-[24px] sm:text-[28px] leading-[28px] sm:leading-[39px] font-semibold">
              Social Media Platforms:
            </h2>
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-[63.5px]">
              {[
                {
                  icon: "/assets/insta.svg",
                  linkLabel: "Instagram Link",
                  followerLabel: "Followers Number",
                  metric3Label: "Total Followers",
                  reached: socials.ig.reached || "6,504",
                  engaged: socials.ig.engaged || "304",
                  total: socials.ig.total || "12,450",
                  linkValue: instaLink,
                  followersValue: instaFollower,
                  onLinkChange: setInstaLink,
                  onFollowersChange: setInstaFollower,
                },
                {
                  icon: "/assets/yout.svg",
                  linkLabel: "Youtube Link",
                  followerLabel: "Subscribers Number",
                  metric3Label: "Total Subscribers",
                  reached: socials.yt.reached || "8,920",
                  engaged: socials.yt.engaged || "510",
                  total: socials.yt.total || "7,300",
                  linkValue: youtubeLink,
                  followersValue: youtubeFollower,
                  onLinkChange: setYoutubeLink,
                  onFollowersChange: setYoutubeFollower,
                },
                {
                  icon: "/assets/tiktok.svg",
                  linkLabel: "TikTok Link",
                  followerLabel: "Followers Number",
                  metric3Label: "Total Followers",
                  reached: socials.tt.reached || "15,204",
                  engaged: socials.tt.engaged || "1,104",
                  total: socials.tt.total || "24,900",
                  linkValue: tiktokLink,
                  followersValue: tiktokFollower,
                  onLinkChange: setTiktokLink,
                  onFollowersChange: setTiktokFollower,
                },
              ].map((p, idx) => (
                <SocialCard key={idx} readOnly={isViewing} {...p} />
              ))}
            </div>
          </div>

          <h3 className="text-[#05162A] text-[24px] sm:text-[28px] leading-[28px] sm:leading-[39px] font-semibold">
            Attached Portfolio
          </h3>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <div className="flex items-center justify-center gap-3">
            {isViewing && currentUserDbId && viewId !== currentUserDbId && (
            <button
              onClick={async () => {
                console.log("Send message clicked:", {
                  isViewing,
                  viewId,
                  currentUserDbId,
                });

                if (!isViewing) {
                  setError(
                    "This button only works when viewing someone else's profile"
                  );
                  return;
                }

                if (!viewId) {
                  setError("No user ID found to message");
                  return;
                }

                if (!currentUserDbId) {
                  setError(
                    "Your user ID not loaded yet. Please wait and try again."
                  );
                  return;
                }

                try {
                  setError(""); // Clear any previous errors
                  console.log(
                    "Creating conversation between:",
                    currentUserDbId,
                    "and",
                    viewId
                  );

                  const { conversationId, error: convError } =
                    await getOrCreateConversation(currentUserDbId, viewId);

                  console.log("Conversation result:", {
                    conversationId,
                    convError,
                  });

                  if (convError) throw new Error(convError);

                  navigate("/chat");
                } catch (err) {
                  console.error("Error creating conversation:", err);
                  setError(err.message || "Failed to start conversation");
                }
              }}
              className="hover:bg-[#2A3B6D] transition-colors duration-300 bg-[#1B2B5D] rounded-lg md:h-12 h-11 text-[16px] leading-[21px] pt-0.5 text-white font-semibold px-[22px]"
            >
              Send a Message
            </button>
            )}
            {!isViewing && (
              <button
                onClick={async () => {
                  if (!supabase) {
                    setError("Supabase not configured");
                    return;
                  }
                  setError("");
                  setLoading(true);
                  try {
                    let uploadedUrl = avatarUrl;
                    if (avatarFile) {
                      const fileExt = avatarFile.name.split(".").pop();
                      const filePath = `${
                        authId || email
                      }-${Date.now()}.${fileExt}`;
                      const { error: upErr } = await supabase.storage
                        .from("avatars")
                        .upload(filePath, avatarFile, { upsert: true });
                      if (upErr) throw upErr;
                      const { data: pub } = supabase.storage
                        .from("avatars")
                        .getPublicUrl(filePath);
                      uploadedUrl = pub?.publicUrl || uploadedUrl;
                    }

                    const identifier = authId
                      ? { column: "auth_id", value: authId }
                      : { column: "email", value: email };
                    const { error: updateErr } = await supabase
                      .from("users")
                      .update({
                        first_nmae: firstName || null,
                        last_name: lastName || null,
                        country: country || null,
                        role: services || null,
                        avatar: uploadedUrl || null,
                        city: city || null,
                        description: description || null,
                        insta_link: instaLink || null,
                        insta_follower: instaFollower || null,
                        youtube_link: youtubeLink || null,
                        youtube_follower: youtubeFollower || null,
                        tiktok_link: tiktokLink || null,
                        tiktok_follower: tiktokFollower || null,
                      })
                      .eq(identifier.column, identifier.value);
                    if (updateErr) throw updateErr;
                    setAvatarUrl(uploadedUrl);
                  } catch (e) {
                    setError(e.message || "Failed to update");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="hover:bg-[#2A3B6D] transition-colors duration-300 bg-[#1B2B5D] rounded-lg md:h-12 h-11 text-[16px] leading-[21px] pt-0.5 text-white font-semibold px-[22px] disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreaterAccount;
