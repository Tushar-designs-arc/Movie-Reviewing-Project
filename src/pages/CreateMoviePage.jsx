import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { createMovieApi } from "../api/movies";
import { useToast } from "../context/ToastContext";
import usePageMetadata from "../hooks/usePageMetadata";
import MovieForm from "../components/MovieForm";
import { ROUTES } from "../constants/routes";

const CreateMoviePage = () => {
  usePageMetadata({
    title: "Add New Movie",
    description:
      "Upload posters, backdrop banners and create a new title entry",
  });

  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (formDataPayload) => {
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();

      // Append text fields
      formData.append("title", formDataPayload.title.trim());
      formData.append("description", formDataPayload.description.trim());
      formData.append("releaseDate", formDataPayload.releaseDate);
      formData.append("duration", formDataPayload.duration);
      formData.append("contentType", formDataPayload.contentType);
      formData.append("country", formDataPayload.country.trim());
      formData.append("certificate", formDataPayload.certificate);
      formData.append("director", formDataPayload.director.trim());
      formData.append("status", formDataPayload.status);
      formData.append("publishStatus", formDataPayload.publishStatus);
      formData.append("isFeatured", String(formDataPayload.isFeatured));

      if (formDataPayload.trailer) {
        formData.append("trailer", formDataPayload.trailer.trim());
      }

      // Append JSON stringified arrays for backend parseFormData
      formData.append("genres", JSON.stringify(formDataPayload.genres));
      formData.append("languages", JSON.stringify(formDataPayload.languages));
      formData.append("cast", JSON.stringify(formDataPayload.cast));
      formData.append(
        "productionCompanies",
        JSON.stringify(formDataPayload.productionCompanies),
      );

      // Append files
      if (formDataPayload.posterFile) {
        formData.append("poster", formDataPayload.posterFile);
      }
      if (formDataPayload.bannerFile) {
        formData.append("banner", formDataPayload.bannerFile);
      }

      await createMovieApi(formData, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percent);
        }
      });

      showToast(
        `Movie "${formDataPayload.title}" created successfully!`,
        "success",
      );
      navigate(ROUTES.MOVIES, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create movie entry.";
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme pb-6">
        <div>
          <Link
            to={ROUTES.MOVIES}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-theme transition mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Movies Catalogue
          </Link>
          <h1 className="text-2xl font-black text-theme sm:text-3xl">
            Add New Movie
          </h1>
          <p className="muted-copy mt-1 text-xs">
            Fill in metadata, classification & upload poster/banner images.
          </p>
        </div>
      </div>

      {/* Movie Form */}
      <MovieForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        uploadProgress={uploadProgress}
        submitLabel="Create Movie Entry"
      />
    </div>
  );
};

export default CreateMoviePage;
