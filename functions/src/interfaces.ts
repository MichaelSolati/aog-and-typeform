export interface IDataOption { 
  label: string;
  value: string;
}

export interface IData { 
  ref: string; 
  options: IDataOption[]; 
}

export interface ITypeformFieldsProperties {
  description: string;
  choices: {
    ref: string;
    label: string;
    attachment: {
      type: string;
      href: string;
    }
  }[];
  fields: any[][];
  allow_multiple_selection: boolean;
  randomize: boolean;
  allow_other_choice: boolean;
  vertical_alignment: boolean;
  supersized: boolean;
  show_labels: boolean;
  alphabetical_order: boolean;
  hide_marks: boolean;
  button_text: string;
  steps: number;
  shape: 'cat' | 'circle' | 'cloud' | 'crown' | 'dog' | 'droplet' | 'flag' | 'heart' | 'lightbulb' | 'pencil' | 'skull' | 'star' | 'thunderbolt' | 'tick' | 'trophy' | 'up' | 'user';
  labels: {
    left: string;
    right: string;
    center: string;
  },
  start_at_one: boolean;
  structure: 'MMDDYYYY' | 'DDMMYYYY' | 'YYYYMMDD';
  separator: '/' | '-' | '.';
  currency: 'AUD' | 'BRL' | 'CAD' | 'CHF' | 'DKK' | 'EUR' | 'GBP' | 'MXN' | 'NOK' | 'SEK' | 'USD';
}

export interface ITypeformFieldsValidations {
  required: boolean;
  max_length: number;
  min_value: number;
  max_value: number;
}

export interface ITypeformAttachment {
  type: 'image' | 'video';
  href: string;
  scale: 0.4 | 0.6 | 0.8 | 1;
}

export interface ITypeformField {
  id: string;
  ref?: string;
  title: string;
  type: 'date' | 'dropdown' | 'email' | 'file_upload' | 'group' | 'legal' | 'long_text' | 'multiple_choice' | 'number' | 'opinion_scale' | 'payment' | 'picture_choice' | 'rating' | 'short_text' | 'statement' | 'website' | 'yes_no';
  properties: ITypeformFieldsProperties;
  validations: ITypeformFieldsValidations;
  attachment: ITypeformAttachment;
}

export interface ITypeformWelcomeScreen {
  ref?: string;
  title: string;
  properties?: {
    description?: string;
    show_button?: boolean;
    button_text?: string;
  }
  attachment?: ITypeformAttachment;
}

export interface ITypeformThankYouScreen {
  ref?: string;
  title: string;
  properties?: {
    show_button?: boolean;
    button_text?: string;
    button_mode?: 'reload' | 'redirect';
    redirect_url?: string;
    share_icons?: boolean;
  }
  attachment?: ITypeformAttachment;
}

export interface ITypeformLogic {
  type: 'field' | 'hidden';
  ref?: string;
  actions?: {
    action: 'jump' | 'add' | 'subtract' | 'multiply' | 'divide';
    details: {
      to?: {
        type: 'field' | 'hidden' | 'thankyou';
        value: string;
      }
      target?: {
        type: 'variable';
        value: 'score' | 'price';
      }
      value?: {
        type: 'constant';
        value: number;
      }
    }
    condition: {
      op: 'begins_with' | 'ends_with' | 'contains' | 'not_contains' | 'lower_than' | 'lower_equal_than' | 'greater_than' | 'greater_equal_than' | 'is' | 'is_not' | 'equal' | 'not_equal' | 'always' | 'on' | 'not_on' | 'earlier_than' | 'earlier_than_or_on' | 'later_than' | 'later_than_or_on';
      vars: {
        type: 'field' | 'hidden' | 'variable' | 'constant' | 'end';
        value: any;
      }[];
    }
  }[];
}

export interface ITypeformForm {
  id?: string;
  title?: string;
  language?: string;
  fields?: ITypeformField[];
  hidden?: string[];
  welcome_screens?: ITypeformWelcomeScreen[];
  thankyou_screens?: ITypeformThankYouScreen[];
  logic?: ITypeformLogic[];
  theme?: {
    href?: string;
  }
  workspace?: {
    href?: string;
  }
  _links?: {
    display?: string;
  }
  settings?: {
    language?: 'en' | 'es' | 'ca' | 'fr' | 'de' | 'ru' | 'it' | 'da' | 'pt' | 'ch' | 'zh' | 'nl' | 'no' | 'uk' | 'ja' | 'ko' | 'hr' | 'fi' | 'sv' | 'pl' | 'el' | 'hu' | 'tr' | 'cs' | 'et' | 'di';
    is_public?: boolean;
    progress_bar?: 'percentage' | 'proportion';
    show_progress_bar?: boolean;
    show_typeform_branding?: boolean;
    meta?: {
      allow_indexing?: boolean;
      description?: string;
      image?: {
        href?: string;
      }
    }
    redirect_after_submit_url?: string;
    google_analytics?: string;
    facebook_pixel?: string;
    google_tag_manager?: string;
    notifications?: {
      self?: {
        enabled?: boolean;
        recipients: string[];
        reply_to?: string;
        subject: string;
        message: string;
      }
      respondent?: {
        enabled?: boolean;
        recipient: string;
        reply_to?: string[];
        subject: string;
        message: string;
      }
    }
  }
}