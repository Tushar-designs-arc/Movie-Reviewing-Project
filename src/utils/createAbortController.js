export // Give request-heavy pages a small common cleanup primitive instead of repeating stale-response guards.
const createAbortController = () => {
  const controller = new AbortController();

  return {
    controller,
    signal: controller.signal,
    abort: () => controller.abort(),
  };
};
