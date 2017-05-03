/**
 * Created by wenjin on 2017/4/27.
 */

//construct: ArrayList();
//size, isEmpty, contains, indexOf, lastIndexOf, toArray, outOfBound
//get, set, add, insert, remove, removeValue, clear, addAll, insertAll
//sort, toString, valueOf,
(function(win) {
    var ArrayList = function() {
        this.datas = [];
    };

    var proto = ArrayList.prototype;

    proto.size = function() {
        return this.datas.length;
    };

    proto.isEmpty = function() {
        return this.size() === 0;
    };

    proto.contains = function(value) {
        return this.datas.indexOf(value) !== -1;
    };

    proto.indexOf = function(value) {
        for ( var index in this.datas) {
            if (this.datas[index] === value) {
                return index;
            }
        }

        return -1;
    };

    proto.lastIndexOf = function(value) {
        for ( var index = this.size(); index >= 0; index--) {
            if (this.datas[index] === value) {
                return index;
            }
        }
    };

    proto.toArray = function() {
        return this.datas;
    };

    proto.outOfBound = function(index) {
        return index < 0 || index > (this.size() - 1);
    };

    proto.get = function(index) {
        if (this.outOfBound(index)) {
            return null;
        }

        return this.datas[index];
    };

    proto.set = function(index, value) {
        this.datas[index] = value;
    };

    proto.add = function(value) {
        this.datas.push(value);
    };

    proto.insert = function(index, value) {
        if (this.outOfBound(index)) {
            return;
        }

        this.datas.splice(index, 0, value);
    };

    proto.remove = function(index) {
        if (this.outOfBound(index)) {
            return false;
        }

        this.datas.splice(index, 1);
        return true;
    };

    proto.removeValue = function(value) {
        if (this.contains(value)) {
            this.remove(this.indexOf(value));
            return true;
        }
        return false;
    };

    proto.clear = function() {
        this.datas.splice(0, this.size());
    };

    proto.addAll = function(list) {
        if (!list instanceof ArrayList) {
            return false;
        }

        for ( var index in list.datas) {
            this.add(list.get(index));
        }

        return true;
    };

    proto.insertAll = function(index, list) {
        if (this.outOfBound(index)) {
            return false;
        }

        if (!list instanceof ArrayList) {
            return false;
        }

        var pos = index;
        for(var index in list.datas)
        {
            this.insert(pos++, list.get(index));
        }
        return true;
    };

    function numberorder(a, b) {
        return a - b;
    }

    proto.sort = function(isNumber){
        if(isNumber){
            this.datas.sort(numberorder);
            return;
        }

        this.datas.sort();
    };

    proto.toString = function(){
        return "[" + this.datas.join() + "]";
    };

    proto.valueOf = function(){
        return this.toString();
    };

    win.ArrayList = ArrayList;
})(window);