
# OMSCS Spring 2016 8803-1 Final Project

## Getting Started

Once [Node](https://nodejs.org/en/download/) is installed in your system:

```
$ git clone https://github.gatech.edu/mbajin3/gt-omscs-spring-2016-8803-1.git
$ cd gt-omscs-spring-2016-8803-1
$ npm install
$ npm start
```

Then, navigate to `http://localhost:8080/` in your browser.

## Usage

1. Select a file from the sidebar.
2. Click Draw to begin drawing. Note: One point is drawn every 50ms (20fps), which is slower than the videos.
3. Click Pause as desired.
4. Move the slider around as desired.
5. Reset becomes enabled when the slider reaches the end of the data set.

## Data Filtering

Any point whose x or y coordinate is below 0.1 percentile or above 99.9 percentile is discarded.

## Corners

The minimum and maximum of the x/y dimensions are used to calculate the coordinates of the corners.

## Candle Position

The candle is not perfectly centered; its position is estimated as follows:

```
x = floor((x_max + x_min) / 2) + 12
y = floor((y_max + y_min))
```

TODO: Determine best fit programmatically from data.
