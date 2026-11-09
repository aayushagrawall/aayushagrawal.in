import { NEW_ROOM, ROOM_TOYS } from './config';

const allSources: Resource[] = [
    {
        name: 'computerSetupModel',
        type: 'gltfModel',
        path: 'models/Computer/computer_setup.glb',
    },
    {
        name: 'computerSetupTexture',
        type: 'texture',
        path: 'models/Computer/baked_computer.webp',
    },
    {
        name: 'environmentModel',
        type: 'gltfModel',
        path: 'models/World/environment.glb',
    },
    {
        name: 'environmentTexture',
        type: 'texture',
        path: 'models/World/baked_environment.webp',
    },
    {
        name: 'decorModel',
        type: 'gltfModel',
        path: 'models/Decor/decor.glb',
    },
    {
        name: 'decorTexture',
        type: 'texture',
        path: 'models/Decor/baked_decor_modified.webp',
    },
    {
        name: 'monitorSmudgeTexture',
        type: 'texture',
        path: 'textures/monitor/layers/compressed/smudges.jpg',
    },
    {
        name: 'monitorShadowTexture',
        type: 'texture',
        path: 'textures/monitor/layers/compressed/shadow-compressed.webp',
    },
    {
        name: 'mouseDown',
        type: 'audio',
        path: 'audio/mouse/mouse_down.mp3',
    },
    {
        name: 'mouseUp',
        type: 'audio',
        path: 'audio/mouse/mouse_up.mp3',
    },
    {
        name: 'keyboardKeydown1',
        type: 'audio',
        path: 'audio/keyboard/key_1.mp3',
    },
    {
        name: 'keyboardKeydown2',
        type: 'audio',
        path: 'audio/keyboard/key_2.mp3',
    },
    {
        name: 'keyboardKeydown3',
        type: 'audio',
        path: 'audio/keyboard/key_3.mp3',
    },
    {
        name: 'keyboardKeydown4',
        type: 'audio',
        path: 'audio/keyboard/key_4.mp3',
    },
    {
        name: 'keyboardKeydown5',
        type: 'audio',
        path: 'audio/keyboard/key_5.mp3',
    },
    {
        name: 'keyboardKeydown6',
        type: 'audio',
        path: 'audio/keyboard/key_6.mp3',
    },
    {
        name: 'startup',
        type: 'audio',
        path: 'audio/startup/startup.mp3',
    },
    {
        name: 'office',
        type: 'audio',
        path: 'audio/atmosphere/office.mp3',
    },
    {
        name: 'ccType',
        type: 'audio',
        path: 'audio/cc/type.mp3',
    },
    {
        name: 'canOpen',
        type: 'audio',
        path: 'audio/desk/can_open.mp3',
    },
];

// With the new baked room, Henry's desk, chair, backdrop and desk props aren't downloaded.
const roomSources: Resource[] = [
    { name: 'roomModel', type: 'gltfModel', path: 'models/Room/room.glb' },
    { name: 'roomGlowModel', type: 'gltfModel', path: 'models/Room/glow.glb' },
    { name: 'roomAlbedo', type: 'texture', path: 'models/Room/albedo.webp' },
    { name: 'roomLightNight', type: 'texture', path: 'models/Room/light-night.webp' },
    { name: 'roomLightDay', type: 'texture', path: 'models/Room/light-day.webp' },
];

// The room with toys (ROOM_TOYS) has its own bake, with the movable props in props.glb.
const toySources: Resource[] = [
    { name: 'roomModel', type: 'gltfModel', path: 'models/Room2/room.glb' },
    { name: 'roomGlowModel', type: 'gltfModel', path: 'models/Room2/glow.glb' },
    { name: 'roomPropsModel', type: 'gltfModel', path: 'models/Room2/props.glb' },
    { name: 'roomAlbedo', type: 'texture', path: 'models/Room2/albedo.webp' },
    { name: 'roomLightNight', type: 'texture', path: 'models/Room2/light-night.webp' },
    { name: 'roomLightDay', type: 'texture', path: 'models/Room2/light-day.webp' },
];

const sources: Resource[] = NEW_ROOM
    ? [...allSources.filter((s) => !['environmentModel', 'environmentTexture', 'decorModel', 'decorTexture'].includes(s.name)), ...(ROOM_TOYS ? toySources : roomSources)]
    : allSources;

export default sources;
