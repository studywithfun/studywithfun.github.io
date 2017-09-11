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

    Vue.component('navbar-top', {
        'template': '<nav class="navbar navbar-default navbar-fixed-top nav-swf"><p class="text-center">{{ title }}</p></nav>',
        'props': ['title']
    });
    Vue.component('navbar-bottom', {
        'template': '<nav class="navbar navbar-default navbar-fixed-bottom nav-swf"><div class="container"><div class="row"><div class="col-xs-6"><a href="index.html"><img class="img-responsive img-rounded center-block icon" src="assets/images/icon-home.jpg" alt="首页"></a></div><div class="col-xs-6"><a href="index.html"><img class="img-responsive img-rounded center-block icon" src="assets/images/icon-profile.jpg" alt="个人中心"></a></div></div></div></nav>'
    });
    Vue.component('words-category', {
        'template': '<div class="container"><div class="row"><template v-for="item in items"><div v-on:click="linkTo(item);" class="col-xs-6"><div class="alert alert-success" role="alert"><h4><b>{{ item.category }}</b></h4><template v-for="(word, index) in item.words"><template v-if="index< 2"><p>{{ word }}</p></template><template v-else-if="index == 2"><p>.....</p></template></template></div></div></template></div></div>',
        'props': ['items'],
        'methods': {
            'linkTo': function (item) {
                if (window.linkTo) {
                    window.linkTo(item);
                }
            }
        }
    });
})();
