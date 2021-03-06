## {nex.js}
> Unleashing the power of AMD for web applications.

[Nex.js](http://erikringsmuth.github.io/nex-js/) and the [RequireJS Router](https://github.com/erikringsmuth/requirejs-router) give you a powerful IoC pattern for routing and loading views. The router lazy loads views. Nex renders the view and injects the layout. The layout is now completely decoupled from the router. It's fully AMD compatible plus it's built on vanilla JS.

- Website [http://erikringsmuth.github.io/nex-js/](http://erikringsmuth.github.io/nex-js/)
- API [http://erikringsmuth.github.io/nex-js/#/api](http://erikringsmuth.github.io/nex-js/#/api)
- Tutorial [http://erikringsmuth.github.io/nex-js/#/example](http://erikringsmuth.github.io/nex-js/#/example)

## Why Nex
First, [why AMD](http://requirejs.org/docs/whyamd.html). AMD is the future of Javascript dependency injection. Modules clearly define their dependencies. [require.js](http://requirejs.org/) is the only script tag you include. The rest of your scripts are loaded using AMD. No more globals!

The router comes next. Other frameworks load all of your app's Javascript up front. You can optimize your site by compiling it down to one file but that doesn't scale. The [RequireJS Router](https://github.com/erikringsmuth/requirejs-router) lazy loads modules as you navigate to each page. You're site could contain 10MB of Javascript and HTML templates and it would only load the 10KB for the current page.

Last, [nex-js](http://erikringsmuth.github.io/nex-js/) views. Other frameworks render the layout (header, footer, etc.) then use the router to load the content. With nex-js the router loads your view and your view injects the layout. You attach `view.outerEl` to the document with everything rendered.

The combination of AMD, a lazy loading router, and layout views gives you an awesome toolset to build your application. This is the next step in web application design.

## Build [![Build Status](https://travis-ci.org/erikringsmuth/nex-js.png?branch=master)](https://travis-ci.org/erikringsmuth/nex-js)
- In node.js
- Run `npm install` to install dependencies
- Run `gulp` to lint and minify your code. This will also watch for changes.

## Running Tests
Open `/tests/AmdSpecRunner.html` and make sure all tests pass. The tests are written using Jasmine.
