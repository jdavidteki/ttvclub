import {React } from "react";
import { ReactDOM } from "react-dom";


export default class SceneCarouselController {
  constructor(projectId, scenes) {
    this.projectId = projectId;
    this.scenes = scenes;
  }

  // Find a scene by ID
  findSceneById(id) {
    return this.scenes.find((scene) => scene.id === id);
  }

  // Add a new scene
  addScene(scene) {
    this.scenes.push(scene);
  }

  // Delete a scene by ID
  deleteSceneById(id) {
    const index = this.scenes.findIndex((scene) => scene.id === id);
    if (index !== -1) {
      this.scenes.splice(index, 1);
    }
  }

  // Update scene's description by ID
  updateSceneDescById(id, newDescription) {
    const scene = this.findSceneById(id);
    if (scene) {
      scene.description = newDescription;
    }
  }

  // Check/uncheck scene's image by ID
  toggleImageCheckedById(id, imageIndex) {
    const scene = this.findSceneById(id);
    if (scene && imageIndex >= 0 && imageIndex < scene.images.length) {
      scene.images[imageIndex].checked = !scene.images[imageIndex].checked;
    }
  }

  getUpdatedScenes() {
    return this.scenes;
  }

  setUpdatedScenes(scenes) {
    this.scenes = scenes;
  }

  // Update scene's duration by ID
  updateDurationById(id, newDuration) {
    const scene = this.findSceneById(id);
    if (scene) {
      scene.duration = newDuration;
    }
  }

  // Add an image to a scene by ID
  addImageToScene(id, image) {
    const scene = this.findSceneById(id);
    if (scene) {
      scene.images.push(image);
    }
  }

  // Remove an image from a scene by ID and image index
  removeImageFromScene(id, imageIndex) {
    const scene = this.findSceneById(id);
    if (scene && imageIndex >= 0 && imageIndex < scene.images.length) {
      scene.images.splice(imageIndex, 1);
    }
  }

  // Reorder images within a scene by ID
  reorderImagesInScene(id, imageIndexes) {
    const scene = this.findSceneById(id);
    if (scene) {
      const newImages = [];
      imageIndexes.forEach((index) => {
        if (index >= 0 && index < scene.images.length) {
          newImages.push(scene.images[index]);
        }
      });
      scene.images = newImages;
    }
  }

  // Check if an image in a scene is selected
  isImageSelected(sceneId, imageIndex) {
    const scene = this.findSceneById(sceneId);
    if (scene && imageIndex >= 0 && imageIndex < scene.images.length) {
      return scene.images[imageIndex].selected;
    }
    return false; // Default to false if scene or image doesn't exist
  }
}
