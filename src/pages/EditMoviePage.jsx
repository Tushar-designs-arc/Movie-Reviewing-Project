import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { getMovieByIdApi, updateMovieApi } from "../api/movies";
import { createAbortController } from "../utils/createAbortController";
import { isCancellationError } from "../utils/apiError";
import { useToast } from "../context/ToastContext";
import usePageMetadata from "../hooks/usePageMetadata";
import MovieForm from "../components/MovieForm";
import ErrorState from "../components/common/ErrorState";
import { ROUTES } from "../constants/routes";

const EditMoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  usePageMetadata({
    title: "Edit Movie Entry",
    description:
      "Update movie details, metadata, classification and media assets",
  });

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const { controller, signal } = createAbortController();
    let isMounted = true;

    const loadMovie = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getMovieByIdApi(id, signal);
        const data = response?.data || response;
        if (isMounted) setMovie(data);
      } catch (err) {
        if (!isCancellationError(err) && isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load movie details.",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMovie();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id, retryKey]);

  const handleSubmit = async (formDataPayload) => {
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      const targetId = movie?._id || id;

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

      formData.append("genres", JSON.stringify(formDataPayload.genres));
      formData.append("languages", JSON.stringify(formDataPayload.languages));
      formData.append("cast", JSON.stringify(formDataPayload.cast));
      formData.append(
        "productionCompanies",
        JSON.stringify(formDataPayload.productionCompanies),
      );

      if (formDataPayload.posterFile) {
        formData.append("poster", formDataPayload.posterFile);
      }
      if (formDataPayload.bannerFile) {
        formData.append("banner", formDataPayload.bannerFile);
      }

      await updateMovieApi(targetId, formData, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percent);
        }
      });

      showToast(
        `Movie "${formDataPayload.title}" updated successfully!`,
        "success",
      );
      navigate(`/movies/${targetId}`, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update movie entry.";
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="section-shell grid min-h-[50vh] place-items-center py-16">
        <div className="cinema-panel flex flex-col items-center rounded-2xl p-8 text-center shadow-2xl">
          <LoaderCircle className="h-8 w-8 animate-spin text-red-500" />
          <p className="mt-4 text-sm font-bold text-theme">
            Loading Movie Entry...
          </p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="space-y-6">
        <Link
          to={ROUTES.MOVIES}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-theme transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Movies Catalogue
        </Link>
        <ErrorState
          title="Movie Entry Not Found"
          message={error || "The requested movie entry could not be retrieved."}
          onRetry={() => setRetryKey((k) => k + 1)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme pb-6">
        <div>
          <Link
            to={ROUTES.MOVIES}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-theme transition mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Movies Catalogue
          </Link>
          <h1 className="text-2xl font-black text-theme sm:text-3xl">
            Edit Movie: {movie.title}
          </h1>
          <p className="muted-copy mt-1 text-xs">
            Update metadata, classification, media posters or publication
            status.
          </p>
        </div>
      </div>

      {/* Movie Form */}
      <MovieForm
        initialValues={movie}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        uploadProgress={uploadProgress}
        submitLabel="Update Movie Entry"
      />
    </div>
  );
};

export default EditMoviePage;
