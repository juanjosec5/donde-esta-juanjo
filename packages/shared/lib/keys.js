// Injection keys shared across the render surface.
export const PAGE = Symbol.for("trip.page"); // the resolved render model
export const NOW = Symbol.for("trip.now"); // a ref<number> ticking every second
export const EMBEDDED = Symbol.for("trip.embedded"); // true inside the builder preview
