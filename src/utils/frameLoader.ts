import { FlavorId, FLAVORS } from '../types/flavor';

export type FrameDrawable = ImageBitmap | HTMLImageElement;

// In-memory cache for pre-decoded frames: key is `${flavorId}_${frameIndex}`
const frameCache = new Map<string, FrameDrawable>();
// Track loading status: 'loading' | 'loaded' | 'error'
const loadStatus = new Map<string, 'loading' | 'loaded' | 'error'>();
// Deduplicate concurrent requests for the same frame
const inflightPromises = new Map<string, Promise<FrameDrawable>>();
// Set of loaded frame indices per flavor
const loadedFramesPerFlavor = new Map<FlavorId, Set<number>>();
// Sorted array cache or quick neighbor lookup helper

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

export function getFrameDimensions(frame: FrameDrawable): { width: number; height: number } {
  if (typeof HTMLImageElement !== 'undefined' && frame instanceof HTMLImageElement) {
    return { width: frame.naturalWidth, height: frame.naturalHeight };
  }
  return { width: frame.width, height: frame.height };
}

export function isFrameReady(frame: FrameDrawable | null | undefined): frame is FrameDrawable {
  if (!frame) return false;
  if (typeof HTMLImageElement !== 'undefined' && frame instanceof HTMLImageElement) {
    return frame.complete && frame.naturalWidth > 0;
  }
  return frame.width > 0 && frame.height > 0;
}

/**
 * Get frame URL.
 * Local optimized WebP assets are used for instant download and zero-lag decoding.
 * Falls back to remote Supabase CDN PNGs if a local file is unavailable.
 */
export function getFrameUrl(flavor: FlavorId, index: number, useRemote = false): string {
  const cfg = FLAVORS[flavor];
  const pad = String(index).padStart(3, '0');

  if (!useRemote && index === 0 && cfg.initialLocalFrame) {
    return cfg.initialLocalFrame;
  }
  if (!useRemote && index === cfg.frameCount - 1 && cfg.finalLocalFrame) {
    return cfg.finalLocalFrame;
  }

  if (useRemote) {
    return `https://fwvmxmjhgghpahpfauvy.supabase.co/storage/v1/object/public/protein/${cfg.supabaseFolder}/frame_${pad}_delay-0.042s.png`;
  }

  return `/frames/${flavor}/frame_${pad}.webp`;
}

