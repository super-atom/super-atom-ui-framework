$(function () {
  console.log('common.js');

  // * 메뉴
  const $headerNavAnchor = $('.header__nav a');
  const $headerMenu = $('.header__menu__list-wrap');
  $headerNavAnchor.on('focus', () => {
    $headerMenu.addClass('focus');
  });
  $headerNavAnchor.on('focusout', () => {
    $headerMenu.removeClass('focus');
  });
});
