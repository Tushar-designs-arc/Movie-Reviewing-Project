import { useEffect } from "react";
import { APP_TITLE } from "../config/config";

const usePageMetadata = ({ title, description } = {}) => {
  useEffect(() => {
    const previousTitle = document.title;
    const existingDescription = document.querySelector(
      'meta[name="description"]',
    );
    const previousDescription = existingDescription?.content;
    let createdDescription = false;

    if (title) {
      document.title = `${title} • ${APP_TITLE}`;
    } else {
      document.title = APP_TITLE;
    }

    if (description !== undefined) {
      const descriptionTag =
        existingDescription || document.createElement("meta");
      if (!existingDescription) {
        descriptionTag.name = "description";
        document.head.appendChild(descriptionTag);
        createdDescription = true;
      }
      descriptionTag.content = description || "";
    }

    return () => {
      document.title = previousTitle;
      if (description !== undefined) {
        const descriptionTag = document.querySelector(
          'meta[name="description"]',
        );
        if (createdDescription) {
          descriptionTag?.remove();
        } else if (descriptionTag) {
          descriptionTag.content = previousDescription || "";
        }
      }
    };
  }, [description, title]);
};

export default usePageMetadata;
