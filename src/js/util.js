function debounce(callback, limit = 100) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(this, args);
    }, limit);
  };
}

function throttle(callback, limit = 100) {
  let waiting = false;
  return function () {
    if (!waiting) {
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
}

// 최대 입력값 제한
function maxLengthLimit(obj) {
  if (obj.value.length > obj.maxLength) {
    obj.value = obj.value.slice(0, obj.maxLength);
  }
}

// 특수문자 입력 방지
function characterCheck(obj) {
  var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;
  if (regExp.test(obj.value)) {
    alert("특수문자는 입력하실수 없습니다.");
    obj.value = obj.value.substring(0, obj.value.length - 1);
  }
}
