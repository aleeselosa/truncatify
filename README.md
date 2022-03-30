# What is this?

This library can be used to truncate long descriptions and cut it to the nearest word ending. It also considers the included tags inside the container.

# Installation

`npm i truncatify --save`

Then...

```
import Truncatify from 'truncatify';

let truncator = new Truncatify({classes: ['.truncate'], limit: 200, truncationChars: '---' });
truncator.truncate();
```

Truncatify has 3 options, those are optional:
* *classes* - _arrays of classes_ | (Defaults to `['.truncate']`)
* *limit* - _number_ | (Defaults to `200`)
* *truncationChars* - _string_ | (Defaults to `...`)