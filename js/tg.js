var shadowRoot;
var shadowDealers = [];
var shadowData = {};

function main(o, data) {
  var root,
      opts = $.extend(true, {}, defaults, o),
      formatNumber = d3.format(opts.format),
      formatPercentage = d3.format(",.2f"),
      rname = opts.rootname,
      margin = opts.margin,
      theight = 36 + 16;

  $('#chart').width(opts.width).height(opts.height);
  var width = opts.width - margin.left - margin.right,
      height = opts.height - margin.top - margin.bottom - theight,
      transitioning;


  // var color = d3.scale.category20c();
  var color = function() {
    var randomColors = ['#191919']
    var index = Math.floor(randomColors.length * Math.random());

    return randomColors[index];
  }

  var x = d3.scale.linear()
      .domain([0, width])
      .range([0, width]);

  var y = d3.scale.linear()
      .domain([0, height])
      .range([0, height]);

  var treemap = d3.layout.treemap()
      .children(function(d, depth) { return depth ? null : d._children; })
      .sort(function(a, b) { return a.value - b.value; })
      .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
      .round(false);

  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .style("margin-left", -margin.left + "px")
      .style("margin.right", -margin.right + "px")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .style("shape-rendering", "crispEdges");

  var grandparent = svg.append("g")
      .attr("class", "grandparent");

  grandparent.append("rect")
      .attr("y", -margin.top)
      .attr("width", width)
      .attr("height", margin.top);

  grandparent.append("text")
      .attr("x", 6)
      .attr("y", 6 - margin.top)
      .attr("dy", ".75em");

  if (opts.title) {
    $("#chart").prepend("<p class='title'>" + opts.title + "</p>");
  }

  if (data instanceof Array) {
    root = { key: rname, values: data };
  } else {
    root = data;
    practice = root;
  }

  function initialize(root) {
    root.x = root.y = 0;
    root.dx = width;
    root.dy = height;
    root.depth = 0;
    shadowRoot = root;
  }

  // Aggregate the values for internal nodes. This is normally done by the
  // treemap layout, but not here because of our custom implementation.
  // We also take a snapshot of the original children (_children) to avoid
  // the children being overwritten when layout is computed.
  function accumulate(d) {
    return (d._children = d.values)
        ? d.value = d.values.reduce(function(p, v) { return p + accumulate(v); }, 0)
        : d.value;
  }

  // Compute the treemap layout recursively such that each group of siblings
  // uses the same size (1×1) rather than the dimensions of the parent cell.
  // This optimizes the layout for the current zoom state. Note that a wrapper
  // object is created for the parent node for each group of siblings so that
  // the parent’s dimensions are not discarded as we recurse. Since each group
  // of sibling was laid out in 1×1, we must rescale to fit using absolute
  // coordinates. This lets us use a viewport to zoom.
  function layout(d) {
    if (d._children) {
      treemap.nodes({_children: d._children});
      d._children.forEach(function(c) {
        c.x = d.x + c.x * d.dx;
        c.y = d.y + c.y * d.dy;
        c.dx *= d.dx;
        c.dy *= d.dy;
        c.parent = d;
        layout(c);
      });
    }
  }

  function display(d) {
    grandparent
        .datum(d.parent)
        .on("click", transition)
      .select("text")
        .text(name(d))
        .attr("fill", "white");

    var g1 = svg.insert("g", ".grandparent")
        .datum(d)
        .attr("class", "depth");

    var g = g1.selectAll("g")
        .data(d._children)
      .enter().append("g");

    g.filter(function(d) { return d._children || [d]; })
          .classed("children", true)
          .on("click", transition);

    var children = g.selectAll(".child")
        .data(function(d) { return d._children; })
      .enter().append("g");

    children.append("rect")
        .attr("class", "child")
        .call(rect)
      .append("title")
        .text(function(d) { return d.key + " (" + formatNumber(d.value) + ")"; });
    children.append("text")
        .attr("class", "ctext")
        .text(function(d) { return d.key; })
        .call(text2);

    g.append("rect")
        .attr("class", "parent")
        .call(rect);

    var t = g.append("text")
        .attr("class", "ptext")
        .attr("dy", ".75em")


    t.append("tspan")
        .text(function(d) { return d.key;});

    t.append("tspan")
        .attr("dy", "1.0em")
        .text(function(d) { return formatNumber(d.value); });

    if (d._children[0]._children[0].key === "Joxos") {
      g.append("image")
        .attr("src", "../images/character_joxos.JPG");
    }

    if (d._children[0]._children[0].category === "Character") {
      console.log(d);
      console.log(d._children[0].age);
      t.append("tspan")
        .attr("dy", "1.0em")
        .text(function(d) { return d._children[0].age; });

      t.append("tspan")
        .attr("dy", "1.0em")
        .text(function(d) { return d._children[0].health; });

      t.append("tspan")
        .attr("dy", "1.0em")
        .text(function(d) { return d._children[0].mana; });
    }


    //Code for displaying percentages
    // t.append("tspan")
    //     .attr("dy", "1.0em")
    //     .text(function(d) { return formatPercentage(d.parent.value/d.value) + "% " + formatNumber(d.value) + " out of " + formatNumber(d.parent.value);});

    t.call(text);

    g.selectAll("rect")
        .style("fill", function(d) { return color(d.key); });

    function transition(d) {
      // debugger;
      //Don't transition if at lowest nest depth.
      if (d._children[0]._children ===  undefined) {
        return;
      }

      if (transitioning || !d) return;
      transitioning = true;

      var g2 = display(d),
          t1 = g1.transition().duration(750),
          t2 = g2.transition().duration(750);

      //Total Conversions, », Region, », LMA, », Dealer Name
      // Update the domain only after entering new elements.
      x.domain([d.x, d.x + d.dx]);
      y.domain([d.y, d.y + d.dy]);

      // Enable anti-aliasing during the transition.
      svg.style("shape-rendering", null);

      // Draw child nodes on top of parent nodes.
      svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

      // Fade-in entering text.
      g2.selectAll("text").style("fill-opacity", 0);

      // Transition to the new view.
      t1.selectAll(".ptext").call(text).style("fill-opacity", 0);
      t1.selectAll(".ctext").call(text2).style("fill-opacity", 0);
      t2.selectAll(".ptext").call(text).style("fill-opacity", 1);
      t2.selectAll(".ctext").call(text2).style("fill-opacity", 1);
      t1.selectAll("rect").call(rect);
      t2.selectAll("rect").call(rect);

      // Remove the old node when the transition is finished.
      t1.remove().each("end", function() {
        svg.style("shape-rendering", "crispEdges");
        transitioning = false;
      });
    }

    return g;
  }

  function text(text) {
    text.selectAll("tspan")
        .attr("x", function(d) { return x(d.x) + 6; })
    text.attr("x", function(d) { return x(d.x) + 6; })
        .attr("fill", "white")
        .attr("y", function(d) { return y(d.y) + 6; })
        .style("opacity", function(d) { return this.getComputedTextLength() < x(d.x + d.dx) - x(d.x) ? 1 : 0; });

  }

  function text2(text) {
    text.attr("x", function(d) { return x(d.x + d.dx) - this.getComputedTextLength() - 6; })
        .attr("y", function(d) { return y(d.y + d.dy) - 6; })
        .attr("fill", "white")
        .style("opacity", function(d) { return this.getComputedTextLength() < x(d.x + d.dx) - x(d.x) ? 1 : 0; });
  }

  function rect(rect) {
    rect.attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y); })
        .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
        .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); });
  }

  function name(d) {
    return d.parent
        ? name(d.parent) + " » " + d.key
        : d.key + " ";
  }

  function buildDealerList() {
    shadowRoot._children.forEach(function(element) {
      var lmaArray = element._children;
      lmaArray.forEach(function(element) {
        var dealerArray = element._children;
        dealerArray.forEach(function(element) {
          var select = $(".dealers"); //OPTION 2
          var singleDealer = $("<option>").text(element.key).attr("value", element.key); //OPTION 2
          select.append(singleDealer); //OPTION 2
          shadowDealers.push(element.key); //OPTION 1
        });
      });
    });
  }

  initialize(root);
  accumulate(root);
  layout(root);
  display(root);
  buildDealerList();


  if (window.parent !== window) {
    var myheight = document.documentElement.scrollHeight || document.body.scrollHeight;
    window.parent.postMessage({height: myheight}, '*');
  }

}

