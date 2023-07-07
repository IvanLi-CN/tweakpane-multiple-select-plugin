import {
	ClassName,
	ListConstraint,
	Value,
	View,
	ViewProps,
} from '@tweakpane/core';

interface Config<T> {
	value: Value<T[]>;
	viewProps: ViewProps;
	lc: ListConstraint<T>;
}

// Create a class name generator from the view name
// ClassName('tmp') will generate a CSS class name like `tp-tmpv`
const className = ClassName('multiple-select');

// Custom view class should implement `View` interface
export class PluginView<T> implements View {
	public readonly element: HTMLElement;
	private value_: Value<T[]>;
	private optionEls: HTMLElement[] = [];
	private containerEl: HTMLElement;
	private emptyEl: HTMLElement | null = null;
	public readonly lc: ListConstraint<T>;

	constructor(doc: Document, config: Config<T>) {
		// Create a root element for the plugin
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		// Bind view props to the element
		config.viewProps.bindClassModifiers(this.element);

		// Receive the bound value from the controller
		this.value_ = config.value;
		// Handle 'change' event of the value
		this.value_.emitter.on('change', this.onValueChange_.bind(this));

		this.lc = config.lc;

		// Create child elements
		this.containerEl = doc.createElement('div');
		this.containerEl.classList.add(className('container'));
		this.element.appendChild(this.containerEl);

		// Apply the initial value
		this.refresh_();

		config.viewProps.handleDispose(() => {
			// Called when the view is disposing
			console.log('TODO: dispose view');
		});
	}

	private refresh_(): void {
		const rawValue = this.value_.rawValue;

		while (this.optionEls.length > 0) {
			const elem = this.optionEls.shift();
			if (elem) {
				this.containerEl.removeChild(elem);
			}
		}

		const doc = this.element.ownerDocument;

		if (this.lc.values.get('options').length === 0 && !this.emptyEl) {
			this.emptyEl = doc.createElement('div');
			this.emptyEl.classList.add(className('empty'));
			this.emptyEl.textContent = '(empty)';

			this.containerEl.appendChild(this.emptyEl);
		} else if (this.emptyEl) {
			this.containerEl.removeChild(this.emptyEl);
			this.emptyEl = null;
		}

		this.lc.values.get('options').forEach((item) => {
			const optionEl = doc.createElement('label');
			optionEl.classList.add(className('option'));

			const inputEl = doc.createElement('input');
			inputEl.classList.add(className('input'));
			inputEl.type = 'checkbox';
			inputEl.checked = rawValue.includes(item.value);
			inputEl.addEventListener('input', () => {
				let current = this.value_.rawValue;
				if (inputEl.checked) {
					current = [...current, item.value];
				} else {
					current = current.filter((v) => v !== item.value);
				}
				this.value_.setRawValue(current);
			});
			optionEl.appendChild(inputEl);

			const textEl = doc.createElement('span');
			textEl.classList.add(className('text'));
			textEl.textContent = item.text;
			optionEl.appendChild(textEl);

			this.optionEls.push(optionEl);
			this.containerEl.appendChild(optionEl);
		});
	}

	private onValueChange_() {
		this.refresh_();
	}
}
