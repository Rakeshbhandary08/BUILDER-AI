import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import BuilderHeader from "../components/BuilderHeader";

const BuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leftTab, setLeftTab] = useState("chat");
  const [publishing, setPublishing] = useState(false);
  const [publishUrl, setPublishUrl] = useState(null);

  const {
    activeProject,
    loadingActiveProject,
    activeFile,
    showCode,
    setActiveFile,
    setShowCode,
    loadProject,
    logout,
  } = useAppContext();

  useEffect(() => {
    if (id && activeProject?._id !== id) {
      loadProject(id);
    }
  }, [id, activeProject?._id, loadProject]);

  //Function for Handling Open Preview
  const handleOpenPreview=()=>{
    if(!activeProject?._id) return;
    setShowCode(false);
    window.open(`/preview/${activeProject?._id}`,"_blank","noopener,noreferrer")
  }

  //Function for Handling Publish the Project
  const handlePublish=()=>{

  }

  //Function for Handling the downlaod of the code
  const handleDownload=()=>{

  }

  // useEffect(()=>{
  //   if(!id || !activeProject) return;
  //   if(activeProject.status === "pending" || activeProject.status === "generating"){
  //     const interval=setInterval(()=>{
  //         loadProject(id,true)
  //     },1500)
  //     return ()=>clearInterval(interval)
  //   }
  // },[id,loadProject,activeProject])

  //Return the loading component
  if (loadingActiveProject || !activeProject || activeProject._id !== id) {
    return <Loading />;
  }

  return (
    <div>
      {/* TOP BAR HEADER */}
      <BuilderHeader
        projectName={activeProject.name}
        version={activeProject.version}
        showCode={showCode}
        publishing={publishing}
        onToggleShowCode={()=>setShowCode(!showCode)}

        onOpenPreview={handleOpenPreview}
        onPublish={handlePublish}
        onDownload={handleDownload}
        onBack={()=>navigate("/")}
        onLogout={logout}
        
      />
    </div>
  );
};

export default BuilderPage;
