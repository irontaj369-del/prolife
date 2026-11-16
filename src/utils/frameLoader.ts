import { FlavorId, FLAVORS } from '../types/flavor';

// In-memory cache for decoded images: key is `${flavorId}_${frameIndex}`
const imageCache = new Map<string, HTMLImageElement>();
// Track loading status: 'loading' | 'loaded' | 'error'
const loadStatus = new Map<string, 'loading' | 'loaded' | 'error'>();
// Set of loaded frame indices per flavor
const loadedFramesPerFlavor = new Map<FlavorId, Set<number>>();

// Listeners for load progress updates
type ProgressListener = (flavor: FlavorId, loadedCount: number, totalCount: number) => void;
const progressListeners = new Set<ProgressListener>();

export function subscribeToProgress(listener: ProgressListener): () => void {
  progressListeners.add(listener);
  return () => {
    progressListeners.delete(listener);
  };
}

function notifyProgress(flavor: FlavorId) {
  const loadedSet = loadedFramesPerFlavor.get(flavor);
  const loadedCount = loadedSet ? loadedSet.size : 0;
  const total = FLAVORS[flavor].frameCount;
  progressListeners.forEach((fn) => fn(flavor, loadedCount, total));
}

/**
 * Get frame URL.
 * Local files are used for frame 0 and frame 189 for instant rendering,
 * while the full 190 frames are fetched from the Supabase public storage.
 */
export function getFrameUrl(flavor: FlavorId, index: number, useRemote = false): string {
  const cfg = FLAVORS[flavor];
  const pad = String(index).padStart(3, '0');

  // Instant local frames for 0 and 189
  if (!useRemote && index === 0 && cfg.initialLocalFrame) {
    return cfg.initialLocalFrame;
  }
  if (!useRemote && index === cfg.frameCount - 1 && cfg.finalLocalFrame) {
    return cfg.finalLocalFrame;
  }

  if (useRemote) {
    return `https://fwvmxmjhgghpahpfauvy.supabase.co/storage/v1/object/public/protein/${cfg.supabaseFolder}/frame_${pad}_delay-0.042s.png`;
  }

  // Local static frame
  return `/frames/${flavor}/frame_${pad}_delay-0.042s.png`;
}

/**
 * Load a single frame and cache it.
 * Tries local static asset first; falls back to remote Supabase CDN on error.
 */
export function loadFrame(flavor: FlavorId, index: number): Promise<HTMLImageElement> {
  const key = `${flavor}_${index}`;
  const existing = imageCache.get(key);
  if (existing && existing.complete && existing.naturalWidth > 0) {
    return Promise.resolve(existing);
  }

  const currentStatus = loadStatus.get(key);
  if (currentStatus === 'loading' && existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(existing), { once: true });
      existing.addEventListener('error', (err) => reject(err), { once: true });
    });
  }

  loadStatus.set(key, 'loading');
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.decoding = 'async';
  imageCache.set(key, img);

  return new Promise((resolve, reject) => {
    let triedRemote = false;

    img.onload = () => {
      loadStatus.set(key, 'loaded');
      let set = loadedFramesPerFlavor.get(flavor);
      if (!set) {
        set = new Set();
        loadedFramesPerFlavor.set(flavor, set);
      }
      set.add(index);
      notifyProgress(flavor);
      resolve(img);
    };

    img.onerror = (err) => {
      if (!triedRemote) {
        // Fallback to Supabase CDN
        triedRemote = true;
        img.src = getFrameUrl(flavor, index, true);
      } else {
        loadStatus.set(key, 'error');
        reject(err);
      }
    };

    // Try local frame first
    img.src = getFrameUrl(flavor, index, false);
  });
}

/**
 * Returns the best available image for this flavor and target index:
 * Exact match if loaded, or nearest loaded neighbor, or frame 0.
 */
