data = [
  {'name' : 'Post 1', '0' : 'tag_a', '1' : 'tag_b'},
  {'name' : 'Post 2', '0' : 'tag_a', '1' : 'tag_c'}
];

data = d3.nest()
  .key(function(d) { return d['0']; })
  .key(function(d) { return d['1']; })
  .entries(data);


// The result is a hierarchical nest of data objects. Each branch node has a key property specifying the name of the branch, and a values property specifying one or more child nodes.

// Leaf nodes contain the original keys and values for each data item that was passed to the nest method.


[
  {
  "key": "tag_a",
  "values": [
    {
    "key": "tag_b",
    "values": [
      {
      "0": "tag_a",
      "1": "tag_b",
      "name": "Post 1"
      }
    ]
    },
    {
    "key": "tag_c",
    "values": [
      {
      "0": "tag_a",
      "1": "tag_c",
      "name": "Post 2"
      }
    ]
    }
  ]
  }
]


data = [{
    'name': 'Post 1',
    '0': 'tag_a',
    '1': 'tag_b'
  },
  {
    'name': 'Post 3',
    '0': 'tag_a',
    '1': 'tag_c',
    '2': 'tag_b'
  }
];
