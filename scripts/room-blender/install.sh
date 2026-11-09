#!/bin/bash
# Copy a bake (OUT from build_room.py) into static/models/Room2/, meshopt-compressing the GLBs,
# and write the numbers the site needs (light map scales, prop positions) into
# src/Application/World/roomData.ts.
#   scripts/room-blender/install.sh OUT [path to gltf-transform cli.js]
# (static/models/Room/ is the bake from before the room toys; it stays as it is.)
set -e
OUT=$1
CLI=${2:-gltf-transform}
HERE=$(dirname "$0")
DEST=$HERE/../../static/models/Room2
mkdir -p "$DEST"
cp "$OUT"/albedo.webp "$OUT"/light-night.webp "$OUT"/light-day.webp "$DEST"/
for m in room glow props; do
  if [ -f "$CLI" ]; then node "$CLI" meshopt "$OUT/$m.glb" "$DEST/$m.glb" --level high --quantize-position 16 --quantize-texcoord 16;
  else $CLI meshopt "$OUT/$m.glb" "$DEST/$m.glb" --level high --quantize-position 16 --quantize-texcoord 16; fi
done
python3 - "$OUT/room.json" "$HERE/../../src/Application/World/roomData.ts" <<'EOF'
import json, sys
d = json.load(open(sys.argv[1]))
out = {'lightMapIntensity': d['lightMapIntensity'], 'props': d['props'], 'ball': d['ball']}
with open(sys.argv[2], 'w') as f:
    f.write("// Written by scripts/room-blender/install.sh from the bake's room.json. Don't edit by hand.\n")
    f.write('export const ROOM2 = ' + json.dumps(out, indent=4) + ';\n')
EOF
cat "$OUT"/room.json
ls -la "$DEST"
