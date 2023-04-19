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
