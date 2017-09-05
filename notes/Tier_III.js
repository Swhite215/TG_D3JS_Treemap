//Task List 08/24/2017
// 1. Create Larger Data Set, about 2000 - PYTHON
// 2. Within the data set use all tags and as many LMA's as possible.
// 3. Consolidate Tags Accurately and Implement this data object in current D3JS Project.



/*STEP ONE

1. Grab the JSON data object from the json file
2. Create a data variable that is a nested object.
3. Call the main function and pass two objects.
    -The first object contains a key:value pair denoting the title of the Graph.
    -The second object contains a key:value pair denoting the name of what is being meausured
    -Also contains a key:value pair where values holds DATA - an array of 6 Region Objects
    -Each Region Object has a values property that has an array of LMA objects
    -Each LMMA Object has a values property that has an array of Dealer objects
    -Each Dealer Object has a values property that has an array of our made tag objects
    -Each tag object has a values property that has an a value corresponding to a total conversion count.

*/

/* STEP TWO

1. Main passes two parameters, the first is a title object, the second is your nested data object.
2. You generate multiple variables when running main.
  var root
  var opts = combined object of your title object and your degaults object where you defined defaults of the graph.
  var formatNumber = format for rounding the number to an integer i.e. Total Conversions should be whole numbers.
  var rname = holding name for the graph if data comes in the from of an array.
  var margin = a margin object of the acceptable margin values when making the graph.
  var theight = random numbers that are removed from height.

  3. Grab the #chart element and give it a width and height based on my options object.
    Width is my width minus the margins I want, height is my height minus the margins and theight.
    Declare a boolean transitioning variable.

  4. Using d3 create a color scale.

  5. Using d3, create a 1:1 mapping scale for domain of width to range of width in pixels.
  6. Using d3, create a 1:! mapping scale for domain of height to range of height in pixels.
  7. using d3, create the treemap, sort something, create a ratio of the each leaf of the treemap, and don't round the numbers.

*/

/* STEP THREE

1. var svg stores a d3 selecltion of your chart where you append an svg, give it a width, height, and margin styling based ono default object.
2. Append a g element for grouping purposes on the svg.
3. var grandparent holds a d3 selection for chart, adds class to group of grandparent.
4. Appends svg rectangle to grandparent, gives it width of svg, height of margin top area, and y position is starts at bottom of margin change.
5. Appends text element to grandparent, positions distance from left, and y distance from top. and dy changes y positioning to be slightly lower given text.
6. Checks if opts has a title, if so it prepends a paragraph tag before the chart containing the title.
7. Checks, if an array it then sets up an object with key of your default title and sets the values property equal to your array of data (objects).

*/

/* STEP FOUR

1. intialize sets the initial parameters of your root object i.e. your data structure.
2. Accumulate
*/
