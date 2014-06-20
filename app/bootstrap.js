const PRODUCTION = false;

window.assert = chai.assert;

if (PRODUCTION) {
  System.paths['app'] = 'dist/all.min.js';
  System.bundles['app'] = ['app/main'];
}
else {
  System.paths['app/*'] = 'dist/*.js';
}

System.import('app/main')
  .catch(console.error.bind(console));
