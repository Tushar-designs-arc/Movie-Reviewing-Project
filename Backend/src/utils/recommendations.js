const scoreContent = (target, candidate) => {
  if (!target || target.slug === candidate.slug) {
    return -1;
  }

  const sharedGenres = candidate.genre.filter((item) => target.genre.includes(item)).length;
  const typeBoost = target.type === candidate.type ? 2 : 0;
  const ratingBoost = candidate.rating / 10;
  const freshBoost = candidate.isRecentlyAdded ? 0.4 : 0;

  return sharedGenres * 3 + typeBoost + ratingBoost + freshBoost;
};

const getRecommendations = (contents, target, limit = 8) =>
  [...contents]
    .map((content) => ({ content, score: scoreContent(target, content) }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Number(limit) || 8)
    .map((item) => item.content);

module.exports = {
  getRecommendations,
};
