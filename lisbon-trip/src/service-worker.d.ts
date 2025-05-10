declare module '$service-worker' {
    /** hashed build assets */
    export const build: string[];
    /** files in static/ */
    export const files: string[];
    /** build hash */
    export const version: string;
}
