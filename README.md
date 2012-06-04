# Flap #
Flap lets you create a skeuomorphic [Split-Flap](http://en.wikipedia.org/wiki/Split-flap_display) display using [RaphaëlJS](http://raphaeljs.com/). You can use it to create a "flip clock" time display, or maybe an old school visitor counter.

All you need is RaphaëlJS to get started, no other libraries required.

To make a simple flip clock you might do something lke this:

```js
var clock = new Flap('clock', { length: 5, library: 'time'});

  function updateTime() {
    var date = new Date(), 
        hours = date.getHours(), 
        minutes = date.getMinutes(), 
        time; 

    hours = hours < 10 ? "0" + hours : hours; 
    minutes = minutes < 10 ? "0" + minutes : minutes; 

    time = hours +":"+ minutes; clock.text(time); 
  }
  updateTime();
  setInterval(updateTime, 1000);
```

## Maintainers ##
- [Brian McMurray](https://github.com/bmcmurray), Phase2 Technology

