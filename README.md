# Welcome to Stagehand

## Introduction

This application is meant to ease managing your hardware synth/sequencer/whatever setup's state. You could use it to plan live gigs, document studio sessions etc.

Think of the Setups page like a big, slightly inconvenient patchbay with presets.

## Todos / Known issues

This is very much in alpha stage. Saving and loading setups seems to work, but hasn't been tested thoroughly. So edge cases might be a situated a bit more towards the center than you'd assume at first.

Aside from that, this is (part of) what needs to be done still:

* General:
  * Make app responsive
  * Port to React Native, maybe
  * Use a more robust way of handling setup, device, and other data (IndexedDB might not be the be-all-end-all)
  * Add JSON import and export to all entities
  * Make everything customizable
* Setups
  * :heavy_check_mark: Don't start with all devices on init - add a library component for managing devices
  * Make saving/loading process more intuitive
  * Refine visuals (Include photos/drawings of devices?)
* Devices, Device Categories, Connector Types, Data Types
  * Implement CRUD for devices, categories, connectors, data types
  * Implement basic search and filter capability
  * Refine visuals (Include photos/drawings of devices?)
