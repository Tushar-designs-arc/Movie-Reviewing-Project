const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse rounded-lg bg-surface-soft/60 ${className}`}
    />
  );
};

export default Skeleton;
