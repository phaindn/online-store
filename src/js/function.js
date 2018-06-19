var db = JSON.parse(ajaxGetData("datajson/itemList.json"));
var templateItemBuy = { id: "sm06", color: "red", number: 1 };
var templateItem = { "id": "", "name": "", "description": "", "color": [], "img": [], "price": [], "type": [] };
var categoriesList = JSON.parse(ajaxGetData("datajson/categories.json"));
var cartList = {
    counter: 0,
    total: 0,
    items: [],
    indexOf: function(id, color) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].id == id && this.items[i].color == color)
                return i;
        }
        return -1;
    },
    remove: function(id, color) {
        var index = this.indexOf(id, color);
        // console.log("In cartList.remove: " + [id, color, index].join(" - "));
        this.total -= this.items[index].number * db[getItemIndex(id)].price[getColorIndex(id, color)];
        var num = this.items[index].number;
        // console.log("Before: " + this.counter + "; Type: " + typeof(this.counter));
        this.counter -= parseInt(this.items[index].number);
        // console.log("After: " + this.counter + "; Type: " + typeof(this.counter));
        for (var i = index; i < this.items.length; i++)
            this.items[i] = this.items[i + 1];
        this.items.pop();
        return num;
    }
};
var resultDb = {
    itemCount: 0,
    currentItems: 0,
    items: [],
    reset: function() {
        this.itemCount = 0;
        this.items = [];
        this.currentItems = 0;
    }
};

$(document).ready(function() {
    $(".dropdown").dropdown();
    $('.flexdatalist').flexdatalist();
    $('.checkbox').checkbox();
    $('.ui.sticky').sticky();
    $('#hiddenModal').modal();
    $("#cartCount>button")
        .popup({
            inline: true,
            on: 'click',
            position: 'bottom center',
            delay: {
                show: 300,
                hide: 400
            }
        });
    $('.list .master.checkbox')
        .checkbox({
            onChecked: function() {
                var $childCheckbox = $(this).closest('.checkbox').siblings('.list').find('.checkbox');
                $childCheckbox.checkbox('check');
            },
            onUnchecked: function() {
                var $childCheckbox = $(this).closest('.checkbox').siblings('.list').find('.checkbox');
                $childCheckbox.checkbox('uncheck');
            }
        });
    $('.list .child.checkbox')
        .checkbox({
            fireOnInit: true,
            onChange: function() {
                var $listGroup = $(this).closest('.list'),
                    $parentCheckbox = $listGroup.closest('.item').children('.checkbox'),
                    $checkbox = $listGroup.find('.checkbox'),
                    allChecked = true,
                    allUnchecked = true;
                $checkbox.each(function() {
                    if ($(this).checkbox('is checked')) {
                        allUnchecked = false;
                    } else {
                        allChecked = false;
                    }
                });
                if (allChecked) {
                    $parentCheckbox.checkbox('set checked');
                } else if (allUnchecked) {
                    $parentCheckbox.checkbox('set unchecked');
                } else {
                    $parentCheckbox.checkbox('set indeterminate');
                }
            }
        });
    cartToggle();
});

function cartToggle() {
    if (cartList.counter > 0) {
        checkOut.classList.remove("disabled");
        $("#inCart").html("");
    } else {
        checkOut.classList.add("disabled");
        cart.total = parseFloat(0).toFixed(6);
        cartList.total = 0;
        $("#inCart").html("<h4 class='ui header'>You have nothing in your cart.</h4>");
    }
}

function getItemIndex(id) {
    for (var i = 0; i < db.length; i++)
        if (db[i].id == id) return i;
    return -1;
}

function getColorIndex(id, color) {
    var arrIndex = getItemIndex(id);
    for (var i = 0; i < db[arrIndex].color.length; i++)
        if (db[arrIndex].color[i] == color) return i;
    return -1;
}


function changeColor(elem) {
    var grand = elem.parent().parent().parent();
    var color = elem.attr("data-color");
    grand.attr("data-color", color);
    var id = grand.attr("data-id");
    var x = elem.parent().children("a.ui.dot");
    var y = [];
    for (var i = 0; i < x.length; i++)
        y[i] = x[i];
    y.forEach(element => {
        if (element.classList.contains("active"))
            element.classList.remove("active");
    });
    var src = db[getItemIndex(id)].img[getColorIndex(id, color)];
    var newSrc = "src/images/shop/" + src;
    grand.children("div.image").children("img").attr("src", newSrc);
    var price = db[getItemIndex(id)].price[getColorIndex(id, color)];
    grand.children("div.overlay").children("div:first-child").children("div.label").children("i").children("b").text(price);
    elem[0].classList.add("active");
}

