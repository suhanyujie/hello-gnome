// import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

// export default class HelloGnomeApp extends Extension {
//     enable() {}

//     disable() {}
// }

import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';
import IBus from 'gi://IBus';
import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as BoxPointer from 'resource:///org/gnome/shell/ui/boxpointer.js';
import * as keyboard from 'resource:///org/gnome/shell/ui/status/keyboard.js';

const InputSourcePopup = keyboard.InputSourcePopup;
const InputSourceIndicator = Main.panel.statusArea.keyboard;

export default class MyExtension extends Extension {
    gsettings?: Gio.Settings;
    animationsEnabled = true;

    enable() {
        this.gsettings = this.getSettings();
        this.animationsEnabled =
            this.gsettings!.get_value('padding-inner').deepUnpack() ?? 8;

        // custom code...
    }

    disable() {
        this.gsettings = undefined;
    }

    // custom method...
}
