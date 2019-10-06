import Primitives from '../primitives'
import PrimitiveElement from './primitive-element'
import FunctionElement from './function-element'
import ComponentElement from './component-element'

function Element (props, children, draw, func) {
}

Element.prototype.draw = function (ctx, children) {
  ctx.save()
  ctx.transform('zzz')
  this.rendered.draw(ctx)
  ctx.restore()
}

Element.prototype.render = function (parent, screen) {
  
}

export function createElement (Type, props, children) {
  if (typeof Type === 'string') {
    return PrimitiveElement(Type, props, children)
  }
  if (typeof Type === 'function') {
    if (Constructor.prototype.isPrototypeOf(type.prototype)) {
      return ComponentElement(Type, props, children)
    }
    return FunctionElement(Type, props, children)
  }
}
