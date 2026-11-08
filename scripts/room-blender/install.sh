#!/bin/bash
# Copy a bake (OUT from build_room.py) into static/models/Room/, meshopt-compressing the GLBs.
#   scripts/room-blender/install.sh OUT [path to gltf-transform cli.js]
set -e
OUT=$1
CLI=${2:-gltf-transform}
DEST=$(dirname "$0")/../../static/models/Room
mkdir -p "$DEST"
cp "$OUT"/albedo.webp "$OUT"/light-night.webp "$OUT"/light-day.webp "$DEST"/
for m in room glow; do
  if [ -f "$CLI" ]; then node "$CLI" meshopt "$OUT/$m.glb" "$DEST/$m.glb" --level high --quantize-position 16 --quantize-texcoord 16;
  else $CLI meshopt "$OUT/$m.glb" "$DEST/$m.glb" --level high --quantize-position 16 --quantize-texcoord 16; fi
done
cat "$OUT"/room.json
ls -la "$DEST"
