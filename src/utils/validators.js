export const MOVIE_FIELD_VALIDATORS = {
  title: (value) => (value.trim() ? "" : "Movie title is required."),
  description: (value) =>
    !value.trim()
      ? "Description is required."
      : value.trim().length < 20
        ? "Description must be at least 20 characters."
        : "",
  releaseDate: (value) => (value ? "" : "Release date is required."),
  duration: (value) =>
    !value || Number(value) <= 0 ? "Duration must be greater than 0." : "",
  director: (value) => (value.trim() ? "" : "Director name is required."),
  country: (value) => (value.trim() ? "" : "Country of origin is required."),
};

export const validateMovieField = (name, value) =>
  MOVIE_FIELD_VALIDATORS[name]?.(String(value ?? "")) ?? "";
