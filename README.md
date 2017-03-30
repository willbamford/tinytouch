# tinytouch

Tiny JavaScript touch library designed to work with mouse and touch devices.

## Usage

```js
import { DOWN, MOVE, UP, CANCEL, DRAG }, createTouch from 'tinytouch'

const touch = createTouch(document.body)
const printEvent = (event) => console.log

touch
  .on(DOWN, printEvent)
  .on(MOVE, printEvent)
  .on(DRAG, printEvent)
  .on(UP, printEvent)
  .on(CANCEL, printEvent)
```

## Events

Note: only a single (first) touch event is handled.

| Name     | Description                 |
|:---------|:----------------------------|
| `DOWN`   | `mousedown` or `touchstart` |
| `MOVE`   | `mousemove` or `touchmove`  |
| `UP`     | `mouseup` or `touchend`     |
| `CANCEL` | `mouseout` or `touchcancel` |
| `DRAG`   | `DOWN` combined with `MOVE` |

Each event has the following properties:

| Property | Description                                           |
|:---------|:------------------------------------------------------|
| `source` | Source event from browser                             |
| `x`      | x pixel position                                      |
| `y`      | y pixel position                                      |
| `dx`     | Change in x from previous event (or zero)             |
| `dy`     | Change in y from previous event (or zero)             |
| `tx`     | Total change in x from initial `DOWN` event (or zero) |
| `ty`     | Total change in y from initial `DOWN` event (or zero) |
| `type`   | `Mouse` or `Touch`                                    |

Note `DRAG` is `DOWN` combined with `MOVE`.
