import { DialogflowConversation, Contexts, Suggestions } from 'actions-on-google';
import * as Fuse from 'fuse.js';

import { IData, IDataOption, ITypeformForm, ITypeformField, ITypeformThankYouScreen } from './interfaces';

export class Slide {
  private _option: string;
  private _prefix= '';
  private _slide: ITypeformField | ITypeformThankYouScreen;

  constructor(private _conv: DialogflowConversation<{}, {}, Contexts>, private _tf: ITypeformForm) {
    const data: IData = _conv.data as IData;
    let option: IDataOption;
    const response: string = String(this._conv.arguments.parsed.input.text);
    let slide: ITypeformField | ITypeformThankYouScreen;

    if (response && Array.isArray(data.options) && data.options.length) {
      option = this._response(response, data.options);
      if (!option) {
        this._option = 'error';
      } else {
        slide = _tf.fields.find((value) => value.ref === option.value);
        this._prefix = `You slected: ${option.label}\n`;
        if (slide) {
          this._option = 'next';
          this._slide = slide;
        } else {
          this._option = 'end';
          this._slide = _tf.thankyou_screens.find((value) => value.ref === option.value) || _tf.thankyou_screens[0]
        }
      }
    } else {
      this._option = 'next';
      this._slide = _tf.fields[0];
    }
  }

  public run(): void {
    if (this._option === 'end') {
      this._runEnd();
    } else if (this._option === 'error') {
      this._runError();
    } else {
      this._runNext();
    }
  }

  private _choices(choices: any[] = (this._slide as ITypeformField).properties.choices): string {
    const choicesStrings = choices.map(element => element.label);
    const last = choicesStrings.pop();
    return choicesStrings.length ? (choicesStrings.join(', ') + ' or ' + last + '?') : last;
  }

  private _data(): IData {
    const choices = (this._slide as ITypeformField).properties.choices.map((c) => { return { label: c.label, ref: c.ref }; });
    const actions = this._tf.logic.find((v) => v.ref === this._slide.ref).actions;
    const options = [];

    choices.forEach((c) => {
      const action = actions.find(a => ((a.condition.vars.length === 2) && (a.condition.vars[1].value === c.ref)));
      const backup = actions.find(a => a.condition.op === 'always');
      options.push({ label: c.label, value: (action ? action : backup).details.to.value });
    });

    return { ref: this._slide.ref, options };
  }

  private _response(response: string, options: IDataOption[]): IDataOption {
    const searcher = new Fuse(options, { keys: ['label'], threshold: 0.7 });
    const result = searcher.search(response);
    return (result.length) ? result[0] : null;
  }

  private _runEnd(): void {
    this._conv.close(`${this._prefix}${this._slide.title}\nGoodbye...`);
  }

  private _runError(): void {
    const data: IData = this._conv.data as IData;
    this._conv.add(`I'm sorry, I didn't understand. Would you like to: ${this._choices(data.options)}`);
    this._conv.add(new Suggestions(data.options.map(element => element.label)));
  }

  private _runNext(): void {
    this._conv.data = this._data();
    const choices = (this._slide as ITypeformField).properties.choices;
    this._conv.add(`${this._prefix}${this._slide.title}... What would you like to do? ${this._choices()}`);
    this._conv.add(new Suggestions(choices.map(element => element.label)));
    this._conv.data = this._data();
  }
}