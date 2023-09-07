import { Project } from "./Protos.js";
import SceneCarouselController from './SceneCarouselController.js';
const { Configuration, OpenAIApi } = require("openai");
const deepai = require('deepai');

import Firebase from "../../firebase/firebase.js";

class ProjectController {
    constructor() {
        this.project = Project;

        const openAIAPI = Firebase.getOpenAIAPI();
        const openaiApiKey = Array.isArray(openAIAPI) ? openAIAPI.join("") : openAIAPI;
        const configuration = new Configuration({ apiKey: openaiApiKey });
        delete configuration.baseOptions.headers['User-Agent'];

        this.openai = new OpenAIApi(configuration);
        this.project.scenesCarousel = new SceneCarouselController(this.project.id, this.project.scenes);
        this.deepaiApiKey = Firebase.getDeepaiAPIKey();
        deepai.setApiKey(this.deepaiApiKey);
    }

    askOpenAIToBreakDescIntoFrames = async () => {
        const prompt = `Break this story into a series of descriptive and evocative 
                    sentences to be used with text-to-image AI for creating 
                    a motion picture: ${this.project.description}}`

        const GPT35TurboMessage = [
            {
                role: "user",
                content: prompt
            },
        ];

        const response = await this.openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: GPT35TurboMessage,
        });
        const aiResponse = response.data.choices[0].message.content;

        this.setScenesDescFromFrameStories(aiResponse);
    };

    setScenesDescFromFrameStories(aiResponse) {
        const frameStories = aiResponse.split("\n");
        const scenes = [];
        for (let i = 0; i < frameStories.length; i++) {
            const scene = {
                id: i,
                description: frameStories[i],
                imageURL: "",
                videoURL: "",
                timeCreated: Date.now(),
                timeUpdated: Date.now(),
            };
            scenes.push(scene);
        }
        this.project.scenes = scenes;
    }

    setSceneImagesFromDeepAI = async () => {
        for (let i = 0; i < this.project.scenes.length; i++) {
            const scene = this.project.scenes[i];
            const response = await deepai.callStandardApi("text2img", {
                text: scene.description,
            });
            this.project.scenes[i].imageURL = response.output_url;
        }
    };

    setScenesCarousel() {
        this.project.scenesCarousel.getUpdatedScenes(this.project.scenes);
    }

    getScenesCarousel() {
        this.project.scenesCarousel.setUpdatedScenes();
    }

    setDateCreated() {
        this.project.dateCreated = Date.now();
    }

    setTimeUpdated() {
        this.project.timeUpdated = Date.now().toString();
    }

    setProjectName(name) {
        this.project.name = name;
    }

    setProjectDesc(description) {
        this.project.description = description;
    }

    setNumberFrames(numFrames) {
        this.project.numFrames = numFrames;
    }

    setVideoLength(length) {
        this.project.videoLength = length;
    }

    setBckMusicURL(url) {
        this.project.backgroundMusicURL = url;
    }

    pushProjectToFirebase() {
        Firebase.createProject(this.project);
    }

    updateProjectInFirebase() {
        Firebase.updateProject(this.project);
    }

    sendProjectToServer() {
        // Assuming this.project is your JSON object
        const projectData = JSON.stringify(this.project);

        // Define the URL of your Python server
        const url = 'http://your-python-server-url-here';

        // Define the request options, including the method and headers
        const requestOptions = {
            method: 'POST', // You can use 'GET', 'POST', 'PUT', etc. depending on your server
            headers: {
                'Content-Type': 'application/json', // Specify the content type as JSON
            },
            body: projectData, // Include your JSON data here
        };

        // Send the HTTP request using the Fetch API
        fetch(url, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the JSON response
            })
            .then((data) => {
                // Handle the response data here
                console.log('Response from server:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}

export default ProjectController;
