import { getAttributeOrThrow, getAttributeOrDefault } from "./lib/attribute";

/**
 * A hook used to render graphics according to the given
 * context ops list
 *
 * The hook expects a `canvas:<id>:init` event with `{ ops }` payload,
 * where `ops` is a list of functions and args to call on the CanvasRenderingContext2d
 * [["fillRect", [130, 190,40,60]]..]
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 *
 * Later `canvas:<id>:push` events may be sent with more `{ ops }` payload,
 * to dynamically update the canbas.
 *
 * Configuration:
 *
 *   * `data-id` - canvas id
 *
 */
const Canvas = {
  mounted() {
    this.props = getProps(this);
    this.state = {
      canvas: null,
      ctx: null
    };

    this.state.canvas = document.createElement("canvas");
    this.state.canvas.setAttribute("id", this.props.id);
    this.state.canvas.setAttribute("width", this.props.width)
    this.state.canvas.setAttribute("height", this.props.height)
    this.el.appendChild(this.state.canvas);


    this.state.ctx = this.state.canvas.getContext('2d');
    const applyOps = ctxOperator(this.state.ctx)

    this.handleEvent(`canvas:${this.props.id}:init`, ({ ops }) => {
      applyOps(ops)
    });

    this.handleEvent(`canvas:${this.props.id}:push`, ({ ops }) => {
      applyOps(ops)
    });
  },

  updated() {
    this.props = getProps(this);
    this.state.canvas.setAttribute("width", this.props.width);
    this.state.canvas.setAttribute("height", this.props.height);
  },

  destroyed() {
    if (this.state.viewPromise) {
      this.state.viewPromise.then((view) => view.finalize());
    }
  },
};

function ctxOperator(ctx) {
  return function(ops) {
    for (const [op, args] of ops) {
      console.log({op, args})

        try {
          if (op == "set") {
            ctx[args[0]] = args[1];
          } else if (typeof ctx[op] === "function") {
            const arg = args.filter(x => x != "unset")
            ctx[op](...arg);
          } else {
            console.log("Recieved a bad function:" + op)
          }
      } catch (e) {
        console.error(e)
      }
    }
  }
}

function getProps(hook) {
  return {
    id: getAttributeOrThrow(hook.el, "data-id"),
    width: getAttributeOrDefault(hook.el, "data-width", 300),
    height: getAttributeOrDefault(hook.el, "data-height", 300),
  };
}

export default Canvas