var defaults = {
    margin: {top: 24, right: 0, bottom: 0, left: 0}, //Margins
    rootname: "TOP", //Default Name
    format: ",d", //Format for Numbers
    title: "", //Empty value to be filled in later.
    width: 1000, //Width of the graph
    height: 700 //Height of the graph
};

if (window.location.hash === "") {
  //Intial Ajax Request

  //Current d3.json method
    d3.json("genesis_data.json", function(err, res) {
        if (!err) {
            //Create a data variable that is a nested object.
            var data = d3.nest().key(function(d) { return d.location; }).key(function(d) { return d['category']; }).key(function(d) { return d.key; }).key(function(d) { return d.key; }).entries(res);

            shadowData = data;

            main({title: "Tranquility's Genesis"}, {key: "Game Pieces", values: data});
        }
    });
}

$(document).ready(function() {

  //Final Transiiton to Dealer View
  function dealerMove(dealer) {
    setTimeout(function() {
      for (var i = 0; i < $("g.depth > .children").length; i++) {
         var list = $("g.depth > .children")[i].childNodes;
         if (list[list.length - 1].textContent.replace(/\d|,/g, "").trim() == dealer.trim()) {

           //Click the Dealer
           $("g.depth > .children")[i].__onclick();
         }
      }
      //Clear Input Field
      $(".ui-autocomplete-input").val("");
    }, 1800);
  }

  //Transition to LMA View
  function lmaMove(lma, dealer) {
    lma = lma.replace(', ', ' ');

    setTimeout(function() {
      for (var i = 0; i < $("g.depth > .children").length; i++) {
         var list = $("g.depth > .children")[i].childNodes;
         if (list[list.length - 1].textContent.replace(/\d|,/g, "").trim() == lma) {

           //Click the LMA
           $("g.depth > .children")[i].__onclick();
         }
      }
    }, 800);
    dealerMove(dealer);
  }

  //Transiiton to Region View
  function regionMove(region, lma, dealer) {
    for (var i = 0; i < $("g.depth > .children").length; i++) {
       var list = $("g.depth > .children")[i].childNodes;
       if (list[list.length - 1].textContent.replace(/\d|,/g, "").trim() == region) {

         //Click the Region
         $("g.depth > .children")[i].__onclick();
       }
    }
    lmaMove(lma, dealer);
  }

  //Reset the Graph
  function reset() {
    d3.select("#chart").html("");
    shadowDealers = [];
    main({title: "Tier III Data"}, {key: "Total Conversions", values: shadowData});
  }

  //Set Up Auto-Complete with Dealer List
  $( "#tags" ).autocomplete({
      source: shadowDealers
  });

  //Variable to hold dealer name
  var currentDealer;

  //Grab the selected dealer from Auto-Complete
  $( ".ui-autocomplete-input" ).autocomplete({
    select: function( event, ui ) {
      currentDealer = ui.item.value;
    }
  });

  //Transition to Dealer View from Search Button - OPTION 1
  $("#goToDealer").on("click", function() {
    var region = "";
    var lma = "";
    var dealer = currentDealer;

    var regions = shadowRoot._children;

    // Searching Process
    regions.forEach(function(element) {
      var designatedMarketingArea = element._children;
      designatedMarketingArea.forEach(function(element) {
        dealers = element._children;
        dealers.forEach(function(element) {
          if (dealer === element.key) {
            lma =  element.parent.key;
            region =  element.parent.parent.key;
          }
        });
      });
    });

    //Re-draw the Treemap
    reset();
    //Run Region, LMA, and Dealer Transition
    regionMove(region, lma, dealer);
  });

  //Transition to Dealer View from Select Element - OPTION 2
  $(".dealers").on("change", function() {
    var region = "";
    var lma = "";
    var dealer = this.value;

    var regions = shadowRoot._children;

    //Searching Process Identifying Destination
    regions.forEach(function(element) {
      var designatedMarketingArea = element._children;
      designatedMarketingArea.forEach(function(element) {
        dealers = element._children;
        dealers.forEach(function(element) {
          if (dealer === element.key) {
            lma =  element.parent.key;
            region =  element.parent.parent.key;
          }
        });
      });
    });

    //Re-draw the Treemap
    reset();

    // Run Region, LMA, and Dealer Transition
    regionMove(region, lma, dealer);
  });

  //Re-draw the treemap
  $("#reset").on("click", function() {
    reset();
  });

});
