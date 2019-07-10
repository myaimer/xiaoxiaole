function  arrayClone2x2(arr) {
    var temp = [];
    for(var i = 0; i<arr.length;i++){
        temp[i] = [];
        for(var j =0;j<arr[i].length;j++){
            temp[i][j] = arr[i][j];
        }
    }
    return temp;
}