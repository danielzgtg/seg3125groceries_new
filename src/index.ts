// JavaScript entrypoint for entire application
// TS as a documentation and commenting layer on top of JS

import './index.scss';
import Application from './application/application';
import install from './sw/init';

install();
new Application(document.body);
