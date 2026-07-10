# Auto-posting question Shorts with Make.com + Google Drive

Goal: render locally, and have each Short posted to YouTube automatically on a
schedule — without writing an uploader or passing YouTube's API audit (Make's
YouTube connection is already verified, so uploads publish publicly).

The flow:

```
npm run video:render  ──►  Google Drive folder  ──►  Make.com scenario  ──►  YouTube
   (.mp4 + .json)          (synced from disk)        (1 video per run)
```

Each render writes, per video, a `<id>.mp4` and a `<id>.json` with the
`title`, `description`, `tags[]`, and `privacyStatus` Make needs.

## One-time setup

### 1. A Drive-synced output folder
1. Install **Google Drive for desktop** and sign in.
2. Make a folder in your Drive, e.g. `ready-to-ace/shorts-queue`. Note its local
   path (something like `G:\My Drive\ready-to-ace\shorts-queue`).
3. Render straight into it with the `VIDEO_OUT_DIR` env var:

   ```powershell
   # PowerShell
   $env:VIDEO_OUT_DIR = "G:\My Drive\ready-to-ace\shorts-queue"; npm run video:render
   ```

   The `.mp4` + `.json` land in the folder and sync to Drive automatically.
   (Leave `VIDEO_OUT_DIR` unset to render to the default `out/videos`.)

### 2. The Make.com scenario
Create a new scenario with these modules:

1. **Google Drive → Watch Files in a Folder**
   - Folder: your `shorts-queue`.
   - Filter/limit: set **Maximum number of results = 1** so it processes one
     video per run (this is what drips one Short per schedule tick).
   - Add a filter after it: continue only if the file **name ends with `.mp4`**
     (so the `.json`/`.txt` don't trigger uploads).

2. **Google Drive → Download a File** (the video)
   - File: the file from the trigger. This gives Make the video binary.

3. **Google Drive → Search for Files**
   - Query: same base name as the video but `.json`
     (e.g. name = `{{replace(trigger.name; ".mp4"; ".json")}}`), in the same folder.

4. **Google Drive → Download a File** (the JSON) → **JSON → Parse JSON**
   - Parse the downloaded JSON text into `title`, `description`, `tags`, `privacyStatus`.

5. **YouTube → Upload a Video**
   - Connect your YouTube channel (Make handles the OAuth; public upload works).
   - Video content: the binary from step 2.
   - Title → `title`, Description → `description`, Tags → `tags` (array maps
     straight in), Privacy → `privacyStatus` (`public`).
   - Category: "Education". Made for kids: **No**.

6. **Schedule the scenario**
   - Set the scenario clock to run e.g. **once a day** at a good posting time.
     With "max results = 1" on the trigger, that posts one Short per day, oldest
     first, until the queue is empty.

## Notes & gotchas
- **Don't re-render over posted files.** The Watch trigger tracks what it has
  seen, but re-rendering overwrites a file (new modified time) and can re-trigger
  an upload. Either only render *new* questions (new ids), or add a final
  **Google Drive → Move a File** step into a `posted/` subfolder so uploaded
  videos leave the queue.
- **Free tier.** Make's free plan runs scheduled scenarios and has a monthly
  operations cap; one-Short-a-day is well within it.
- **Scheduling inside YouTube instead.** If you'd rather publish at an exact
  time, set Privacy = "Private" + a `publishAt` in the YouTube module, but for a
  simple daily drip, "public on run" is easiest.
- **Titles/tags** come entirely from the `.json`; tweak the templates in
  `scripts/render-videos.mjs` (`titleFor`, `tagsFor`) and re-render to change them.
