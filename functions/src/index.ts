import {conversation} from '@assistant/conversation';
import {createClient, Typeform} from '@typeform/api-client';
import * as functions from 'firebase-functions';

import {Slide} from './slide';

const typeform = createClient({token: functions.config().typeform?.token});
const typeformForm = typeform.forms.get({
  uid: functions.config().typeform?.form,
});

let resolvedForm: Promise<Typeform.Form> | null;
typeformForm.then(f => (resolvedForm = Promise.resolve(f)));
const form = (): Promise<Typeform.Form> =>
  resolvedForm ? resolvedForm : typeformForm;

const app = conversation({debug: false});

app.handle('welcome', async conv => {
  const p = await form();
  const slide = new Slide(conv, p);
  conv.add(`Welcome to ${p.title}.\n${p?.welcome_screens?.[0].title}\n`);
  slide.run();
});

app.handle('fallback', async conv => {
  const p = await form();
  const slide = new Slide(conv, p);
  slide.run();
});

export const aog = functions.https.onRequest(app);
