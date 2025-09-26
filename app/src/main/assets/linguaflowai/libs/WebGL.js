/**
 * A utility module with basic WebGL 2 capability testing.
 * Direkt verwendbar mit: import WebGL from './libs/WebGL.js';
 */
class WebGL {

  static isWebGL2Available() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
    } catch (e) {
      return false;
    }
  }

  static isColorSpaceAvailable(colorSpace) {
    try {
      const canvas = document.createElement('canvas');
      const ctx = window.WebGL2RenderingContext && canvas.getContext('webgl2');
      ctx.drawingBufferColorSpace = colorSpace;
      return ctx.drawingBufferColorSpace === colorSpace;
    } catch (e) {
      return false;
    }
  }

  static getWebGL2ErrorMessage() {
    return this._getErrorMessage(2);
  }

  static _getErrorMessage(version) {
    const names = {
      1: 'WebGL',
      2: 'WebGL 2'
    };

    const contexts = {
      1: window.WebGLRenderingContext,
      2: window.WebGL2RenderingContext
    };

    let message = 'Dein $0 unterstützt leider kein <a href="https://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">$1</a>';

    const element = document.createElement('div');
    element.id = 'webglmessage';
    element.style.fontFamily = 'monospace';
    element.style.fontSize = '13px';
    element.style.fontWeight = 'normal';
    element.style.textAlign = 'center';
    element.style.background = '#fff';
    element.style.color = '#000';
    element.style.padding = '1.5em';
    element.style.width = '400px';
    element.style.margin = '5em auto 0';

    if (contexts[version]) {
      message = message.replace('$0', 'Grafikchip');
    } else {
      message = message.replace('$0', 'Browser');
    }

    message = message.replace('$1', names[version]);
    element.innerHTML = message;

    return element;
  }
}

export default WebGL;