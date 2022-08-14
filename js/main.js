window.addEventListener('load', function () {
    openModal();
    console.log('hack');
});

var CallbackRegistry = {}; // реестр
var token;
var id;
// Модальное окно приветствия
const openModal = () => {
    payload = `<div>
    <h1>Привет!👋</h1>
    <div>Введите токен и id пользователя</div>
    <br>
    <label for="token">Токен (желательно полученный <a href="https://oauth.vk.com/authorize?client_id=2685278&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=2064127&response_type=token&v=5.122">тут</a>):</label>
    <br>
    <input type="text" id="token" name="token" required minlength="8">
    <br>
    <br>
    <label for="id_user">id пользователя переписки</label>
    <br>
    <input type="text" id="id_user" name="id_user" required>
    <br>
    <br>
    <input id="save" value="Погнали!" type="button" onclick="get_chat(document.getElementById('token').value, document.getElementById('id_user').value)"></input>
    
    </div>`;

    var panel = document.querySelector(".page_wrap");
    console.log(panel);
    var newModel = document.createElement('div');
    newModel.setAttribute("id", "open-modal");
    newModel.className = "modal-window overlayDiv";
    newModel.innerHTML = payload;
    panel.appendChild(newModel);
    return newModel;
}

const openModalTools = () => {
    payload = `<div>
    <a onclick="document.getElementById('open-modal').remove();" title="Close" class="modal-close" id="close-a">Close</a>
    <h1>Инструменты</h1>
    <div>Добавить в друзья</div>
    <br>
    <label for="id_friend_add">Введите id</label>
    <br>
    <input type="text" id="id_friend_add" name="id" required minlength="8">
    <input id="add_friend_button" value="Добавить" type="button" onclick="add_friend(document.getElementById('id_friend_add').value)"></input>
    <br>
    <br>    
    <div>Удалить из друзей</div>
    <br>
    <label for="id_friend_remove">id пользователя переписки</label>
    <br>
    <input type="text" id="id_friend_remove" name="id" required>
    <input id="add_friend_button" value="Удалить" type="button" onclick="remove_friend(document.getElementById('id_friend_remove').value)"></input>
    <br>
    <br>
    <div>Блокировка</div>
    <br>
    <label for="id_account_ban">id блокируемого пользователя</label>
    <br>
    <input type="text" id="id_account_ban" name="id" required>
    <input id="id_account_ban_button" value="Удалить" type="button" onclick="account_ban(document.getElementById('id_account_ban').value)"></input>
    <br>
    <br>
    
    </div>`;

    var panel = document.querySelector(".page_wrap");
    console.log(panel);
    var newModel = document.createElement('div');
    newModel.setAttribute("id", "open-modal");
    newModel.className = "modal-window overlayDiv";
    newModel.innerHTML = payload;
    panel.appendChild(newModel);
    return newModel;
}

const get_chat = (token, id) => {
    // Убираем модальное окно
    var elem = document.getElementById('open-modal');
    // Проверка на существование
    if (elem != null){
        console.log(elem);
        elem.parentNode.removeChild(elem);
    }

    // Проверка на пустые поля
    if (token !== '' || token !== ''){
        this.token = token;
        this.id = id;
    }
    else{
        console.log('Оставлено пустое поле')
    }
    console.log('Токен: ', this.token, ' и id ', this.id);
    // Обращаемся к апи истории сообщений
    vk_api('messages.getHistory', this.token, this.id, null, 0)
};

// Получаем имя собеседника
const usersget = (result) => {
    console.log(result.response);
    document.getElementById('first_name').innerHTML = (result.response[0].first_name + ' ' + result.response[0].last_name);
};

// Для апи запросов
const vk_api = async (method, param1, param2, param3, param4) => {
    // VK не поддерживает CORS, обходим с соездаем запроса с использованием JSONP
    var script = document.createElement('SCRIPT');
    var offset = Number(param4);
    if (method === 'messages.getHistory')
        console.log('Получаем СМС');
    script.src = `https://api.vk.com/method/${method}?access_token=${param1}&user_id=${param2}&fields=${param3}&offset=${offset}&count=20&v=5.131&callback=${method.replace('.', '')}`;
    document.getElementsByTagName("head")[0].appendChild(script);
    document.getElementsByTagName("head")[0].removeChild(script);
};

