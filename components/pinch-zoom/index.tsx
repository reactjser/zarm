/* https://github.com/GoogleChromeLabs/pinch-zoom */
import React, { Component } from 'react';
import PointerTracker, { Pointer } from 'pointer-tracker';
import { Point } from './PropsType';

let cachedSvg: SVGSVGElement;

function getSVG(): SVGSVGElement {
  if (cachedSvg) {
    return cachedSvg;
  }
  cachedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  return cachedSvg;
}

function createMatrix(): SVGMatrix {
  return getSVG().createSVGMatrix();
}

function createPoint(): SVGPoint {
  return getSVG().createSVGPoint();
}

function getDistance(a: Point, b?: Point): number {
  if (!b) return 0;
  return Math.sqrt((b.clientX - a.clientX) ** 2 + (b.clientY - a.clientY) ** 2);
}

function getMidpoint(a: Point, b?: Point): Point {
  if (!b) return a;

  return {
    clientX: (a.clientX + b.clientX) / 2,
    clientY: (a.clientY + b.clientY) / 2,
  };
}

export interface PinchZoomProps {
  prefixCls?: string;
  className?: string;
  onChange?: Function;
}
export default class PinchZoom extends Component<PinchZoomProps, any> {
  private _container;

  private _transform: SVGMatrix = createMatrix();

  private _positioningEl?: Element;

  constructor(props) {
    super(props);
    this._container = React.createRef();
  }

  componentDidMount() {
    const { current = {} } = this._container;
    const { children } = current;
    const [el] = children;
    this._positioningEl = el;
    const pointerTracker: PointerTracker = new PointerTracker(current, {
      start: (_pointer, event) => {
        // We only want to track 2 pointers at most
        if (pointerTracker.currentPointers.length === 2 || !this._positioningEl) return false;
        event.preventDefault();
        return true;
      },
      move: (previousPointers, _changePointers) => {
        // event.stopPropagation();
        if (this.scale === 1) return;
        this._onPointerMove(previousPointers, pointerTracker.currentPointers);
        // return fasle
      },
      // end: ()
    });
    this._container.current.addEventListener('wheel', (event) => this._onWheel(event));
  }

  get x() {
    return this._transform.e;
  }

  get scale() {
    return this._transform.a;
  }

  get y() {
    return this._transform.f;
  }

  /**
  * Update the stage with a given scale/x/y.
  */
  setTransform(opts) {
    const {
      scale = this.scale,
    } = opts;

    let {
      x = this.x,
      y = this.y,
    } = opts;

    // If we don't have an element to position, just set the value as given.
    // We'll check bounds later.
    if (!this._positioningEl) {
      this._updateTransform(scale, x, y);
      return;
    }

    // Get current layout
    const thisBounds = this._container.current.getBoundingClientRect();
    const positioningElBounds = this._positioningEl.getBoundingClientRect();

    // Not displayed. May be disconnected or display:none.
    // Just take the values, and we'll check bounds later.
    if (!thisBounds.width || !thisBounds.height) {
      this._updateTransform(scale, x, y);
      return;
    }

    // Create points for _positioningEl.
    let topLeft = createPoint();
    topLeft.x = positioningElBounds.left - thisBounds.left;
    topLeft.y = positioningElBounds.top - thisBounds.top;
    let bottomRight = createPoint();
    bottomRight.x = positioningElBounds.width + topLeft.x;
    bottomRight.y = positioningElBounds.height + topLeft.y;

    // Calculate the intended position of _positioningEl.
    const matrix = createMatrix()
      .translate(x, y)
      .scale(scale)
      // Undo current transform
      .multiply(this._transform.inverse());

    topLeft = topLeft.matrixTransform(matrix);
    bottomRight = bottomRight.matrixTransform(matrix);

    // Ensure _positioningEl can't move beyond out-of-bounds.
    // Correct for x
    if (topLeft.x > thisBounds.width) {
      x += thisBounds.width - topLeft.x;
    } else if (bottomRight.x < 0) {
      x += -bottomRight.x;
    }

    // Correct for y
    if (topLeft.y > thisBounds.height) {
      y += thisBounds.height - topLeft.y;
    } else if (bottomRight.y < 0) {
      y += -bottomRight.y;
    }

    let x1 = x;
    let y1 = y;
    let s = scale;
    if (s <= 1) {
      s = 1;
      x1 = 0;
      y1 = 0;
    }

    this._updateTransform(s, x1, y1);
  }

  _onWheel = (event) => {
    event.preventDefault();

    const currentRect = this._positioningEl!.getBoundingClientRect();
    let { deltaY } = event;
    const { ctrlKey, deltaMode } = event;

    if (deltaMode === 1) { // 1 is "lines", 0 is "pixels"
      // Firefox uses "lines" for some types of mouse
      deltaY *= 15;
    }

    // ctrlKey is true when pinch-zooming on a trackpad.
    const divisor = ctrlKey ? 100 : 300;
    const scaleDiff = 1 - deltaY / divisor;
    this.applyChange({
      scaleDiff,
      originX: event.clientX - currentRect.left,
      originY: event.clientY - currentRect.top,
      allowChangeEvent: true,
    });
  };

  applyChange = (opts) => {
    const {
      panX = 0, panY = 0,
      originX = 0, originY = 0,
      scaleDiff = 1,
    } = opts;

    const matrix = createMatrix()
      // Translate according to panning.
      .translate(panX, panY)
      // Scale about the origin.
      .translate(originX, originY)
      // Apply current translate
      .translate(this.x, this.y)
      .scale(scaleDiff)
      .translate(-originX, -originY)
      // Apply current scale.
      .scale(this.scale);

    // Convert the transform into basic translate & scale.
    this.setTransform({
      scale: matrix.a,
      x: matrix.e,
      y: matrix.f,
    });
  };

  private _onPointerMove(previousPointers: Pointer[], currentPointers: Pointer[]) {
    if (!this._positioningEl) return;

    // Combine next points with previous points
    const currentRect = this._positioningEl.getBoundingClientRect();

    // For calculating panning movement
    const prevMidpoint = getMidpoint(previousPointers[0], previousPointers[1]);
    const newMidpoint = getMidpoint(currentPointers[0], currentPointers[1]);

    // Midpoint within the element
    const originX = prevMidpoint.clientX - currentRect.left;
    const originY = prevMidpoint.clientY - currentRect.top;

    // Calculate the desired change in scale
    const prevDistance = getDistance(previousPointers[0], previousPointers[1]);
    const newDistance = getDistance(currentPointers[0], currentPointers[1]);
    const scaleDiff = prevDistance ? newDistance / prevDistance : 1;
    this.applyChange({
      originX,
      originY,
      scaleDiff,
      panX: newMidpoint.clientX - prevMidpoint.clientX,
      panY: newMidpoint.clientY - prevMidpoint.clientY,
    });
  }

  /**
   * Update transform values without checking bounds. This is only called in setTransform.
   */
  private _updateTransform(scale: number, x: number, y: number) {
    // Avoid scaling to zero
    // Return if there's no change
    if (
      scale === this.scale
      && x === this.x
      && y === this.y
    ) return;

    this._transform.e = x;
    this._transform.f = y;
    this._transform.d = this._transform.a = scale;

    this._container.current.style.setProperty('--x', `${this.x}px`);
    this._container.current.style.setProperty('--y', `${this.y}px`);
    this._container.current.style.setProperty('--scale', this.scale);
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange({
        x,
        y,
        scale,
      });
    }
  }

  render() {
    const { children, className } = this.props;
    return (<div ref={this._container} className={`${className} za-pinch-zoom`}>{children}</div>);
  }
}
