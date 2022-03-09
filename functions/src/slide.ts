import {ConversationV3, Suggestion} from '@assistant/conversation';
import {Typeform} from '@typeform/api-client';
import Fuse from 'fuse.js';

import {SessionParams, DataOption} from './interfaces';

export class Slide {
  private _option: string;
  private _slide: Typeform.Field | Typeform.ThankYouScreen | undefined;

  constructor(private _conv: ConversationV3, private _tf: Typeform.Form) {
    const session: SessionParams = _conv.session.params as SessionParams;
    let option: DataOption | null;
    const response = this._conv.intent.query || '';
    let slide: Typeform.Field | Typeform.ThankYouScreen | undefined;

    if (response && Array.isArray(session.options) && session.options.length) {
      option = this._response(response, session.options);
      if (!option) {
        this._option = 'error';
      } else {
        slide = _tf.fields?.find(value => value.ref === option?.value);
        if (slide) {
          this._option = 'next';
          this._slide = slide;
        } else {
          this._option = 'end';
          this._slide =
            _tf.thankyou_screens?.find(value => value.ref === option?.value) ||
            _tf.thankyou_screens?.[0];
        }
      }
    } else {
      this._option = 'next';
      this._slide = _tf.fields?.[0];
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

  private _choices(
    choices: Typeform.Choice[] | undefined = (this._slide as Typeform.Field)
      .properties?.choices
  ): string {
    choices = choices ? choices : [];
    const choicesStrings = choices.map(element => element.label);
    const last = choicesStrings.pop() || '';
    return choicesStrings.length
      ? choicesStrings.join(', ') + ' or ' + last + '?'
      : last;
  }

  private _session(): SessionParams {
    let choices = (this._slide as Typeform.Field).properties?.choices;
    choices = (choices || []).map(c => {
      return {label: c.label, ref: c.ref};
    });
    const actions = this._tf.logic?.find(
      v => v.ref === this._slide?.ref
    )?.actions;
    const options: DataOption[] = [];

    choices.forEach(c => {
      const action = actions?.find(
        a =>
          a.condition?.vars?.length === 2 && a.condition.vars[1].value === c.ref
      );
      const backup = actions?.find(a => a.condition?.op === 'always');
      options.push({
        label: c.label,
        value: (action ? action : backup)?.details?.to?.value,
      });
    });

    return {ref: this._slide?.ref, options};
  }

  private _response(
    response: string,
    options: DataOption[]
  ): DataOption | null {
    const searcher = new Fuse(options, {keys: ['label'], threshold: 0.7});
    const result = searcher.search(response);
    return result.length ? result[0].item : null;
  }

  private _runEnd(): void {
    this._conv.add(`${this._slide?.title}\nGoodbye...`);
    this._conv.scene.next = {name: 'Goodbye'};
  }

  private _runError(): void {
    const session: SessionParams = this._conv.session.params as SessionParams;
    this._conv.add(
      `I'm sorry, I didn't understand. Would you like to: ${this._choices(
        session.options
      )}`
    );

    for (const element of session.options) {
      this._conv.add(new Suggestion({title: element.label || ''}));
    }
  }

  private _runNext(): void {
    this._conv.session.params = this._session();
    const choices = (this._slide as Typeform.Field).properties?.choices || [];
    this._conv.add(
      `${this._slide?.title}... What would you like to do? ${this._choices()}`
    );

    for (const element of choices) {
      this._conv.add(new Suggestion({title: element.label || ''}));
    }

    this._conv.session.params = this._session();
  }
}
