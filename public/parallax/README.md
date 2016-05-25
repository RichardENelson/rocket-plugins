# Rocket Parallax for jQuery
Reveals elements based on the vertical scroll position of the browser.


## Documentation
### Usage


```javascript
$( "#my-container" ).rktParallax();
```


### Styles
The parent element that contains the image must have the following styles applied to it:

```css
.my-container {
	position: relative;
	overflow: hidden;
}
```


### Options
Options can be passed via data attributes. For data attributes, append the option name to `data-`, as in `data-interval=""`.

**stagger** (Number) When several elements pass the threshold at once, the animation/transition in is staggered.  This time is represented in seconds.  Default `0.1`.

**threshold** (Number) The percentage ratio based off of the window height that an element's top position must pass before it is revealed.  Default `0.9`.



### Methods
You can call additional methods on a reveal managed element by calling the plugin on the element and using one of the following commands as a string parameter (e.g. `$( "#my-container" ).rktReveal( "update" );`).

**destroy()** (Void) Destroys the reveal manager for all matching elements.

**disable()** (Void) Disables the resize and scroll event listeners.

**enable()** (Void) Enables the resize and scroll event listeners.




## Examples
(TBD)


## History
### v0.0.3
Added event handling for animation/transition end, in which the reveal classes are removed.  This will allow the browser to display the items without using the GPU if desired.

### v0.0.2
Added custom debouncing and throlling of resize and scroll events.  Added fix so that transitions can be used instead of animations.

### v0.0.1
Added to GitHub after using in several projects.
