//template = { "id": "", "name": "", "description": "", "color": [], "img": [], "price": [], "type": [] }

function generateDummyItems(amount) {
    var list = [];
    for (var i = 1; i < amount; i++) {
        var affix = "0".repeat(2 - Math.floor(Math.log10(i))) + (i);
        var id = "dummy" + affix;
        var color = ["red", "green", "blue", "black", "grey", "pink", "yellow", "white"];
        var name = "Dummy item " + affix;
        var description = "This is the dummy item, it is created by javascript. It's in the position " + i + " in array.";
        var img = [];
        for (var j = 0; j < color.length; j++)
            img[j] = "dummyItem.jpg";
        var price = [];
        for (var j = 0; j < color.length; j++)
            price[j] = (Math.random() / 10).toFixed(5);
        var type = ["Developing", "Other"];
        list[i] = { "id": id, "name": name, "description": description, "color": color, "img": img, "price": price, "type": type };
    }
    console.log(JSON.stringify(list));
}