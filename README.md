# Toastify
Toast messages for angularjs-based apps

##### See demo and basic usage example at http://kyashan.github.io/toastify/


### Toastify parameters, to specify inside toastify.create() method

```javascript
  {
    toastCustomClass: null,   // Css class 
    appendTo: 'body',         // Id of html tag where to append toasts
    closeByClick: false,      // Close toast by clicking on it
    showClose: true,          // Show closing 'X' on top-right
    autoclose: true,          // Set if toast must automatically close after timeout
    timeout: 4000,            // Autoclose timeout
    message : '',             // Toast message
    callback: null,           // Callback when toast is closed
    onclick: null,            // Methods to call when click on entire toast is performed
    template: null,           // Html template to pass into the toast
    controller: null,         // Angular controller to pass into the toast
    gravity: 'top',           // Where to display toast on screen. Possible values are 'top' or 'bottom'
    doneMessage: '',          // Message to display into the toast on done method 
    doneClass: 'done',        // Css class to apply on done method
    doneAutoclose: true,      // Specity wheather or not toast must autoclose after done method
  }
```


## Dependencies

- [angularjs](https://angularjs.org/)
- [jquery](https://jquery.com/)



## License

MIT

