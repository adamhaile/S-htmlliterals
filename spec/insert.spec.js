describe("Html::insert", function () {
    var container, container2,
        insert, insert2;

    beforeEach(function () {
        var html = document.createElement("div");
        html.appendChild(document.createTextNode("before"));
        var htmlMark = html.appendChild(document.createComment(" insert "));
        html.appendChild(document.createTextNode("after"));
        var html2 = document.createElement("div");
        html2.appendChild(document.createTextNode("before"));
        var html2Mark = html2.appendChild(document.createComment(" insert "));
        html2.appendChild(document.createTextNode("after"));

        container = html;
        container2 = html2;
        insert = S.data(null);
        insert2 = S.data(null);

        S.root(function () {
            S(function (state) { 
                Html.insert(htmlMark, insert, state); 
            });
            S(function (state) { 
                Html.insert(html2Mark, insert2, state); 
            });
        });
    });

    it("can insert and remove a node", function () {
        var node = document.createElement("span");
        node.innerText = "foo";

        insert(node);
        expect(container.innerHTML).toBe("before<span>foo</span><!-- insert -->after");
        insert(null);
        expect(container.innerHTML).toBe("before<!-- insert -->after");
        insert(node);
        expect(container.innerHTML).toBe("before<span>foo</span><!-- insert -->after");
    });

    it("can move a node", function () {
        var node = document.createElement("span");
        node.innerText = "foo";

        insert(node);
        expect(container.innerHTML).toBe("before<span>foo</span><!-- insert -->after");
        expect(container2.innerHTML).toBe("before<!-- insert -->after");
        insert2(node);
        expect(container.innerHTML).toBe("before<!-- insert -->after");
        expect(container2.innerHTML).toBe("before<span>foo</span><!-- insert -->after");
    });

    it("can insert and remove a fragment", function () {
        // <span>foo</span>inside<span>bar</span>
        var frag = document.createDocumentFragment();
        var span1 = document.createElement("span");
        span1.innerText = "foo";
        frag.appendChild(span1);
        frag.appendChild(document.createTextNode("inside"));
        var span2 = document.createElement("span");
        span2.innerText = "bar";
        frag.appendChild(span2);
        frag.originalNodes = Array.prototype.slice.apply(frag.childNodes);

        insert(frag);
        expect(container.innerHTML).toBe("before<span>foo</span>inside<span>bar</span><!-- insert -->after");
        insert(null);
        expect(container.innerHTML).toBe("before<!-- insert -->after");
        insert(frag);
        expect(container.innerHTML).toBe("before<span>foo</span>inside<span>bar</span><!-- insert -->after");
    });

    it("can move a fragment", function () {
        // <span>foo</span>inside<span>bar</span>
        var frag = document.createDocumentFragment();
        var span1 = document.createElement("span");
        span1.innerText = "foo";
        frag.appendChild(span1);
        frag.appendChild(document.createTextNode("inside"));
        var span2 = document.createElement("span");
        span2.innerText = "bar";
        frag.appendChild(span2);
        frag.originalNodes = Array.prototype.slice.apply(frag.childNodes);

        insert(frag);
        expect(container.innerHTML).toBe("before<span>foo</span>inside<span>bar</span><!-- insert -->after");
        expect(container2.innerHTML).toBe("before<!-- insert -->after");
        insert2(frag);
        expect(container.innerHTML).toBe("before<!-- insert -->after");
        expect(container2.innerHTML).toBe("before<span>foo</span>inside<span>bar</span><!-- insert -->after");
    });

    /*
    it("can re-insert a node, thereby moving it", function () {
        var node = new Html("<span>foo</span>", 7),
            first = insert(node),
            second = insert(node);

            expect(first.innerHTML)
            .toBe("before<!-- insert -->after");
            expect(second.innerHTML)
            .toBe("before<span>foo</span><!-- insert -->after");
    });
    
    it("can insert a fragment", function () {
        expect(insert(new Html("<span>foo</span>inside<span>bar</span>", 8)).innerHTML)
        .toBe("before<span>foo</span>inside<span>bar</span><!-- insert -->after");
    });

    it("can remove an inserted fragment", function () {
        var frag = new Html("<span>foo</span>inside<span>bar</span>", 9),
            first = insert(frag),
            second = insert(frag);

            expect(first.innerHTML)
            .toBe("before<!-- insert -->after");
            expect(second.innerHTML)
            .toBe("before<span>foo</span>inside<span>bar</span><!-- insert -->after");
    });

    it("can move a fragment, thereby removing it form the initial location", function () {
        var frag = new Html("<span>foo</span>inside<span>bar</span>", 10),
            first = insert(frag),
            second = insert(frag);

            expect(first.innerHTML)
            .toBe("before<!-- insert -->after");
            expect(second.innerHTML)
            .toBe("before<span>foo</span>inside<span>bar</span><!-- insert -->after");
    });

    it("can insert an array of strings, which will be separated by spaces", function () {
        expect(insert(["foo", "bar"]).innerHTML)
        .toBe( "beforefoo bar<!-- insert -->after", "array of strings");
    });

    it("can insert an array of nodes", function () {
        expect(insert([new Html("<span>foo</span>", 11), new Html("<div>bar</div>", 12)]).innerHTML)
        .toBe("before<span>foo</span><div>bar</div><!-- insert -->after");
    });

    it("can (currently) insert nested arrays", function () {
        // should we support this?
        expect(insert(["foo", ["bar", "blech"]]).innerHTML)
        .toBe("beforefoo bar blech<!-- insert -->after", "array of array of strings");
    });
    */
});
