import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector(
    (state) => state.user
  );

  const navigate = useNavigate();
  const { id } = useParams();

  // If id exists => Update mode
  const isEditMode = Boolean(id);

  // ==================== STATES ====================

  const [files, setFiles] = useState([]);

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [fetchingListing, setFetchingListing] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==================== FETCH LISTING FOR EDIT ====================

  useEffect(() => {
    if (!isEditMode) return;

    const fetchListing = async () => {
      try {
        setFetchingListing(true);
        setError("");

        const response = await fetch(
          `http://localhost:3000/api/listings/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch listing"
          );
        }

        setFormData({
          imageUrls: data.imageUrls || [],
          name: data.name || "",
          description: data.description || "",
          address: data.address || "",
          type: data.type || "rent",
          bedrooms: data.bedrooms ?? 1,
          bathrooms: data.bathrooms ?? 1,
          regularPrice: data.regularPrice ?? 50,
          discountPrice: data.discountPrice ?? 0,
          offer: data.offer ?? false,
          parking: data.parking ?? false,
          furnished: data.furnished ?? false,
        });
      } catch (error) {
        console.error(
          "Fetch listing error:",
          error
        );

        setError(
          error.message ||
            "Failed to load listing"
        );
      } finally {
        setFetchingListing(false);
      }
    };

    fetchListing();
  }, [id, isEditMode]);

  // ==================== HANDLE INPUT ====================

  const handleChange = (e) => {
    const {
      id,
      value,
      type,
      checked,
    } = e.target;

    // Rent / Sell
    if (id === "rent" || id === "sale") {
      setFormData((prev) => ({
        ...prev,
        type: id,
      }));

      return;
    }

    // Checkbox fields
    if (
      id === "parking" ||
      id === "furnished" ||
      id === "offer"
    ) {
      setFormData((prev) => ({
        ...prev,
        [id]: checked,
      }));

      return;
    }

    // Number fields
    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [id]: Number(value),
      }));

      return;
    }

    // Text fields
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // ==================== CLOUDINARY IMAGE UPLOAD ====================

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      // 2 MB validation
      if (file.size > 2 * 1024 * 1024) {
        reject(
          new Error(
            "Image size must be less than 2 MB"
          )
        );

        return;
      }

      const cloudinaryFormData =
        new FormData();

      cloudinaryFormData.append(
        "file",
        file
      );

      cloudinaryFormData.append(
        "upload_preset",
        "mern-estate"
      );

      const xhr =
        new XMLHttpRequest();

      xhr.open(
        "POST",
        "https://api.cloudinary.com/v1_1/tbhigbnt/image/upload"
      );

      // Upload progress
      xhr.upload.addEventListener(
        "progress",
        (event) => {
          if (event.lengthComputable) {
            const progress =
              Math.round(
                (event.loaded /
                  event.total) *
                  100
              );

            console.log(
              `Upload is ${progress}% done`
            );
          }
        }
      );

      // Response
      xhr.onload = () => {
        if (
          xhr.status >= 200 &&
          xhr.status < 300
        ) {
          try {
            const data = JSON.parse(
              xhr.responseText
            );

            console.log(
              "Cloudinary upload successful:",
              data
            );

            resolve(
              data.secure_url
            );
          } catch (error) {
            reject(
              new Error(
                "Invalid response from Cloudinary"
              )
            );
          }
        } else {
          console.error(
            "Cloudinary error:",
            xhr.responseText
          );

          reject(
            new Error(
              "Cloudinary upload failed"
            )
          );
        }
      };

      // Network error
      xhr.onerror = () => {
        reject(
          new Error(
            "Cloudinary network error"
          )
        );
      };

      xhr.send(
        cloudinaryFormData
      );
    });
  };

  // ==================== SELECT IMAGES ====================

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(
      e.target.files
    );

    setImageUploadError("");

    // No files
    if (selectedFiles.length === 0) {
      return;
    }

    // Maximum 6 images
    if (
      selectedFiles.length +
        formData.imageUrls.length >
      6
    ) {
      setImageUploadError(
        "You can only upload 6 images per listing"
      );

      return;
    }

    // Check file types
    const invalidFile =
      selectedFiles.find(
        (file) =>
          !file.type.startsWith(
            "image/"
          )
      );

    if (invalidFile) {
      setImageUploadError(
        "Only image files are allowed"
      );

      return;
    }

    // Check 2 MB
    const largeFile =
      selectedFiles.find(
        (file) =>
          file.size >
          2 * 1024 * 1024
      );

    if (largeFile) {
      setImageUploadError(
        `${largeFile.name} is larger than 2 MB`
      );

      return;
    }

    setFiles(selectedFiles);
  };

  // ==================== UPLOAD IMAGES ====================

  const handleImageSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setImageUploadError(
        "Please select at least one image"
      );

      return;
    }

    if (
      files.length +
        formData.imageUrls.length >
      6
    ) {
      setImageUploadError(
        "You can only upload 6 images per listing"
      );

      return;
    }

    try {
      setUploading(true);
      setImageUploadError("");

      const uploadPromises =
        files.map((file) =>
          storeImage(file)
        );

      const imageUrls =
        await Promise.all(
          uploadPromises
        );

      setFormData((prev) => ({
        ...prev,
        imageUrls: [
          ...prev.imageUrls,
          ...imageUrls,
        ],
      }));

      setFiles([]);

      // Reset file input
      const fileInput =
        document.getElementById(
          "images"
        );

      if (fileInput) {
        fileInput.value = "";
      }

      console.log(
        "Uploaded images:",
        imageUrls
      );
    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      setImageUploadError(
        error.message ||
          "Image upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  // ==================== DELETE IMAGE ====================

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls:
        prev.imageUrls.filter(
          (_, i) => i !== index
        ),
    }));
  };

  // ==================== CREATE / UPDATE LISTING ====================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Check login
    if (!currentUser?.token) {
      setError(
        "You must be logged in"
      );

      return;
    }

    // Check images
    if (
      formData.imageUrls.length === 0
    ) {
      setError(
        "Please upload at least one image"
      );

      return;
    }

    // Check maximum images
    if (
      formData.imageUrls.length > 6
    ) {
      setError(
        "You can only have 6 images"
      );

      return;
    }

    // Check discount
    if (
      formData.offer &&
      formData.discountPrice >=
        formData.regularPrice
    ) {
      setError(
        "Discount price must be lower than regular price"
      );

      return;
    }

    // Check prices
    if (
      formData.regularPrice < 0 ||
      formData.discountPrice < 0
    ) {
      setError(
        "Price cannot be negative"
      );

      return;
    }

    try {
      setLoading(true);

      // CREATE
      const url = isEditMode
        ? `http://localhost:3000/api/listings/${id}`
        : "http://localhost:3000/api/listings";

      const method = isEditMode
        ? "PUT"
        : "POST";

      const response =
        await fetch(url, {
          method,

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${currentUser.token}`,
          },

          body: JSON.stringify(
            formData
          ),
        });

      const data =
        await response.json();

      console.log(
        isEditMode
          ? "Update listing response:"
          : "Create listing response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEditMode
              ? "Failed to update listing"
              : "Failed to create listing")
        );
      }

      console.log(
        isEditMode
          ? "Listing updated successfully:"
          : "Listing created successfully:",
        data.listing
      );

      // Go to listing detail
      if (data.listing?._id) {
        navigate(
          `/listing/${data.listing._id}`
        );
      } else {
        navigate("/listing");
      }

    } catch (error) {
      console.error(
        isEditMode
          ? "Update listing error:"
          : "Create listing error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================== UI ====================

  if (fetchingListing) {
    return (
      <main className="p-3 max-w-4xl mx-auto">
        <p className="text-center my-7 text-2xl">
          Loading listing...
        </p>
      </main>
    );
  }

  return (
    <main className="p-3 max-w-4xl mx-auto">

      <h1 className="text-3xl font-semibold text-center my-7">
        {isEditMode
          ? "Update Listing"
          : "Create a Listing"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4"
      >

        {/* ================= LEFT SIDE ================= */}

        <div className="flex flex-col gap-4 flex-1">

          {/* NAME */}

          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />

          {/* DESCRIPTION */}

          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={
              formData.description
            }
          />

          {/* ADDRESS */}

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          {/* CHECKBOXES */}

          <div className="flex gap-6 flex-wrap">

            {/* SALE */}

            <div className="flex gap-2">

              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={
                  formData.type ===
                  "sale"
                }
              />

              <span>Sell</span>

            </div>

            {/* RENT */}

            <div className="flex gap-2">

              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={
                  formData.type ===
                  "rent"
                }
              />

              <span>Rent</span>

            </div>

            {/* PARKING */}

            <div className="flex gap-2">

              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={
                  formData.parking
                }
              />

              <span>
                Parking spot
              </span>

            </div>

            {/* FURNISHED */}

            <div className="flex gap-2">

              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={
                  formData.furnished
                }
              />

              <span>
                Furnished
              </span>

            </div>

            {/* OFFER */}

            <div className="flex gap-2">

              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={
                  formData.offer
                }
              />

              <span>Offer</span>

            </div>

          </div>

          {/* BEDROOMS / BATHROOMS / PRICE */}

          <div className="flex flex-wrap gap-6">

            {/* BEDROOMS */}

            <div className="flex items-center gap-2">

              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={
                  formData.bedrooms
                }
              />

              <p>Beds</p>

            </div>

            {/* BATHROOMS */}

            <div className="flex items-center gap-2">

              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={
                  formData.bathrooms
                }
              />

              <p>Baths</p>

            </div>

            {/* REGULAR PRICE */}

            <div className="flex items-center gap-2">

              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={
                  formData.regularPrice
                }
              />

              <div className="flex flex-col items-center">

                <p>
                  Regular price
                </p>

                {formData.type ===
                  "rent" && (
                  <span className="text-xs">
                    ($ / month)
                  </span>
                )}

              </div>

            </div>

            {/* DISCOUNT PRICE */}

            {formData.offer && (
              <div className="flex items-center gap-2">

                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={
                    formData.discountPrice
                  }
                />

                <div className="flex flex-col items-center">

                  <p>
                    Discounted price
                  </p>

                  {formData.type ===
                    "rent" && (
                    <span className="text-xs">
                      ($ / month)
                    </span>
                  )}

                </div>

              </div>
            )}

          </div>

        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className="flex flex-col flex-1 gap-4">

          {/* IMAGE TITLE */}

          <p className="font-semibold">

            Images:

            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover
              (max 6)
            </span>

          </p>

          {/* IMAGE INPUT */}

          <div className="flex gap-4">

            <input
              onChange={
                handleFileChange
              }
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />

            <button
              type="button"
              disabled={uploading}
              onClick={
                handleImageSubmit
              }
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading
                ? "Uploading..."
                : "Upload"}
            </button>

          </div>

          {/* IMAGE ERROR */}

          {imageUploadError && (
            <p className="text-red-700 text-sm">
              {imageUploadError}
            </p>
          )}

          {/* UPLOADED IMAGES */}

          {formData.imageUrls
            .length > 0 && (
            <div className="flex flex-col gap-3">

              {formData.imageUrls.map(
                (url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="flex justify-between p-3 border items-center rounded-lg"
                  >

                    <div className="flex items-center gap-3">

                      <img
                        src={url}
                        alt="listing"
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      <span className="text-sm text-gray-500">
                        {index === 0
                          ? "Cover Image"
                          : `Image ${
                              index + 1
                            }`}
                      </span>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveImage(
                          index
                        )
                      }
                      className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                    >
                      Delete
                    </button>

                  </div>
                )
              )}

            </div>
          )}

          {/* CREATE / UPDATE LISTING */}

          <button
            disabled={
              loading ||
              uploading
            }
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update listing"
              : "Create listing"}
          </button>

          {/* ERROR */}

          {error && (
            <p className="text-red-700 text-sm">
              {error}
            </p>
          )}
        </div>
      </form>
    </main>
  );
}