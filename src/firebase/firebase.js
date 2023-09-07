import firebase from "firebase";

class Firebase {
  createProject = (project) => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/projects/' + project.id.replace(/\s/g, '') + '/')
      .set(
        {
          name: project.name,
          id: project.id.replace(/\s/g, ''),
          description: project.description,
          dateCreated: project.dateCreated,
          timeUpdated: project.timeUpdated,
          numFrames: project.numFrames,
          videoLength: project.videoLength,
          backgroundMusicURL: project.backgroundMusicURL,
          scenes: project.scenes,
        }
      )
      .then((response) => {
        console.log("response", d)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }

  updateProject = (script) => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/projects/' + script.id + '/')
      .update(
        {
          name: project.name,
          description: project.description,
          dateCreated: project.dateCreated,
          timeUpdated: project.timeUpdated,
          numFrames: project.numFrames,
          videoLength: project.videoLength,
          backgroundMusicURL: project.backgroundMusicURL,
          scenes: project.scenes,
        }
      )
      .then((response) => {
        console.log("response", response)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }

  getOpenAIAPI = () => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/openAIAPI/')
      .once('value')
      .then(snapshot => {
        if (snapshot.val()){
          resolve(Object.values(snapshot.val()))
        }else{
          resolve({})
        }
      })
    })
  }

  getDeepaiAPIKey = () => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/deepAI/')
      .once('value')
      .then(snapshot => {
        if (snapshot.val()){
          resolve(Object.values(snapshot.val()))
        }else{
          resolve({})
        }
      })
    })
  }
}

export default new Firebase();
