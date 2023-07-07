import {
	constrainRange,
	Controller,
	ListConstraint,
	ListParamsOptions,
	normalizeListOptions,
	PointerHandler,
	PointerHandlerEvent,
	Value,
	ViewProps,
} from '@tweakpane/core';

import {PluginView} from './view';

interface Config<T> {
	value: Value<T[]>;
	options: ListParamsOptions<T>;
	viewProps: ViewProps;
}

// Custom controller class should implement `Controller` interface
export class PluginController<T> implements Controller<PluginView<T>> {
	public readonly value: Value<T[]>;
	public readonly view: PluginView<T>;
	public readonly viewProps: ViewProps;
	public readonly lc: ListConstraint<T>;

	constructor(doc: Document, config: Config<T>) {
		this.onPoint_ = this.onPoint_.bind(this);

		// Receive the bound value from the plugin
		this.value = config.value;

		const lc = new ListConstraint(normalizeListOptions<T>(config.options));

		this.lc = lc;

		// and also view props
		this.viewProps = config.viewProps;
		this.viewProps.handleDispose(() => {
			// Called when the controller is disposing
			console.log('TODO: dispose controller');
		});

		// Create a custom view
		this.view = new PluginView(doc, {
			value: this.value,
			viewProps: this.viewProps,
			lc: this.lc,
		});

		// You can use `PointerHandler` to handle pointer events in the same way as Tweakpane do
		const ptHandler = new PointerHandler(this.view.element);
		ptHandler.emitter.on('down', this.onPoint_);
		ptHandler.emitter.on('move', this.onPoint_);
		ptHandler.emitter.on('up', this.onPoint_);
	}

	private onPoint_(ev: PointerHandlerEvent) {
		// const data = ev.data;
		// if (!data.point) {
		// 	return;
		// }
		// // Update the value by user input
		// const dx =
		// 	constrainRange(data.point.x / data.bounds.width + 0.05, 0, 1) * 10;
		// const dy = data.point.y / 10;
		// this.value.rawValue = Math.floor(dy) * 10 + dx;
	}
}
