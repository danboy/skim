//https://gist.github.com/jmgunn87/9882152
//
const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer massa libero, efficitur vel mollis in, egestas ut augue. Quisque dignissim leo ac orci imperdiet, vitae mollis mauris ultrices. In dignissim rhoncus orci, at venenatis diam efficitur at. Fusce condimentum urna tellus, sed vulputate nisi posuere non. Vivamus sollicitudin mollis lectus nec dictum. Ut dictum ante felis, sit amet sagittis erat imperdiet id. Etiam ac suscipit est. Etiam viverra pulvinar congue. Integer nec porttitor sapien. Vivamus tincidunt enim ut leo dapibus, eu tempor justo convallis. Pellentesque rutrum nunc nisi, at venenatis nunc sagittis vitae. Sed ac ullamcorper ante. Nam pulvinar tempus consequat. Pellentesque eleifend sem metus, eu accumsan nulla suscipit ac.

Proin volutpat nulla a ex maximus, id semper tortor mollis. Duis est magna, egestas ac elit quis, ornare fringilla sem. Donec quis dolor mi. Cras eget pretium nunc. Praesent eros dui, tempus vel dictum et, elementum consectetur orci. Etiam placerat eget velit non sodales. Vivamus id consequat magna, in mattis mi. Duis molestie quam sed ante eleifend, a vulputate magna bibendum.

Fusce sed tortor eu odio elementum rutrum at sit amet nisl. Donec fringilla bibendum mollis. Integer at ante risus. Fusce commodo arcu turpis, a auctor diam venenatis nec. Nam eget convallis enim, at commodo lorem. Praesent ultrices ligula eu accumsan dapibus. Donec finibus elit sit amet quam facilisis, eget hendrerit sem accumsan. Fusce hendrerit eget nisi quis ullamcorper. Nullam a aliquam metus. Sed scelerisque, augue sit amet varius dapibus, arcu nisl pellentesque erat, at porttitor massa risus id dolor. Aenean tempus ligula eu massa bibendum pharetra. Vestibulum mi velit, scelerisque ut ante eget, sagittis auctor leo.`


class Skim {

  constructor(text, stage, options) {
    this.text = text;
    this.stage = document.getElementById(stage);
    this.options = {
      speed: 300,
      ...options
    }
  }

  ORP(word) {
    var length = word.length;
    while('\n,.?!:;"'.indexOf(word[--length]) !== -1);
    switch(++length) {
      case 0: case 1: return 0;
      case 2: case 3: return 1;
      default: return Math.floor(length / 2) - 1;
    }
  }

  createWord(word) {
    var regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    var split = this.ORP(word);
    var length = word.length;
    let lpad;
    let rpad;

    if (length == 2) {
      rpad = this.pad("\u00A0", 1);
    } else if (length == 1 || length == 3) {
      rpad = this.pad("\u00A0", 0);
    } else if (length % 2) {
      lpad = this.pad("\u00A0", Math.floor(length / 2) - split + 1);
    } else {
      lpad = this.pad("\u00A0", Math.floor(length / 2) - split);
    }

    let result = document.createElement("div");
    result.style["text-align"] = "center";
    result.appendChild(document.createTextNode(lpad));

    let left = document.createElement("span");
    left.appendChild(document.createTextNode(lpad+word.substr(0, split)));
    result.appendChild(left);

    let highlight = document.createElement("span");
    highlight.style["color"] = "red";
    highlight.appendChild(document.createTextNode(word.substr(split,1)));
    result.appendChild(highlight);

    let right = document.createElement("span");
    right.appendChild(document.createTextNode(word.substr(split+1)+rpad));
    result.appendChild(right);
    return result;
  }

  pad(string, count) {
    var result = '';
    while (count--) result += string;
    return result;
  }

  * iterateOverArray (arr) {
    var i = 0;
    while (i < arr.length) {
      yield arr[i++];
    }
  }

  async read(words) {
    var generator = await this.iterateOverArray(words);

    var interval = setInterval(() => {
      var nxt = generator.next();
      if (!nxt || nxt.done) {
        clearTimeout(interval);
      }
      else {
        this.stage.innerHTML = "";
        this.stage.appendChild(this.createWord(nxt.value));
      }
    }, this.options.speed);

  }

  start() {
    const words = this.text.split(` `);
    this.read(words);
  }
}

new Skim(lorem, "root").start();