function innerContent(item, index) {
    var color = item.color[index];
    var id = item.id;
    var img = item.img[index];
    var header = item.name;
    var description = item.description;
    var price = item.price[index];
    var outerContent = '<div class="card" data-color="' + color + '" data-id="' + id + '">' + '</div>';
    var colorPickerInnerHtml = "";
    for (var i in item.color) {
        if (i == 0)
            colorPickerInnerHtml += '<a class="ui ' + item.color[i] + ' active dot" data-color="' + item.color[i] + '" onclick="changeColor($(this))"></a>';
        else colorPickerInnerHtml += '<a class="ui ' + item.color[i] + ' dot" data-color="' + item.color[i] + '" onclick="changeColor($(this))"></a>';
    }
    var html = '<div class="image">' +
        '    <img src="src/images/shop/' + img + '" alt="">' +
        '</div>' +
        '<div class="content">' +
        '    <h4 class="ui header">' + header + '</h4>' +
        '<div class="ui color picker middle aligned">' +
        '                                    <h5 class="ui inline header">Color: </h5>' + colorPickerInnerHtml +
        '                        </div>' +

        '    <div class="description">' +
        '        <p class="ui red text">' + description + '</p>' +
        '    </div>' +
        '</div>' +
        '<div class="overlay">' +
        '    <div class="left floated middle aligned">' +
        '        <div class="ui compact grey label">' +
        '            <i class="yellow bitcoin icon">' +
        '                <b class="ui yellow relaxed">' + price + '</b>' +
        '            </i>' +
        '        </div>' +
        '    </div>' +
        '    <div class="right floated middle aligned">' +
        '        <div class="ui fluid red button label" onclick="addToCart($(this))">' +
        '            <i class="cart plus icon"></i>Add to cart' +
        '        </div>' +
        '    </div>' +
        '</div>';
    return (html);
}

function addItem(indexId, indexColor) {
    var randomElem = Math.floor((Math.random() * db.length));
    var parent = $("div.ui.three.stackable.cards");
    var child = document.createElement("div");
    var attId = document.createAttribute("data-id");
    attId.value = db[indexId].id;
    var attColor = document.createAttribute("data-color");
    attColor.value = db[indexId].color[indexColor];
    var attClass = document.createAttribute("class");
    attClass.value = "card";
    child.setAttributeNode(attClass);
    child.setAttributeNode(attId);
    child.setAttributeNode(attColor);
    child.innerHTML = innerContent(db[indexId], indexColor);
    $(parent).append(child);
}

function searchItem() {
    var input = $("#searchInput").val();
    var type = $("#searchType").val();
    window.location.hash = "/search?q=" + input + ";ca=" + type + ";";
    searchFor(input, type);
}

function searchFor(input, type) {
    searchResult.show = true;
    if (type == "All") type = "";
    $("div.ui.three.stackable.cards").html("");
    searchResult.counter = 0;
    resultDb.reset();
    for (var i = 0; i < db.length; i++) {
        if (db[i].type.toString().indexOf(type) >= 0) {
            if (db[i].name.indexOf(input) >= 0 || db[i].description.indexOf(input) >= 0) {
                if (resultDb.items.indexOf(db[i].id) < 0) {
                    resultDb.items[resultDb.itemCount] = db[i].id;
                    resultDb.itemCount++;
                    searchResult.counter++;
                    if (searchResult.counter <= 30) {
                        resultDb.currentItems++;
                        addItem(i, 0);
                    }
                }
            }
        }
    }
    if (resultDb.itemCount > resultDb.currentItems) appView.show = true;
    else appView.show = false;
}

function filter() {
    $("div.ui.three.stackable.cards").html("");
    var filterCat = [];
    document.querySelectorAll('#categoryL :checked').forEach(function(elem) {
        filterCat[filterCat.length] = elem.value;
    });
    if (filterCat.length > 0)
        filterArr(filterCat);
    else {
        window.location.hash = "";
        loadRequest();
    }

}

