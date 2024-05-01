import React from "react";
import { useState } from "react";
import { SketchPicker } from "react-color";


function App() {

  const [selectImage,setSelectImage] = useState(null);
  const [processImage,setProcessImage] = useState(null);
  const [pickColor,setPickColor] = useState("#ff6");
  const [imageWidth,setImageWidth] = useState('100%');
  const [imageHeight,setImageHeight] = useState('200px');

  

  const handlFile = (e)=>{
    const file = e.target.files[0];

    if(file){
      const reader = new FileReader();
      reader.onload = ()=>{
        setSelectImage(reader.result);
      }
      reader.readAsDataURL(file);
    }

  };

  const removeBg = async()=>{
    const apikey = 'cdvej9dSkhLNWX6MsAzh9w4h';
    const apiUrl = 'https://api.remove.bg/v1.0/removebg';



    const formData = new FormData();

    const blob = await fetch(selectImage).then(response => response.blob());

    formData.append('image_file',blob,selectImage.name);
    formData.append('size','auto');

    try{
      const response = await fetch(apiUrl,{
        method:'POST',
        headers:{
          'X-Api-Key':apikey
        },
        body:formData
      });

      if(!response.ok){
        throw new Error('Failed to process image');
      } 

      const result = await response.blob();
      const processImageUrl = URL.createObjectURL(result);
      setProcessImage(processImageUrl);

    }
    catch(error){
      console.log('Error',error);
    }

  };


  const bgChangeColor = (color)=>{
    setPickColor(color.hex);
  }


  const downloadImage = () => {
    if (selectImage && processImage) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const originalImg = new Image();
      const processedImg = new Image();
  
      originalImg.crossOrigin = "anonymous"; // Ensure cross-origin access to the image
  
      originalImg.onload = () => {
        canvas.width = originalImg.width;
        canvas.height = originalImg.height;

      ctx.fillStyle = pickColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
        // Draw the original image onto the canvas
        ctx.drawImage(originalImg, 0, 0);
  
        processedImg.crossOrigin = "anonymous"; // Ensure cross-origin access to the image
        processedImg.onload = () => {
          // Draw the processed image with the background onto the canvas
          ctx.drawImage(processedImg, 0, 0, canvas.width, canvas.height);
  
          // Convert the canvas content to a data URL representing a JPEG image
          const dataURL = canvas.toDataURL("image/jpeg");
  
          // Create a link element to trigger the download
          const link = document.createElement("a");
          link.href = dataURL;
          link.download = "processed_image_with_bg.jpg";
  
          // Append the link to the document body, trigger a click event, then remove the link
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
  
        // Set the source of the processed image to the processImage URL
        processedImg.src = processImage;
      };
  
      // Set the source of the original image to the selectImage URL
      originalImg.src = processImage;
    }
  };
  
  
  
  

  



  return (
    <div className="bg-slate-500 w-full h-screen flex-col overflow-y-scroll">
      {/* <h1 class="text-3xl font-bold underline">Hello world!</h1> */}
      <div className="flex flex-col  items-center p-8">
        <div
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white "
          
        >
          Upload file
        </div>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          type="file"
          onChange={handlFile}
        />
        <div>
        {selectImage && (
          <div>
            
            <img
              src = {selectImage}
              alt = "selected"
              className="mt-4 rounded-lg"
              style={{maxWidth:'100%' , maxHeight:'200px'}}
        />
          </div>
        )}
        </div>

        {selectImage && (
          <div className="m-3">
          <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md" onClick={removeBg}>
                Remove Background
              </button>
          </div>
        )}

        {selectImage && (
          <div>
          <label htmlFor="widthInput" className="mr-2 font-bold text-lg text-black">width:</label>
          <input 
          id="widthId"
          type="number"
          value={imageWidth}
          onChange={(e)=>setImageWidth(e.target.value)}
          className="pl-2 rounded-md"

           />
           <label htmlFor="heightInput" className="ml-8 mr-2 font-bold text-lg text-black ">Height:</label>
          <input 
          id="heightId"
          type="number"
          value={imageHeight}
          onChange={(e)=>setImageHeight(e.target.value)}
          className="pl-2 rounded-md"

           />
        </div>
        )}
        
       
        {processImage && (
          <div className= " border-black mt-4" style={{background:pickColor}}>
            <img
          
          src={processImage}
          alt="process"
          className="mt-4 rounded-lg"
          style={{maxWidth:`${imageWidth}px`,maxHeight:`${imageHeight}px`}}
          />
          </div>   
        )}

        

       
      {processImage && (
          <div className="mt-4">
          <SketchPicker
          color={pickColor}
          onChangeComplete={bgChangeColor} 
          />
          </div>
        )}
        

        {processImage && (
          <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md mt-2" onClick={downloadImage}>
          Download Image
        </button>
        )}
        

      </div>
    </div>
  );
}

export default App;
