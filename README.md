# SimWrapper Python Tools

Official python library for working with SimWrapper.

[SimWrapper](https://simwrapper.github.io) is a data visualization tool for exploring large transport simulation results.

## About this library

This library contains the "simwrapper" command-line tool, which allows browsing of local files on your PC/laptop using the SimWrapper website.

We are at the very early stages of building this tool. The API will change, things will break, and there are certainly bugs.

- Our primary goal is to make it easy to get local simulation results viewable using the SimWrapper website.
- We have only tested this using Anaconda Python. Only Python 3.x is supported.

## Quickstart

1. Install once, using `pip install simwrapper`

2. `cd` into your data folder, then run `simwrapper serve` to enable the local file server

3. Browse to either <https://vsp.berlin/simwrapper> or <https://activitysim.github.io/dashboard> to view your local folder outputs.
