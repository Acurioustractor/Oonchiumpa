# Edit Review — Oonchiumpa 2 Min Narrative

*Applying principles from `video-editing-guide.md` to a specific cut.*

**File:** `Oonchiumpa - 2 Min Narrative.mp4`
**Duration:** 3:40 (220 s)
**Video:** 1920×1080, H.264, 30fps, 13.1 Mb/s
**Audio:** stereo AAC 160 kb/s, mean -17.7 dBFS, peak **0.0 dBFS** ⚠

---

## TL;DR — four things

1. **It's 3:40, not 2 minutes.** The shape is good — trimming to 2:00 is an editorial question, not a technical one. My read: the middle is where the minutes are, not the bookends.
2. **Audio is peaking at 0 dBFS.** Risk of distortion on loud playback. Easy fix — I can normalise to -1 dBFS ceiling without touching the mix.
3. **Structural arc is textbook.** Landscape → people → activity → reflection → echo. The closing drone sunset earns its hold because the opening drone dawn opened with the same place. That's Pearlman's "echo, don't summarise" — well done.
4. **Variety of subjects is strong.** Elder speaker, young boy at the creek, young woman painting, male staff interview, community swag-making, boxing, female staff interview. Community arc shape.

---

## Structural map (what I can see)

| Timecode | Content | Shot mode |
|----------|---------|-----------|
| 0:00 – 0:10 | Dusk drone over Alice Springs | Contemplative (wide) |
| 0:10 – 0:40 | Elder/senior staff woman speaking (cafe interior) | Narrative (mid) |
| 0:40 – 0:55 | Young woman painting, close-up of black paint on canvas | Illustrative B-roll |
| 0:55 – 1:28 | Mix: young boy at creek, staff interview intercuts | Narrative |
| 1:28 – 1:46 | Creek water close-up, young woman painting 2 | Contemplative |
| 1:46 – 2:20 | Staff swag-making (outdoor), kinetic cluster | **Kinetic** (1.5–2 s per shot) |
| 2:20 – 2:45 | Community swag setup at house, female staff interview | Narrative |
| 2:45 – 3:15 | Boxing heavy-bag, young boy at creek return | Payoff + echo |
| 3:15 – 3:40 | Sunset drone over Alice Springs | Closing contemplative |

Average shot length: ~5 seconds (narrative pace — correct for interview-driven doc).
Kinetic cluster around 2:27–2:34 — five cuts in ~8 s, 1.5 s each. Used deliberately during swag assembly.
Contemplative holds on water + landscape — correct placement.

---

## What's working

**The arc.** Opening landscape → interior voice → youth activity → field B-roll → kinetic "making" → staff reflection → youth action → return to water → closing landscape. This is classically well-shaped documentary. **Pearlman:** physical rhythm (wide → close → wide) maps to emotional rhythm (distance → intimacy → distance).

**The echo.** Dusk drone opens, sunset drone closes. Young boy at creek appears around 1:28 *and* around 3:00. Water feature at 1:28 echoes at 3:00+. These are the single best documentary ending move — "return to an image transformed by what the viewer now knows" (guide §5).

**The kinetic cluster at the swag sequence.** Using a burst of 1.5-second cuts during physical making is exactly what the guide's "rule of three paces" recommends. Don't lose this — it's your release moment.

**Variety of subjects.** Elder, young boy, young woman, male staff, community group, female staff, boxing youth. You avoid the common deficit frame — strength is shown as strength throughout.

---

## Where I'd look next (specific timecodes)

### 1. The opening is a 10-second drone → 30-second interview. Two possible reads.

**If voiceover begins within the first 6–10 s over the drone:** working as designed. J-cut-like structure (voice comes in under landscape). That's textbook (guide §5 — "voice-over should begin within the first 6–10 seconds").

**If the drone holds silent for all 10 s, then cuts to interview and the interview starts abruptly:** two small fixes.
- Bring the interview audio in under the last 2 seconds of drone (a J-cut)
- Trim the drone to 7-8 seconds — still establishes place, arrives at the speaker sooner

I can't hear the audio from my end, so you know which it is. Check the waveform at 0:00–0:15.

### 2. Mid-section (1:00–1:30) is where time lives.

If you're trimming to 2:00, this stretch is where to compress. Three candidates:
- The young-woman-painting sequence (around 0:45 and again around 1:30) — two passes of the same scene. Consider one pass, held longer.
- The staff interview sections between the swag-making — some lines might be compressible with J-cuts into B-roll (move the voice under water/creek footage).
- The second water close-up (if it's a repeat of the first) — keep one, not both.

### 3. Audio ceiling at 0.0 dBFS.

Your mean is healthy (-17.7 dB, good for voice). Your **peak is at 0.0** — that's the absolute digital ceiling. Any playback system with a bit of headroom management will clip or distort on the loudest moments. Industry standard for delivery:
- Voice: peak around -3 to -6 dBFS
- Full mix ceiling: -1 dBFS (for broadcast/web safety)
- Loudness (LUFS) target: -16 LUFS for web, -14 LUFS for podcasts, -23 LUFS for broadcast

**I can do this fix directly.** Non-destructive loudness normalise to -16 LUFS with true-peak limit at -1 dBFS. Won't change the creative mix, just brings the peaks down safely.

### 4. Overlay cadence — I can't see text overlays from frame samples.

If there are text overlays, re-read guide §3:
- Lower-thirds once per speaker, early, then never again
- Hold reading-time + 1 s (9 words = 4 s minimum)
- Never over a face delivering emotion
- Indigenous-language text styled differently (centred, larger, held longer)

### 5. Protocol check.

This is the one that matters most and I can't see it from frames:
- Has every person shown reviewed the rough cut?
- If anyone depicted has passed since filming, is there an opening "may contain images" warning?
- Is there an Acknowledgement of Country at the top or tail?

If any of those three are unanswered, pause before sharing externally.

---

## What I can do for you right now

**Audio ceiling fix** (safe, non-destructive):
```bash
ffmpeg -i "Oonchiumpa - 2 Min Narrative.mp4" \
  -af "loudnorm=I=-16:TP=-1:LRA=11" \
  -c:v copy -c:a aac -b:a 192k \
  "Oonchiumpa - 2 Min Narrative - normalised.mp4"
```
Video stream copied bit-perfect. Audio peaks brought to -1 dBFS, loudness to -16 LUFS (web standard). Takes ~30 seconds.

**Trim to 2:00** (if you want an aggressive cut): I'd need to know which sections you're OK cutting. From frame analysis, the most compressible section is ~0:45–1:45 (two passes of painting + interview intercuts). I can't decide what to cut without hearing the voice-over — but I can cut by your spec.

**Rough cut detection with a waveform view**: I can generate a waveform + scene-cut diagram as a PNG so you can see where the peaks and quiet beats are falling structurally. Useful for deciding trims.

---

## The one principle that applies most to this edit

From the guide §2: **"After a charged interview line, cut to a landscape with ambient sound for 4–8 seconds before the next line. Single most effective trick in community documentary editing."**

Your edit already does this with the creek water shot at ~1:30 and the water/boy shots at ~3:00. If you're trimming, protect these. They're the emotional spine.

---

## Recommendation

**Don't force it to 2:00.** A 3:00 cut of this footage would be excellent; a butchered 2:00 cut would be worse than the current 3:40. If the title has to stay "2 Min Narrative," retitle the file. If the duration has to be 2:00, trim the middle and keep the bookends, not the reverse.

**Do the audio normalise.** It's free, it's safe, and -1 dBFS ceiling is the single most important technical delivery standard for web video.
