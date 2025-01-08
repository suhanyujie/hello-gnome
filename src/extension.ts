// import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

// export default class HelloGnomeApp extends Extension {
//     enable() {}

//     disable() {}
// }

import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';
import St from 'gi://St';
import Clutter from 'gi://Clutter';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as BoxPointer from 'resource:///org/gnome/shell/ui/boxpointer.js';
import * as keyboard from 'resource:///org/gnome/shell/ui/status/keyboard.js';

const InputSourcePopup = keyboard.InputSourcePopup;
const InputSourceIndicator = Main.panel.statusArea.keyboard;

export default class MyExtension extends Extension {
    gsettings?: Gio.Settings;
    animationsEnabled = true;

    _window: St.BoxLayout | null = null;
    statusLabel: St.Label | null = null;

    enable() {
        this.gsettings = this.getSettings();
        this.animationsEnabled =
            this.gsettings!.get_value('padding-inner').deepUnpack() ?? 8;

        // custom code...
        this._createStatusWindow();
    }

    disable() {
        this.gsettings = undefined;

        this._window?.remove_child(this.statusLabel);
        this.statusLabel = null;
        Main.uiGroup.remove_child(this._window);
        this._window = null;
    }

    // custom method...
    _createStatusWindow() {
        if (this._window) {
            this._window.destroy();
        }

        this._window = new St.BoxLayout({
            style_class: 'obs-status-window',
            vertical: true,
            opacity: 200, // 设置透明度，范围为 0-255
            y_align: Clutter.ActorAlign.END,
            x_align: Clutter.ActorAlign.END,
        });
        // 设置背景色、边框和圆角
        this._window.set_style(`
            width:200px;height:200px;
            background-color: rgba(59, 47, 47, 0.73); /* 背景色，带有透明度 */
            border: 2px solid #ffffff; /* 边框颜色和宽度 */
            border-radius: 10px; /* 圆角半径 */
            padding: 10px; /* 内边距 */
            color:rgba(241, 235, 235, 0.53);
        `);

        // this._window.set_position(100, 100); // 设置窗口位置

        this.statusLabel = new St.Label({
            text: 'Idle', // 默认状态文本
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._window.add_child(this.statusLabel);
        Main.uiGroup.add_child(this._window);

        // 添加拖动功能
        let dragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        this._window.connect('button-press-event', (actor, event) => {
            if (event.get_button() === 1) {
                // 左键拖动
                dragging = true;
                const [stageX, stageY] = event.get_coords();
                const [actorX, actorY] =
                    this._window.get_transformed_position();
                dragOffsetX = stageX - actorX;
                dragOffsetY = stageY - actorY;
            }
            return Clutter.EVENT_STOP; // 阻止事件冒泡
        });
        this._window.connect('button-release-event', (actor, event) => {
            if (event.get_button() === 1) {
                dragging = false;
            }
            return Clutter.EVENT_STOP; // 阻止事件冒泡
        });
        // motion-event 是 Clutter 库中的一个信号，用于处理鼠标移动事件。当鼠标在窗口或舞台上移动时，会触发这个事件。通过监听 motion-event 信号，可以在鼠标移动时执行特定的操作
        global.stage.connect('motion-event', (actor, event) => {
            if (dragging) {
                const [stageX, stageY] = event.get_coords();
                this._window.set_position(
                    stageX - dragOffsetX,
                    stageY - dragOffsetY,
                );
            }
            return Clutter.EVENT_STOP; // 阻止事件冒泡
        });
    }

    _updateStatusWindow(statusText: string) {
        if (!this._window) {
            this._createStatusWindow();
        }

        this.statusLabel.text = statusText;
    }
}
