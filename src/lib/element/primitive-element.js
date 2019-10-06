function PrimitiveElement (Type, props, children) {
  const draw = Primitives[Type]
  return new CuteElement(props, children, draw, null)
}

export default PrimitiveElement
