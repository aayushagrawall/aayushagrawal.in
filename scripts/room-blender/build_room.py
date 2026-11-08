"""The streetwear bedroom around the CRT, modelled in Blender (bpy) and baked.

  python3 scripts/room-blender/build_room.py preview OUT.png [night|day]   quick Cycles render
  python3 scripts/room-blender/build_room.py bake OUTDIR [size]            bake + export

Coordinates are written in the site's scene units (the desk top is at y = -452, the floor
at y = -2985) and converted here: Blender (x, y, z) = (X, -Z, Y) / 1000. The site loads the
GLB with a scale of 1000.

What gets baked (one mesh, one UV atlas):
  albedo.png          the colours (posters, wood, fabric...)
  light-night.png     lighting at night: desk lamp, LED strips, neon sign, monitor glow,
                      a little moonlight through the window
  light-day.png       lighting in the day: sun through the window, sky light
The site draws colour x light (MeshBasicMaterial map + lightMap) and swaps the light map
for day and night. Glowing things (LEDs, neon, window glass) are exported separately in
glow.glb and drawn unlit.

Kept from the old scene and only used here to cast shadows: the CRT computer (imported
from static/models/Computer/computer_setup.glb) and simple stand-ins for the desk items
the site adds itself (QR frame, lamp, can, neon desk sign).
"""
import math
import os
import sys

import bpy
import bmesh
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
TEX = os.path.join(REPO, 'static', 'textures', 'room')

FLOOR = -2985.0
DESK_Y = -452.0
WALL_TOP = 4000.0
X0, X1 = -6000.0, 6200.0  # inner faces of the left and right walls
BACK = -2600.0  # inner face of the back wall
FRONT = 7600.0  # open front edge


def V(X, Y, Z):
    return Vector((X / 1000.0, -Z / 1000.0, Y / 1000.0))


# ---------------------------------------------------------------- materials
MATS = {}


def srgb(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in c] + [1.0]


def mat(name, color='#808080', rough=0.8, image=None, emit=None, strength=1.0, repeat=None):
    key = name
    if key in MATS:
        return MATS[key]
    m = bpy.data.materials.new(name)
    if hasattr(m, 'use_nodes'):
        m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes.get('Principled BSDF')
    bsdf.inputs['Roughness'].default_value = rough
    if 'Specular IOR Level' in bsdf.inputs:
        bsdf.inputs['Specular IOR Level'].default_value = 0.2
    if image:
        tex = nt.nodes.new('ShaderNodeTexImage')
        tex.image = bpy.data.images.load(os.path.join(TEX, image), check_existing=True)
        # always read the object's own 'src' UVs (the active UV map becomes the bake atlas)
        uvn = nt.nodes.new('ShaderNodeUVMap')
        uvn.uv_map = 'src'
        if repeat:
            mapping = nt.nodes.new('ShaderNodeMapping')
            mapping.inputs['Scale'].default_value = (repeat[0], repeat[1], 1)
            nt.links.new(uvn.outputs['UV'], mapping.inputs['Vector'])
            nt.links.new(mapping.outputs['Vector'], tex.inputs['Vector'])
        else:
            nt.links.new(uvn.outputs['UV'], tex.inputs['Vector'])
        nt.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
        tex.name = 'albedo_src'
    else:
        bsdf.inputs['Base Color'].default_value = srgb(color)
    if emit:
        bsdf.inputs['Emission Color'].default_value = srgb(emit)
        bsdf.inputs['Emission Strength'].default_value = strength
    MATS[key] = m
    return m


# ---------------------------------------------------------------- geometry helpers
def link(obj, coll):
    coll.objects.link(obj)
    return obj


def new_coll(name):
    c = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(c)
    return c


def mesh_obj(name, bm, material, coll):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    ob.data.materials.append(material)
    return link(ob, coll)


