var myObject = {
    value: 1,
    show: function() {
      console.log( "1   " + this.value); // 注１

      function show() {
        console.log("2   " + this.value); // 注２
      }
      show();
    }
  };
  myObject.show();