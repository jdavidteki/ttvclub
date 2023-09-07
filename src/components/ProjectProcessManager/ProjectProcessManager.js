import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Project } from '../controllers/Protos.js';
import ProjectController from '../controllers/ProjectController.js';

import './ProjectProcessManager.css';

class ConnectedProjectProcessManager extends Component {
    constructor(props) {
        super(props);

        // Define stages and initial state
        this.stages = ['projectName', 'projectDescription', 'sceneController', 'finalStep'];
        this.state = {
            currentStage: 'projectName',
            projectName: '',
            projectDescription: '',
            // Add more fields for other stages as needed
        };
        this.projectController = new ProjectController();
    }

    // Function to handle stage transitions to the next stage
    goToNextStage = () => {
        const { currentStage } = this.state;
        const currentIndex = this.stages.indexOf(currentStage);

        // After transitioning to the next stage, you can call methods from ProjectController if needed.
        if (this.state.currentStage === 'projectDescription') {
            this.projectController.setProjectName(this.state.projectName);
        }

        //save update to firebase
        this.projectController.updateProjectInFirebase();

        // Ensure we're not at the last stage
        if (currentIndex < this.stages.length - 1) {
            const nextStage = this.stages[currentIndex + 1];
            this.setState({ currentStage: nextStage });
        }
    };

    // Function to handle stage transitions to the previous stage
    goToPrevStage = () => {
        const { currentStage } = this.state;
        const currentIndex = this.stages.indexOf(currentStage);

        //save update to firebase
        this.projectController.updateProjectInFirebase();

        // Ensure we're not at the first stage
        if (currentIndex > 0) {
            const prevStage = this.stages[currentIndex - 1];
            this.setState({ currentStage: prevStage });
        }
    };

    // Function to handle input changes and stage transitions
    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value }, () => {
            // Check if user has completed the current stage
            if (this.isStageComplete()) {
                this.goToNextStage();
            }
        });
    };

    // Function to check if the current stage is complete
    isStageComplete = () => {
        const { currentStage } = this.state;

        // Implement stage-specific validation logic here
        switch (currentStage) {
            case 'projectName':
                return this.state.projectName.trim() !== '';
            case 'projectDescription':
                return this.state.projectDescription.trim() !== '';
            // Add validation for other stages as needed
            default:
                return false;
        }
    };

    render() {
        const { currentStage } = this.state;

        return (
            <div className='ProjectProcessManager'>
                <h2>Create Your Project</h2>
                <p>Current Stage: {currentStage}</p>

                {/* Render stage-specific components */}
                {currentStage === 'projectName' && (
                    <div>
                        <label>Project Name:</label>
                        <input
                            type="text"
                            name="projectName"
                            value={this.state.projectName}
                            onChange={this.handleInputChange}
                        />
                    </div>
                )}

                {currentStage === 'projectDescription' && (
                    <div>
                        <label>Project Description:</label>
                        <textarea
                            name="projectDescription"
                            value={this.state.projectDescription}
                            onChange={this.handleInputChange}
                        />
                    </div>
                )}

                {/* Render other stages here */}
                {/* Example: */}
                {/* {currentStage === 'sceneController' && (
          <SceneController />
        )} */}

                {/* Render buttons to proceed to the next stage or go back */}
                <div>
                    <button onClick={this.goToPrevStage}>Previous</button>
                    {this.isStageComplete() && (
                        <button onClick={this.goToNextStage}>Next</button>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

let ProjectProcessManager = withRouter(connect(mapStateToProps)(ConnectedProjectProcessManager));
export default withRouter(ProjectProcessManager);