import React, { Component } from "react";

export const Image = {
    name: "",
    description: "",
    id: 0,
    url: "",
    position: 0,
    isSelected: false,
    duration: 0,
}

export const Scene = {
    name: "",
    description: "",
    id: 0,
    images: new Array(Image),
    position: 0,
}


export const Project = {
    name: "",
    id: 0,
    description: "",
    dateCreated: "",
    timeUpdated: "",
    numFrames: 0,
    videoLength: 0,
    backgroundMusicURL: "",
    scenes: new Array(Scene),
    scenesCarousel: new Array(Scene),
}

