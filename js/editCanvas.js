var editCanvas = document.querySelector("#edit-canvas");
editCanvas.height = 400;
editCanvas.width = 600;

var ctx = editCanvas.getContext('2d');

// Title and Title Background
var titleComponent = {
  properties: {
    text: function() {
      return document.querySelector("#title").value;
    },
    bgColor: function() {
      return defaults.titleColor;
    }
  },
  draw: function() {
    this._bg();
    this._text();
  },
  _bg: function() {
    ctx.fillStyle = this.properties.bgColor();
    ctx.fillRect(0, 300, 500, 120);
  },
  _text: function() {
    editCanvas.letterSpacing = 2;
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.font = '30px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
      var words = text.split(' ');
      var line = '';

      for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, x, y);
    }
    wrapText(ctx, this.properties.text(), 255, 326, 450, 35);
  }
}

// Category and Category Background
var categoryComponent = {
  properties: {
    text: function() {
      return document.querySelector('#category').value;
    },
    bgColor: function() {
      return defaults.sidebarColor;
    }
  },
  draw: function() {
    this._bg();
    this._text();
  },
  _bg: function() {
    ctx.fillStyle = this.properties.bgColor();
    ctx.fillRect(500, 0, 150, 400);
  },
  _text: function() {
    ctx.save();
    ctx.translate(524, 200);
    ctx.rotate(-0.5 * Math.PI);
    editCanvas.style.letterSpacing = 4;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '48px sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(this.properties.text(), 0, 0);
    ctx.restore();
  }
}

// Background Image
var backgroundComponent = {
  properties: {
    domId: "#background",
  },
  draw: function() {
    this._addImage();
  },
  _addImage: function() {
    var file = defaults.background;

    var background = new Image();
    // background.crossOrigin = "Anonymous";

    background.onload = function() {
      sourceHeight = background.height;
      sourceWidth = background.width;
      ctx.globalCompositeOperation = 'destination-over';
      ctx.drawImage(background, 0, 0, sourceWidth, sourceHeight,
        0, 0, 600, 400);
      ctx.globalCompositeOperation = 'source-over';
    }

    background.src = file;
  }
}


// main function to draw / redraw canvas
function draw() {
  //Draw Title Component
  ctx.clearRect(0, 0, editCanvas.width, editCanvas.height);
  titleComponent.draw();
  categoryComponent.draw();
  backgroundComponent.draw();

  //Store to local storage.. next
}

document.addEventListener('DOMContentLoaded', function() {

  // Update Events
  document.querySelector('#title').addEventListener('keyup', draw);
  document.querySelector('#category').addEventListener('change', draw);

  // Any Query Params?
  if (getUrlParameter('title')) {
    $("#title").val(getUrlParameter('title'))
  }
  if (getUrlParameter('category')) {
    $("#category option").each(function(i, opt) {
      if ($(opt).val().toLowerCase() == getUrlParameter('category').toLowerCase()) {
        $(opt).attr('selected', true)
      }
    })
  }
  if (getUrlParameter('background')) {
    $("#background-url").val(getUrlParameter('background'));
  }


  // Select Dropdowns to Material Styles
  var elems = document.querySelectorAll('select');
  instances = M.FormSelect.init(elems);

  draw();

  document.querySelector('#download-image').addEventListener('click', function() {
    //to png
    var img = document.createElement('img');
    img.src = editCanvas.toDataURL();
    var a = document.createElement('a');
    a.href = img.src;
    a.download = 'thumbnail.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
});

// Helper function to get URL Query Params
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
