import ContentCard from "./ContentCard";

const MovieCard = ({ movie, item, ...props }) => <ContentCard item={item || movie} {...props} />;

export default MovieCard;
