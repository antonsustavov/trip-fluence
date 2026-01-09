import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import CustomDropdown from "../components/CustomDropdown";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getOrCreateConversation } from "../utils/conversationUtils";

const BrandsAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const viewId = params?.id;
  const qs = new URLSearchParams(location.search);
  const passed = {
    id: qs.get("id") || "",
    title: qs.get("title") || "",
    location: qs.get("location") || "",
    image: qs.get("image") || "",
  };
  const initialFirstName = qs.get("firstName") || "Jane";
  const initialLastName = qs.get("lastName") || "Smith";
  const initialCountry = qs.get("country") || "usa";
  const initialCity = qs.get("city") || "new-york";
  const initialBrandLink = qs.get("brandLink") || "https://example.com/brand";
  const initialDescription =
    qs.get("description") || "Short brand description for testing.";

  const [city, setCity] = useState(initialCity);
  const [country, setCountry] = useState(initialCountry);
  const [imageUrl, setImageUrl] = useState(passed.image || "");
  const [brandTitle, setBrandTitle] = useState(passed.title || "");
  const [brandLink, setBrandLink] = useState(initialBrandLink);
  const [description, setDescription] = useState(initialDescription);
  const [contactPersonName, setContactPersonName] = useState("");
  const [currentUserDbId, setCurrentUserDbId] = useState(null);
  const [error, setError] = useState("");

  const toLabel = (slug) =>
    (slug || "")
      .replace(/-/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  const baseCityOptions = [
    { value: "new-york", label: "New York" },
    { value: "tokyo", label: "Tokyo" },
    { value: "delhi", label: "Delhi" },
    { value: "shanghai", label: "Shanghai" },
  ];
  const baseCountryOptions = [
    { value: "pakistan", label: "Pakistan" },
    { value: "usa", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "uae", label: "United Arab Emirates" },
    { value: "india", label: "India" },
  ];
  const ensureOption = (opts, val) => {
    if (!val) return opts;
    return opts.some((o) => o.value === val)
      ? opts
      : [...opts, { value: val, label: toLabel(val) }];
  };
  const cityOptions = ensureOption(baseCityOptions, city || initialCity);
  const countryOptions = ensureOption(
    baseCountryOptions,
    country || initialCountry
  );

  useEffect(() => {
    let active = true;
    async function loadById() {
      if (!supabase || !viewId) return;
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", viewId)
        .maybeSingle();
      if (!active || !data) return;
      setBrandTitle(`${data.first_nmae || ""} ${data.last_name || ""}`.trim());
      setCountry(data.country || "");
      setCity(data.city || "");
      setImageUrl(data.avatar || "");
      setBrandLink(data.brand_url || "");
      setDescription(data.description || "");
      setContactPersonName(data.contact_person_name || "");
    }
    loadById();
    return () => {
      active = false;
    };
  }, [viewId]);

  useEffect(() => {
    let active = true;
    async function loadOwn() {
      if (!supabase || viewId) return;
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) return;
      const identifier = user.id
        ? { column: "auth_id", value: user.id }
        : user.email
        ? { column: "email", value: user.email }
        : null;
      if (!identifier) return;
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq(identifier.column, identifier.value)
        .maybeSingle();
      if (!active || !data) return;
      setBrandTitle(`${data.first_nmae || ""} ${data.last_name || ""}`.trim());
      setCountry(data.country || "");
      setCity(data.city || "");
      setImageUrl(data.avatar || "");
      setBrandLink(data.brand_url || "");
      setDescription(data.description || "");
      setContactPersonName(data.contact_person_name || "");
    }
    loadOwn();
    return () => {
      active = false;
    };
  }, [viewId]);

  // Load current user's database ID for messaging
  useEffect(() => {
    let isMounted = true;
    async function loadCurrentUserDbId() {
      if (!supabase) return;
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) return;
      const identifier = user.id
        ? { column: "auth_id", value: user.id }
        : user.email
        ? { column: "email", value: user.email }
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
  }, []);

  return (
    <>
      <UserHeader />
      <div className="w-full md:px-6 px-4 py-10 md:py-[60px]">
        <div className="max-w-[1240px] w-full mx-auto">
          {/* Profile */}
          <div className="flex items-start justify-between sm:flex-row flex-col gap-6 lg:pr-[46px]">
            <div className="w-full sm:w-[230px] md:w-[254px]">
              <div className="p-3.5 sm:p-[21.17px] w-full flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={brandTitle}
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
              <h2 className="text-[#05162A] text-[24px] leading-[34px] font-normal text-center">
                Profile Picture
              </h2>
            </div>
            <div className="max-w-[844px] w-full">
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
                <div className="flex flex-col gap-2 sm:gap-3">
                  <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="Brand Name..."
                    value={brandTitle}
                    readOnly
                    className="border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    placeholder="Contact Person Name"
                    value={contactPersonName}
                    readOnly
                    className="border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
                  />
                </div>
              </div>
              <div className="mt-5 lg:mt-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
                <div className="flex flex-col gap-2 sm:gap-3">
                  <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
                    Country
                  </label>
                  <CustomDropdown
                    options={countryOptions}
                    value={country}
                    onChange={() => {}}
                    placeholder="Select"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
                    City
                  </label>
                  <CustomDropdown
                    options={cityOptions}
                    value={city}
                    onChange={() => {}}
                    placeholder="Select"
                  />
                </div>
              </div>
              <div className="mt-5 lg:mt-8 flex flex-col gap-2 sm:gap-3">
                <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
                  Brand Link (website, Social Media, Airbnb/Booking)
                </label>
                <input
                  type="text"
                  placeholder="Enter URL ..."
                  value={brandLink}
                  readOnly
                  className="border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-8 mb-8 sm:mb-12">
            <div className="flex flex-col gap-2 sm:gap-3">
              <label className="text-[#05162A] text-[16px] leading-[24px] font-normal">
                Description
              </label>
              <textarea
                placeholder="Write Short Description"
                value={description}
                readOnly
                className="h-[194px] resize-none border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          <div className="flex items-center justify-center">
            <button
              onClick={async () => {
                console.log("Send message clicked:", {
                  viewId,
                  currentUserDbId,
                });

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
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandsAccount;
