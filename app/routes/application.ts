import Route from '@ember/routing/route';
import { service } from '@ember/service';

import en from '../../translations/en-us.json';

import type IntlService from 'ember-intl/services/intl';

// English only for now; another language is another file in translations/
export default class ApplicationRoute extends Route {
  @service declare intl: IntlService;

  beforeModel() {
    this.intl.addTranslations('en-us', en);
    this.intl.setLocale('en-us');
  }
}