def box(name, X, Y, Z, w, h, d, material, coll, bevel=0.0, rot_y=0.0, rot_x=0.0, rot_z=0.0):
    """A box centred at (X, Y, Z) scene units, w along X, h along Y, d along Z."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=Vector((w / 1000, d / 1000, h / 1000)), verts=bm.verts)
    if bevel > 0:
        bmesh.ops.bevel(bm, geom=list(bm.edges), offset=bevel / 1000, segments=2, affect='EDGES', profile=0.5)
    ob = mesh_obj(name, bm, material, coll)
    ob.rotation_euler = (rot_x, rot_z, -rot_y)  # scene Y-rotation is Blender -Z
    ob.location = V(X, Y, Z)
    return ob


def cyl(name, X, Y, Z, r, h, material, coll, seg=24, r2=None, axis='Y', rot=(0, 0, 0)):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r / 1000, radius2=(r2 if r2 is not None else r) / 1000, depth=h / 1000)
    ob = mesh_obj(name, bm, material, coll)
    if axis == 'X':
        ob.rotation_euler = (0, math.pi / 2, 0)
    elif axis == 'Z':
        ob.rotation_euler = (math.pi / 2, 0, 0)
    if rot != (0, 0, 0):
        ob.rotation_euler = rot
    ob.location = V(X, Y, Z)
    return ob


def sphere(name, X, Y, Z, r, material, coll, scale=(1, 1, 1), seg=24):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=seg // 2, radius=r / 1000)
    ob = mesh_obj(name, bm, material, coll)
    ob.scale = (scale[0], scale[2], scale[1])
    ob.location = V(X, Y, Z)
    return ob


def plane(name, corners, material, coll):
    """A quad from four scene-space corners (counter-clockwise seen from the front)."""
    bm = bmesh.new()
    vs = [bm.verts.new(V(*c)) for c in corners]
    bm.faces.new(vs)
    return mesh_obj(name, bm, material, coll)


def wall_rect(name, x0, x1, y0, y1, z, material, coll, facing=+1):
    """Rectangle on a plane of constant Z (back wall), facing +Z (into the room)."""
    c = [(x0, y0, z), (x1, y0, z), (x1, y1, z), (x0, y1, z)]
    if facing < 0:
        c = c[::-1]
    return plane(name, c, material, coll)


def side_rect(name, x, z0, z1, y0, y1, material, coll, facing=+1):
    """Rectangle on a plane of constant X, facing +X (facing=+1) or -X."""
    c = [(x, y0, z1), (x, y0, z0), (x, y1, z0), (x, y1, z1)]
    if facing < 0:
        c = c[::-1]
    return plane(name, c, material, coll)


def poster(name, image, X, Y, Z, w, h, coll, wall='back'):
    m = mat('poster:' + image, image=image, rough=0.6)
    hw, hh = w / 2, h / 2
    if wall == 'back':
        corners = [(X - hw, Y - hh, Z), (X + hw, Y - hh, Z), (X + hw, Y + hh, Z), (X - hw, Y + hh, Z)]
    elif wall == 'left':  # facing +X: seen from inside, the image's left edge is towards the front (+Z)
        corners = [(X, Y - hh, Z + hw), (X, Y - hh, Z - hw), (X, Y + hh, Z - hw), (X, Y + hh, Z + hw)]
    else:  # right wall, facing -X: the image's left edge is towards the back (-Z)
        corners = [(X, Y - hh, Z - hw), (X, Y - hh, Z + hw), (X, Y + hh, Z + hw), (X, Y + hh, Z - hw)]
    ob = plane(name, corners, m, coll)
    # UVs: whole image on the quad
    uv = ob.data.uv_layers.new(name='src')
    for poly in ob.data.polygons:
        for li, (u, v) in zip(poly.loop_indices, [(0, 0), (1, 0), (1, 1), (0, 1)]):
            uv.data[li].uv = (u, v)
    return ob


def planar_uv(ob, axis_a, axis_b, scale):
    """Give a mesh a 'src' UV map projected on two scene axes (for tiling textures)."""
    me = ob.data
    uv = me.uv_layers.get('src') or me.uv_layers.new(name='src')
    mw = ob.matrix_world
    for poly in me.polygons:
        for li in poly.loop_indices:
            co = mw @ me.vertices[me.loops[li].vertex_index].co
            S = {'X': co.x * 1000, 'Y': co.z * 1000, 'Z': -co.y * 1000}
            uv.data[li].uv = (S[axis_a] / scale, S[axis_b] / scale)


# ---------------------------------------------------------------- the scene
def build():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    bake = new_coll('bake')  # baked into the atlas and exported as room.glb
    glow = new_coll('glow')  # unlit glowing parts, exported as glow.glb
    occl = new_coll('occluders')  # cast shadows only
    lights_night = new_coll('lights_night')
    lights_day = new_coll('lights_day')

    # ---- materials
    wall_m = mat('wall', '#45474d', 0.95)
    wall_dark = mat('wall_dark', '#3c3e44', 0.95)
    floor_m = mat('floor', image='floor.webp', rough=0.7)
    slab_m = mat('slab', '#1a1a1c', 0.9)
    trim_m = mat('trim', '#1f1f22', 0.7)
    oak = mat('desk_top', '#5a3d28', 0.55)
    metal = mat('black_metal', '#141416', 0.45)
    chair_m = mat('chair', '#18181a', 0.6)
    chair_red = mat('chair_red', '#a3141c', 0.6)
    bed_frame = mat('bed_frame', '#2a2420', 0.7)
    sheet = mat('sheet', '#c9c6be', 0.9)
    duvet = mat('duvet', '#2f3238', 0.95)
    pillow = mat('pillow', '#dedbd3', 0.95)
    throw = mat('throw', '#7a2e22', 0.95)
    shelf_m = mat('shelf', '#e8e6e2', 0.4)
    box_orange = mat('box_orange', '#d2611f', 0.7)
    box_black = mat('box_black', '#1d1d1f', 0.7)
    box_white = mat('box_white', '#e6e2da', 0.7)
    rug_m = mat('rug', image='rug.webp', rough=1.0)
    frame_m = mat('window_frame', '#202024', 0.5)
    curtain = mat('curtain', '#26282d', 1.0)
    rack_m = mat('rack', '#151517', 0.4)
    beanbag = mat('beanbag', '#3a3f2e', 0.95)
    plant_pot = mat('plant_pot', '#202022', 0.6)
    leaf = mat('leaf', '#2f5a36', 0.8)
    paper = mat('paper', '#e9e6df', 0.9)

    # ---- floor slab (the floor top is at FLOOR), visible edges from outside
    sx0, sx1, sz0, sz1 = X0 - 200, X1 + 200, BACK - 200, FRONT
    box('slab', (sx0 + sx1) / 2, FLOOR - 175, (sz0 + sz1) / 2, sx1 - sx0, 320, sz1 - sz0, slab_m, bake)
    fl = plane('floor', [(X0, FLOOR, FRONT), (X1, FLOOR, FRONT), (X1, FLOOR, BACK), (X0, FLOOR, BACK)], floor_m, bake)
    planar_uv(fl, 'X', 'Z', 3000)

    # ---- walls: single faces looking into the room (the site hides the ones facing away)
    wx0, wx1, wy0, wy1 = -4700, -2300, 300, 3300  # window opening on the back wall
    wall_rect('wall_back_l', X0, wx0, FLOOR, WALL_TOP, BACK, wall_m, bake)
    wall_rect('wall_back_r', wx1, X1, FLOOR, WALL_TOP, BACK, wall_m, bake)
    wall_rect('wall_back_b', wx0, wx1, FLOOR, wy0, BACK, wall_m, bake)
    wall_rect('wall_back_t', wx0, wx1, wy1, WALL_TOP, BACK, wall_m, bake)
    side_rect('wall_left', X0, BACK, FRONT, FLOOR, WALL_TOP, wall_dark, bake, +1)
    side_rect('wall_right', X1, BACK, FRONT, FLOOR, WALL_TOP, wall_dark, bake, -1)
    # window reveal (the wall's thickness inside the opening)
    D = 260
    plane('reveal_b', [(wx0, wy0, BACK), (wx1, wy0, BACK), (wx1, wy0, BACK - D), (wx0, wy0, BACK - D)], wall_m, bake)
    plane('reveal_t', [(wx0, wy1, BACK - D), (wx1, wy1, BACK - D), (wx1, wy1, BACK), (wx0, wy1, BACK)], wall_m, bake)
    plane('reveal_l', [(wx0, wy0, BACK - D), (wx0, wy1, BACK - D), (wx0, wy1, BACK), (wx0, wy0, BACK)][::-1], wall_m, bake)
    plane('reveal_r', [(wx1, wy0, BACK), (wx1, wy1, BACK), (wx1, wy1, BACK - D), (wx1, wy0, BACK - D)][::-1], wall_m, bake)
    box('sill', (wx0 + wx1) / 2, wy0 - 40, BACK + 90, wx1 - wx0 + 260, 80, 260, trim_m, bake)
    # window frame (black), glass is a glow plane
    for i, (fx, fw) in enumerate([(wx0 + 40, 80), (wx1 - 40, 80), ((wx0 + wx1) / 2, 60)]):
        box(f'frame_v{i}', fx, (wy0 + wy1) / 2, BACK - D + 60, fw, wy1 - wy0, 70, frame_m, bake)
    for i, (fy, fh) in enumerate([(wy0 + 40, 80), (wy1 - 40, 80), (wy0 + (wy1 - wy0) * 0.42, 60)]):
        box(f'frame_h{i}', (wx0 + wx1) / 2, fy, BACK - D + 60, wx1 - wx0, fh, 70, frame_m, bake)
    glass = plane('window_glass', [(wx0, wy0, BACK - D + 30), (wx1, wy0, BACK - D + 30), (wx1, wy1, BACK - D + 30), (wx0, wy1, BACK - D + 30)], mat('glass_glow', '#9fb4d8'), glow)
    uvg = glass.data.uv_layers.new(name='src')
    for poly in glass.data.polygons:
        for li, (u, v) in zip(poly.loop_indices, [(0, 1), (1, 1), (1, 0), (0, 0)]):
            uvg.data[li].uv = (u, v)
    # curtains: wavy dark panels either side of the window, and a rod
    for side, cx in (('l', wx0 - 330), ('r', wx1 + 330)):
        bm = bmesh.new()
        W, H, N = 760, 3500, 24
        top_y, z = wy1 + 300, BACK + 120
        verts = []
        for j in range(2):
            row = []
            for i in range(N + 1):
                t = i / N
                x = cx - W / 2 + W * t
                zz = z + 70 * math.sin(t * math.pi * 6)
                y = top_y - H * j
                row.append(bm.verts.new(V(x, y, zz)))
            verts.append(row)
        for i in range(N):
            bm.faces.new([verts[1][i], verts[1][i + 1], verts[0][i + 1], verts[0][i]])
        ob = mesh_obj(f'curtain_{side}', bm, curtain, bake)
        mod = ob.modifiers.new('solid', 'SOLIDIFY')
        mod.thickness = 0.03
    cyl('curtain_rod', (wx0 + wx1) / 2, wy1 + 320, BACK + 120, 22, (wx1 - wx0) + 1700, metal, bake, seg=12, axis='X')

    # ---- skirting
    box('skirt_back', (X0 + X1) / 2, FLOOR + 90, BACK + 15, X1 - X0, 180, 30, trim_m, bake)
    box('skirt_left', X0 + 15, FLOOR + 90, (BACK + FRONT) / 2, 30, 180, FRONT - BACK, trim_m, bake)
    box('skirt_right', X1 - 15, FLOOR + 90, (BACK + FRONT) / 2, 30, 180, FRONT - BACK, trim_m, bake)

    # ---- the desk: thick oak top, black steel frame; the CRT sits where it always did
    dx0, dx1, dz0, dz1 = -3800, 2800, -1380, 1780
    top = box('desk_top', (dx0 + dx1) / 2, DESK_Y - 70, (dz0 + dz1) / 2, dx1 - dx0, 140, dz1 - dz0, oak, bake, bevel=12)
    planar_uv(top, 'X', 'Z', 2400)
    for lx in (dx0 + 200, dx1 - 200):
        for lz in (dz0 + 160, dz1 - 160):
            box('desk_leg', lx, (FLOOR + DESK_Y - 140) / 2, lz, 90, DESK_Y - 140 - FLOOR, 90, metal, bake)
        box('desk_side_bar', lx, FLOOR + 380, (dz0 + dz1) / 2, 70, 70, dz1 - dz0 - 320, metal, bake)
    box('desk_back_bar', (dx0 + dx1) / 2, DESK_Y - 230, dz0 + 160, dx1 - dx0 - 400, 160, 60, metal, bake)
    # a loose sheet of paper under the lamp (the lamp is the site's)
    box('paper', -2060, DESK_Y + 2, 990, 1000, 4, 760, paper, bake, rot_y=0.12)

    # ---- gaming chair, turned a little towards the desk
    chair = []
    cx, cz, cy = 820, 2550, FLOOR
    for i in range(5):
        a = i * 2 * math.pi / 5
        chair.append(box('chair_leg', cx + math.cos(a) * 420, cy + 220, cz + math.sin(a) * 420, 860, 70, 110, chair_m, bake, bevel=10, rot_y=-a))
        chair.append(sphere('chair_wheel', cx + math.cos(a) * 820, cy + 70, cz + math.sin(a) * 820, 75, chair_m, bake, seg=12))
    chair.append(cyl('chair_gas', cx, cy + 600, cz, 55, 700, metal, bake, seg=16))
    chair.append(box('chair_seat', cx, cy + 1050, cz, 1250, 230, 1250, chair_m, bake, bevel=60))
    chair.append(box('chair_seat_stripe', cx, cy + 1172, cz, 260, 20, 1180, chair_red, bake))
    back_z = cz + 640
    chair.append(box('chair_back', cx, cy + 2150, back_z + 60, 1180, 1900, 220, chair_m, bake, bevel=70, rot_x=-0.12))
    chair.append(box('chair_back_stripe_l', cx - 380, cy + 2150, back_z - 60, 120, 1700, 30, chair_red, bake, rot_x=-0.12))
    chair.append(box('chair_back_stripe_r', cx + 380, cy + 2150, back_z - 60, 120, 1700, 30, chair_red, bake, rot_x=-0.12))
    chair.append(box('chair_head', cx, cy + 3250, back_z + 190, 720, 260, 200, chair_m, bake, bevel=60, rot_x=-0.12))
    for sx in (-1, 1):
        chair.append(box('chair_arm_post', cx + sx * 640, cy + 1350, cz + 80, 70, 420, 70, metal, bake))
        chair.append(box('chair_arm', cx + sx * 640, cy + 1580, cz, 140, 70, 720, chair_m, bake, bevel=20))
    # turn the whole chair about its column
    pivot = V(cx, cy, cz)
    R = Matrix.Rotation(0.35, 4, 'Z')
    for ob in chair:
        ob.location = pivot + R @ (ob.location - pivot)
        ob.rotation_euler.z += 0.35

    # ---- low bed along the left wall
    bx0, bx1, bz0, bz1 = X0 + 40, -3250, 2300, FRONT - 100
    bw, bl, bcx, bcz = bx1 - bx0, bz1 - bz0, (bx0 + bx1) / 2, (bz0 + bz1) / 2
    box('bed_frame', bcx, FLOOR + 230, bcz, bw, 460, bl, bed_frame, bake, bevel=20)
    box('bed_head', bcx, FLOOR + 800, bz0 - 50, bw, 1600, 100, bed_frame, bake, bevel=20)
    box('mattress', bcx, FLOOR + 460 + 200, bcz, bw - 120, 400, bl - 120, sheet, bake, bevel=50)
    box('duvet', bcx, FLOOR + 880, bz1 - bl * 0.36 - 60, bw - 20, 90, bl * 0.72, duvet, bake, bevel=40)
    box('duvet_fold', bcx, FLOOR + 900, bz1 - bl * 0.72 - 160, bw - 10, 140, 380, duvet, bake, bevel=60)
    box('throw', bcx + 300, FLOOR + 940, bz1 - 800, bw * 0.55, 50, 900, throw, bake, bevel=20, rot_y=0.2)
    for dxp in (-0.24, 0.24):
        box('pillow', bcx + dxp * bw, FLOOR + 960, bz0 + 420, bw * 0.4, 230, 600, pillow, bake, bevel=90, rot_y=dxp * 0.3)

    # ---- sneaker wall: three white floating shelves with sneakers, boxes below
    shelf_x0, shelf_x1 = 3100, 5900
    for i, sy in enumerate((700, 1550, 2400)):
        box(f'sneaker_shelf{i}', (shelf_x0 + shelf_x1) / 2, sy, BACK + 190, shelf_x1 - shelf_x0, 50, 380, shelf_m, bake, bevel=6)
        for j, (sx, upper, sole, accent) in enumerate(SNEAKERS[i]):
            sneaker(f'sneaker{i}{j}', sx, sy + 25, BACK + 200, upper, sole, accent, bake, flip=(j % 2 == 1))
    # shoe boxes stacked in the corner
    bxs = [(5300, 0, box_orange), (5300, 1, box_black), (5300, 2, box_orange), (4350, 0, box_white), (4350, 1, box_black)]
    for i, (x, level, m) in enumerate(bxs):
        y = FLOOR + 200 + level * 400
        box(f'shoebox{i}', x + (level % 2) * 40, y, BACK + 500, 900, 390, 620, m, bake, bevel=6, rot_y=0.04 * (level - 1))
        box(f'shoebox_lid{i}', x + (level % 2) * 40, y + 205, BACK + 500, 920, 40, 640, box_black if m is not box_black else box_white, bake, rot_y=0.04 * (level - 1))

    # ---- clothes rack with hoodies on the right wall
    rz0, rz1, rx = 3200, 5900, X1 - 520
    for rz in (rz0, rz1):
        box('rack_post', rx, FLOOR + 1300, rz, 60, 2600, 60, rack_m, bake)
        box('rack_foot', rx, FLOOR + 20, rz, 700, 40, 80, rack_m, bake)
    cyl('rack_bar', rx, FLOOR + 2560, (rz0 + rz1) / 2, 28, rz1 - rz0, rack_m, bake, seg=12, axis='Z')
    hoodie_cols = ['#1c1c1e', '#6b6e72', '#3d4a35', '#d9d3c7', '#7a1c22', '#1c1c1e']
    for i, col in enumerate(hoodie_cols):
        z = rz0 + 280 + i * ((rz1 - rz0 - 560) / (len(hoodie_cols) - 1))
        hm = mat(f'hoodie{i}', col, 0.95)
        box(f'hoodie_body{i}', rx, FLOOR + 1900, z, 760, 1150, 150, hm, bake, bevel=60, rot_y=math.pi / 2)
        box(f'hoodie_hood{i}', rx, FLOOR + 2420, z, 420, 260, 170, hm, bake, bevel=60, rot_y=math.pi / 2)
        cyl(f'hanger{i}', rx, FLOOR + 2500, z, 6, 160, rack_m, bake, seg=6)

    # ---- skate decks on the right wall, near the desk
    deck_m = mat('deck', image='deck.webp', rough=0.6)
    for i, (z, tilt) in enumerate(((800, 0.1), (1500, -0.06))):
        bm = bmesh.new()
        W, H = 680, 2200
        # a rounded deck outline in the wall plane (facing -X)
        pts = []
        for k in range(40):
            a = math.pi * k / 39
            pts.append((W / 2 * math.cos(a), H / 2 - W / 2 + W / 2 * math.sin(a)))
        for k in range(40):
            a = math.pi + math.pi * k / 39
            pts.append((W / 2 * math.cos(a), -H / 2 + W / 2 + W / 2 * math.sin(a)))
        vs = []
        for (u, v) in pts:
            uu = u * math.cos(tilt) - v * math.sin(tilt)
            vv = u * math.sin(tilt) + v * math.cos(tilt)
            vs.append(bm.verts.new(V(X1 - 30, 1500 + vv, z + uu)))  # facing -X, into the room
        f = bm.faces.new(vs)
        ob = mesh_obj(f'deck{i}', bm, deck_m, bake)
        uv = ob.data.uv_layers.new(name='src')
        for poly in ob.data.polygons:
            for li, vi in zip(poly.loop_indices, poly.vertices):
                u, v = pts[vi]
                uv.data[li].uv = (u / W + 0.5, v / H + 0.5)
        # single-sided like the wall, so it disappears with the wall when seen from outside

    # ---- posters (the film posters are for made-up films)
    poster('poster_static', 'poster-static.webp', -1550, 1900, BACK + 4, 900, 1350, bake)
    poster('poster_404', 'poster-404.webp', 1850, 1900, BACK + 4, 900, 1350, bake)
    poster('poster_city', 'poster-city.webp', X0 + 4, 1350, 2900, 1000, 1500, bake, wall='left')
    poster('poster_personal', 'poster-personal.webp', X0 + 4, 1350, 6500, 1000, 1500, bake, wall='left')

    # ---- rug, bean bag, football, plant
    rug = plane('rug', [(-1500, FLOOR + 6, 4300), (3300, FLOOR + 6, 4300), (3300, FLOOR + 6, 1000), (-1500, FLOOR + 6, 1000)], rug_m, bake)
    uv = rug.data.uv_layers.new(name='src')
    # the rug texture has a white margin (it used to be multiplied over a floor): skip it
    mu, mv = 40 / 1024, 40 / 704
    for poly in rug.data.polygons:
        for li, (u, v) in zip(poly.loop_indices, [(mu, mv), (1 - mu, mv), (1 - mu, 1 - mv), (mu, 1 - mv)]):
            uv.data[li].uv = (u, v)
    bb = sphere('beanbag', 2700, FLOOR + 520, 5600, 900, beanbag, bake, scale=(1.15, 0.6, 1.1), seg=32)
    sphere('football', 400, FLOOR + 330, 6400, 330, mat('football', '#e8e6e0', 0.6), bake, seg=24)
    cyl('plant_pot', -2700, FLOOR + 380, -1900, 380, 760, plant_pot, bake, r2=300, seg=24)
    for k in range(9):
        a = k * 2 * math.pi / 9
        h = 1400 + 500 * ((k * 7) % 5) / 4
        leaf_ob = box(f'snake_leaf{k}', -2700 + math.cos(a) * 120, FLOOR + 760 + h / 2, -1900 + math.sin(a) * 120, 130, h, 24, leaf, bake, rot_y=a, rot_x=0.08 * math.cos(a), rot_z=0.08 * math.sin(a))

    # ---- glowing parts (unlit on the site; light sources in the bake)
    led_red = mat('led', '#ff2a2a', emit='#ff2a2a', strength=0)
    box('led_top', (X0 + X1) / 2, WALL_TOP - 60, BACK + 30, X1 - X0 - 100, 30, 30, led_red, glow)
    box('led_desk', (dx0 + dx1) / 2, DESK_Y - 160, dz0 + 120, dx1 - dx0 - 500, 24, 24, led_red, glow)
    box('led_bed', bcx, FLOOR + 30, bcz, 30, 24, bl - 400, led_red, glow)
    neon_text('STAY UP', 150, 3200, BACK + 50, glow)

    # ---- stand-ins for the CRT and the desk items, for their shadows
    import_crt(occl)
    box('px_frame', -1880, DESK_Y + 690, -1130, 990, 1380, 60, mat('px', '#777777'), occl, rot_x=-0.08)
    cyl('px_can', 1740, DESK_Y + 425, 880, 230, 850, mat('px'), occl)
    box('px_neon', 1180, DESK_Y + 200, 260, 900, 400, 40, mat('px'), occl)
    box('px_lamp_base', -1330, DESK_Y + 30, 660, 380, 60, 380, mat('px'), occl)

    # ---- lights
    # night: desk lamp (warm spot over the paper), monitor glow, LED strips and neon (red),
    # cold moonlight from the window, a very dark sky
    spot('lamp', (-1950, 300, 1000), (-2160, DESK_Y, 1050), '#ffb46b', 900, 1.15, lights_night)
    area('monitor_glow', (0, 950, 520), (0, 950, 3000), '#bcd0ff', 220, 1.3, 1.0, lights_night)
    area('led_top_light', ((X0 + X1) / 2, WALL_TOP - 90, BACK + 80), ((X0 + X1) / 2, 0, BACK + 1200), '#ff2a2a', 260, X1 - X0 - 200, 60, lights_night)
    area('led_desk_light', ((dx0 + dx1) / 2, DESK_Y - 190, dz0 + 140), ((dx0 + dx1) / 2, DESK_Y - 190, BACK), '#ff3020', 160, dx1 - dx0 - 500, 60, lights_night)
    area('led_desk_down', ((dx0 + dx1) / 2, DESK_Y - 200, dz0 + 400), ((dx0 + dx1) / 2, FLOOR, dz0 + 600), '#ff3020', 140, dx1 - dx0 - 500, 300, lights_night)
    area('led_bed_light', (bcx, FLOOR + 50, bcz), (bcx, FLOOR - 1000, bcz), '#ff2a2a', 0, 100, 100, lights_night)
    point('neon_light', (150, 3200, BACK + 450), '#ff2a2a', 220, 300, lights_night)
    # a soft cool fill from above, so the room reads at night without killing the mood
    area('night_fill', ((X0 + X1) / 2, 9000, 2500), ((X0 + X1) / 2, FLOOR, 2500), '#6f7fae', 2600, 9000, 7000, lights_night)
    area('moon', ((wx0 + wx1) / 2, (wy0 + wy1) / 2, BACK - 150), ((wx0 + wx1) / 2, 0, 3000), '#7f9cff', 260, wx1 - wx0, wy1 - wy0, lights_night)
    # day: sun through the window and sky light from the open side
    sun('sun', (-0.35, -0.55, 0.75), '#fff1dc', 4.5, lights_day)
    area('day_fill', ((X0 + X1) / 2, 9000, 2500), ((X0 + X1) / 2, FLOOR, 2500), '#f2f4ff', 3000, 9000, 7000, lights_day)
    area('window_sky', ((wx0 + wx1) / 2, (wy0 + wy1) / 2, BACK - 150), ((wx0 + wx1) / 2, 0, 3000), '#cfe0ff', 900, wx1 - wx0, wy1 - wy0, lights_day)
    area('monitor_glow_day', (0, 950, 520), (0, 950, 3000), '#bcd0ff', 80, 1.3, 1.0, lights_day)
    return scene


SNEAKERS = [
    # x, upper, sole, accent
    [(3500, '#f2f0ea', '#f2f0ea', '#c0151c'), (4300, '#1b1b1d', '#f0eee8', '#f0eee8'), (5100, '#e9e6de', '#2a2a2c', '#3a5bd0'), (5600, '#c84c1c', '#f0eee8', '#1b1b1d')],
    [(3500, '#1b1b1d', '#1b1b1d', '#c0151c'), (4300, '#f2f0ea', '#f2f0ea', '#2f6b3a'), (5100, '#6b6e72', '#f0eee8', '#f2f0ea')],
    [(3500, '#f2f0ea', '#c49a6c', '#1b1b1d'), (4300, '#9a1b22', '#f0eee8', '#f2f0ea'), (5100, '#2b3a55', '#f0eee8', '#f2f0ea')],
]


def sneaker(name, X, Y, Z, upper_c, sole_c, accent_c, coll, flip=False):
    """A simple low-top sneaker (no branding): sole, rounded upper, toe cap, an accent stripe."""
    L, W = 640, 240
    s = -1 if flip else 1
    sole = box(name + '_sole', X, Y + 35, Z, L, 70, W, mat('sole' + sole_c, sole_c, 0.7), coll, bevel=25)
    up = box(name + '_upper', X - s * 60, Y + 160, Z, L * 0.78, 190, W * 0.92, mat('upper' + upper_c, upper_c, 0.8), coll, bevel=70)
    toe = sphere(name + '_toe', X + s * (L / 2 - 120), Y + 110, Z, 125, mat('upper' + upper_c, upper_c, 0.8), coll, scale=(1.3, 0.75, 0.95), seg=16)
    heel = box(name + '_heel', X - s * (L / 2 - 70), Y + 230, Z, 140, 230, W * 0.9, mat('upper' + upper_c, upper_c, 0.8), coll, bevel=50)
    box(name + '_stripe', X - s * 40, Y + 150, Z + W * 0.47, L * 0.5, 50, 6, mat('acc' + accent_c, accent_c, 0.7), coll)
    box(name + '_collar', X - s * 150, Y + 262, Z, 220, 20, W * 0.7, mat('collar', '#1a1a1a', 0.9), coll)


def neon_text(text, X, Y, Z, coll):
    cu = bpy.data.curves.new('neon', 'FONT')
    cu.body = text
    cu.size = 0.9
    cu.align_x = 'CENTER'
    cu.align_y = 'CENTER'
    cu.fill_mode = 'NONE'
    cu.bevel_depth = 0.035
    cu.offset = -0.02
    ob = bpy.data.objects.new('neon_sign', cu)
    coll.objects.link(ob)
    ob.data.materials.append(mat('neon', '#ff2a2a', emit='#ff2a2a', strength=0))
    # stand it on the back wall above the desk, reading from inside the room
    ob.rotation_euler = (math.pi / 2, 0, 0)
    ob.location = V(X, Y, Z)
    bpy.context.view_layer.update()
    # make it a mesh so it can be exported
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    mo = bpy.data.objects.new('neon_sign', me)
    mo.matrix_world = ob.matrix_world
    coll.objects.link(mo)
    bpy.data.objects.remove(ob)
    return mo


def import_crt(coll):
    # the uncompressed original (the site's copy is meshopt-compressed, which bpy can't read)
    path = os.path.join(HERE, 'src', 'computer_setup_raw.glb')
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    for o in new:
        for c in o.users_collection:
            c.objects.unlink(o)
        coll.objects.link(o)
        if o.type == 'MESH':
            o.data.materials.clear()
            o.data.materials.append(mat('px', '#777777'))
    # the site scales this model by 900 (scene units); ours are /1000, so 0.9
    roots = [o for o in new if o.parent is None]
    for r in roots:
        r.matrix_world = Matrix.Scale(0.9, 4) @ r.matrix_world


def look_at(ob, frm, to):
    d = (V(*to) - V(*frm)).normalized()
    ob.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()


def spot(name, frm, to, color, power, size, coll):
    li = bpy.data.lights.new(name, 'SPOT')
    li.color = srgb(color)[:3]
    li.energy = power
    li.spot_size = size
    li.spot_blend = 0.6
    li.shadow_soft_size = 0.12
    ob = bpy.data.objects.new(name, li)
    ob.location = V(*frm)
    look_at(ob, frm, to)
    coll.objects.link(ob)


def area(name, frm, to, color, power, w, h, coll):
    li = bpy.data.lights.new(name, 'AREA')
    li.color = srgb(color)[:3]
    li.energy = power
    li.shape = 'RECTANGLE'
    li.size = (w / 1000) if w > 10 else w
    li.size_y = (h / 1000) if h > 10 else h
    ob = bpy.data.objects.new(name, li)
    ob.location = V(*frm)
    look_at(ob, frm, to)
    coll.objects.link(ob)


def point(name, at, color, power, radius, coll):
    li = bpy.data.lights.new(name, 'POINT')
    li.color = srgb(color)[:3]
    li.energy = power
    li.shadow_soft_size = radius / 1000
    ob = bpy.data.objects.new(name, li)
    ob.location = V(*at)
    coll.objects.link(ob)


def sun(name, direction, color, strength, coll):
    li = bpy.data.lights.new(name, 'SUN')
    li.color = srgb(color)[:3]
    li.energy = strength
    li.angle = 0.05
    ob = bpy.data.objects.new(name, li)
    d = Vector((direction[0], -direction[2], direction[1])).normalized()  # scene dir -> blender
    ob.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    coll.objects.link(ob)


def set_world(color, strength):
    w = bpy.data.worlds.get('World') or bpy.data.worlds.new('World')
    bpy.context.scene.world = w
    if hasattr(w, 'use_nodes'):
        w.use_nodes = True
    bg = w.node_tree.nodes.get('Background') or w.node_tree.nodes.new('ShaderNodeBackground')
    bg.inputs['Color'].default_value = srgb(color)
    bg.inputs['Strength'].default_value = strength
    out = w.node_tree.nodes.get('World Output') or w.node_tree.nodes.new('ShaderNodeOutputWorld')
    w.node_tree.links.new(bg.outputs['Background'], out.inputs['Surface'])


def use_lights(mode):
    for name in ('lights_night', 'lights_day'):
        c = bpy.data.collections[name]
        on = name == 'lights_' + mode
        for ob in c.objects:
            ob.hide_render = not on
    if mode == 'night':
        set_world('#0b1020', 0.25)
    else:
        set_world('#c9d6ea', 1.3)


def cycles(samples):
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = samples
    sc.cycles.use_denoising = True
    sc.cycles.max_bounces = 4
    sc.cycles.diffuse_bounces = 3


def preview(out, mode='night', samples=24, view='idle'):
    build()
    use_lights(mode)
    cycles(samples)
    sc = bpy.context.scene
    cam_d = bpy.data.cameras.new('cam')
    cam_d.sensor_fit = 'VERTICAL'
    cam_d.angle_y = math.radians(35)
    cam_d.clip_end = 1000
    cam = bpy.data.objects.new('cam', cam_d)
    sc.collection.objects.link(cam)
    if view == 'idle':
        frm, to = (-20000, 9500, 20000), (0, -1000, 0)
    elif view == 'idle2':
        frm, to = (20000, 9500, 20000), (0, -1000, 0)
    else:
        frm, to = (0, 1500, 5300), (0, 500, 0)
    cam.location = V(*frm)
    look_at(cam, frm, to)
    sc.camera = cam
    sc.render.resolution_x = 960
    sc.render.resolution_y = 600
    sc.render.filepath = out
    # Cycles draws both sides of the walls; hide the ones the site would cull from here
    away = {'idle': ('wall_left', 'skirt_left', 'poster_city', 'poster_personal'),
            'idle2': ('wall_right', 'skirt_right', 'deck0', 'deck1')}.get(view, ())
    for ob in bpy.data.objects:
        if ob.name.split('.')[0] in away:
            ob.hide_render = True
    # glow parts: emissive in previews
    for ob in bpy.data.collections['glow'].objects:
        for m in ob.data.materials:
            b = m.node_tree.nodes.get('Principled BSDF')
            if b and m.name in ('led', 'neon'):
                b.inputs['Emission Strength'].default_value = 8 if mode == 'night' else 1.5
    bpy.ops.render.render(write_still=True)


# ---------------------------------------------------------------- baking
DENSITY = [  # (name prefix, texel density weight)
    ('poster', 3.2), ('deck', 3.0), ('rug', 2.0), ('neon_board', 1.0), ('sneaker', 2.6), ('shoebox', 2.0),
    ('hoodie', 1.6), ('chair', 1.8), ('desk_top', 2.2), ('paper', 2.0), ('bed', 1.4), ('mattress', 1.4),
    ('duvet', 1.4), ('pillow', 1.6), ('throw', 1.6), ('floor', 1.15), ('wall', 0.9), ('slab', 0.35),
    ('reveal', 0.8), ('frame', 1.4), ('curtain', 1.2),
]


def weight(name):
    for p, w in DENSITY:
        if name.startswith(p):
            return w
    return 1.5


def mesh_area(ob):
    me = ob.data
    return sum(p.area for p in me.polygons) * (ob.matrix_world.to_scale().x ** 2)


def uv_area(me, layer):
    total = 0.0
    for p in me.polygons:
        pts = [me.uv_layers[layer].data[li].uv for li in p.loop_indices]
        a = 0.0
        for i in range(len(pts)):
            x1, y1 = pts[i]
            x2, y2 = pts[(i + 1) % len(pts)]
            a += x1 * y2 - x2 * y1
        total += abs(a) / 2
    return total


def select_only(obs, active=None):
    bpy.ops.object.select_all(action='DESELECT')
    for o in obs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = active or obs[0]


def prepare_room():
    """Apply modifiers, give every object a 'src' and an 'atlas' UV map (unwrapped per object and
    scaled by its texel density weight), join everything in 'bake' into one mesh, pack."""
    coll = bpy.data.collections['bake']
    obs = [o for o in coll.objects if o.type == 'MESH']
    for o in obs:
        select_only([o])
        for m in list(o.modifiers):
            bpy.ops.object.modifier_apply(modifier=m.name)
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
        me = o.data
        if 'src' not in me.uv_layers:
            me.uv_layers.new(name='src')
        at = me.uv_layers.new(name='atlas')
        me.uv_layers.active = at
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=0.02, scale_to_bounds=False)
        bpy.ops.object.mode_set(mode='OBJECT')
        a3, a2 = mesh_area(o), uv_area(me, 'atlas')
        k = weight(o.name) * math.sqrt(a3 / max(a2, 1e-9))
        for d in me.uv_layers['atlas'].data:
            d.uv = d.uv * k
    select_only(obs)
    bpy.ops.object.join()
    room = bpy.context.view_layer.objects.active
    room.name = 'room'
    room.data.uv_layers.active = room.data.uv_layers['atlas']
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.pack_islands(rotate=True, scale=True, margin=0.004)
    bpy.ops.object.mode_set(mode='OBJECT')
    return room


def bake_into(room, image, kind, samples):
    for m in room.data.materials:
        nt = m.node_tree
        n = nt.nodes.get('bake_target') or nt.nodes.new('ShaderNodeTexImage')
        n.name = 'bake_target'
        n.image = image
        nt.nodes.active = n
    sc = bpy.context.scene
    sc.cycles.samples = samples
    sc.render.bake.margin = 8
    sc.render.bake.use_clear = True
    select_only([room])
    if kind == 'albedo':
        bpy.ops.object.bake(type='DIFFUSE', pass_filter={'COLOR'}, margin=8)
    else:
        bpy.ops.object.bake(type='DIFFUSE', pass_filter={'DIRECT', 'INDIRECT'}, margin=8)


def to_srgb8(arr):
    import numpy as np
    a = np.clip(arr, 0, 1)
    return np.where(a <= 0.0031308, a * 12.92, 1.055 * np.power(a, 1 / 2.4) - 0.055)


def save_image(image, path, scale=1.0, blur=0.0):
    import numpy as np
    from PIL import Image, ImageFilter
    w, h = image.size
    px = np.empty(w * h * 4, dtype=np.float32)
    image.pixels.foreach_get(px)
    px = px.reshape(h, w, 4)[::-1, :, :3] / scale  # Blender stores bottom-up
    out = (to_srgb8(px) * 255 + 0.5).astype('uint8')
    im = Image.fromarray(out)
    if blur:
        im = im.filter(ImageFilter.GaussianBlur(blur))
    im.save(path, quality=90, method=6)


def light_scale(image):
    import numpy as np
    w, h = image.size
    px = np.empty(w * h * 4, dtype=np.float32)
    image.pixels.foreach_get(px)
    lum = px.reshape(-1, 4)[:, :3].max(axis=1)
    lum = lum[lum > 1e-4]
    return float(max(1.0, np.percentile(lum, 99.7))) if len(lum) else 1.0


def export_glb(obs, path, keep_uv):
    for o in obs:
        if o.type != 'MESH':
            continue
        for uv in list(o.data.uv_layers):
            if uv.name != keep_uv:
                o.data.uv_layers.remove(uv)
    select_only(obs)
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_materials='NONE',
                              export_normals=False, export_apply=True, export_yup=True, export_texcoords=True)


def bake_all(out, size=2048, light_size=1024, samples=64):
    import json
    import time
    os.makedirs(out, exist_ok=True)
    build()
    cycles(samples)
    # glow parts don't emit in the bake (the lights do that), they only block light
    t0 = time.time()
    room = prepare_room()
    print('uv ready', round(time.time() - t0, 1), 's', flush=True)
    meta = {}
    alb = bpy.data.images.new('albedo', size, size, float_buffer=True)
    alb.colorspace_settings.name = 'Linear Rec.709' if 'Linear Rec.709' in [c.identifier for c in alb.colorspace_settings.bl_rna.properties['name'].enum_items] else 'Non-Color'
    use_lights('day')
    bake_into(room, alb, 'albedo', 4)
    save_image(alb, os.path.join(out, 'albedo.webp'))
    print('albedo', round(time.time() - t0, 1), 's', flush=True)
    for mode in ('night', 'day'):
        use_lights(mode)
        img = bpy.data.images.new('light-' + mode, light_size, light_size, float_buffer=True)
        bake_into(room, img, 'light', samples)
        sc = light_scale(img)
        meta[mode] = round(sc, 4)
        save_image(img, os.path.join(out, f'light-{mode}.webp'), scale=sc, blur=0.8)
        print(mode, 'scale', sc, round(time.time() - t0, 1), 's', flush=True)
    export_glb([room], os.path.join(out, 'room.glb'), 'atlas')
    glow = [o for o in bpy.data.collections['glow'].objects]
    export_glb(glow, os.path.join(out, 'glow.glb'), 'src')
    with open(os.path.join(out, 'room.json'), 'w') as f:
        json.dump({'lightMapIntensity': meta}, f)
    print('done', meta, round(time.time() - t0, 1), 's')


if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'preview':
        preview(sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else 'night', int(sys.argv[4]) if len(sys.argv) > 4 else 24, sys.argv[5] if len(sys.argv) > 5 else 'idle')
    elif cmd == 'bake':
        a = sys.argv
        bake_all(a[2], int(a[3]) if len(a) > 3 else 2048, int(a[4]) if len(a) > 4 else 1024, int(a[5]) if len(a) > 5 else 64)
