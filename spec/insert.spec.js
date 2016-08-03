describe("Html::insert", function () {
    var container, container2,
        insert, insert2;

    beforeEach(function () {
        var html = new Html("<div>before<!-- insert -->after</div>"),
            html2 = new Html("<div>before<!-- insert -->after</div>");

        container = html.node;
        container2 = html2.node;
        insert = S.data(null);
        insert2 = S.data(null);

        html.child([1], function (__) { 
            __[0].insert(insert); 
        });
        html2.child([1], function (__) { 
            __[0].insert(insert2); 
        });
    });

    it("can insert and remove a node", function () {
        var node = new Html("<span>foo</span>").node;
        insert(node);
        expect(container.innerHTML).toBe("before<span>foo</span><!-- insert -->after");
        insert(null);
        expect(container.innerHTML).toBe("before<!-- insert -->after");
        insert(node);
        expect(container.innerHTML).toBe("before<span>foo</span><!-- insert -->after");
    });

    it("can move a node", function () {
        var node = new Html("<span>foo</span>").node;
        insert(node);
        expect(container.innerHTML).toBe("before<span>foo</span><!-- insert -->after");
        expect(container2.innerHTML).toBe("before<!-- insert -->after");
        insert2(node);
        expect(container.innerHTML).toBe("before<!-- insert -->after");
        expect(container2.innerHTML).toBe("before<span>foo</span><!-- insert -->after");
    });

    it("can insert and remove a fragment", function () {
        var frag = new Html("<span>foo</span>inside<span>bar</span>").node;
        insert(frag);
        expect(container.innerHTML).toBe("before<span>foo</span>inside<span>bar</span><!-- insert -->after");
        insert(null);
        expect(container.innerHTML).toBe("before<!-- insert -->after");
        insert(frag);
        expect(container.innerHTML).toBe("before<span>foo</span>inside<span>bar</span><!-- insert -->after");
    });

    it("can move a fragment", function () {
        var frag = new Html("<span>foo</span>inside<span>bar</span>").node;
        insert(frag);
        expect(container.innerHTML).toBe("before<span>foo</span>inside<span>bar</span><!-- insert -->after");
        expect(container2.innerHTML).toBe("before<!-- insert -->after");
        insert2(frag);
        expect(container.innerHTML).toBe("before<!-- insert -->after");
        expect(container2.innerHTML).toBe("before<span>foo</span>inside<span>bar</span><!-- insert -->after");
    });

    /*
    it("can re-insert a node, thereby moving it", function () {
        var node = new Html("<span>foo</span>").node,
            first = insert(node),
            second = insert(node);

            expect(first.innerHTML)
            .toBe("before<!-- insert -->after");
            expect(second.innerHTML)
            .toBe("before<span>foo</span><!-- insert -->after");
    });

    it("can insert a fragment", function () {
        expect(insert(new Html("<span>foo</span>inside<span>bar</span>").node).innerHTML)
        .toBe("before<span>foo</span>inside<span>bar</span><!-- insert -->after");
    });

    it("can remove an inserted fragment", function () {
        var frag = new Html("<span>foo</span>inside<span>bar</span>").node,
            first = insert(frag),
            second = insert(frag);

            expect(first.innerHTML)
            .toBe("before<!-- insert -->after");
            expect(second.innerHTML)
            .toBe("before<span>foo</span>inside<span>bar</span><!-- insert -->after");
    });

    it("can move a fragment, thereby removing it form the initial location", function () {
        var frag = new Html("<span>foo</span>inside<span>bar</span>").node,
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
        expect(insert([new Html("<span>foo</span>").node, new Html("<div>bar</div>").node]).innerHTML)
        .toBe("before<span>foo</span><div>bar</div><!-- insert -->after");
    });

    it("can (currently) insert nested arrays", function () {
        // should we support this?
        expect(insert(["foo", ["bar", "blech"]]).innerHTML)
        .toBe("beforefoo bar blech<!-- insert -->after", "array of array of strings");
    });
    */
});
