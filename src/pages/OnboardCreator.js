import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import CustomDropdown from "../components/CustomDropdown";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const countryOptions = [
  { value: "pakistan", label: "Pakistan" },
  { value: "usa", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "uae", label: "United Arab Emirates" },
  { value: "india", label: "India" },
];

const OnboardCreator = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [authUserId, setAuthUserId] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  // Socials
  const [instaLink, setInstaLink] = useState("");
  const [instaFollower, setInstaFollower] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [youtubeFollower, setYoutubeFollower] = useState("");
  const [tiktokLink, setTiktokLink] = useState("");
  const [tiktokFollower, setTiktokFollower] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (user && active) {
        setAuthUserId(user.id);
        setAuthEmail(user.email || "");
      }
      const identifier = user?.id
        ? { column: "auth_id", value: user.id }
        : user?.email
        ? { column: "email", value: user.email }
        : null;
      if (!identifier) return;
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq(identifier.column, identifier.value)
        .maybeSingle();
      if (!active || !data) return;
      setFirstName(data.first_nmae || "");
      setLastName(data.last_name || "");
      setCountry(data.country || "");
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
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleUpdate = async () => {
    if (!supabase) {
      setError("Supabase not configured");
      return;
    }
    setError("");
    setLoading(true);
    try {
      let uploadedUrl = avatarUrl;

      console.log("avatarFile", avatarFile);
      if (avatarFile) {
        const ext = (avatarFile.name.split(".").pop() || "png").toLowerCase();
        const ownerKey = "public";
        const filePath = `public/${ownerKey}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, );
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        uploadedUrl = pub?.publicUrl || uploadedUrl;
      }
      const identifier = authUserId
        ? { column: "auth_id", value: authUserId }
        : { column: "email", value: authEmail };
      const { error: updateErr } = await supabase
        .from("users")
        .update({
          first_nmae: firstName || null,
          last_name: lastName || null,
          country: country || null,
          city: city || null,
          description: description || null,
          insta_link: instaLink || null,
          insta_follower: instaFollower || null,
          youtube_link: youtubeLink || null,
          youtube_follower: youtubeFollower || null,
          tiktok_link: tiktokLink || null,
          tiktok_follower: tiktokFollower || null,
          avatar: uploadedUrl || null,
          role: "creator",
          is_verified: false,
        })
        .eq(identifier.column, identifier.value);
      if (updateErr) throw updateErr;
      setAvatarUrl(uploadedUrl);
      setSuccess("Please wait until the admin approved your account.");
      await supabase.auth.signOut();
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (e) {
      setError(e.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UserHeader />
      <main className="px-4 md:px-6 py-10 sm:py-[60px]">
        <div className="max-w-[1070px] mx-auto">
          <h1 className="text-center text-[#05162A] text-[28px] sm:text-[40px] lg:text-[48px] leading-[36px] sm:leading-[48px] lg:leading-[67px] font-semibold">
            Complete your creator profile
          </h1>
          <div className="mt-8 max-w-[640px] mx-auto space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name..."
                className="border border-[#05588E29] outline-none bg-white rounded-lg py-3 px-4 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name..."
                className="border border-[#05588E29] outline-none bg-white rounded-lg py-3 px-4 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
                Country of residence
              </label>
              <CustomDropdown
                options={countryOptions}
                value={country}
                onChange={setCountry}
                placeholder="Select"
              />
            </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City..."
              className="border border-[#05588E29] outline-none bg-white rounded-lg py-3 px-4 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe yourself..."
              className="min-h-[52px] border border-[#05588E29] outline-none bg-white rounded-lg py-3 px-4 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
            />
          </div>
          <h3 className="text-[#05162A] text-[20px] sm:text-[22px] leading-[28px] font-semibold pt-2">
            Socials
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">Instagram Link</label>
              <input
                type="text"
                value={instaLink}
                onChange={(e) => setInstaLink(e.target.value)}
                placeholder="https://instagram.com/yourhandle"
                className="border border-[#05588E29] outline-none bg-white rounded-lg py-3 px-4 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">Instagram Followers</label>
              <input
                type="text"
                value={instaFollower}
                onChange={(e) => setInstaFollower(e.target.value)}
                placeholder="e.g. 12450"
                className="border border-[#05588E29] outline-none bg-white rounded-lg py-3 px-4 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">YouTube Link</label>
              <input
                type="text"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                placeholder="https://youtube.com/@yourhandle"
                className="border border-[#05588E29] outline-none bg-white rounded-lg py-3 px-4 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">YouTube Subscribers</label>
              <input
                type="text"
                value={youtubeFollower}
                onChange={(e) => setYoutubeFollower(e.target.value)}
                placeholder="e.g. 7300"
                className="border border-[#05588E29] outline-none bg-white rounded-lg py-3 px-4 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">TikTok Link</label>
              <input
                type="text"
                value={tiktokLink}
                onChange={(e) => setTiktokLink(e.target.value)}
                placeholder="https://tiktok.com/@yourhandle"
                className="border border-[#05588E29] outline-none bg-white rounded-lg py-3 px-4 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">TikTok Followers</label>
              <input
                type="text"
                value={tiktokFollower}
                onChange={(e) => setTiktokFollower(e.target.value)}
                placeholder="e.g. 24900"
                className="border border-[#05588E29] outline-none bg-white rounded-lg py-3 px-4 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
              />
            </div>
          </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
                Profile picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <div className="flex items-center justify-center">
              <button
                disabled={loading}
                onClick={handleUpdate}
                className="hover:bg-[#2A3B6D] transition-colors duration-300 bg-[#1B2B5D] text-white text-[16px] font-semibold h-12 px-6 rounded-lg disabled:opacity-60"
              >
                {loading ? "Updating..." : "Update & Continue"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default OnboardCreator;
