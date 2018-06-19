**1. Left filter side-bar**
    ***Template***
        **Main categories 1**
            +|***Sub categories 1***
            +|***Sub categories 2***
            +|***Sub categories 3***
        **Main categories 2**
            +|***Sub categories 1***
            +|***Sub categories 2***
            +|***Sub categories 3***
        **Main categories 3**
            +|***Sub categories 1***
            +|***Sub categories 2***
            +|***Sub categories 3***
    ***Function***
        'onchange =' 
        ```javascript
        function filter(categoriesList[]) {
            var resultCounter = 0;
            var resultList = [];
            for (var i = 0; i < db.length; i++) {
                categoriesList.forEach(elem => {
                    if (db[i].type.join(",").indexOf(elem)>=0 && resultList[i] != resultList[i-1]) {
                        resultList[0] = db[i].id;
                        resultList++;
                    }
                })
            }
            for (var i in resultList) {
                addItem(resultList[i], 0);
            }
        }
        ```
**2. Pagination menu**
**3. View cart**
**4. Checkout**
    ***Already have form to check out***
    ***From given***