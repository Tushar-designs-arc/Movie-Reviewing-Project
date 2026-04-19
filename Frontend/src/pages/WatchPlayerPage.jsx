import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { mediaUrl } from "../api/client";
import ContentRail from "../components/ContentRail";
import { contentId } from "../utils/content";

const WatchPlayerPage = () => {
  const { id } = useParams();
  const videoRef = useRef(null);
  const lastSyncRef = useRef(0);
  const [content, setContent] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const loadDetails = async () => {
      const { data } = await api.get(`/content/${id}`);
      setContent(data.content);
      setRecommendations(data.recommendations || []);
    };

    loadDetails();
  }, [id]);

  const syncProgress = async (force = false) => {
    const video = videoRef.current;

    if (!video || !content || !video.duration) {
      return;
    }

    const now = Date.now();

    if (!force && now - lastSyncRef.current < 10000) {
      return;
    }

    lastSyncRef.current = now;
    const progress = Math.min((video.currentTime / video.duration) * 100, 100);

    try {
      await api.post("/user/continue-watching", {
        contentId: contentId(content),
        progress,
        duration: Math.round(video.duration),
      });
    } catch {
      // Playback should never be interrupted by a tracking failure.
    }
  };

  if (!content) {
    return (
      <div className="pt-20">
        <div className="h-[70vh] animate-pulse bg-white/[0.08]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 pt-20">
      <section className="section-shell py-6">
        <Link
          to={`/details/${contentId(content)}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-neutral-300 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to details
        </Link>
        <div className="cinema-panel overflow-hidden rounded-lg bg-black p-1">
          <video
            ref={videoRef}
            controls
            autoPlay
            poster={content.banner}
            src={mediaUrl(content.videoUrl)}
            onTimeUpdate={() => syncProgress(false)}
            onPause={() => syncProgress(true)}
            onEnded={() => syncProgress(true)}
            className="aspect-video w-full rounded-md bg-black"
          />
        </div>
        <div className="mt-5">
          <h1 className="text-3xl font-black text-white">{content.title}</h1>
          <p className="mt-2 max-w-3xl text-neutral-400">{content.description}</p>
        </div>
      </section>

      <ContentRail title="More Like This" items={recommendations} />
    </div>
  );
};

export default WatchPlayerPage;
