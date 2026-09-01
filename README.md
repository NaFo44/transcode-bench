# transcode-bench

This project is implementing an FFmpeg transcoding benchmark to compare different configuration.

## Requirements

- Bun 1.3.10
- FFmpeg
- FFprobe

## Quick setup

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run start <input> <config>
```

You can create your own configuration json file in /presets.

This project was created using `bun init` in bun v1.3.10. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
