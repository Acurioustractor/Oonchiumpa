# Timeline Analysis — Oonchiumpa 2 Min Narrative

*Reading the Final Cut Pro XML exported from Descript. This shows every clip, every audio track, every cut.*

## Headline numbers

- **Runtime: 3:40.47** (220 s) — video titled "2 Min" is 84% over target
- **63 interview cuts** on the main track — talking heads cut together
- **6 speakers** cycling through: Kristy, Laquisha, Jackquann, Nigel, Fred, Tanya
- **5 long B-roll holds** (12-26 s each) pasted over interview audio
- **Music under voice for 2:49 straight** (then swaps to a different track)

## Interview map (who speaks when)

| Segment | Speaker | Duration |
|---------|---------|----------|
| 0:08 – 0:30 | Kristy Bloomfield | 22 s |
| 0:30 – 0:53 | Laquisha | 23 s |
| 0:53 – 1:00 | Jackquann | 7 s |
| 1:00 – 1:33 | Nigel | **33 s** |
| 1:33 – 1:47 | Laquisha | 14 s |
| 1:47 – 1:55 | Kristy | 8 s |
| 1:55 – 2:40 | Fred | **45 s** |
| 2:40 – 2:49 | Tanya | 9 s |
| 2:49 – 3:04 | Kristy | 15 s |
| 3:04 – 3:17 | Tanya | 13 s |
| 3:18 – 3:29 | Jackquann + Nigel closing | 11 s |

**6 speakers in 3:17 is a lot.** For a 2-min piece, 3 speakers max feels right. For the story to land, each voice needs ~30-45 seconds to breathe — when speakers cycle every 10 s the audience never connects to any of them.

## B-roll map (the visual spine)

| Time | Footage | Duration |
|------|---------|----------|
| 0:00 – 0:14 | DJI_0026 drone over Alice | 14 s (opens) |
| 0:40 – 0:52 | Youth footage 1776025386432 | 12 s |
| 1:08 – 1:34 | Youth + drone 1776025282252 | 26 s |
| 2:09 – 2:34 | Bed-making 1769977827617 | 26 s |
| 2:45 – 3:08 | War memorial (OSMO) | 23 s |
| 3:27 – 3:40 | DJI_0068 drone close | 13 s |

**Five B-roll holds totalling 1:54** — that's 52% of the runtime. Good ratio for documentary. The structure is: **landscape → interview → B-roll → interview → B-roll → interview → B-roll → closing landscape**. Classic shape.

## Music placement