function filterArr(filterCat) {
    searchResult.show = true;
    searchResult.counter = 0;
    resultDb.reset();
    if (filterCat[0] != "All")
        filterCat.forEach(function(val) {
            for (var i = 0; i < db.length; i++) {
                if (db[i].type.toString().indexOf(val) >= 0) {
                    if (resultDb.items.indexOf(db[i].id) < 0) {
                        resultDb.items[resultDb.itemCount] = db[i].id;
                        resultDb.itemCount++;
                        searchResult.counter++;
                        if (searchResult.counter <= 30) {
                            resultDb.currentItems++;
                            addItem(i, 0);
                        }
                    }
                }
            }
        });
    else {
        filterCat = ["All"];
        for (var i = 0; i < db.length; i++) {
            if (db[i].type.toString().indexOf("") >= 0) {
                if (resultDb.items.indexOf(db[i].id) < 0) {
                    resultDb.items[resultDb.itemCount] = db[i].id;
                    resultDb.itemCount++;
                    searchResult.counter++;
                    if (searchResult.counter <= 30) {
                        resultDb.currentItems++;
                        addItem(i, 0);
                    }
                }
            }
        }
    }
    if (resultDb.itemCount > resultDb.currentItems) appView.show = true;
    else appView.show = false;
    window.location.hash = "/filter?q=" + filterCat.join("-");
}

function toCartItem(id, color) {
    var img = db[getItemIndex(id)].img[getColorIndex(id, color)];
    var name = db[getItemIndex(id)].name;
    var number = cartList.items[cartList.indexOf(id, color)].number;
    var price = db[getItemIndex(id)].price[getColorIndex(id, color)];
    var html = '<div class="item" data-id="' + id + '" data-color="' + color + '">' +
        '                        <img class="ui tiny image" src="src/images/shop/' + img + '" style="max-width:100%">' +
        '                        <div class="content">' +
        '                            <a class="header">' + name + '</a>' +
        '                            <div class="description">' +
        '                                <div class="very relaxed header">Color: ' +
        '                                   <b style="color: ' + color + '">' + color + '</b>' +
        '                               </div>' +
        '                                <div class="header">Quantity:' +
        '                                    <div class="ui small basic icon buttons">' +
        '                                        <button class="ui button" onclick="decrease($(this))">' +
        '                                           <i class="left chevron icon"></i></button>' +
        '                                        <button class="ui disabled button quantity">' + number + '</button>' +
        '                                        <button class="ui button" onclick="increase($(this))">' +
        '                                           <i class="right chevron icon"></i></button>' +
        '                                    </div>' +
        '                                </div>' +
        '                            </div>' +
        '                        </div>' +
        '                        <div class="right floated content">' +
        '                            <div class="ui small yellow basic label">' +
        '                                <i class="ui bitcoin icon"></i>' + price +
        '                            </div>' +
        '                            <br>' +
        '                            <a class="ui small red basic label" onclick="removeFromCart($(this))">' +
        '                                <i class="ui cut icon"></i> Delete</a>' +
        '                        </div>' +
        '                    </div>';
    return html;
}


function addToCart(elem) {
    var grand = elem.parent().parent().parent();
    var Id = grand.attr("data-id");
    var Color = grand.attr("data-color");
    var item = { id: Id, color: Color, number: 1 };
    cartList.counter++;
    cart.counter = cartList.counter;
    if (cartList.total <= 0) {
        cartToggle();
        console.warn("Toggle");
    }
    if (cartList.indexOf(Id, Color) >= 0) {
        var index = cartList.indexOf(Id, Color);
        cartList.items[index].number += 1;
        var selector = '[data-id="' + Id + '"][data-color="' + Color + '"]';
        $("#inCart").find(selector).find('.quantity').text(cartList.items[index].number);
    } else {
        cartList.items[cartList.items.length] = item;
        var innerHTML = $("#inCart").html();
        innerHTML += toCartItem(Id, Color);
        $("#inCart").html(innerHTML);
    }
    cartList.total += 1 * db[getItemIndex(Id)].price[getColorIndex(Id, Color)];
    cart.total = cartList.total.toFixed(6);
}

function removeFromCart(elem) {
    var grand = elem.parent().parent();
    if (grand.attr("data-id") == undefined)
        grand = elem.closest("div.item[data-id]");
    var Id = grand.attr("data-id");
    var Color = grand.attr("data-color");
    // console.log("In removeFromCart: " + Id + " - " + Color);
    var decAmount = cartList.remove(Id, Color);
    cart.counter = cartList.counter;
    cart.total = cartList.total.toFixed(6);
    grand.html("");
    grand.hide();
    grand.attr("data-id", null);
    grand.attr("data-color", null);
    if (cartList.counter == 0) cartToggle();
}

