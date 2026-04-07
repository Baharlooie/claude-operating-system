"""
Read Aloud — converts MD project files to speech using edge-tts.

Usage:
    python read-aloud.py <file.md>                  # Stream aloud (starts in seconds)
    python read-aloud.py <file.md> --save            # Save MP3 next to the MD file
    python read-aloud.py <file.md> --save -o out.mp3 # Save to specific path
    python read-aloud.py <file.md> --voice en-US-AndrewNeural
    python read-aloud.py <file.md> --rate "+25%"     # Speed up 25%
    python read-aloud.py --list-voices               # Show available English voices

Requires: pip install edge-tts
Streaming playback requires ffplay (bundled with ffmpeg).
"""

import argparse
import asyncio
import os
import re
import shutil
import subprocess
import sys
import tempfile

import edge_tts

DEFAULT_VOICE = "en-US-AndrewNeural"
FFPLAY_PATH = shutil.which("ffplay")


def strip_markdown(text: str) -> str:
    """Remove markdown syntax to produce clean spoken text."""
    # Remove YAML frontmatter
    text = re.sub(r"^---\s*\n.*?\n---\s*\n", "", text, flags=re.DOTALL)
    # Remove horizontal rules
    text = re.sub(r"^-{3,}\s*$", "", text, flags=re.MULTILINE)
    # Remove markdown headings markers but keep the text
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)
    # Remove bold/italic markers
    text = re.sub(r"\*{1,3}(.+?)\*{1,3}", r"\1", text)
    text = re.sub(r"_{1,3}(.+?)_{1,3}", r"\1", text)
    # Convert markdown links [text](url) to just text
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    # Remove inline code backticks
    text = re.sub(r"`([^`]+)`", r"\1", text)
    # Remove code blocks
    text = re.sub(r"```[\s\S]*?```", "", text)
    # Remove image references
    text = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", text)
    # Clean up bullet points — replace with pause
    text = re.sub(r"^\s*[-*+]\s+", "  ", text, flags=re.MULTILINE)
    # Clean up numbered lists
    text = re.sub(r"^\s*\d+\.\s+", "  ", text, flags=re.MULTILINE)
    # Remove pipe tables — keep cell content as comma-separated
    def clean_table_row(match):
        row = match.group(0)
        if re.match(r"^\s*\|[\s\-:|]+\|\s*$", row):
            return ""  # separator row
        cells = [c.strip() for c in row.strip().strip("|").split("|") if c.strip()]
        return ", ".join(cells) + "."

    text = re.sub(r"^\|.+\|$", clean_table_row, text, flags=re.MULTILINE)
    # Remove HTML tags
    text = re.sub(r"<[^>]+>", "", text)
    # Collapse multiple blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


async def list_voices():
    """Print available English voices."""
    voices = await edge_tts.list_voices()
    en_voices = [v for v in voices if v["Locale"].startswith("en-")]
    for v in en_voices:
        marker = " <-- default" if v["ShortName"] == DEFAULT_VOICE else ""
        print(f"  {v['ShortName']:45} {v['Gender']:8} {v['Locale']}{marker}")


async def stream_play(text: str, voice: str, rate: str):
    """Stream TTS audio to a temp file while ffplay plays it — starts within seconds."""
    communicate = edge_tts.Communicate(text, voice, rate=rate)

    tmp = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
    tmp_path = tmp.name

    try:
        chunk_count = 0
        ffplay_proc = None

        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                tmp.write(chunk["data"])
                tmp.flush()
                chunk_count += 1

                if chunk_count == 5 and ffplay_proc is None:
                    ffplay_proc = subprocess.Popen(
                        [
                            FFPLAY_PATH,
                            "-nodisp",
                            "-autoexit",
                            "-loglevel", "quiet",
                            tmp_path,
                        ],
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL,
                    )

        tmp.close()

        if ffplay_proc is None:
            ffplay_proc = subprocess.Popen(
                [
                    FFPLAY_PATH,
                    "-nodisp",
                    "-autoexit",
                    "-loglevel", "quiet",
                    tmp_path,
                ],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )

        ffplay_proc.wait()

    finally:
        if not tmp.closed:
            tmp.close()
        try:
            os.unlink(tmp_path)
        except OSError:
            pass


async def synthesize(text: str, voice: str, rate: str, output_path: str):
    """Generate speech audio file from text."""
    communicate = edge_tts.Communicate(text, voice, rate=rate)
    await communicate.save(output_path)


def play_audio_fallback(path: str):
    """Fallback: play an MP3 file using PowerShell MediaPlayer (Windows) or open command."""
    if sys.platform == "win32":
        try:
            subprocess.run(
                [
                    "powershell",
                    "-Command",
                    f'Add-Type -AssemblyName presentationCore; '
                    f'$m = New-Object System.Windows.Media.MediaPlayer; '
                    f'$m.Open("{path}"); '
                    f'$m.Play(); '
                    f'Start-Sleep -Seconds 1; '
                    f'while ($m.Position -lt $m.NaturalDuration.TimeSpan) {{ Start-Sleep -Milliseconds 500 }}; '
                    f'$m.Close()',
                ],
                check=True,
            )
            return
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass
        os.startfile(path)
    elif sys.platform == "darwin":
        subprocess.run(["open", path])
    else:
        subprocess.run(["xdg-open", path])


def main():
    parser = argparse.ArgumentParser(description="Read MD files aloud using edge-tts")
    parser.add_argument("file", nargs="?", help="Path to the MD file")
    parser.add_argument(
        "--voice", default=DEFAULT_VOICE, help=f"Voice to use (default: {DEFAULT_VOICE})"
    )
    parser.add_argument("--save", action="store_true", help="Save MP3 instead of playing")
    parser.add_argument("-o", "--output", help="Output MP3 path (implies --save)")
    parser.add_argument(
        "--list-voices", action="store_true", help="List available English voices"
    )
    parser.add_argument(
        "--rate", default="+0%", help='Speech rate, e.g. "+25%%" for faster (default: normal)'
    )

    args = parser.parse_args()

    if args.list_voices:
        asyncio.run(list_voices())
        return

    if not args.file:
        parser.error("Please provide a file path (or use --list-voices)")

    file_path = os.path.abspath(args.file)
    if not os.path.exists(file_path):
        print(f"Error: file not found: {file_path}", file=sys.stderr)
        sys.exit(1)

    with open(file_path, "r", encoding="utf-8") as f:
        raw = f.read()

    text = strip_markdown(raw)
    char_count = len(text)
    print(f"Processing: {os.path.basename(file_path)} ({char_count:,} chars)")

    if args.output:
        args.save = True

    if args.save:
        output_path = args.output or file_path.rsplit(".", 1)[0] + ".mp3"
        asyncio.run(synthesize(text, args.voice, args.rate, output_path))
        print(f"Saved: {output_path}")
    elif FFPLAY_PATH:
        print("Streaming (press Ctrl+C to stop)...")
        try:
            asyncio.run(stream_play(text, args.voice, args.rate))
        except KeyboardInterrupt:
            print("\nStopped.")
    else:
        print("ffplay not found — generating full MP3 first (slower start)...")
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
            tmp_path = tmp.name
        try:
            asyncio.run(synthesize(text, args.voice, args.rate, tmp_path))
            print("Playing...")
            play_audio_fallback(tmp_path)
        finally:
            try:
                os.unlink(tmp_path)
            except OSError:
                pass


if __name__ == "__main__":
    main()
