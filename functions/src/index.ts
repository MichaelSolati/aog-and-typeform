import { createClient } from '@typeform/api-client'
import { dialogflow } from 'actions-on-google';
import * as functions from 'firebase-functions';

import { ITypeformForm } from './interfaces';
import { Slide } from './slide';

const typeform = createClient({ token: functions.config().typeform.token });
const typeformForm = typeform.forms.get({ uid: functions.config().typeform.form });

let resolvedForm;
typeformForm.then(f => resolvedForm = new Promise(r => r(f)));
const form = (): Promise<ITypeformForm> => resolvedForm ? resolvedForm : typeformForm;

const app = dialogflow({ debug: false });

app.intent('Default Welcome Intent', (conv) => {
  return form().then((p) => {
    const slide = new Slide(conv, p);
    conv.add(`Welcome to ${p.title}.\n${p.welcome_screens[0].title}\n`);
    slide.run();
  });
});

app.intent('Default Fallback Intent', (conv) => {
  return form().then((p) => {
    const slide = new Slide(conv, p);
    slide.run();
  });
});

export const aog = functions.https.onRequest(app);