# Tweakpane Multiple Select Plugin

A multiple selector plugin for [Tweakpane][tweakpane].

## Installation

### Browser

```html
<script src="tweakpane.min.js"></script>
<script src="ivanli-cn-tweakpane-multiple-select-plugin.umd.min.js"></script>
<script>
	const pane = new Tweakpane.Pane();
	pane.registerPlugin(IvanliCnTweakpaneMultipleSelectPlugin);
</script>
```

or ES Modules:

```html
<script src="tweakpane.min.js"></script>
<script type="module">
    import * as IvanliCnTweakpaneMultipleSelectPlugin from 'ivanli-cn-tweakpane-multiple-select-plugin.module.js';
	const pane = new Tweakpane.Pane();
	pane.registerPlugin(IvanliCnTweakpaneMultipleSelectPlugin);
</script>
```

[tweakpane]: https://github.com/cocopon/tweakpane/
