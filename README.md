# SimWrapper Python Tools

Official python library for working with SimWrapper.

[SimWrapper](https://simwrapper.github.io) is a data visualization tool for exploring large transport simulation results.

## About this library

This library contains the "simwrapper" command-line tool, which allows browsing of local files on your PC/laptop using the SimWrapper website.

We are at the very early stages of building this tool. The API will change, things will break, and there are certainly bugs.

- Our primary goal is to make it easy to get local simulation results viewable using the SimWrapper website.
- We have only tested this using Anaconda Python. Only Python 3.x is supported.

## Installation

Install once, using `pip install simwrapper`

## Usage

`simwrapper` knows two commands:

- `simwrapper serve` starts a local file server in the current directory. Run this command, then browse to either <https://vsp.berlin/simwrapper> or <https://activitysim.github.io/dashboard> to view your local folder outputs.

- `simwrapper open [vsp|asim]` opens a new web browser tab AND a local file server in the current directory. The site will only operate as long as you keep that local server running, so don't close the command window.
  - For the ActivitySim site, use `simwrapper open asim`
  - For the VSP MATSim site, use `simwrapper open vsp`
