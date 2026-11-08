import Application from '../Application';
import Resources from '../Utils/Resources';
import ComputerSetup from './Computer';
import MonitorScreen from './MonitorScreen';
import Environment from './Environment';
import Decor from './Decor';
import Cursor from './Cursor';
import Hitboxes from './Hitboxes';
import AudioManager from '../Audio/AudioManager';
import Personal from './Personal';
import BakedRoom from './BakedRoom';
import { NEW_ROOM } from '../config';
export default class World {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;

    // Objects in the scene
    environment: Environment;
    decor: Decor;
    computerSetup: ComputerSetup;
    monitorScreen: MonitorScreen;
    cursor: Cursor;
    audioManager: AudioManager;
    personal: Personal;
    room?: BakedRoom;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            if (NEW_ROOM) {
                this.room = new BakedRoom();
                this.computerSetup = new ComputerSetup();
                this.monitorScreen = new MonitorScreen();
                this.audioManager = new AudioManager();
                this.personal = new Personal(this.computerSetup.bakedModel.getModel(), this.room.raycastTarget, [this.computerSetup.bakedModel.material]);
                return;
            }
            this.environment = new Environment();
            this.decor = new Decor();
            this.computerSetup = new ComputerSetup();
            this.monitorScreen = new MonitorScreen();
            this.audioManager = new AudioManager();
            this.personal = new Personal(
                this.computerSetup.bakedModel.getModel(),
                this.environment.bakedModel.getModel(),
                [
                    this.environment.bakedModel.material,
                    this.decor.bakedModel.material,
                    this.computerSetup.bakedModel.material,
                ],
                this.decor.bakedModel.getModel()
            );
            // const hb = new Hitboxes();
            // this.cursor = new Cursor();
        });
    }

    update() {
        if (this.monitorScreen) this.monitorScreen.update();
        if (this.environment) this.environment.update();
        if (this.audioManager) this.audioManager.update();
        if (this.personal) this.personal.update();
        if (this.room) this.room.update();
    }
}
