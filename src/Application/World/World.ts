import Application from '../Application';
import Resources from '../Utils/Resources';
import ComputerSetup from './Computer';
import MonitorScreen from './MonitorScreen';
import AudioManager from '../Audio/AudioManager';
import Personal from './Personal';
import BakedRoom from './BakedRoom';
import Toys from './Toys';

export default class World {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;

    // Objects in the scene
    computerSetup: ComputerSetup;
    monitorScreen: MonitorScreen;
    audioManager: AudioManager;
    personal: Personal;
    room: BakedRoom;
    toys: Toys;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        // Wait for resources
        this.resources.on('ready', () => {
            // the room (baked in Blender), the CRT, the desk items and the toys
            this.room = new BakedRoom();
            this.computerSetup = new ComputerSetup();
            this.monitorScreen = new MonitorScreen();
            this.audioManager = new AudioManager();
            this.personal = new Personal(this.computerSetup.bakedModel.getModel(), this.room.raycastTarget, [this.computerSetup.bakedModel.material]);
            this.toys = new Toys(this.room);
        });
    }

    update() {
        if (this.monitorScreen) this.monitorScreen.update();
        if (this.audioManager) this.audioManager.update();
        if (this.personal) this.personal.update();
        if (this.room) this.room.update();
        if (this.toys) this.toys.update();
    }
}
