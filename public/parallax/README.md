# Rocket Parallax for jQuery
Sets images to fill (aka cover) their parent container and vertically scroll separately from the page so that a parallax effect is achieved.

## Documentation
### Usage
The HTML my have a container element and an image element that is a child of the container, as follows:

```html
<div class="rkt-parallax">
	<img class="rkt-parallax-image" src="my-image.jpg"  alt="My Image">
</div>
```

Call the plugin on the container element(s) that should have the parallax effect:

```javascript
$( ".rkt-parallax" ).rktParallax();
```

With options:
```javascript
$( ".rkt-parallax" ).rktParallax( {
	bleed: 200
} );
```


### Styles
The parent element that contains the image must have the following styles applied to it:

```css
.rkt-container {
	position: relative;
	overflow: hidden;
}
```

The image element must have the following styles applied to it:

```css
.rkt-parallax {
	position: absolute;
}
```


### Options
Options can be passed via JavaScript within an object or as data attributes.  Options set in JavaScript will take precedence over data attributes.  For data attributes, append the option name to `data-`, as in `data-interval=""` in the DOM.

**bleed** (Number) The minimum vertical bleed space in pixels.  Having a minimum ensures that there is enough vertical height set for the image so that it can scroll faster than the page scrolls, even after being resized to fill the parent container.  Default `100`.



### Methods
You can call additional methods on a reveal managed element by calling the plugin on the element and using one of the following commands as a string parameter (e.g. `$( "#my-container" ).rktReveal( "update" );`).

**destroy()** (Void) Destroys the parallax manager for all matching elements.

**disable()** (Void) Disables the resize and scroll event listeners.

**enable()** (Void) Enables the resize and scroll event listeners.



### Lazy Loading
By not setting the image element `src` attribute and adding the `data-src` attribute to path, the plugin will then only load the image once it scrolls into view.  *Note: This the `src` for lazy loading cannot be set via JavaScript.*


### Responsive Images
The plugin supports responsive images for higher pixel density screens.  For images that don't use lazy loading, you must specify the image source via the `srcset` attribute.  There is no support for anything other than specifying images for varying pixel densities.  For example:

```html
<img class="rkt-parallax-image" src="my-image.jpg" srcset="my-image.jpg 1x, my-image@2x.jpg 2x" alt="My Image">
```

If you want to use lazy loading, then specify the image sources as follows:

```html
<img class="rkt-parallax-image" data-src="my-image.jpg" data-src2x="my-image@2x.jpg" alt="My Image">
```



## Examples
(TBD)



## History
### v0.0.7
Added support for responsive images via data attributes or `srcset`.

### v0.0.6
Changed how elements are targetted, so now it's the container that gets added.  This allows the whole container to be hidden while the image is loading.

### v0.0.5
Added optional lazy loading of images.

### v0.0.4
Added fade-in loaded style to prevent FOUC while image dimensions are being retrieved.

### v0.0.3
Added detection and utilization of passive event listeners for scrolling.

### v0.0.2
Changed how images are positioned from background images where the background position is set, to image elements where positioning is done through CSS transforms.

### v0.0.1
Added to GitHub after using in several projects.
