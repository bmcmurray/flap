describe("Flap", function() {

  beforeEach(function() {
    var body = document.getElementsByTagName('body')[0];

    var oldTest = document.getElementById('test');
    if (oldTest) {
      body.removeChild(oldTest);
    }
    var testNode = document.createElement('div');
    testNode.setAttribute('id', 'test');

    body.appendChild(testNode);
  });

  afterEach(function() {
    var body = document.getElementsByTagName('body')[0];
    body.removeChild(document.getElementById('test'));
  });

  it("should be present in the global namespace", function() {
    expect(Flap).toBeDefined();
  });

  it("should create a display when created", function() {
    var test = new Flap('test', {});

    expect(test).toBeDefined();
  });

  it("should expand its width based on its initial length", function() {
    var params = {length: 1};
    var test = new Flap('test', params);

    expect(test._paper.width).toBe(30);

    var params2 = {length: 5};
    var test2 = new Flap('test', params2);

    expect(test2._paper.width).toBe( (5*35) - 5 );

    var params3 = {text: 'hello, world'};
    var test3 = new Flap('test', params3);

    expect(test3._paper.width).toBe(params.text.length*35 -5);
  });

  it("should not allow text longer than its width", function() {
    var params = {length: 5};
    var test = new Flap('test', params);

    test.text('too long');
    expect(test.text()).toBe('');
  });
});