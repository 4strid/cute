# cute
Framework for composing applications and games with Canvas

## build and run

it should suffice to run
```
npm install
```

then
```
npm run develop
```

Once compiled, open index.html in a web browser to view Squares App, the prototypal app used
to define the interface of the framework.

The source code for the application is found in /src. I put in some comments so you can kind
of see how it works.

There are other examples: balloons and bounce, but these will not compile or run... yet. They
depend on features which have not yet been implemented.

## enough Cute to get by

We draw to the screen using primitive components, and we nest those
together to draw the smallest pieces of our user interfaces such as menu buttons or a player
character. Nest enough buttons together, and you compose a menu. Compose menus, levels, a
physics engine, and a loading screen, and you have a game.

Cute provides a framework for creating and composing components. Components can draw themselves
to the screen, interact with the keyboard and mouse, and detect what other components they are
colliding with. Most importantly, components are described declaratively: given some data, what
should they look like? This declarative syntax means the source code of your game directly
describes the scene on the screen and how its components will interact.

What Cute doesn't provide is, well, anything else. To emphasize just how strange that is, let's
list some things that it doesn't provide.

-----------------|-----
Asset Loader?    | Nope
World Stage?     | Nope
Physics Engine?  | Nope
Camera?          | Nope

The reason being these can all be constructed as completely ordinary components. A separate
repository will be set up as a sort of "standard library" and the two will live in harmony,
working together to make game development easy and fun. Haven't settled on a name yet,
though I'm considering Beautiful or Extras at the moment.

### Hello JSX

We'll begin with the classic example: Hello World.

```jsx
Cute.attach(
    <text>Hello World</text>,
    document.querySelector('.root')
)
```

Here we call `Cute.attach` to create a canvas and attach it to our container in the page.

The first argument we pass in is the root node of our application. In this case, just a single
`<text>` element with a message inside it. This strange bit of brackety syntax is what we call
JSX. It looks like HTML (never mind that there's no such thing as a `<text>` tag) and is used 
like a templating language for describing how our components should appear on the screen, the
way you use HTML to describe what a web page should contain. But rather than outputting something like
a string template, what it returns is a Cute component, which is more like a function. The key
distinction here is that any piece of JSX is ultimately just JavaScript code, and can be treated
just like a regular JavaScript value, *because it is one*. That's why we can pass it as an
argument to another function.

#### JavaScript in JSX

Since JSX is just JavaScript, it should come as no surprise that we can dip back down into regular
JavaScript when we write it. To do so, in any piece of JSX we can use `{  }` braces to insert any
JavaScript expression we want.

```jsx
const who = 'JSX'
const app = <text>Hello, {who}</text>
```

#### Children in JSX

Just like HTML and XML, a tag can contain other tags as children. Some components rely on their
children to fully render something to the screen, for instance the `<rect>` tag, which only draws
a path, requiring a `<fill>` and/or `<stroke>` child in order to draw something to the screen,
and others, such as `<layer>` act as containers, drawing all their children.

```jsx
<layer>
	<rect>
		<fill/>
	</rect>
	<rect>
		<fill/>
	</rect>
</layer>
```

Note that if a tag contains no children, we can close it immediately with `/>` just like in XML.
Every JSX tag must be closed, either with a closing tag or by self-closing.

#### Hello props

JSX tags can have attributes like HTML tags. We call these attributes "props" and they're passed down
to the component created by the tag. We can use these to alter the way a component is drawn to the
screen.

```jsx
<fill-rect color='hotpink'/>
```

#### x, y, w, and h

There are special props, accepted by all components, which affect their size and position. These are
`x`, `y`, `w` (for width), and `h` (for height). By default, a component has coordinates (0, 0) and
width and height equal to those of its parent component. That's why in our previous examples the
rectangles we drew took up the whole screen.

Let's draw some explicitly sized and positioned rectangles:

```jsx
<layer>
    <rect x={50} y={50} w={100} h={100}>
        <fill color='#facade'/>
    </rect>
    <rect x={100} y={100} w={150} h={150}>
        <fill color='#deface'/>
    </rect>
</layer>
```

Position and dimension props are numbers, and will not be typecast, so we must use `{}` to pass them
rather than quotes.

You can pass any kind of value as a prop, not just numbers by using the `prop={value}` syntax.

An important thing to note is that these x and y coordinates are always relative to the component's
parent, rather than to the screen. We'll see why this is useful when we define our own components in
a moment.

```jsx
<layer x={60} y={40}>
	<rect x={0} y={0} w={50} h={50}>
		<fill color='lightcoral'/>
	</rect>
</layer>
```

Note: Cute source code can also be written in regular old vanilla ES5 JavaScript but your
developer happiness will suffer immensely. JSX and ES6 are  worth installing Webpack and Babel for,
I promise.

### Components of our own

So far our examples have only used built-in, primitive components that represent a single function
call to the canvas API. The spirit of the framework lies in composing these primitives into more
complex, reusable components.

The simplest such components are regular JavaScript functions, which take a single argument `props`
and return a Cute element. These functional components are similar to primitives in that they only
draw something to the screen.

The following code draws a rectangle to the screen with a "shadow" (just another rectangle of the
same size layered underneath the main one):

```jsx
function ShadowSquare (props) {
    return (
        <layer>
			<fill-rect x={7} y={7} w={props.w} h={props.h} color='#111'/>
			<fill-rect x={0} y={0} w={props.w} h={props.h} color={props.color}/>
		</layer>
    )
}
```

Notice how the coordinates of the rectangles we draw don't reference `props.x` or `props.y`. This
is because they're drawn relative to the component, its own coordinates already having been
accounted for. This allows for much simpler positioning, without having to say `+ props.x` all the
time. Not only that, but as you nest components deeper and deeper, the expression you'd have to
use to position your subcomponents would quickly become unmanageable! So we do the math for you.

Recall that by default, components have position (0, 0) and the same width and height as their parent
or to put it another way, they take up the full space of their parent. With this in mind, we can
simplify our component by omitting some unnecessary props.  

```jsx
function ShadowSquare (props) {
    return (
        <layer>
			<fill-rect x={7} y={7} color='#111'/>
			<fill-rect color={props.color}/>
		</layer>
    )
}
```

Nice and concise.

The order in which you define your components is significant: it determines the order in which
they're drawn. Components that are drawn later appear on top of ones drawn previously. Children
are drawn after their parents.

### Interactive Components