const get_profile = async (result, param1, param2, param3) => {
    // VK не поддерживает CORS, обходим с соездаем запроса с использованием JSONP
    if (await result !== null){
        CallbackRegistry[result.response[0].id] = result.response[0];
        //console.log(CallbackRegistry);
        return await result.response[0];
    }
    else{
        (async () => {
            var script = document.createElement('SCRIPT');
            script.src = `https://api.vk.com/method/users.get?access_token=${param1}&user_ids=${param2}&fields=photo_100&v=5.131&callback=get_profile}`;
            document.getElementsByTagName("head")[0].appendChild(script);
            document.getElementsByTagName("head")[0].removeChild(script);
        })();
    }
};

const get_video = async (result, param1, param2, param3) => {
    // VK не поддерживает CORS, обходим с соездаем запроса с использованием JSONP
    if (await result !== null){
        console.log(result);
        CallbackRegistry[result.response.items[0].owner_id + '_' + result.response.items[0].id] = result.response.items[0].player;
        console.log(CallbackRegistry);
        return await result.response.items[0].player;
    }
    else{
        (async () => {
            var script = document.createElement('SCRIPT');
            var own_id = Number(param2);
            script.src = `https://api.vk.com/method/video.get?access_token=${param1}&owner_id=${own_id}&videos=${param3}&v=5.131&callback=get_video}`;
            document.getElementsByTagName("head")[0].appendChild(script);
            document.getElementsByTagName("head")[0].removeChild(script);
        })();
    }
};


// Получение данных профиля по id
/**
 * 
 * @param id Индитификатор профиля
 * @returns возврат промиса
 * 
 * TODO: Оптимизировать код. Добавить проверку на сущесвование параметра в регистре CallbackRegistry. Если параметр существует, нет необходимости получать его повтороно
 * !Частые запросы к API не рекомендются. Обязательно оптимизировать
 */
function get_profile_info_for_id(id) {
    get_profile(null, token, id.toString(), null);
    return new Promise((resolve, reject) => {

        let timerId = setTimeout(() => {
            if (typeof CallbackRegistry[id.toString()] !== 'undefined')
            {
                //console.log('Дождались');
                //console.log(CallbackRegistry[id.toString()]);
                clearTimeout(timerId);
                resolve(CallbackRegistry[id.toString()]);
            }
        }, 1000);
    });
}

function get_video_player(owner_id, id) {
    get_video(null, token, owner_id.toString(), owner_id.toString() + "_" + id.toString());
    return new Promise((resolve, reject) => {

        let timerId = setTimeout(() => {
            if (typeof CallbackRegistry[owner_id.toString() + "_" + id.toString()] !== 'undefined')
            {
                //console.log('Дождались');
                //console.log(CallbackRegistry[id.toString()]);
                clearTimeout(timerId);
                resolve(CallbackRegistry[owner_id.toString() + "_" + id.toString()]);
            }
        }, 1000);
    });
}

