document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date();

    const ADD_TEXT = document.getElementById('add-text');                               // リスト登録のテキストボックス
    const ADD_LIST_BUTTON = document.getElementById('add-list-btn');                    // 「登録」ボタン
    const SAVE_INPUT_LIST_BUTTON = document.getElementById('save-input-txt-btn');       // 「txt保存」（リスト登録タブ側）
    const CLEAR_LIST_BUTTON = document.getElementById('clear-list-btn');                // 「リストのクリア」
    const DROP_AREA = document.getElementById('droparea');                              // 「ここにテキストファイルをドロップ」
    const LIST_COUNT = document.getElementById('list-count');                           // 登録リスト数のカウント
    const INPUT_LIST_DATA = document.getElementById('input_list_sortable');             // 登録リスト本体
    const RANDOM_SELECT_TAB = document.getElementById('random-select-tab');             // ランダム抽選タブ
    const INPUT_LIST = document.getElementById('input-list');                           // 登録リスト（ランダム抽選タブ側）
    const SELECT_VALUE = document.getElementById('select-value');                       // ランダム抽選数
    const RANDOM_SELECT_BUTTON = document.getElementById('random-select-btn');          // 「ランダム抽選」ボタン
    const OUTPUT_LIST_DATA = document.getElementById('output_list_sortable');           // 抽選結果リスト
    const CLIPBOARD_BUTTON = document.getElementById('clipboard-btn');                  // 「クリップボードに保存」ボタン
    const SAVE_OUTPUT_LIST_BUTTON = document.getElementById('save-output-txt-btn');     // 「txt保存」（ランダム抽選タブ側）

    var inputCount = 1;
    var outputCount = 1;

    // リスト登録ボタン押下イベント
    ADD_LIST_BUTTON.addEventListener('click', function() {
        addList(ADD_TEXT.value)
    });

    ADD_TEXT.addEventListener('keypress', function(event) {
        if(event.key === 'Enter') {
            addList(ADD_TEXT.value);
        }
    });
    function addList(textValue) {
        if (ADD_TEXT.value == '') {
            return;
        }
        else {
            // ゴミ箱アイコン
            var trashIcon = document.createElement('span');
            trashIcon.classList.add('bi');
            trashIcon.classList.add('bi-trash3');

            var trashButton = document.createElement('button');
            trashButton.id = 'trash-item-' + inputCount;
            trashButton.setAttribute('trash-item', 'list-item-' + inputCount);
            trashButton.addEventListener('click', function() {
                // リスト削除
                var listId = this.getAttribute('trash-item');
                var listItemElement = document.getElementById(listId);
                INPUT_LIST_DATA.removeChild(listItemElement);

                // リストカウント更新
                LIST_COUNT.innerText = 'リスト数：' + INPUT_LIST_DATA.childElementCount;
            });

            trashButton.classList.add('btn');
            trashButton.classList.add('btn-outline-dark');
            trashButton.classList.add('border-opacity-50');
            trashButton.appendChild(trashIcon);

            // リスト追加
            var newListText = document.createElement('label');
            newListText.classList.add('px-2');
            newListText.innerText = textValue;

            var newAddList = document.createElement('li');
            newAddList.id = 'list-item-' + inputCount;
            newAddList.classList.add('list-group-item');
            newAddList.classList.add('d-flex');
            newAddList.classList.add('justify-content-between');
            newAddList.classList.add('align-items-center');
            newAddList.draggable = true;
            newAddList.appendChild(newListText);
            newAddList.appendChild(trashButton);

            INPUT_LIST_DATA.appendChild(newAddList);

            // リストカウント更新
            LIST_COUNT.innerText = 'リスト数：' + INPUT_LIST_DATA.childElementCount;

            // テキストボックス初期化
            ADD_TEXT.value = '';

            inputCount += 1;
        }
    }

    // ドロップ領域へファイルをフォーカスした場合の処理
    DROP_AREA.addEventListener('dragover', function(ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "copy";
        DROP_AREA.classList.add("dragover");
    });

    // ドロップ領域からファイルを離した場合の処理
    DROP_AREA.addEventListener('dragleave', function(ev) {
        DROP_AREA.classList.remove("dragover");
        console.log("dragleave");
    });

    // ドロップ領域へファイルをドロップした場合の処理
    DROP_AREA.addEventListener('drop', function(ev) {
        DROP_AREA.classList.remove("dragover");

        //既定の動作を行わない。
        ev.preventDefault();

        //ドロップされたファイル
        const [file] = ev.dataTransfer.files;

        //FileReaderでテキスト読み込み
        const reader = new FileReader();
        reader.onload = (e) => {
            // 文字コードを変換して読み込み
            var strArray = new Uint8Array(e.target.result);
            var encoding = Encoding.detect(strArray);
            var unicodeString = Encoding.convert(strArray, {
                to: 'UNICODE',
                from: encoding,
                type: 'string',
            });

            // 読み込んだデータをリストに登録
            var list = unicodeString.split(/\r\n|\r|\n/);
            list.forEach(function(item) {
                if (item != '') {
                    ADD_TEXT.value = ' ';
                    addList(item);
                }
            });
        };
        reader.readAsArrayBuffer(file);
    });

    // リスト全削除ボタン押下イベント
    CLEAR_LIST_BUTTON.addEventListener('click', function() {
        // リストを初期化
        INPUT_LIST_DATA.innerHTML = '';
        // リストカウント更新
        LIST_COUNT.innerText = 'リスト数：' + INPUT_LIST_DATA.childElementCount;
    });

    // リストからランダムで取得タブ押下時イベント
    RANDOM_SELECT_TAB.addEventListener('click', function() {
        // リストを初期化
        INPUT_LIST.innerHTML = '';
        SELECT_VALUE.innerHTML = '';

        var itemList = INPUT_LIST_DATA.getElementsByTagName('li');
        if (itemList.length == 0) {
            // 登録リストが0件の場合
            INPUT_LIST.innerHTML = '<label>登録されているリストがありません</label>';
            var option = document.createElement('option');
            option.value = 0;
            option.textContent = 0;
            SELECT_VALUE.appendChild(option)
            RANDOM_SELECT_BUTTON.disabled = true;
        }
        else {
            // 登録リストの生成
            RANDOM_SELECT_BUTTON.disabled = false;
            for (var i = 0; i < itemList.length; i++) {
                // リスト追加
                var newListText = document.createElement('label');
                newListText.innerText = itemList[i].getElementsByTagName('label')[0].innerText;
                var newAddList = document.createElement('li');
                newAddList.classList.add('list-group-item');
                newAddList.appendChild(newListText);
                INPUT_LIST.appendChild(newAddList);

                // select-valueに値を追加
                var option = document.createElement('option');
                option.value = i + 1;
                option.textContent = i + 1;
                SELECT_VALUE.appendChild(option)
            }
        }
    });

    // ランダム抽選
    RANDOM_SELECT_BUTTON.addEventListener('click', function() {
        var inputList = INPUT_LIST.getElementsByTagName('li');
        var itemList = [];
        var outputList = [];
        if (inputList.length == 0) {
            return;
        }
        else {
            // リストを初期化
            OUTPUT_LIST_DATA.innerHTML = '';

            // 登録リストからリストを取得
            for (var i = 0; i < inputList.length; i++) {
                itemList.push(inputList[i].getElementsByTagName('label')[0].innerText)
            }

            // ランダム抽選
            var optionElements = SELECT_VALUE.options;
            for (var i = 0; i < optionElements[SELECT_VALUE.selectedIndex].value; i++) {
                var findFlg = true;
                while (findFlg) {
                    var num = Math.floor(Math.random() * itemList.length);
                    if (outputList.includes(num)) {
                        continue;
                    }
                    outputList.push(num);
                    findFlg = false;
                }
            }

            // 「リストの順番を維持」がチェックの場合ソートする
            if (document.getElementById('chk-sorted').checked) {
                var f = function (a, b) {
                    return a - b
                }
                outputList.sort(f);
            }

            // 抽選結果をリストに出力
            for (var i = 0; i < outputList.length; i++) {
                var textValue = inputList[outputList[i]];

                // リスト追加
                var newListText = document.createElement('label');
                newListText.classList.add('px-2');
                newListText.innerText = textValue.innerText;

                var newAddList = document.createElement('li');
                newAddList.id = 'list-item-' + outputCount;
                newAddList.classList.add('list-group-item');
                newAddList.classList.add('d-flex');
                newAddList.classList.add('justify-content-between');
                newAddList.classList.add('align-items-center');
                newAddList.draggable = true;
                newAddList.appendChild(newListText);

                OUTPUT_LIST_DATA.appendChild(newAddList);

                outputCount += 1;
            }
        }
    });

    // クリップボードへコピー
    CLIPBOARD_BUTTON.addEventListener('click', function() {
        var outputTxt = "";
        var itemList = OUTPUT_LIST_DATA.getElementsByTagName('li');
        if (itemList.length == 0) {
            return;
        }
        else {
            for (var i = 0; i < itemList.length; i++) {
                outputTxt += itemList[i].getElementsByTagName('label')[0].innerText + '\r\n';
            }
        }

        navigator.clipboard.writeText(outputTxt);

        // 一時的にボタン内の文字列を更新
        CLIPBOARD_BUTTON.innerText = "コピーしました！";
        setTimeout(function() {
            CLIPBOARD_BUTTON.innerText = "クリップボードにコピー";
        }, 1000);
    });

    // 登録リストのtxt保存
    SAVE_INPUT_LIST_BUTTON.addEventListener('click', function() {
        var outputTxt = "";
        var itemList = INPUT_LIST_DATA.getElementsByTagName('li');
        if (itemList.length == 0) {
            return;
        }
        else {
            for (var i = 0; i < itemList.length; i++) {
                outputTxt += itemList[i].getElementsByTagName('label')[0].innerText + '\r\n';
            }
        }
        saveTextToFile(outputTxt);
    });

    // 抽選結果のtxt保存
    SAVE_OUTPUT_LIST_BUTTON.addEventListener('click', function() {
        var outputTxt = "";
        var itemList = OUTPUT_LIST_DATA.getElementsByTagName('li');
        if (itemList.length == 0) {
            return;
        }
        else {
            for (var i = 0; i < itemList.length; i++) {
                outputTxt += itemList[i].getElementsByTagName('label')[0].innerText + '\r\n';
            }
        }
        saveTextToFile(outputTxt);
    });
    function saveTextToFile(text) {
        var date = currentDate.getFullYear() +
            String(currentDate.getMonth() + 1).padStart(2, "0") +
            String(currentDate.getDate()).padStart(2, "0") +
            String(currentDate.getHours()).padStart(2, "0") +
            String(currentDate.getMinutes()).padStart(2, "0") +
            String(currentDate.getSeconds()).padStart(2, "0");
        var filename = "output_" + date + ".txt";

        const blob = new Blob([text], { type: 'text/plain' });
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.click();
    }

    // リスト入れ替え時のアニメーション設定
    $(function(){
        new Sortable(input_list_sortable, {
            animation: 150
        });
        new Sortable(output_list_sortable, {
            animation: 150
        });
    });
});