function decrease(elem) {
    var grand = elem.closest(".item");
    var Id = grand.attr("data-id");
    var Color = grand.attr("data-color");
    var index = cartList.indexOf(Id, Color);

    if (cartList.items[index].number > 1) {
        cartList.items[index].number--;
        cartList.counter--;
        cartList.total -= (db[getItemIndex(Id)].price[getColorIndex(Id, Color)]);
        var selector = '[data-id="' + Id + '"][data-color="' + Color + '"]';
        $("#inCart").find(selector).find('.quantity').text(cartList.items[index].number);
    } else {
        removeFromCart(elem);
        console.warn("Remove called");
    }

    if (cartList.counter == 0) {
        cartToggle();
    }
    cart.total = cartList.total.toFixed(6);
    cart.counter = cartList.counter;
}

function increase(elem) {
    var grand = elem.closest(".item");
    var Id = grand.attr("data-id");
    var Color = grand.attr("data-color");
    var index = cartList.indexOf(Id, Color);
    cartList.items[index].number++;
    cartList.counter++;
    cart.counter = cartList.counter;
    cartList.total -= -(db[getItemIndex(Id)].price[getColorIndex(Id, Color)]);
    cart.total = cartList.total.toFixed(6);
    var selector = '[data-id="' + Id + '"][data-color="' + Color + '"]';
    $("#inCart").find(selector).find('.quantity').text(cartList.items[index].number);
}

function showModal() {
    $('.flexdatalist').flexdatalist();
    $(".dropdown").dropdown();
    $('.checkbox').checkbox({});
    $('#hiddenModal').modal('show');
}

function viewMore() {
    var count = 0;
    var pos = resultDb.currentItems;
    for (var i = pos; i < resultDb.itemCount; i++) {
        addItem(getItemIndex(resultDb.items[i]), 0);
        resultDb.currentItems++;
        count++;
        if (count == 30) break;
    }
    if (resultDb.currentItems >= resultDb.itemCount)
        appView.show = false;

}

function loadState() {
    var state = $("#State").val();
    var townList = $("#townList");
    var townData = [];
    var data = [];

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            for (var i = 0; i < data.length; i++) {
                if (data[i].name === state) {
                    townData = data[i].district;
                }
            }
            townList.html("");
            var innerHTML = "";
            for (var i = 0; i < townData.length; i++) {
                innerHTML += '<option value="' + townData[i] + '"> ' + townData[i] + ' </option>' + '\n';
            }
            townList.html(innerHTML);
        }
    };
    xhttp.open("GET", "datajson/vietnam.json", true);
    xhttp.send();
}

function loadRequest() {
    var req = window.location.hash;
    if (req.indexOf("search?") >= 0) {
        var q = req.slice(req.indexOf("q=") + 2, req.indexOf(";"));
        var ca = req.slice(req.indexOf("ca=") + 3, req.lastIndexOf(";"));
        searchResult.show = true;
        // console.log(q + ";" + ca);
        searchFor(q, ca);
    } else if (req.indexOf("filter?") >= 0) {
        var filterQuery = req.slice(req.indexOf("filter?q=") + 9, req.length);
        var filterCat = filterQuery.split("-");
        filterArr(filterCat);
    } else {
        searchResult.show = false;
        for (var i = 0; i < 9; i++)
            addItem(i, 0);
    }
}

function readCookie() {
    var cookie = document.cookie;
    var oldCart = JSON.parse(cookie.slice(0, cookie.indexOf(";")));
    cartList.counter = oldCart.counter;
    cartList.items = oldCart.items;
    cartList.total = oldCart.total;
}


function changeContent(selector, stream) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            $(selector).html(this.responseText);
        }
    };
    xhttp.open("GET", stream, true);
    xhttp.send();

}

function homepage() {
    window.location.hash = "";
    $('#categoryL :checked').toArray().forEach(function(elem) {
        elem.checked = false;
    });
    $(".ui.master.checkbox").checkbox('set determinate');
    searchInput.value = "";
    searchType.value = "";
    $(".ui.three.stackable.cards").html("");
    resultDb.reset();
    searchResult.reset();
    appView.show = false;
    loadRequest();
}

function ajaxGetData(stream) {
    try {
        var xhttp = new XMLHttpRequest();
        var result = "";
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                result = this.responseText;
            }
        };
        xhttp.open("GET", stream, false);
        xhttp.send();
        return result;
    } catch (err) {
        console.error(err.msg);
        return ("");
    }
}