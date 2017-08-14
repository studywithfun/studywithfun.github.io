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
})();
