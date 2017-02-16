# About
This module is a test case for rxaviers/react-globalize-webpack-plugin. It shows how string changes can sometimes cause a webpack asset hash to not be updated.

# Installation
`npm install`

# Running
```
$ npm test

i18n asset hash for strings in module-a and module-b are the same, even though they have different strings
  module-a hash: c039fd9bc5bdf08aa2ae
  module-b hash: c039fd9bc5bdf08aa2ae


i18n asset hash for strings in module-b and module-c are different, even though they have the same strings
  module-b hash: c039fd9bc5bdf08aa2ae
  module-c hash: 20c9836ac888070d187d

```

# Interpretation
**why do module-a and module-b have the same i18n hash?**

react-globalize-webpack-plugin depends on globalize-webpack-plugin to trigger an event. This event is only triggered for modules that g-w-p thinks are interesting, which are ones that import globalize.

Because neither module-a nor module-b import globalize, their strings are not used in the i18n chunk hash, causing them to hash to the same value.

The expectation here is that the i18n chunks for module-a and module-b would have different hashes because they define different strings.


**why do module-b and module-c have different i18n hashes?**

module-c imports globalize, though it does not use it. This is sufficient for getting the strings in module-c to be incorporated into the webpack chunk hash.

The expectation here is that the i18n chunk hashes for module-b and module-c would be the same because they define the same strings.