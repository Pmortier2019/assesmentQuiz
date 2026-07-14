// Remotion entry point. Kept separate from the Next.js app; the two share
// nothing at runtime except the question data in src/lib/professionDemo.ts.
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
