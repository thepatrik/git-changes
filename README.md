# git-changes

[![Build Status](https://travis-ci.org/thepatrik/git-changes.svg?branch=master)](https://travis-ci.org/thepatrik/git-changes)

A small tool for getting a changelog from a git repo.

## Usage

Install git-changes from npm globally on your system, which allows you to run it from anywhere.

```console
$ npm install -g git-changes
```

Usage description

```
Usage: git-changes [--dir=<git-directory>] [--output=<output_filename>] [--since=<git-tag>] [--to==<git-tag>]
```

### Examples

Write changes from the latest relase to file

```console
$ git-changes --output=changelog
```

Get changes between releases

```console
$ git-changes --since=v1.0.22 --to=v1.0.25
```

Get changes since a specific git tag, residing in some other directory

```console
$ git-changes --since=v1.0.10 --dir=/Users/User/git-repo
```
