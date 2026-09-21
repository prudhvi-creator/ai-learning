// Never persist readiness: every sign-in must read before writing.
export function createCloudSession(currentUid: () => string | undefined) {
  let generation = 0;
  let loadedUid: string | null = null;
  return {
    invalidate() {
      generation++;
      loadedUid = null;
    },
    canWrite(uid: string) {
      return loadedUid === uid && currentUid() === uid;
    },
    beginLoad(uid: string) {
      const request = ++generation;
      loadedUid = null;
      const isCurrent = () => request === generation && currentUid() === uid;
      return {
        isCurrent,
        complete() {
          if (isCurrent()) loadedUid = uid;
        },
      };
    },
  };
}
