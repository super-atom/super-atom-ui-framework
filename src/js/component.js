// * 팝업
var popupOption = {
  overlap: true,
  x: 1256,
  y: 120,
};

var popupDatas = [
  {
    order: 1,
    name: "테스트 팝업1",
    link: "#",
    image: "assets/images/popup-sample.png",
    width: 400,
    height: 440,
    show: true,
    startDate: "2023-05-10 13:00",
    endDate: "2023-06-20 13:00",
  },
  {
    order: 2,
    name: "테스트 팝업2",
    link: "#",
    image: "http://placehold.it/500x500.png",
    width: 500,
    height: 300,
    show: true,
    startDate: "2023-05-12 13:00",
    endDate: "2023-06-20 13:00",
  },
  {
    order: 3,
    name: "테스트 팝업3",
    link: "#",
    image: "http://placehold.it/700x700.png",
    width: 700,
    height: 700,
    show: false,
    startDate: "2023-05-15 13:00",
    endDate: "2023-06-20 13:00",
  },
  {
    order: 4,
    name: "테스트 팝업3",
    link: "#",
    image: "http://placehold.it/700x700.png",
    width: 700,
    height: 700,
    show: true,
    startDate: "2023-05-15 13:00",
    endDate: "2023-06-01 13:00",
  },
];

