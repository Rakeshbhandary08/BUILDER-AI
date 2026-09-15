import projectModel from "../models/Project.js";

//**********   POST  /api/project

//create a new project from an AI Prompt
export async function createProject(req, res) {
  try {
    const { prompt } = req.body;

    //if prompt is not present or invalid prompt
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    //User authentication
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    //create project in DB immediately with "pending" status
    const project = await projectModel.create({
      name: "Planning project...",
      description: prompt,
      files: {},
      messages: [
        //Schema
        { role: "user", content: prompt },
        { role: "assistant", content: "Planning project structure..." },
      ],
      version: 0,
      owner: req.user.userId,
      status: "pending",
      filesPlanned: [],
      currentFile: null,
      error: null,
    });

    //Start background generation
    runBackgroundGeneration(project._id.toString(), prompt).catch((err) => {
      console.log(
        `[Background AI] Fatal generation error for project ${project._id}:`,
        err,
      );
    });

    res.status(201).json({
      _id: project._id,
      name: project.name,
      description: project.description,
      files: {},
      messages: project.messages,
      version: project.version,
      status: project.status,
      filesPlanned: project.filesPlanned,
      filesGenerated: project.filesGenerated,
      currentFile: project.currentFile,
      error: project.error,
      createdAt: project.createdAt,
    });
  } catch (err) {
    console.log("[Error Failed]", err);
    return res.status(500).json({ error: "Failed to create Project" });
  }
}

//Background worker to progressive generate files and update database in real-time
// INTEGRATION WITH AI
async function runBackgroundGeneration(prompt) {
  console.log(`Here is your : ${prompt}`);
}

//***************  GET -> /api/projects *************************
export async function listProjects(req, res) {
  try {
    //Verify user authentication
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    //Fetch projects owned by logged-in user
    const projects = await projectModel
      .find(
        { owner: req.user.userId },
        {
          name: 1,
          description: 1,
          status: 1,
          version: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      )
      .sort({ updatedAt: -1 });

    return res.json(projects);
  } catch (err) {
    console.log("[projects list]", err);
    return res.status(500).json({ error: "Failed to fetch project" });
  }
}

//***************  GET -> /api/project/:id *************************

export async function getProject(req, res) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const project = await projectModel.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    });

    //IF there is no project with given id or invalid id something
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    let filesObj = {};
    for (let [path, entry] of Object.entries(project.files)) {
      filesObj[path] = entry.content;
    }

    return res.json({
      _id: project._id,
      name: project.name,
      description: project.description,
      files: filesObj,
      messages: project.messages,
      version: project.version,
      status: project.status,
      filesPlanned: project.filesPlanned,
      filesGenerated: project.filesGenerated,
      currentFile: project.currentFile,
      error: project.error,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    });
  } catch (err) {
    console.log("[project failed", err);
    return res.status(500).json({ error: "Failed to fetch project" });
  }
}

//***************  DELETE /api/projects/:id  ********************** */

export async function deleteProject(req, res) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await projectModel.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId,
    });

    if (!result) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.json({
      success: true,
      message: "Project is succcessfully deleled",
    });
  } catch(err){
     console.log("[project failed]",err)
     return res.status(500).json({error:"Failed to deleted project"})
  }
}