async function fetchAndDecodeBitmap(url: string): Promise<FrameDrawable> {
  if (typeof createImageBitmap === 'function') {
    const response = await fetch(url, { cache: 'force-cache' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const blob = await response.blob();
    return await createImageBitmap(blob);
  }

  return await loadImageElement(url);
}

function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = async () => {
      try {
        if (typeof img.decode === 'function') {
          await img.decode();
        }
      } catch {
        // Ignore decode rejection if image is still drawable
      }
      resolve(img);
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

/**
 * Load and off-main-thread decode a single frame, then cache its GPU-ready ImageBitmap.
 */
export function loadFrame(flavor: FlavorId, index: number): Promise<FrameDrawable> {
  const key = `${flavor}_${index}`;
  const existing = frameCache.get(key);
  if (isFrameReady(existing)) {
    return Promise.resolve(existing);
  }

  const inflight = inflightPromises.get(key);
  if (inflight) {
    return inflight;
  }

  loadStatus.set(key, 'loading');

  const promise = (async () => {
    let decoded: FrameDrawable;
    try {
      decoded = await fetchAndDecodeBitmap(getFrameUrl(flavor, index, false));
    } catch {
      // Fallback to remote Supabase PNG via Image element + decode()
      decoded = await loadImageElement(getFrameUrl(flavor, index, true));
    }

    frameCache.set(key, decoded);
    loadStatus.set(key, 'loaded');

    let set = loadedFramesPerFlavor.get(flavor);
    if (!set) {
      set = new Set();
      loadedFramesPerFlavor.set(flavor, set);
    }
    set.add(index);
    notifyProgress(flavor);
    return decoded;
  })()
    .catch((err) => {
      loadStatus.set(key, 'error');
      throw err;
    })
    .finally(() => {
      inflightPromises.delete(key);
    });

  inflightPromises.set(key, promise);
  return promise;
}

/**
 * Returns the exact decoded frame if ready, or nearest decoded neighbor (fast outward scan).
 */
export function getBestAvailableFrame(flavor: FlavorId, targetIndex: number): FrameDrawable | null {
  const exact = frameCache.get(`${flavor}_${targetIndex}`);
  if (isFrameReady(exact)) {
    return exact;
  }

  const set = loadedFramesPerFlavor.get(flavor);
  if (!set || set.size === 0) {
    const zero = frameCache.get(`${flavor}_0`);
    return isFrameReady(zero) ? zero : null;
  }

  // Fast outward search from targetIndex (O(distance) instead of scanning full set)
  const total = FLAVORS[flavor].frameCount;
  for (let offset = 1; offset < total; offset++) {
    const down = targetIndex - offset;
    if (down >= 0 && set.has(down)) {
      const f = frameCache.get(`${flavor}_${down}`);
      if (isFrameReady(f)) return f;
    }
    const up = targetIndex + offset;
    if (up < total && set.has(up)) {
      const f = frameCache.get(`${flavor}_${up}`);
      if (isFrameReady(f)) return f;
    }
  }

  return null;
}

/**
 * High-throughput priority queue preloader with background multi-flavor warming.
 */
class PriorityQueueLoader {
  private activeCount = 0;
  private maxConcurrent = 10;
  private queue: Array<{ flavor: FlavorId; index: number; priority: number }> = [];
  private currentFlavor: FlavorId = 'chocolate';
  private lastFocusFlavor: FlavorId | null = null;
  private lastFocusFrame = -999;
  private backgroundWarmed = false;

  public setFocus(flavor: FlavorId, currentFrame: number = 0) {
    // Avoid rebuilding & sorting the queue on every single scroll pixel
    if (
      this.lastFocusFlavor === flavor &&
      Math.abs(currentFrame - this.lastFocusFrame) < 6 &&
      this.queue.length > 0
    ) {
      return;
    }

    this.lastFocusFlavor = flavor;
    this.lastFocusFrame = currentFrame;
    this.currentFlavor = flavor;

    const total = FLAVORS[flavor].frameCount;

    // Immediately ensure frame 0 and final frame are fetched
    loadFrame(flavor, 0).catch(() => {});
    loadFrame(flavor, total - 1).catch(() => {});

    // Check if active flavor is already completely loaded
    const loadedSet = loadedFramesPerFlavor.get(flavor);
    if (loadedSet && loadedSet.size >= total) {
      this.scheduleOtherFlavors();
      return;
    }

    const items: Array<{ flavor: FlavorId; index: number; priority: number }> = [];
    const seen = new Set<number>();

    const addCandidate = (idx: number, priority: number) => {
      if (idx < 0 || idx >= total || seen.has(idx)) return;
      seen.add(idx);
      const key = `${flavor}_${idx}`;
      if (loadStatus.get(key) !== 'loaded') {
        items.push({ flavor, index: idx, priority });
      }
    };

    // 1. Immediate neighborhood around current scroll frame (+/- 18)
    for (let offset = 0; offset <= 18; offset++) {
      addCandidate(currentFrame + offset, 200 - offset);
      addCandidate(currentFrame - offset, 200 - offset);
    }

    // 2. Dense keyframes across full timeline (every 4th frame) for smooth scrubbing immediately
    for (let i = 0; i < total; i += 4) {
      addCandidate(i, 120);
    }

    // 3. Even fill (every 2nd frame)
    for (let i = 0; i < total; i += 2) {
      addCandidate(i, 60);
    }

    // 4. All remaining frames
    for (let i = 0; i < total; i++) {
      addCandidate(i, 20);
    }

    items.sort((a, b) => b.priority - a.priority);
    this.queue = items;
    this.pump();
  }

  private scheduleOtherFlavors() {
    if (this.backgroundWarmed) return;
    this.backgroundWarmed = true;

    const otherFlavors = (['chocolate', 'strawberry', 'cookies'] as FlavorId[]).filter(
      (f) => f !== this.currentFlavor
    );

    const extras: Array<{ flavor: FlavorId; index: number; priority: number }> = [];
    for (const f of otherFlavors) {
      const total = FLAVORS[f].frameCount;
      // Keyframes first, then remaining frames
      for (let i = 0; i < total; i += 4) {
        if (loadStatus.get(`${f}_${i}`) !== 'loaded') {
          extras.push({ flavor: f, index: i, priority: 5 });
        }
      }
      for (let i = 0; i < total; i++) {
        if (i % 4 !== 0 && loadStatus.get(`${f}_${i}`) !== 'loaded') {
          extras.push({ flavor: f, index: i, priority: 1 });
        }
      }
    }

    if (extras.length > 0) {
      this.queue.push(...extras);
      this.pump();
    }
  }

  private pump() {
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
          if (this.queue.length === 0 && this.activeCount === 0) {
            const loadedSet = loadedFramesPerFlavor.get(this.currentFlavor);
            if (loadedSet && loadedSet.size >= FLAVORS[this.currentFlavor].frameCount) {
              this.scheduleOtherFlavors();
            }
          }
          this.pump();
        });
    }
  }
}

export const queueLoader = new PriorityQueueLoader();

// Warm up initial and final frames for all flavors immediately on startup
export function warmUpInitialFrames() {
  (['chocolate', 'strawberry', 'cookies'] as FlavorId[]).forEach((flavor) => {
    loadFrame(flavor, 0).catch(() => {});
    loadFrame(flavor, FLAVORS[flavor].frameCount - 1).catch(() => {});
  });
}
