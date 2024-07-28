document.addEventListener('DOMContentLoaded', () => {
    // JSONデータを読み込む
    const jsonDataElement = document.getElementById('json-data');
    const jsonData = JSON.parse(jsonDataElement.textContent);

    // JSONデータからボタンを生成する
    jsonData.forEach(item => {
        const btnId = "btn-" + item.id

        // ボタンの有効／無効
        var isEnabled = true;
        const buttonStatus = localStorage.getItem(btnId);
        if (buttonStatus !== null) {
            // ローカルストレージからボタンの状態を取得
            isEnabled = buttonStatus.toLowerCase() === "true";
        }
        else {
            // データが存在しない場合、ボタンの状態を初期化登録
            localStorage.setItem(btnId, isEnabled);
        }

        /* ここから音声ボタンを生成 */
        const contentDiv = document.getElementById(item.group);
        const itemBtn = document.createElement('button');

        itemBtn.id = btnId;
        itemBtn.className = "btn btn-voice";

        if (isEnabled) {
            itemBtn.classList.remove('button-disable');
            itemBtn.classList.remove('hidden');
        }
        else {
            itemBtn.classList.add('button-disable');
            itemBtn.classList.add('hidden');
        }

        itemBtn.setAttribute('data-audio', item.id);
        itemBtn.innerHTML = `${item.name}`;

        contentDiv.appendChild(itemBtn);

        /* ここからaudioタグを生成 */
        const audioDiv = document.getElementById('audio-list');
        const audioItem = document.createElement('audio');
        audioItem.id = item.id;
        audioItem.src = item.src;
        audioDiv.appendChild(audioItem);
    });

    // 編集トグルボタンの押下イベント
    const checkbox = document.getElementById('edit-switch');
    checkbox.addEventListener('click', () => {
        var editmodeInformation = document.getElementById("editmode-information");

        if (checkbox.checked) {
            // JSONデータの分、処理を行う
            jsonData.forEach(item => {
                const btnId = "btn-" + item.id
                const contentButton = document.getElementById(btnId);
                contentButton.classList.remove('hidden');
            });
            editmodeInformation.classList.remove('hidden');
        }
        else {
            // JSONデータの分、処理を行う
            jsonData.forEach(item => {
                const btnId = "btn-" + item.id

                // ボタンの有効／無効
                var isEnabled = true;

                const buttonStatus = localStorage.getItem(btnId);
                if (buttonStatus !== null) {
                    // ローカルストレージからボタンの状態を取得
                    isEnabled = buttonStatus.toLowerCase() === "true";
                }

                var contentButton = document.getElementById(btnId);
                if (isEnabled) {
                    contentButton.classList.remove('hidden');
                }
                else {
                    contentButton.classList.add('hidden');
                }
            });
            editmodeInformation.classList.add('hidden');
        }
    });

    // 音声ボタン押下イベント
    document.querySelectorAll('button[data-audio]').forEach(function(button) {
        button.addEventListener('click', function() {
            var audioId = this.getAttribute('data-audio');
            var audioElement = document.getElementById(audioId);
            // 編集トグルボタンの状態を判定
            if (checkbox.checked) {
                // ボタンの表示／非表示設定を振り分け
                if (this.classList.contains('button-disable')) {
                    this.classList.remove('button-disable');
                    localStorage.setItem(this.id, true);
                }
                else {
                    this.classList.add('button-disable');
                    localStorage.setItem(this.id, false);
                }
            }
            else{
                audioElement.play();
            }
        });
    });

    // すべてのボタンを表示状態にするイベント
    const allEnable = document.getElementById('btn-all-enable');
    allEnable.addEventListener('click', () => {
        // JSONデータの分、処理を行う
        jsonData.forEach(item => {
            const btnId = "btn-" + item.id
            const contentButton = document.getElementById(btnId);
            contentButton.classList.remove('button-disable');
            localStorage.setItem(btnId, true);
        });
    });

    // すべてのボタンを非表示状態にするイベント
    const allDisable = document.getElementById('btn-all-disable');
    allDisable.addEventListener('click', () => {
        // JSONデータの分、処理を行う
        jsonData.forEach(item => {
            const btnId = "btn-" + item.id
            const contentButton = document.getElementById(btnId);
            contentButton.classList.add('button-disable');
            localStorage.setItem(btnId, false);
        });
    });
});
