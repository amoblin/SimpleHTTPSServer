function iOSversion() {
  if (/iP(hone|od|ad)/.test(navigator.platform)) {
    // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
  }
}

ver = iOSversion();
if (ver[0] < 7 || ver[1] < 1) {
    document.getElementById("https").style.display = "none";
    document.getElementById("http").style.display = "block";
}

