$(function () {
  // * i18n
  var rerender = () => {
    // start localizing, details:
    // https://github.com/i18next/jquery-i18next#usage-of-selector-function
    $('body').localize();
  };

  const lngs = {
    ko: { nativeName: '한글' },
    en: { nativeName: 'English' },
  };

  let lngDataKo = [];
  let lngDataEn = [];

  $.ajax({
    type: "GET",
    url: '/assets/i18n/hwadam_translate2.csv',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    headers: {
      Accept : "text/csv; charset=utf-8",
      "Content-Type": "text/csv; charset=utf-8"
    },
    success: function (data) {
      var lngData = $.csv.toObjects(data);
      for (let i = 0; i < Object.keys(lngs).length; i++) {
        lngData.forEach((el) => {
          var lng = Object.keys(lngs)[i];
          let temp = null;
          lng === 'ko'
            ? (temp = _.omit(el, ['code', 'en']))
            : (temp = _.omit(el, ['code', 'ko']));
          if (lng !== 'data') {
            Object.defineProperty(
              temp,
              'data',
              Object.getOwnPropertyDescriptor(temp, lng)
            );
            delete temp[lng];
          }
          lng === 'ko' ? lngDataKo.push(temp) : lngDataEn.push(temp);
        });
      }

      // use plugins and options as needed, for options, detail see
      // http://i18next.com/docs/
      i18next.init(
        {
          fallbackLng: 'ko',
          // evtl. use language-detector https://github.com/i18next/i18next-browser-languageDetector
          debug: true,
          resources: {
            // evtl. load via xhr https://github.com/i18next/i18next-xhr-backend
            ko: {
              translation: lngDataKo,
            },
            en: {
              translation: lngDataEn,
            },
          },
        },
        function (err, t) {
          if (err) {
            console.error(err);
          } else {
            // for options see
            // https://github.com/i18next/jquery-i18next#initialize-the-plugin
            jqueryI18next.init(i18next, $, { useOptionsAttr: true });

            // fill language switcher
            let isCookie = Cookies.get('language');
            Object.keys(lngs).map((lng) => {
              const opt = new Option(lngs[lng].nativeName, lng);
              if(isCookie) {
                if (lng === Cookies.get('language')) {
                  opt.setAttribute('selected', 'selected');
                  i18next.changeLanguage(lng);
                }
              } else {
                if (lng === i18next.resolvedLanguage) {
                  Cookies.set('language', lng);
                  opt.setAttribute('selected', 'selected');
                }
              }
              $('#languageSwitcher').append(opt);
            });


            $('#languageSwitcher').on('change', function () {
              const chosenLng = $(this).find('option:selected').attr('value');

              Cookies.set('language', chosenLng);
              i18next.changeLanguage(chosenLng, () => {
                rerender();
              });
            });

            rerender();
          }
        }
      );
    },
  });
});
