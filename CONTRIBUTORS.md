# Contributors

* [Fernando Montoya](https://github.com/montogeek) - Use separate lodash functions instead of the core package. Faster to install this way.
* [Jonathan Felchlin](https://github.com/GreenGremlin) - Smart merging for loaders.
* [David Gómez](https://github.com/davegomez) - Performance and cosmetic improvements.
* [siready](https://github.com/siready) - Extend `merge.smart` to support `include/exclude`.
* [C.J. Winslow](https://github.com/Whoaa512) - Make `merge.smart` `include/exclude` to work correctly with `loader`.
* [Artem Zakharchenko](https://github.com/blackrabbit99) - Fix `merge.smart` duplication so that if `include` exists, it will merge.
* [Matt Shwery](https://github.com/mshwery) - If `exclude` is the same while using `merge.smart`, merge `loaders`.
* [Lucretiel](https://github.com/Lucretiel) - Added a more generic test to describe merge behavior better.
* [Christian Hoffmeister](https://github.com/choffmeister) - Fix `merge.smart` behavior so that it checks against full loader names instead of just the first letter.
* [Ken Powers](https://github.com/knpwrs) - Changed Travis icon to use SVG (scales better).
* [Kyle Herock](https://github.com/rockmacaca) - Improved webpack 2 support, avoided concatenating loaders if the first matching entry's include/exclude doesn't match. #41
