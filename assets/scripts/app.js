(function () {
    function createKey(wordContent) {
        return ["newWord", "key", wordContent].join(":");
    }

    function exist(wordContent) {
        return !!localStorage.getItem(createKey(wordContent));
    }

    function add(word) {
        var wordContent = word.content;
        localStorage.setItem(createKey(wordContent), wordContent);
    }

    function remove(wordContent) {
        localStorage.removeItem(createKey(wordContent));
    }

    function list() {
        var result = [];
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key.indexOf("newWord:key:") == 0) {
                result.push(localStorage.getItem(key));
                continue;
            }
        }
        return result;
    }

    window.NWordList = {
        "exist": exist,
        "add": add,
        "remove": remove,
        "list": list
    };

    window.getParameter = function (paramName) {
        var reg = new RegExp(["(^|&)", paramName, "=([^&]*)(&|$)"].join(""), "i");
        var r = window.location.search.substr(1).match(reg);
        var result = r ? decodeURIComponent(r[2]).split(",") : [];
        return result.length == 0 ? "" : result[0];
    };
    window.getWordUrl = function (wordContent) {
        return ["assets", "words", wordContent.substring(0, 1), wordContent, wordContent + ".json"].join("/");
    };
    window.getWordAudioUrl = function (wordContent, audioFile) {
        return ["assets", "words", wordContent.substring(0, 1), wordContent, audioFile].join("/");
    };
    window.getTssAudioUrl = function (text) {
        return "https://fanyi.baidu.com/gettts?lan=en&spd=3&source=web&text=" + encodeURIComponent(text);
    }
    window.getItemsByCategoryId = function (categories, categoryId) {
        for (var index in categories) {
            var category = categories[index];
            if (category.id == categoryId) {
                return category.items;
            }
        }
        return [];
    };
    window.autoplayWordAudio = function (word) {
        if (word && word.pronunciation) {
            if (word.pronunciation.uk && word.pronunciation.uk.audio) {
                $("<audio></audio>").attr({
                    "src": getWordAudioUrl(word.content, word.pronunciation.uk.audio),
                    "autoplay": "autoplay"
                });
            } else if (word.pronunciation.us && word.pronunciation.us.audio) {
                $("<audio></audio>").attr({
                    "src": getWordAudioUrl(word.content, word.pronunciation.us.audio),
                    "autoplay": "autoplay"
                });
            }
        }
    };

    Vue.component('navbar-top', {
        'template': '<nav class="navbar navbar-default navbar-fixed-top nav-swf"><p class="text-center">{{ title }}</p></nav>',
        'props': ['title']
    });
    Vue.component('navbar-bottom', {
        'template': '<nav class="navbar navbar-default navbar-fixed-bottom nav-swf"><div class="container"><div class="row"><div class="col-xs-6"><a href="index.html"><img class="img-responsive img-rounded center-block icon" src="assets/images/icon-home.jpg" alt="首页"></a></div><div class="col-xs-6"><a href="index.html"><img class="img-responsive img-rounded center-block icon" src="assets/images/icon-profile.jpg" alt="个人中心"></a></div></div></div></nav>'
    });
    Vue.component('words-category', {
        'template': '<div class="container"><div class="row"><template v-for="category in categories"><div v-on:click="linkTo(category);" class="col-xs-6"><div class="alert alert-success" role="alert"><p class="words-category"><b>{{ category.id }}</b> <span class="badge">{{ category.items.length }}</span></p><template v-for="(word, index) in category.items"><template v-if="index< 2"><p class="words-item">{{ word | toString }}</p></template><template v-else-if="index == 2"><p class="words-item">.....</p></template></template></div></div></template></div></div>',
        'props': ['categories'],
        'methods': {
            'linkTo': function (item) {
                if (window.linkTo) {
                    window.linkTo(item);
                }
            }
        },
        'filters': {
            'toString': function (value) {
                if (typeof value === 'object') {
                    return value.content;
                }
                return value.toString();
            }
        }
    });
    Vue.component('words-word', {
        'template': '<div><audio id="playAudio"></audio><p class="word-content">{{ word.content }}</p><p><template v-if="word.pronunciation && word.pronunciation.uk"><span class="word-pronunciation-type">英</span> <span class="word-pronunciation-phonetic" v-if="word.pronunciation.uk.phonetic">[{{ word.pronunciation.uk.phonetic }}]</span><template v-if="word.pronunciation.uk.audio"><span class="glyphicon glyphicon-volume-up" @click="playWordAudio(word.content, word.pronunciation.uk.audio)"></span></template></template>&nbsp;&nbsp;&nbsp;<template v-if="word.pronunciation && word.pronunciation.us"><span class="word-pronunciation-type">美</span> <span class="word-pronunciation-phonetic" v-if="word.pronunciation.us.phonetic">[{{ word.pronunciation.us.phonetic }}]</span><template v-if="word.pronunciation.us.audio"><span class="glyphicon glyphicon-volume-up" @click="playWordAudio(word.content, word.pronunciation.us.audio)"></span></template></template></p><template v-if="word.definition && word.definition.cn"><p><template v-for="(value, key) in word.definition.cn"><span class="word-definition-type">{{ key }}.</span> <span class="word-definition-content">{{ value.join(";") }}</span><br></template></p></template><template v-if="word.examples"><blockquote v-for="item in word.examples" class="word-example"><p>{{ item.first }}<em><ins>{{ word.content }}</ins></em>{{ item.last }} <span class="glyphicon glyphicon-volume-up" @click="playExampleAudio(item.first, item.last, word.content)"></span></p><footer v-if="item.translation">{{ item.translation }}</footer></blockquote></template></div>',
        'props': ['word'],
        'methods': {
            'playWordAudio': function (wordContent, audioFile) {
                var wordAudioUrl = getWordAudioUrl(wordContent, audioFile);
                this.playAudio(wordAudioUrl);
            },
            'playAudio': function (audioUrl) {
                $("#playAudio").attr({
                    "autoplay": "autoplay",
                    "src": audioUrl
                });
            },
            "playExampleAudio": function (first, last, wordContent) {
                var text = [first, wordContent, last].join(" ");
                var exampleAudioUrl = getTssAudioUrl(text);
                this.playAudio(exampleAudioUrl);
            }
        }
    });
})();