class Popup {
  constructor(data, option) {
    this.option = option;
    this.data = data;
    this.setPopupCookie(1, true);
    this.closePopup = this.closePopup.bind(this);
    this.closePopupExpires = this.closePopupExpires.bind(this);
    this.nowDate = this.nowDate.bind(this);
  }
  getPopupCookie(idx) {
    return Cookies.get(this.getPopupCookieName(idx));
  }
  getPopupCookieName(idx) {
    return "popup" + idx;
  }
  setPopupCookie(idx, boolean, expires) {
    Cookies.set(this.getPopupCookieName(idx), boolean, expires);
  }
  createPopup() {
    var nowDate = this.nowDate();
    var el = this.data[0];
    var data = this.data;
    var createDomOrNull = function (data) {
      if (data.length === 0) return null;
      var result = "";
      result += '<div class="popup-swiper"><div class="swiper-wrapper">';
      for (let i = 0; i < data.length; i++) {
        var el = data[i];
        var isDateCondition =
          el["startDate"] <= nowDate && el["endDate"] >= nowDate;
        if (el["show"] !== false && isDateCondition) {
          result += `<div class="swiper-slide"><img src="${el["image"]}" alt="팝업 이미지" class="img"></img></div>`;
        }
      }
      result += "</div><div class='swiper-pagination'></div></div>";
      return result;
    };

    if (createDomOrNull(data) === null) {
      console.log("팝업 데이터가 없습니다.");
    } else if (this.getPopupCookie("Show") === "true") {
      console.log("팝업을 오늘 하루 보지 않습니다.");
    } else {
      var layerArea = document.createElement("div");
      layerArea.classList.add("layer-popup-area");
      var layer = document.createElement("div");
      layer.classList.add("layer-popup");
      layer.innerHTML = createDomOrNull(data);
      layer.style.cssText = `z-index:10; position:absolute; top: ${popupOption.y}px; left: ${popupOption.x}px; width: 400px; height: 488px;`;

      var buttonWrap = document.createElement("div");
      buttonWrap.classList.add("layer-popup__btn-wrap");
      var layerCloseButton = document.createElement("button");
      layerCloseButton.classList.add("layer-popup__btn-close");
      layerCloseButton.innerHTML +=
        "<button class='layer-popup__btn-close'></button>";
      layerCloseButton.addEventListener("click", this.closePopup);

      var layerCloseButtonExpires = document.createElement("button");
      layerCloseButtonExpires.classList.add("layer-popup__btn-day-close");
      layerCloseButtonExpires.expires = 1;
      layerCloseButtonExpires.el = el;
      layerCloseButtonExpires.innerHTML = `<span>오늘 하루 보지 않기</span>`;
      layerCloseButtonExpires.addEventListener(
        "click",
        this.closePopupExpires,
        false
      );

      buttonWrap.append(layerCloseButtonExpires);
      buttonWrap.append(layerCloseButton);
      layer.append(buttonWrap);
      layerArea.append(layer);
      return layerArea;
    }
  }
  showPopup(){
    document.querySelector("body").append(this.createPopup());
      new Swiper(".popup-swiper", {
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 5000,
        },
        pagination: {
          el: ".swiper-pagination",
          type: "bullets",
          clickable: true,
        },
      });
  }
  closePopup(event) {
    var el = event.currentTarget.closest(".layer-popup-area");
    el.remove();
  }
  closePopupExpires(event) {
    this.closePopup(event);
    this.setPopupCookie("Show", true, { expires: 1 });
  }
  nowDate() {
    const popDt = new Date(),
      popYear = popDt.getFullYear(),
      popMonth = popDt.getMonth() + 1,
      popDate = popDt.getDate(),
      popHours = popDt.getHours(),
      popMinutes = popDt.getMinutes();
    return (
      popYear +
      "-" +
      (popMonth < 10 ? "0" + popMonth : popMonth) +
      "-" +
      (popDate < 10 ? "0" + popDate : popDate) +
      " " +
      popHours +
      ":" +
      popMinutes
    );
  }
}
$(function () {
  // 아코디언
  var accordion = (function () {
    var $accordion = $('.js-accordion');
    var $accordion_header = $accordion.find('.js-accordion-header');

    // default settings
    var settings = {
      // animation speed
      speed: 400,

      // close all other accordion items if true
      oneOpen: false,
    };

    return {
      // pass configurable object literal
      init: function ($settings) {
        $accordion_header.on('click', function () {
          accordion.toggle($(this));
        });

        $.extend(settings, $settings);

        // ensure only one accordion is active if oneOpen is true
        if (settings.oneOpen && $('.js-accordion-item.active').length > 1) {
          $('.js-accordion-item.active:not(:first)').removeClass('active');
        }

        // reveal the active accordion bodies
        $('.js-accordion-item.active').find('> .js-accordion-body').show();
      },
      toggle: function ($this) {
        if (
          settings.oneOpen &&
          $this[0] !=
            $this
              .closest('.js-accordion')
              .find('> .js-accordion-item.active > .js-accordion-header')[0]
        ) {
          $this
            .closest('.js-accordion')
            .find('> .js-accordion-item')
            .removeClass('active')
            .find('.js-accordion-body')
            .slideUp();
        }

        // show/hide the clicked accordion item
        $this.closest('.js-accordion-item').toggleClass('active');
        $this.next().stop().slideToggle(settings.speed);
      },
    };
  })();

  $(document).ready(function () {
    accordion.init({ speed: 300, oneOpen: true });
  });

    // 탭메뉴
    $(".tab:first-of-type, .tabpanel:first-of-type").addClass("active");
    $(".tab:first-of-type").attr("aria-selected", "true");
    $(".tab:first-of-type, .tabpanel:first-of-type")
      .addClass("active")
      .attr("tabindex", "0");

    $(".tab").on("keydown", function (event) {
      event = event || window.event;
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
      var keycode = event.keyCode || event.which;

      switch (keycode) {
        case 13: // Enter
          // 선택된 탭 활성화
          $(this)
            .addClass("active")
            .attr("aria-selected", "true")
            // 기존 탭 비활성화
            .siblings()
            .removeClass("active")
            .attr("aria-selected", "false");
          // 연관된 탭 패널 활성화
          $("#" + $(this).attr("aria-controls"))
            .attr("tabindex", "0")
            .addClass("active")
            // 기존 탭 패널 비활성화
            .siblings(".tabpanel")
            .attr("tabindex", "-1")
            .removeClass("active");
          break;

        case 32: // Space

        case 37: // left arrow
          if (this.previousElementSibling) {
            $(this).attr("tabindex", "-1").prev().attr("tabindex", "0").focus();
          } else {
            // 초점이 첫 번째 요소에 있었다면, 마지막 탭으로 초점 이동
            $(this).attr("tabindex", "-1");
            $(".tab:last-of-type").attr("tabindex", "0").focus();
          }
          break;
        case 39: // right arrow
          if (this.nextElementSibling) {
            $(this).attr("tabindex", "-1").next().attr("tabindex", "0").focus();
          } else {
            // 초점이 마지막 요소에 있었다면, 첫 번째 탭으로 초점 이동
            $(this).attr("tabindex", "-1");
            $(".tab:first-of-type").attr("tabindex", "0").focus();
          }
          break;
      }
    });

    $(".tablist").on("keydown", ".active", function (event) {
      event = event || window.event;
      var keycode = event.keyCode || event.which;

      // tab 키 눌렀을 때 (shift + tab은 제외)
      if (!event.shiftKey && keycode === 9) {
        event.preventDefault
          ? event.preventDefault()
          : (event.returnValue = false);
        $("#" + $(this).attr("aria-controls"))
          .attr("tabindex", "0")
          .addClass("active")
          .focus()
          .siblings(".tabpanel")
          .attr("tabindex", "-1")
          .removeClass("active");
      }
    });

    $(".tab").on("mousedown", function () {
      // 선택된 탭 활성화
      $(this)
        .addClass("active")
        .attr({
          tabindex: "0",
          "aria-selected": "true",
        })
        .focus()
        // 기존 탭 비활성화
        .siblings()
        .removeClass("active")
        .attr({
          tabindex: "-1",
          "aria-selected": "false",
        });
      // 연관된 탭 패널 활성화
      $("#" + $(this).attr("aria-controls"))
        .attr("tabindex", "0")
        .addClass("active")
        // 기존 탭 패널 비활성화
        .siblings(".tabpanel")
        .attr("tabindex", "-1")
        .removeClass("active");
    });
});
