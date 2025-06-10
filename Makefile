# --------------------------------------------------
# standard Makefile preamble
# see https://tech.davis-hansson.com/p/make/
SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules
# Gnu Make 4.0+ only
ifeq ($(origin .RECIPEPREFIX), undefined)
  $(error Your Make does not support .RECIPEPREFIX. Please use GNU Make 4.0 or later)
endif
.RECIPEPREFIX = >
# --------------------------------------------------

build: .build-sentinel

clean:
> rm -rf build
> rm -rf dist
> rm -f  .build-sentinel
.PHONY: clean

test:
> pytest tests/
.PHONY: test

#push: test build
push: build
> twine check dist/*
> twine upload dist/*
.PHONY: push

version:
> npx standard-version
.PHONY: version

#.build-sentinel: $(shell find simwrapper/*.py) $(shell find docs/*) README.md setup.py
.build-sentinel: $(shell find simwrapper/*.py) VERSION README.md setup.py
> rm -rf dist
> python3 setup.py sdist bdist_wheel
> twine check dist/*
> touch $@

