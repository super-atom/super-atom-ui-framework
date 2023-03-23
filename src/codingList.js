$(function () {
  loadData();

  $('.btn-top').on('click', function () {
    $(window).scrollTop(0, 0);
  });
});

var listArray = [];

// load data
function loadData() {
  $.ajax({
    method: 'GET',
    url: './codingList.json',
    dataType: 'json',
  })
    .done(function (data) {
      try {
        listArray = JSON.parse(JSON.stringify(data));
      } catch (e) {
        listArray = data;
      }

      // make list
      makeList(listArray);

      // 건수 구하기
      displayNumber();
    })
    .fail(function (XMLHttpRequest, textStatus, errorThrown) {
      alert('data를 불러오지 못했습니다.');
    });
}

// 진행상태 selectbox
function selSorting() {
  var dataList = [];
  var stateVal = $('select[name=proj-state]').val();

  if (!!stateVal) {
    $.each(listArray, function (index, item) {
      if (stateVal === item.state) {
        dataList.push(listArray[index]);
      }
    });
  } else {
    dataList = listArray;
  }

  makeList(dataList);
}

// 건수 표시
function displayNumber() {
  var obj = $('.srch-bar').find('.count');
  var _total, _wait, _continue, _complete, _hold, _delete;
  var _html = '';

  _total = listArray.length;
  _wait = listArray.filter(function (x) {
    return x.state === '0';
  }).length;
  _continue = listArray.filter(function (x) {
    return x.state === '1';
  }).length;
  _complete = listArray.filter(function (x) {
    return x.state === '2';
  }).length;
  _hold = listArray.filter(function (x) {
    return x.state === '3';
  }).length;
  _delete = listArray.filter(function (x) {
    return x.state === '4';
  }).length;

  p_wait = Math.round((_wait / (_total - _hold - _delete)) * 10000) / 100;
  p_continue =
    Math.round((_continue / (_total - _hold - _delete)) * 10000) / 100;
  p_complete =
    Math.round((_complete / (_total - _hold - _delete)) * 10000) / 100;
  p_hold = Math.round((_hold / (_total - _delete)) * 10000) / 100;
  p_delete = Math.round((_delete / (_total - _hold)) * 10000) / 100;

  _html += '전체: <i>' + _total + '</i>건, &nbsp;&nbsp;';
  _html += '진행대기: <i>' + _wait + '</i>건(' + p_wait + '%), &nbsp;&nbsp;';
  _html +=
    '진행중: <i class="conti">' +
    _continue +
    '</i>건(' +
    p_continue +
    '%), &nbsp;&nbsp;';
  _html +=
    '완료: <i class="comp">' +
    _complete +
    '</i>건(' +
    p_complete +
    '%), &nbsp;&nbsp;';
  _html += '보류: <i>' + _hold + '</i>건(' + p_hold + '%), &nbsp;&nbsp;';
  _html += '제외: <i>' + _delete + '</i>건(' + p_delete + '%)';

  obj.html(_html);
}

// 리스트 만들기
function makeList(arr) {
  var _state,
    _path = '',
    _work,
    _cls;
  var list = $('.tbl-base').find('tbody');
  var listObj = '';
  if (arr.length < 1) {
    listObj += '<tr class="nothing">';
    listObj += '    <td colspan="15">검색결과가 없습니다.</td>';
    listObj += '</tr>';
  } else {
    $.each(arr, function (index, item) {
      // 상태
      _state =
        item.state === '0'
          ? '진행대기'
          : item.state === '1'
          ? '진행중'
          : item.state === '2'
          ? '완료'
          : item.state === '3'
          ? '보류'
          : item.state === '4'
          ? '제외'
          : '';
      _cls =
        item.state === '1'
          ? 'ing'
          : item.state === '2'
          ? 'complete'
          : item.state === '3'
          ? 'hold'
          : item.state === '4'
          ? 'del'
          : '';

      // 화면 경로
      _path = '';
      item.depth.forEach(function (i, idx, arr) {
        if (arr[idx] !== '') {
          if (idx !== arr.length - 1) {
            _path += arr[idx] + ' > ';
          } else {
            _path += "<b class='string'>" + arr[idx] + '</b>';
          }
        }
      });

      // 페이지 링크
      _work =
        item.state === '1' || item.state === '2'
          ? item.type.toLowerCase() === 'page'
            ? '<a href=' +
              './' +
              item.pageid +
              '.html' +
              " target='_blank'>" +
              item.work +
              '</a>'
            : "<a href=\"javascript:viewPage('" +
                item.pageid +
                "', '" +
                item.type.toLowerCase() +
                "');\">" +
                item.work +
                "</a>"
          : item.work;
      // list
      listObj += '<tr class="' + _cls + '">';
      listObj += '<td>' + (index + 1) + '</td>';
      listObj += '<td>' + _state + '</td>';
      listObj += '<td>' + item.start + '</td>';
      listObj += '<td>' + item.end + '</td>';
      listObj += '<td>' + item.pageid + '</td>';
      listObj += '<td class="txt-l">' + item.category + '</td>';
      listObj += '<td class="txt-l">' + _path + '</td>';
      listObj += '<td class="txt-l">' + _work + '</td>';
      listObj += '<td>' + item.type + '</td>';
      listObj += '<td class="txt-l">' + item.etc + '</td>';
      listObj += '</tr>';

      if (item.modified.length > 0) {
        listObj += '<tr class="modify">';
        listObj += '<td colspan="6"> "' + item.work + '"의 수정내역</td>';
        listObj += '<td colspan="9" class="txt-l">';
        $.each(item.modified, function (i) {
          listObj += i + 1 + '. ' + item.modified[i];
          if (item.modified.length - 1 !== i) {
            listObj += '<br>';
          }
        });
        listObj += '</td>';
        listObj += '</tr>';
      }
    });
  }

  list.html(listObj);
}

// 페이지 보기
function viewPage(_pid, _type) {
  var path = _pid + '.html';

  if (_type === 'page') {
    if (typeof window.open == 'function') {
      window.open(url, 'page');
    } else {
      // IOS
      location.assign(location.origin + url);
      // window.location.href = url;
    }
  } else if (_type === 'viewer') {
      var popW, popH;
      if (_pid === 'w_098') {
          popW = '1920';
          popH = '1080';
      } else {
          popW = window.screen.width;
          popH = window.screen.height;
      }
      window.open(path, 'viewer', 'width='+ popW +', height='+ popH +', resizable=no, toolbar=no');
  }
}
