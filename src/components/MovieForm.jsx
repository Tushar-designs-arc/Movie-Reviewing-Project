import { useState, useEffect, useRef, useCallback } from "react";
import { Image as ImageIcon, X, Check, Video } from "lucide-react";
import Button from "./common/Button";
import { validateImageFile } from "../utils/image";
import { MOVIE_FIELD_VALIDATORS, validateMovieField } from "../utils/validators";

// Constants

const AVAILABLE_GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Kids",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

const AVAILABLE_CERTIFICATES = ["U", "UA", "A", "PG", "PG-13", "R", "NC-17"];
const CONTENT_TYPES = ["movie", "series", "documentary", "short-film"];

//  Field validators 


//  Internal section sub-components 

const SectionPanel = ({ title, subtitle, children }) => (
  <div className="cinema-panel rounded-3xl p-6 sm:p-8 space-y-6">
    <div className="border-b border-theme pb-4">
      <h2 className="text-lg font-black text-theme">{title}</h2>
      {subtitle && <p className="muted-copy text-xs mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const FieldError = ({ id, message }) =>
  message ? (
    <p id={id} role="alert" className="mt-1 text-xs text-red-400 font-semibold">
      {message}
    </p>
  ) : null;

const FormField = ({ label, required, htmlFor, error, errorId, children }) => (
  <div>
    <label
      htmlFor={htmlFor}
      className="block text-xs font-bold text-theme mb-1.5"
    >
      {label}{" "}
      {required && (
        <span className="text-red-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
    {children}
    <FieldError id={errorId} message={error} />
  </div>
);

const ImageUploadBox = ({
  id,
  label,
  required,
  preview,
  onSelect,
  onRemove,
  error,
  errorId,
  accept = "image/jpeg,image/png,image/webp",
}) => (
  <FormField
    label={label}
    required={required}
    htmlFor={id}
    error={error}
    errorId={errorId}
  >
    <div
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-theme p-4 text-center bg-surface-soft/40 hover:bg-surface-soft/80 transition"
      aria-describedby={error ? errorId : undefined}
    >
      {preview ? (
        <div
          className="relative w-full mb-3"
          style={{ maxWidth: id === "posterFile" ? "8rem" : "100%" }}
        >
          <div
            className={`overflow-hidden rounded-xl shadow-lg border border-theme ${
              id === "posterFile" ? "h-44 w-32 mx-auto" : "h-44 w-full"
            }`}
          >
            <img
              src={preview}
              alt={`${label} preview`}
              className="h-full w-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label={`Remove ${label.toLowerCase()}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div
          className="my-4 text-muted flex flex-col items-center"
          aria-hidden="true"
        >
          <ImageIcon className="h-10 w-10 text-muted/60 mb-2" />
          <p className="text-xs font-semibold">
            JPG, PNG or WEBP — max 10 MB
          </p>
        </div>
      )}
      <label
        htmlFor={id}
        className="secondary-action cursor-pointer rounded-xl px-4 py-2 text-xs font-bold focus-within:ring-2 focus-within:ring-red-500"
      >
        {preview ? "Change Image" : "Browse File"}
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={onSelect}
          className="sr-only"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
      </label>
    </div>
    <FieldError id={errorId} message={error} />
  </FormField>
);

//  Main MovieForm component 

const MovieForm = ({
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  uploadProgress = 0,
  submitLabel = "Save Movie",
}) => {
  const buildInitialData = () => ({
    title: initialValues.title || "",
    description: initialValues.description || "",
    releaseDate: initialValues.releaseDate
      ? new Date(initialValues.releaseDate).toISOString().split("T")[0]
      : "",
    duration: initialValues.duration || 120,
    contentType: initialValues.contentType || "movie",
    genres: initialValues.genres || ["Action"],
    languages: Array.isArray(initialValues.languages)
      ? initialValues.languages.join(", ")
      : initialValues.languages || "english",
    country: initialValues.country || "United States",
    certificate: initialValues.certificate || "UA",
    director: initialValues.director || "",
    cast: Array.isArray(initialValues.cast)
      ? initialValues.cast.join(", ")
      : initialValues.cast || "",
    productionCompanies: Array.isArray(initialValues.productionCompanies)
      ? initialValues.productionCompanies.join(", ")
      : initialValues.productionCompanies || "",
    trailer: initialValues.trailer || "",
    status: initialValues.status || "released",
    publishStatus: initialValues.publishStatus || "published",
    isFeatured: Boolean(initialValues.isFeatured),
  });

  const [formData, setFormData] = useState(buildInitialData);
  const [errors, setErrors] = useState({});
  const [, setTouched] = useState({});

  // Media files & local blob preview URLs
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(
    initialValues.poster?.url ||
      (typeof initialValues.poster === "string" ? initialValues.poster : ""),
  );
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(
    initialValues.banner?.url ||
      (typeof initialValues.banner === "string" ? initialValues.banner : ""),
  );

  // Track which previews are blob URLs (created by us) so we can revoke them
  const posterBlobRef = useRef(null);
  const bannerBlobRef = useRef(null);

  // Unsaved changes detection
  const initialDataRef = useRef(buildInitialData());
  const [hasChanges, setHasChanges] = useState(false);

  // Detect if form has been dirtied compared to initial snapshot
  useEffect(() => {
    const initial = initialDataRef.current;
    const changed =
      Object.keys(formData).some((key) => {
        if (Array.isArray(formData[key]) && Array.isArray(initial[key])) {
          return JSON.stringify(formData[key]) !== JSON.stringify(initial[key]);
        }
        return String(formData[key]) !== String(initial[key]);
      }) ||
      Boolean(posterFile) ||
      Boolean(bannerFile);
    setHasChanges(changed);
  }, [formData, posterFile, bannerFile]);

  // Warn before browser refresh / tab close when form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!hasChanges || isSubmitting) return;
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges, isSubmitting]);


  // Revoke blob preview URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (posterBlobRef.current) URL.revokeObjectURL(posterBlobRef.current);
      if (bannerBlobRef.current) URL.revokeObjectURL(bannerBlobRef.current);
    };
  }, []);

  //  Field handlers 

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setFormData((prev) => ({ ...prev, [name]: newValue }));

      // Clear error immediately when field has a valid value
      if (errors[name]) {
        const errMsg = validateMovieField(name, newValue);
        if (!errMsg) setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors],
  );

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errMsg = validateMovieField(name, value);
    if (errMsg) setErrors((prev) => ({ ...prev, [name]: errMsg }));
  }, []);

  const handleGenreToggle = useCallback(
    (genre) => {
      setFormData((prev) => {
        const exists = prev.genres.includes(genre);
        const updated = exists
          ? prev.genres.filter((g) => g !== genre)
          : [...prev.genres, genre];
        return { ...prev, genres: updated };
      });
      if (errors.genres) setErrors((prev) => ({ ...prev, genres: "" }));
    },
    [errors.genres],
  );

  //  Image handlers 

  const handleImageSelect = useCallback(
    (field) => (e) => {
      const file = e.target.files?.[0];
      // Reset input so same file can be re-selected after removal
      e.target.value = "";
      if (!file) return;

      const errMsg = validateImageFile(file, 10);
      if (errMsg) {
        setErrors((prev) => ({ ...prev, [field]: errMsg }));
        return;
      }

      const blobUrl = URL.createObjectURL(file);

      if (field === "poster") {
        if (posterBlobRef.current) URL.revokeObjectURL(posterBlobRef.current);
        posterBlobRef.current = blobUrl;
        setPosterFile(file);
        setPosterPreview(blobUrl);
      } else {
        if (bannerBlobRef.current) URL.revokeObjectURL(bannerBlobRef.current);
        bannerBlobRef.current = blobUrl;
        setBannerFile(file);
        setBannerPreview(blobUrl);
      }

      setErrors((prev) => ({ ...prev, [field]: "" }));
    },
    [],
  );

  const handleRemovePoster = useCallback(() => {
    if (posterBlobRef.current) {
      URL.revokeObjectURL(posterBlobRef.current);
      posterBlobRef.current = null;
    }
    setPosterFile(null);
    setPosterPreview("");
  }, []);

  const handleRemoveBanner = useCallback(() => {
    if (bannerBlobRef.current) {
      URL.revokeObjectURL(bannerBlobRef.current);
      bannerBlobRef.current = null;
    }
    setBannerFile(null);
    setBannerPreview("");
  }, []);

  //  Validation 

  const validateAll = () => {
    const newErrors = {};

    Object.entries(MOVIE_FIELD_VALIDATORS).forEach(([name, validator]) => {
      const errMsg = validator(String(formData[name] ?? ""));
      if (errMsg) newErrors[name] = errMsg;
    });

    if (!formData.genres || formData.genres.length === 0) {
      newErrors.genres = "Please select at least one genre.";
    }

    if (!posterFile && !posterPreview) {
      newErrors.poster = "Poster image is required.";
    }
    if (!bannerFile && !bannerPreview) {
      newErrors.banner = "Banner/backdrop image is required.";
    }

    setErrors(newErrors);

    // Mark all validated fields as touched
    const touchedFields = {};
    Object.keys(MOVIE_FIELD_VALIDATORS).forEach((k) => {
      touchedFields[k] = true;
    });
    setTouched((prev) => ({ ...prev, ...touchedFields }));

    return Object.keys(newErrors).length === 0;
  };

  //  Submit 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    const castArray = formData.cast
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const prodArray = formData.productionCompanies
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const languagesArray = formData.languages
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    onSubmit({
      ...formData,
      duration: Number(formData.duration),
      cast: castArray,
      productionCompanies: prodArray,
      languages: languagesArray,
      posterFile,
      bannerFile,
    });
  };

  //  Render helpers 

  const inputClass = (name) =>
    `cinema-input py-3 px-4 text-sm${errors[name] ? " border-red-500 focus:ring-red-500" : ""}`;

  //  Render 

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-8"
        aria-label="Movie entry form"
        noValidate
      >
        {/*  1. Basic Information  */}
        <SectionPanel
          title="Basic Information"
          subtitle="Primary movie title, storyline description & availability status."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Title */}
            <div className="sm:col-span-2">
              <FormField
                label="Movie Title"
                required
                htmlFor="title"
                error={errors.title}
                errorId="title-error"
              >
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Inception"
                  className={inputClass("title")}
                  aria-required="true"
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? "title-error" : undefined}
                />
              </FormField>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <FormField
                label="Synopsis / Overview"
                required
                htmlFor="description"
                error={errors.description}
                errorId="description-error"
              >
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Write a detailed movie synopsis (at least 20 characters)..."
                  className={`${inputClass("description")} resize-y`}
                  aria-required="true"
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={
                    errors.description ? "description-error" : undefined
                  }
                />
              </FormField>
            </div>

            {/* Content Type */}
            <div>
              <label
                htmlFor="contentType"
                className="block text-xs font-bold text-theme mb-1.5"
              >
                Content Type
              </label>
              <select
                id="contentType"
                name="contentType"
                value={formData.contentType}
                onChange={handleChange}
                className="cinema-input py-3 px-4 text-sm capitalize"
              >
                {CONTENT_TYPES.map((type) => (
                  <option key={type} value={type} className="capitalize">
                    {type.replace(/-/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Release Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-xs font-bold text-theme mb-1.5"
              >
                Release Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="cinema-input py-3 px-4 text-sm"
              >
                <option value="released">Released</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>

            {/* Publish Status */}
            <div>
              <label
                htmlFor="publishStatus"
                className="block text-xs font-bold text-theme mb-1.5"
              >
                Publish Status (Website Visibility)
              </label>
              <select
                id="publishStatus"
                name="publishStatus"
                value={formData.publishStatus}
                onChange={handleChange}
                className="cinema-input py-3 px-4 text-sm"
              >
                <option value="published">Published (Visible to Public)</option>
                <option value="draft">Draft (Admin Only)</option>
              </select>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-3 pt-6">
              <input
                id="isFeatured"
                name="isFeatured"
                type="checkbox"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 rounded accent-red-600 focus:ring-red-500 cursor-pointer"
              />
              <label
                htmlFor="isFeatured"
                className="text-xs font-bold text-theme cursor-pointer select-none"
              >
                Mark as Featured Title (Displayed in Hero Banner)
              </label>
            </div>
          </div>
        </SectionPanel>

        {/*  2. Classification & Specs  */}
        <SectionPanel
          title="Classification & Specs"
          subtitle="Genres, language, duration, release date & parental certificate."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Release Date */}
            <FormField
              label="Release Date"
              required
              htmlFor="releaseDate"
              error={errors.releaseDate}
              errorId="releaseDate-error"
            >
              <input
                id="releaseDate"
                name="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass("releaseDate")}
                aria-required="true"
                aria-invalid={Boolean(errors.releaseDate)}
                aria-describedby={
                  errors.releaseDate ? "releaseDate-error" : undefined
                }
              />
            </FormField>

            {/* Duration */}
            <FormField
              label="Runtime Duration (Minutes)"
              required
              htmlFor="duration"
              error={errors.duration}
              errorId="duration-error"
            >
              <input
                id="duration"
                name="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. 148"
                className={inputClass("duration")}
                aria-required="true"
                aria-invalid={Boolean(errors.duration)}
                aria-describedby={
                  errors.duration ? "duration-error" : undefined
                }
              />
            </FormField>

            {/* Country */}
            <FormField
              label="Country of Origin"
              required
              htmlFor="country"
              error={errors.country}
              errorId="country-error"
            >
              <input
                id="country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. United States"
                className={inputClass("country")}
                aria-required="true"
                aria-invalid={Boolean(errors.country)}
                aria-describedby={errors.country ? "country-error" : undefined}
              />
            </FormField>

            {/* Certificate */}
            <div>
              <label
                htmlFor="certificate"
                className="block text-xs font-bold text-theme mb-1.5"
              >
                Content Rating Certificate
              </label>
              <select
                id="certificate"
                name="certificate"
                value={formData.certificate}
                onChange={handleChange}
                className="cinema-input py-3 px-4 text-sm"
              >
                {AVAILABLE_CERTIFICATES.map((cert) => (
                  <option key={cert} value={cert}>
                    {cert}
                  </option>
                ))}
              </select>
            </div>

            {/* Genres */}
            <div className="sm:col-span-2">
              <fieldset>
                <legend className="block text-xs font-bold text-theme mb-2">
                  Genres{" "}
                  <span className="text-red-500" aria-hidden="true">
                    *
                  </span>{" "}
                  <span className="font-normal text-muted">
                    (Select all that apply)
                  </span>
                </legend>
                <div
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-label="Movie genres"
                  aria-required="true"
                >
                  {AVAILABLE_GENRES.map((genre) => {
                    const selected = formData.genres.includes(genre);
                    return (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => handleGenreToggle(genre)}
                        aria-pressed={selected}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition border ${
                          selected
                            ? "nav-pill-active border-red-500/50 text-white"
                            : "secondary-action text-muted hover:text-theme"
                        }`}
                      >
                        {selected && (
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        <span>{genre}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.genres && (
                  <p
                    role="alert"
                    className="mt-2 text-xs text-red-400 font-semibold"
                  >
                    {errors.genres}
                  </p>
                )}
              </fieldset>
            </div>

            {/* Languages */}
            <div className="sm:col-span-2">
              <label
                htmlFor="languages"
                className="block text-xs font-bold text-theme mb-1.5"
              >
                Available Languages{" "}
                <span className="font-normal text-muted">
                  (Comma-separated)
                </span>
              </label>
              <input
                id="languages"
                name="languages"
                type="text"
                value={formData.languages}
                onChange={handleChange}
                placeholder="e.g. english, hindi, spanish"
                className="cinema-input py-3 px-4 text-sm"
              />
            </div>
          </div>
        </SectionPanel>

        {/*  3. Cast & Production Team  */}
        <SectionPanel
          title="Cast & Production Team"
          subtitle="Director, starring actors & production studios."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Director */}
            <FormField
              label="Director"
              required
              htmlFor="director"
              error={errors.director}
              errorId="director-error"
            >
              <input
                id="director"
                name="director"
                type="text"
                value={formData.director}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Christopher Nolan"
                className={inputClass("director")}
                aria-required="true"
                aria-invalid={Boolean(errors.director)}
                aria-describedby={
                  errors.director ? "director-error" : undefined
                }
              />
            </FormField>

            {/* Production Companies */}
            <div>
              <label
                htmlFor="productionCompanies"
                className="block text-xs font-bold text-theme mb-1.5"
              >
                Production Studios{" "}
                <span className="font-normal text-muted">
                  (Comma-separated)
                </span>
              </label>
              <input
                id="productionCompanies"
                name="productionCompanies"
                type="text"
                value={formData.productionCompanies}
                onChange={handleChange}
                placeholder="e.g. Warner Bros, Syncopy"
                className="cinema-input py-3 px-4 text-sm"
              />
            </div>

            {/* Cast */}
            <div className="sm:col-span-2">
              <label
                htmlFor="cast"
                className="block text-xs font-bold text-theme mb-1.5"
              >
                Starring Cast{" "}
                <span className="font-normal text-muted">
                  (Comma-separated names)
                </span>
              </label>
              <input
                id="cast"
                name="cast"
                type="text"
                value={formData.cast}
                onChange={handleChange}
                placeholder="e.g. Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page"
                className="cinema-input py-3 px-4 text-sm"
              />
            </div>
          </div>
        </SectionPanel>

        {/*  4. Media Assets & Trailer  */}
        <SectionPanel
          title="Media Assets & Trailer"
          subtitle="Poster image, backdrop banner & official YouTube trailer link."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Poster Upload */}
            <ImageUploadBox
              id="posterFile"
              label="Poster Image (2:3 Portrait)"
              required
              preview={posterPreview}
              onSelect={handleImageSelect("poster")}
              onRemove={handleRemovePoster}
              error={errors.poster}
              errorId="poster-error"
            />

            {/* Banner Upload */}
            <ImageUploadBox
              id="bannerFile"
              label="Banner / Backdrop (16:9 Landscape)"
              required
              preview={bannerPreview}
              onSelect={handleImageSelect("banner")}
              onRemove={handleRemoveBanner}
              error={errors.banner}
              errorId="banner-error"
            />

            {/* Trailer URL */}
            <div className="sm:col-span-2">
              <label
                htmlFor="trailer"
                className="block text-xs font-bold text-theme mb-1.5"
              >
                Official YouTube Trailer URL
              </label>
              <div className="relative">
                <input
                  id="trailer"
                  name="trailer"
                  type="url"
                  value={formData.trailer}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=YoHD9XEInc0"
                  className="cinema-input py-3 pl-10 pr-4 text-sm"
                />
                <Video
                  className="absolute left-3.5 top-3.5 h-4 w-4 text-red-500 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </SectionPanel>

        {/*  Upload Progress  */}
        {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
          <div
            className="cinema-panel rounded-2xl p-4"
            role="status"
            aria-live="polite"
            aria-label={`Upload progress: ${uploadProgress}%`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-theme mb-2">
              <span>Uploading Media Assets…</span>
              <span aria-hidden="true">{uploadProgress}%</span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-surface-soft"
              aria-hidden="true"
            >
              <div
                className="h-full bg-red-600 transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/*  Submit Actions  */}
        <div className="flex items-center justify-between gap-4 pt-2">
          {hasChanges && !isSubmitting && (
            <p
              className="text-xs font-semibold text-amber-400"
              role="status"
              aria-live="polite"
            >
              You have unsaved changes.
            </p>
          )}
          <div className="ml-auto">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
            >
              {submitLabel}
            </Button>
          </div>
        </div>
      </form>

    </>
  );
};

export default MovieForm;
