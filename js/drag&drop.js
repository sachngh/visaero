document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");

    dropZoneElement.addEventListener("click", (event) => {
      inputElement.click(); /*clicking on input element whenever the dropzone is clicked so file browser is opened*/
    });

    inputElement.addEventListener("change", (event) => {
      if (inputElement.files.length) {
        updateThumbnail(dropZoneElement, inputElement.files[0]);
      }
    });

    dropZoneElement.addEventListener("dragover", (event) => {
      event.preventDefault(); /*this along with prevDef in drop event prevent browser from opening file in a new tab*/
      dropZoneElement.classList.add("drop-zone--over");
    });
    ["dragleave", "dragend"].forEach((type) => {
      dropZoneElement.addEventListener(type, (event) => {
        dropZoneElement.classList.remove("drop-zone--over");
      });
    });
    dropZoneElement.addEventListener("drop", (event) => {
      event.preventDefault();
      console.log(
        event.dataTransfer.files
      ); /*if you console.log only event and check the same data location, you won't see the file due to a chrome bug!*/
      if (event.dataTransfer.files.length) {
        inputElement.files =
          event.dataTransfer.files; /*asigns dragged file to inputElement*/

        updateThumbnail(
          dropZoneElement,
          event.dataTransfer.files[0]
        ); /*thumbnail will only show first file if multiple files are selected*/
      }
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });
  function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector(
      ".drop-zone__thumb"
    );
    /*remove text prompt*/
    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
      dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }

    /*first time there won't be a thumbnailElement so it has to be created*/
    if (!thumbnailElement) {
      thumbnailElement = document.createElement("div");
      thumbnailElement.classList.add("drop-zone__thumb");
      dropZoneElement.appendChild(thumbnailElement);
    }
    thumbnailElement.dataset.label =
      file.name; /*takes file name and sets it as dataset label so css can display it*/

    /*show thumbnail for images*/
    if (file.type.startsWith("image/")) {
      const reader = new FileReader(); /*lets us read files to data URL*/
      reader.readAsDataURL(file); /*base 64 format*/
      reader.onload = () => {
        thumbnailElement.style.backgroundImage = `url('${reader.result}')`; /*asynchronous call. This function runs once reader is done reading file. reader.result is the base 64 format*/
        thumbnailElement.style.backgroundPosition = "center";
      };
    } else {
      thumbnailElement.style.backgroundImage = null; /*plain background for non image type files*/
    }
  }