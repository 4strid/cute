import primitives from '../primitives'

function Node (type, props, children) {
  if (typeof type === 'string') {
    this.drawFn = primitives._lookup(type);
    this.renderFn = renderFunction;
  }
  if (type.prototype.render === undefined) {
    this.renderFn = renderFunction;
  }
  if (type.prototype.render !== undefined) {
    this.renderFn = renderComponent;
  }
}

function renderFunction (props, parent) {
  
}

function renderComponent (props, parent) {

}

Node.prototype.draw = function (ctx) {
  return this.drawFn(ctx);
}

Node.prototype.render = function (props, parent) {
  // this.receiveProps(props, parent);
  return this.renderFn(props, parent);
}

function ComponentNode (type, props, children) {
  this.props = props || {};
}

function PrimitiveNode (drawFn, props, children) {
  this.draw = drawFn;
  this.props = props;
  this.children = children || [];
}

PrimitiveNode.prototype.render = function (props) {
  this.receiveProps(props);
  return this;
}

function FunctionNode (renderFn) {
  // render(props, parent) <- renderFn(props, parent)
  this.renderFn = renderFn;
}

FunctionNode.prototype.render = function (props, parent) {
  this.receiveProps(props);
  // if updated rerender ? idk
  return this.renderFn(props);
}

FunctionNode.prototype.draw = ComponentNode.prototype.draw;

function TextNode (text) {
	this.text = text
}

TextNode.prototype.render = function () {
  return this;
}

TextNode.prototype.draw = function () {
  // noop
}

export default NodeContext