| Track | Time | What |
|-------|------|------|
| `audio [music].mp3` | 0:00 – 2:49 | Main music bed — runs under everything |
| `audio [music].mp3` | 2:49 – 3:15 | Continues (split at the war memorial section) |
| `Keep It Different — Jackqwann Bazrick.mp3` | 3:27 – 3:40 | Closing song (Jackquann's own music) |

**Music under voice for 2:49 without a break.** Per the guide §7: *"Silence between music cues is as important as the cues themselves. A short documentary with continuous music has no dynamic range emotionally."* Every moment has music, so no moment gets to be quiet. If any line here is meant to land heavy — an Elder speaking of loss, strength, country — the music mutes it.

**The ending song** (Jackquann's own music) is a beautiful choice for the outro. Gives the film an author, a voice, a signature. Keep that.

## What's structurally strong

- **Echo bookends.** Opening drone → closing drone, with a second drone shot near the end over Alice Springs sunset. Correct documentary shape.
- **Voice-under-landscape opening.** Kristy's audio enters at 0:08 while the drone is still on screen (drone holds until 0:14). That's a J-cut. Textbook.
- **B-roll layered over interview audio.** Each long B-roll section runs **under** continuous interview audio — the viewer watches Country while someone speaks. This is the J/L cut pattern from the guide §4.
- **Young voices close the film.** 3:18-3:29 is Jackquann and Nigel — the youngest speakers given the last word. Structurally powerful.
- **Closing song is by a community artist.** Avoids the guide's warning against "generic cinematic-emotional library tracks."

## Where to cut time (if trimming to 2:00)

To lose 1:40 (100 seconds), the candidates ranked by compressibility:

1. **Fred's 45-second run at 1:55-2:40.** This is the single longest speaker segment. Could compress to ~20 s by cutting sub-phrases — net save: **~25 s**.
2. **Nigel's 33-second run at 1:00-1:33.** Second longest. Could compress to ~15 s — net save: **~18 s**.
3. **B-roll holds.** Both long B-roll sections (1:08-1:34 and 2:09-2:34) are 26 s each. Trim each by 8-10 s — net save: **~18 s**.
4. **Laquisha's two appearances** (0:30-0:53 and 1:33-1:47) total 37 s. One appearance at ~15 s would work — net save: **~22 s**.
5. **Mid-film complexity.** Between 1:00 and 2:00 you have Nigel → Laquisha → Kristy → Fred — four speakers in one minute. Dropping one speaker entirely — net save: **~15-25 s**.

**Total available savings: ~100 seconds.** You can absolutely hit 2:00 without losing the story. The question is which voices stay and which get cut.

## What the guide says this edit should do next

Per `thoughts/shared/video-editing-guide.md`:

1. **§2 — Pauses and silence.** After the heaviest interview line, insert a 3-6 s hold on landscape with ambient sound and **music pulled down or out**. Currently every line lands into more music and more talking. The film never breathes.

2. **§7 — Voice stands alone in three moments.** The opening line, any truth-telling moment, and the final line before credits. Currently all three are under continuous music.

3. **§3 — Overlays.** I can't see any from frame analysis — check: is each speaker introduced by a lower-third? If yes, good. If no, viewers don't know who's speaking and the 6-speaker structure confuses them.

---

## What I can do directly

Three options, you pick:

### Option A: Non-destructive trim (fast, safe, 5 minutes)
Cut the existing rendered MP4 down to 2:00 by removing the sections you specify. Simple ffmpeg concat. Won't touch audio mix or music levels. Good for quickly seeing if 2:00 works.

### Option B: Full re-edit from XML + source (1-2 hours, real improvement)
Re-render from source files using a modified timeline:
- Drop music under the 1-2 most important interview lines (voice stands alone)
- Duck music by another 3-6 dB where it stays under voice
- Optional: trim to 2:00 by cutting [your choice] of speakers
- Export with proper audio ceiling (-1 dBFS) and loudness (-16 LUFS)

### Option C: Build a new XML for you to open in Descript/FCP
Export a modified XML with the structural changes pre-made. You review in the editor, preview, tweak, then hit render yourself. Best if you want control.

---

## My recommendation

**Do Option B.** The mix — specifically, music under voice for 2:49 continuous — is the single biggest improvement available. It costs you nothing visually but gives you three moments where the film is allowed to breathe: opening, one mid-film reflection, and the closing.

Then trim to 2:00 — or retitle the file. Don't butcher the story to hit a number.

---

## Specific trim plan (if you want 2:00)

Proposed 2:00 cut, preserving the arc:

| Time | Source | What |
|------|--------|------|
| 0:00 – 0:10 | Drone + Kristy voice under | Opening (J-cut) |
| 0:10 – 0:30 | Kristy on camera | Identity / authority |
| 0:30 – 0:48 | Laquisha + painting B-roll | Community voice |
| 0:48 – 1:12 | Nigel compressed + youth B-roll | Strength / youth |
| 1:12 – 1:30 | Fred compressed + bed-making B-roll | Practical work |
| 1:30 – 1:42 | Tanya | Legal/strategic voice |
| 1:42 – 1:52 | Jackquann + Nigel young voices | Youth closing |
| 1:52 – 2:00 | Sunset drone + song fade in | Closing bookend |

6 speakers → 6 speakers, but each given half the runtime they currently have. Total: 2:00. Every section earns its place.

Ship this if you want — I'll render it from source.
