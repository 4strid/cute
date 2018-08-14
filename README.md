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

Once compiled, open index.html in a web browser to view Bounce Physics App, the prototypal app used
to define the latest pieces of the interface of the framework. It features a general purpose "physics engine"
so that the code for the Square components is nearly trivial.

The source code for the application is found in /src. I put in some comments so you can kind
of see how it works.

There are other examples: Squares app, which was used to define the original interface of the framework,
and Bounce App, the app written to test the dynamic rerendering algorithm. Bounce Physics reflects the
best, most up-to-date practices, but you may find Squares or Bounce easier to understand. Squares, in particular
is chock full of comments that basically explain the framework's API.

There's also one called Balloons, but it won't compile or run... yet, it relies on features that have not yet been
implemented.

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

|-----------------|-----|
|Asset Loader?    | Nope|
|World Stage?     | Nope|
|Physics Engine?  | Nope|
|Camera?          | Nope|

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

Not all components will require x, y, width, and height props: they may be a fixed size, may calculate
it on their own from some other prop, or may simply not require it to draw themselves. For instance,
`<layer>` relies on nothing but its children, and we almost always use it without any props at all.

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

A functional component must always return exactly one Cute element. To return several, we must wrap
it in a `<layer>` or nest them in such a way that there is only one root.

Notice how the coordinates of the rectangles we draw don't reference `props.x` or `props.y`. This
is because they're drawn relative to the component, its own coordinates already having been
accounted for. This allows for much simpler positioning, without having to say `+ props.x` all the
time. Not only that, but as you nest components deeper and deeper, the expression you'd have to
use to position your subcomponents would quickly become unmanageable! So Cute does the math for you.

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

Now that our component is defined, we can use it to draw as many ShadowSquares as we want, in a
containing component we'll call Scene.

```jsx
function Scene (props) {
	return (
        <layer>
            <ShadowSquare x={5} y={5} w={50} h={50} color='antiquewhite' />
            <ShadowSquare x={25} y={35} w={50} h={50} color='cadetblue' />
            <ShadowSquare x={100} y={120} w={60} h={60} color='crimson' />
        </layer>
   )
}

Cute.attach(<Scene />, document.querySelector('.root'))
```

All the attributes we specify on the ShadowSquare elements are rolled into `props` objects
and passed to the function that defines ShadowSquare.

### Interactive Components

So far everything we've written has drawn something to the screen once and that was essentially
the end of our program. Obviously, to make applications and games, we need our components to update
and the user must be able to interact with them, be that through the keyboard, mouse, controller,
or touch screen.

To do this, we need to make what I call interactive components: components that interact with
the user and with each other. We create them with the Cute function, which returns a constructor
function to be used in JSX tags. We pass to this function an object that contains a blueprint of
how it should appear and behave, called a plan. The simplest interactive components resemble their
functional cousins in that their plan only contain a render function.

#### render

```jsx
const OutlinedRect = Cute({
	render () {
		return (
			<rect>
				<fill color={this.props.fill}/>
				<stroke color={this.props.stroke}/>
			</rect>
	   )
	}
})
```

This basic component relies only on its props and can't update itself, nor have we specified any ways
the user can interact with it, but it would be eligible for collision detection and could interact with
other components in that way. A piece of static terrain might look something like this component.

#### constructor

This is the function that will be used to construct our components when they are rendered for the first
time. Any setup that does not require the component to already be rendered should go in here.

This parameter is optional, but recommended for all interactive components as it is what lets you name the
function that constructs your components. This can be tremendously useful when debugging, as if you
do not provide a constructor, they always come out as `Component`. Which component? Hard to say.
This function is literally the constructor that's used to build your objects, and is the return value
of Cute() if provided.

The first thing we must do in the constructor function is call `this.construct(props)`, which will
perform the setup necessary to make the component work as intended. Though it's tempting to just use
the props object passed to the constructor, the correct way to access the props is (after calling
`this.construct(props)`) by referencing `this.props`.

With a constructor function, we can set up a component that will actually does something other than
just render itself once! Let's make a square that moves from left to right and bounces when it hits
the edges of the screen.

```jsx
const SCENE_WIDTH = 400
const SCENE_HEIGHT = 200

const MovingSquare = Cute({
    constructor: function MovingSquare (props) {
        this.construct(props)    
        this.direction = 1
		this.timerID = window.setInterval(() => {
			if (this.x + this.w > SCENE_WIDTH) {
                this.direction = -1
			}
			if (this.x < 0) {
                this.direction = 1
			}
            this.x += this.direction * 7
		}, 17)
	render () {
        return <fill-rect color='darkred'>
	}
})

Cute.attach(
    <MovingSquare x={0} y={50} w={100} h={100} />,
    document.querySelector('.root')
    SCENE_WIDTH,
    SCENE_HEIGHT
)
```

In this example, we set a timer which sets a new value to `this.x` which is all it takes to move it
on the screen.  All interactive components have reactive x, y, w, and h properties: setting position
with `this.x` or `this.y` will move the component and assigning dimensions with `this.w` and `this.h`
will cause it to rerender.

We'll worry about cleaning up after ourselves (clearing the setInterval) when we have a few more
plan parameters to work with.

#### Introducing: State

Until the previous example, our components had been entirely reliant on their props for information.
MovingSquare introduced an entirely new concept: information persistently stored on the component
itself. Its `x` property, rather than `props.x` was what determined where on the screen it should be
drawn, and we manipulated it directly to move it around.

Most of the components we write will be stateful in some way or another as it's what makes them
dynamic and interesting.

#### data

The first (of two) parameters related to state is called data. The data parameter lets us define a
reactive object which will automatically rerender our component when it is updated. The data parameter
should be a function which returns an object, rather than an object itself. This may seem like extra work,
but it makes sense when you consider that components are meant to be reusable, and that
objects are actually references.

If we were to define the data parameter as the object { counter: 0 }, and then passed it to
each component, then they would not be encapsulated: each component would refer to the same
object, and one component updating its counter would cause every other one to update as well.
So instead, we create a brand new object in the data function, and each component has its own
unique copy. Another benefit is that in the data function, we have access to `this.props` and
also any methods we define in the plan, which we can use to populate the data object.

The object returned by the data parameter function is made reactive and attached to the component
during `this.construct()` and can be accessed with `this.data`. We can use the data object to
update the component, and as a source of information in the components render function. Only
properties that were on the object when it was first created will be reactive, so be sure to
specify everything you need from the get go.

```jsx

```

#### Position: data, props, and this

#### data

Now things are heating up! The data parameter lets us define a reactive object, which will
automatically rerender our component when it is updated. The data parameter should be a
function which returns an object, rather than an object itself. This may seem like extra work,
but it makes sense when you consider that components are meant to be reusable, and that
objects are actually references.

If we were to pass the object { counter: 0 } to each component, then they would not be
encapsulated: each component would refer to the same object, and one component updating its
counter would cause every other one to update as well. So instead, we create a brand new
object in the data function, and each component has its own unique copy. Another benefit is
that in the data function, we have access to `this.props` and also any methods we define in
the plan.
