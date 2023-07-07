import {
	BaseInputParams,
	BindingTarget,
	InputBindingPlugin,
	ListParamsOptions,
	ParamsParsers,
	parseListOptions,
	parseParams,
} from '@tweakpane/core';

import {PluginController} from './controller';

export interface PluginInputParams<T> extends BaseInputParams {
	view: 'multiple-select';
	options: ListParamsOptions<T>;
}

type MultipleSelectPluginInputParams<T> = InputBindingPlugin<
	T[],
	T[],
	PluginInputParams<T>
>;

// NOTE: You can see JSDoc comments of `InputBindingPlugin` for details about each property
//
// `InputBindingPlugin<In, Ex, P>` means...
// - The plugin receives the bound value as `Ex`,
// - converts `Ex` into `In` and holds it
// - P is the type of the parsed parameters
//
export const TweakpaneMultipleSelectPlugin: MultipleSelectPluginInputParams<unknown> = {
	id: 'input-multiple-select',

	// type: The plugin type.
	// - 'input': Input binding
	// - 'monitor': Monitor binding
	type: 'input',

	// This plugin template injects a compiled CSS by @rollup/plugin-replace
	// See rollup.config.js for details
	css: '__css__',

	accept(exValue: unknown, params: Record<string, unknown>) {
		if (exValue != null && !Array.isArray(exValue)) {
			return null;
		}

		// Parse parameters object
		const p = ParamsParsers;
		const result = parseParams<PluginInputParams<unknown>>(params, {
			// `view` option may be useful to provide a custom control for primitive values
			view: p.required.constant('multiple-select'),
			options: p.required.custom<ListParamsOptions<unknown>>(parseListOptions),
		});
		if (!result) {
			return null;
		}

		// Return a typed value and params to accept the user input
		return {
			initialValue: exValue as unknown[],
			params: result,
		};
	},

	binding: {
		reader(_args) {
			return (exValue: unknown): unknown[] => {
				// Convert an external unknown value into the internal value
				return Array.isArray(exValue) ? exValue : [];
			};
		},

		writer(_args) {
			return (target: BindingTarget, inValue) => {
				// Use `target.write()` to write the primitive value to the target,
				// or `target.writeProperty()` to write a property of the target
				target.write(inValue);
			};
		},
	},

	controller(args) {
		// Create a controller for the plugin
		return new PluginController(args.document, {
			value: args.value,
			viewProps: args.viewProps,
			options: args.params.options,
		});
	},
};