var count = 0;
var available_scroll = true;
// Получаем список сообщений
async function  messagesgetHistory(result)  {
    // Ищем в какой тег будем добавлять сообщения
    var listMessages = document.querySelector('.history');
    var available_scroll = true;
    console.log(result);
    // Чекаем имя получателя
    vk_api('users.get', token, this.id);
    console.log(token);
    //console.log(await get_profile_info_for_id(309424939));
    var temp;
    
    
    for (var i of result.response.items)
    {
        var id = i.from_id.toString();
        // Получаем данные профилей чата
        var data = await get_profile_info_for_id(id);

        var not_avaible_attach = '';
        for (var at of i.attachments)
        {
            console.log('Аттач', at);
            if (at.type == 'sticker')
                not_avaible_attach += '<br><b>Стикер</> +50₽';
            if (at.type == 'doc')
                not_avaible_attach += '<br><b>Документ</> +50₽';
            if (at.type == 'wall')
                not_avaible_attach += '<br><b>Запись со стены</> +50₽';
            if (at.type == 'gift')
                not_avaible_attach += '<br><b>Запись со стены</> +50₽';
            if (at.type == "photo")
                not_avaible_attach += `<br><img src="${at.photo.sizes[1].url}" onclick="javascript:window.open('${at.photo.sizes[Object.keys(at.photo.sizes).length-1].url}', '_blank');"></img>`;
            if (at.type == "video") {
                var player = await get_video_player(at.video.owner_id, at.video.id);
                not_avaible_attach += `<br><iframe src="${player}" width="640" height="360" width="-webkit-fill-available" frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
            }
            if (at.type == "audio_message")
                not_avaible_attach += `<br><audio controls>
                <source src="${at.audio_message.link_ogg}" type="audio/ogg; codecs=vorbis">
                <source src="${at.audio_message.link_mp3}" type="audio/mpeg">
                Тег audio не поддерживается вашим браузером. 
                <a href="${at.audio_message.link_mp3}">Попробуйте скачать</a>.
              </audio>`
        }
        // Проверяем, это дополнение к сообщению, или это новое сообщение
        if (id === temp)
        {
            payload = `<div class="message default clearfix joined" id="message4285">

            <div class="body">

                   <div class="pull_right date details" title="19.05.2022 17:38:59 UTC+03:00">
                   ${decode_unixtime(i.date)}
                   </div>

                   <div class="text">
                   ${i.text}
                   ${not_avaible_attach}
                   </div>

            </div>

     </div>`;
        }
        else
        {
        payload = `
        <div class="pull_left userpic_wrap">

                <div class="userpic userpic8" style="width: 42px; height: 42px">

                        <div class="initials" style="line-height: 42px">
                            <img src='${data.photo_100}' 
                            style = "width: 42px;
                            height: 42px;"
                        />
                        </div>

                </div>

        </div>

        <div class="body">

                <div class="pull_right date details" title="07.08.2022 12:54:38 UTC+03:00">
                        ${decode_unixtime(i.date)}
                </div>

                <div class="from_name">
                        ${data.first_name}
                </div>

                <div class="text">
                    ${i.text}
                    
                    ${not_avaible_attach}
                </div>

        </div>
        `;
        }

        // Добавляем сообщения
        var newModel = document.createElement('div');
        newModel.setAttribute("id", `message${i.id}`);
        newModel.className = "message default clearfix";
        newModel.innerHTML = payload;
        listMessages.appendChild(newModel);
        console.log(i.text);

        
        temp = id;
    }

    
    count += 20;
    window.onscroll = function(ev) {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
            if (available_scroll)
            {
                vk_api('messages.getHistory', this.token, this.id, null, count);
            }
            available_scroll = false;
        }
    };
    
}

// Docode UNIX 
const decode_unixtime = (unix_timestamp) => {
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp * 1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();
    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}


// Добавление в друзья
const add_friend = (id_friend) => {
    (async () => {
        var script = document.createElement('SCRIPT');
        script.src = `https://api.vk.com/method/friends.add?access_token=${this.token}&user_id=${id_friend}&v=5.131&callback=add_friend_callback}`;
        document.getElementsByTagName("head")[0].appendChild(script);
        document.getElementsByTagName("head")[0].removeChild(script);
    })();
}

const add_friend_callback = (result) => {
    if (result.response === 1)
        alert('заявка на добавление данного пользователя в друзья отправлена');
    else if(result.response === 2)
        alert('заявка на добавление в друзья от данного пользователя одобрена');
    else if(result.response === 4)
        alert('повторная отправка заявки');
    else {
        alert('какая-то проблема');
        console.log(result);
    }
}

// Удаление из друзей
const remove_friend = (id_friend) => {
    (async () => {
        var script = document.createElement('SCRIPT');
        script.src = `https://api.vk.com/method/friends.delete?access_token=${this.token}&user_id=${id_friend}&v=5.131&callback=remove_friend_callback}`;
        document.getElementsByTagName("head")[0].appendChild(script);
        document.getElementsByTagName("head")[0].removeChild(script);
    })();
}

const remove_friend_callback = (result) => {
    if(result.response['friend_deleted'] !== undefined)
        alert('был удален друг');
    else if(result.response['out_request_deleted'] !== undefined)
        alert('отменена исходящая заявка');
    else if(result.response['in_request_deleted'] !== undefined)
        alert('отклонена входящая заявка');
    else if(result.response['suggestion_deleted'] !== undefined)
        alert('отклонена рекомендация друга');
    else {
        alert('какая-то проблема');
        console.log(result);
    }
}

// Блокировка пользователя
const account_ban = (id_block) => {
    (async () => {
        var script = document.createElement('SCRIPT');
        var id_block_number = Number(id_block);
        script.src = `https://api.vk.com/method/account.ban?access_token=${this.token}&owner_id=${id_block_number}&v=5.131&callback=account_ban_callback}`;
        document.getElementsByTagName("head")[0].appendChild(script);
        document.getElementsByTagName("head")[0].removeChild(script);
    })();
}

const account_ban_callback = (result) => {
    if (result.response === 1)
    {
        alert('Пользователь добавлен в черный список');
    }
    else {
        alert('какая-то проблема');
        console.log(result);
    }
}

// для теста
//get_chat('', '')