export function getBestAvailableFrame(flavor: FlavorId, targetIndex: number): HTMLImageElement | null {
  const key = `${flavor}_${targetIndex}`;
  const exact = imageCache.get(key);
  if (exact && exact.complete && exact.naturalWidth > 0) {
    return exact;
  }

  const set = loadedFramesPerFlavor.get(flavor);
  if (!set || set.size === 0) {
    // Check if initial frame 0 is already in cache
    const zero = imageCache.get(`${flavor}_0`);
    if (zero && zero.complete && zero.naturalWidth > 0) return zero;
    return null;
  }

  // Find nearest index
  let bestIdx = 0;
  let minDiff = Infinity;
  for (const idx of set) {
    const diff = Math.abs(idx - targetIndex);
    if (diff < minDiff) {
      minDiff = diff;
      bestIdx = idx;
    }
  }

  const best = imageCache.get(`${flavor}_${bestIdx}`);
  return best && best.complete && best.naturalWidth > 0 ? best : null;
}

/**
 * Queue priority preloader for a flavor.
 */
class PriorityQueueLoader {
  private activeCount = 0;
  private maxConcurrent = 6;
  private queue: Array<{ flavor: FlavorId; index: number; priority: number }> = [];
  private currentFlavor: FlavorId = 'chocolate';
  private isProcessing = false;

  public setFocus(flavor: FlavorId, currentFrame: number = 0) {
    this.currentFlavor = flavor;

    // Immediately load frame 0 and final frame
    loadFrame(flavor, 0).catch(() => {});
    loadFrame(flavor, FLAVORS[flavor].frameCount - 1).catch(() => {});

    // Clear old queue items from other flavors
    this.queue = this.queue.filter((item) => item.flavor === flavor);

    // Build prioritized batch:
    // 1. Immediate neighborhood of currentFrame (+/- 10)
    // 2. Sparse keyframes across full timeline (step 10)
    // 3. Dense remainder
    const total = FLAVORS[flavor].frameCount;
    const items: Array<{ flavor: FlavorId; index: number; priority: number }> = [];

    // Near current frame
    for (let i = Math.max(0, currentFrame - 15); i <= Math.min(total - 1, currentFrame + 15); i++) {
      items.push({ flavor, index: i, priority: 100 - Math.abs(i - currentFrame) });
    }

    // Keyframes
    for (let i = 0; i < total; i += 10) {
      items.push({ flavor, index: i, priority: 50 });
    }

    // Remainder
    for (let i = 0; i < total; i++) {
      items.push({ flavor, index: i, priority: 10 });
    }

    // Deduplicate & sort by priority descending
    const seen = new Set<number>();
    const filtered: typeof items = [];
    for (const it of items) {
      if (!seen.has(it.index)) {
        seen.add(it.index);
        const key = `${it.flavor}_${it.index}`;
        const st = loadStatus.get(key);
        if (st !== 'loaded') {
          filtered.push(it);
        }
      }
    }

    filtered.sort((a, b) => b.priority - a.priority);
    this.queue = filtered;
    this.processQueue();
  }

  private processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    const pump = () => {
      while (this.activeCount < this.maxConcurrent && this.queue.length > 0) {
        const next = this.queue.shift();
        if (!next) break;

        const key = `${next.flavor}_${next.index}`;
        if (loadStatus.get(key) === 'loaded') {
          continue;
        }

        this.activeCount++;
        loadFrame(next.flavor, next.index)
          .catch(() => {})
          .finally(() => {
            this.activeCount--;
            pump();
          });
      }

      if (this.queue.length === 0 && this.activeCount === 0) {
        this.isProcessing = false;
      }
    };

    pump();
  }
}

export const queueLoader = new PriorityQueueLoader();

// Warm up initial frames for all flavors on application start
export function warmUpInitialFrames() {
  (['chocolate', 'strawberry', 'cookies'] as FlavorId[]).forEach((flavor) => {
    loadFrame(flavor, 0).catch(() => {});
    loadFrame(flavor, FLAVORS[flavor].frameCount - 1).catch(() => {});
  });
}
