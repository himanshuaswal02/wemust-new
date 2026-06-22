let maxWidth = 0;
let maxHeight = 0;
let uploadAddedCount = 0;
let inputGroups;
const defaultDPI = 300;
const MIN_SIZE = 0.5;
let minHeight = MIN_SIZE; 
let aspectRatio;
let file;
let width = 0;
let height = 0;
let maxWidthInches = 0 ;
let maxHeightInches = 0;
let area = 0;
// Function to calculate new dimensions based on the change and aspect ratio
function calculateNewDimensions(width, height, changeBy, isWidth) {
    if (isWidth) {
        const newWidth = width + changeBy;
        const newHeight = newWidth / aspectRatio;
        return { newWidth, newHeight };
    } else {
        const newHeight = height + changeBy;
        const newWidth = newHeight * aspectRatio;
        return { newWidth, newHeight };
    }
}

// Function to clamp the value to a minimum value
function clampValue(value, minValue) {
    return value < minValue ? minValue : value;
}

// Function to update the labels
function updateLabels(updateSize,updateArea) {
    const widthInput = document.querySelector('input[name="properties\\[_Custom Size_x\\]"]');
    const heightInput = document.querySelector('input[name="properties\\[_Custom Size_y\\]"]');
    const customSizeContainer = document.querySelector('[data-option="Custom Size"]');
     let inputLabel = customSizeContainer.querySelector('.input-label');
    if (widthInput && heightInput && customSizeContainer) {
        const widthValue = parseFloat(widthInput.value);
        const heightValue = parseFloat(heightInput.value);

        if (!isNaN(widthValue) && !isNaN(heightValue)) {
            if(updateSize){
             
              if (!inputLabel) {
                  inputLabel = document.createElement('p');
                  inputLabel.classList.add('input-label');
                  customSizeContainer.prepend(inputLabel);
              }
              inputLabel.textContent = `Custom Detected size: ${widthValue.toFixed(2)}" x ${heightValue.toFixed(2)}"`;
            }

            // Update the area text
          if(updateArea){
            area = widthValue * heightValue;
            let areaLabel = customSizeContainer.querySelector('.area-label');
            if (!areaLabel) {
                areaLabel = document.createElement('p');
                areaLabel.classList.add('area-label');
                customSizeContainer.appendChild(areaLabel);
            }
            areaLabel.textContent = `Area: ${area.toFixed(2)} square inches`;
            customSizeContainer.insertBefore(areaLabel, inputLabel.nextSibling);
          }
        }
    }
}

// Function to trigger the input event
function triggerInputEvent(inputElement) {
    const event = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    inputElement.dispatchEvent(event);
}

// Add event listener for the 'upload:added' event
window.addEventListener('upload:added', function (e) {
    



  
  
    uploadAddedCount++;
    let inputWidth = document.querySelector('input[name="properties\\[_Custom Size_x\\]"]');
    let inputHeight = document.querySelector('input[name="properties\\[_Custom Size_y\\]"]');
    if (inputWidth && inputHeight) {
        inputWidth.value = 0;
        inputHeight.value = 0;
    }
  
    file = e.detail;
   // console.log(file,"===========this is file");
    var filepath = file.url;
    // console.log(filepath,"===========this is filepath")
      let productTitle = file.meta.productTitle;
      // if(productTitle != "DTF/Embroidered Patches" || productTitle != "Embroidered Iron On Patches"){
        if(file.mimeType == "application/pdf" || file.mimeType == "application/postscript"){
             let url = `https://app.bsmnconsultancy.com/Imagick/?file=${filepath}`;
            // Making the POST request using fetch
            fetch(url, {
              method: "GET", 
              headers: {
                "Content-Type": "application/json"  
              }
            })
            .then(response => response.json())
            .then(data => {
              // console.log('Success:', data); 
              
              // width = data.data.dimensions.width;
              // height = data.data.dimensions.height;
                if (data && data.dimensions) {
              width = data.dimensions.width || 1;
              height = data.dimensions.height || 1;
              }  else {
                  width = 1;
                  height = 1;
              }
              // console.log(width,"=====width=====");
              // console.log(height,"=====height=====");
              
                if(width > 0 && height > 0){
                  if ( (width * height) > (maxWidth * maxHeight) ) {
                      maxWidth = width;
                      maxHeight = height;
                  }
                  // uploadAddedCount++;
                  
                  if (uploadAddedCount === 1) {
                      maxWidthInches = maxWidth ;
                      maxHeightInches = maxHeight;
                      aspectRatio = maxWidthInches / maxHeightInches;
          
                      minHeight = MIN_SIZE / aspectRatio;
          
                      const { newWidth, newHeight } = calculateNewDimensions(maxWidthInches, maxHeightInches, 0.5, true);
          
                      const customSizeContainer = document.querySelector('[data-option="Custom Size"]');
                      if (customSizeContainer && !customSizeContainer.querySelector('.input-label')) {
                          const label = document.createElement('p');
                          label.classList.add('input-label');
                          customSizeContainer.prepend(label);
                      }
          
                      const inputWidth = document.querySelector('input[name="properties\\[_Custom Size_x\\]"]');
                      const inputHeight = document.querySelector('input[name="properties\\[_Custom Size_y\\]"]');
          
                      if (inputWidth && inputHeight) {
                          inputWidth.value = maxWidthInches;
                          inputHeight.value = maxHeightInches;
          
                          function addSpaceToInput(inputElement) {
                              inputElement.value += ' ';
                              const event = new Event('input', {
                                  bubbles: true,
                                  cancelable: true,
                              });
                              inputElement.dispatchEvent(event);
                          }
          
                          addSpaceToInput(inputWidth);
                          addSpaceToInput(inputHeight);
                          updateLabels(true,true);
          
                          inputWidth.addEventListener('input', function () {
                              let widthValue = parseFloat(this.value);
                              if (isNaN(widthValue) || widthValue < MIN_SIZE) {
                                  widthValue = MIN_SIZE;
                              }
                              const newDimensions = calculateNewDimensions(widthValue, parseFloat(inputHeight.value), 0, true);
                              inputHeight.value = clampValue(newDimensions.newHeight, minHeight).toFixed(2);
                              updateLabels(false,true);
                          });
          
                          inputHeight.addEventListener('input', function () {
                              let heightValue = parseFloat(this.value);
                              if (isNaN(heightValue) || heightValue < minHeight) {
                                  heightValue = minHeight;
                              }
                              const newDimensions = calculateNewDimensions(parseFloat(inputWidth.value), heightValue, 0, false);
                              inputWidth.value = clampValue(newDimensions.newWidth, MIN_SIZE).toFixed(2);
                              updateLabels(false,true);
                          });
          
                          // Restrict input to accept only numbers or floating-point numbers
                          inputWidth.addEventListener('input', function () {
                              this.value = this.value.replace(/[^0-9.]/g, '');
                          });
          
                          inputHeight.addEventListener('input', function () {
                              this.value = this.value.replace(/[^0-9.]/g, '');
                          });
                      }
          
                      let fields = document.querySelectorAll('.cl-po--options .cl-po--option');
                      for (let field of fields) {
                          field.style.display = 'block';
                      }
                      let priceContainer = document.querySelector('.price-container');
                      if (priceContainer) {
                          priceContainer.style.display = 'block';
                      }
                  }
                }
              })
            .catch((error) => {
              
              width = 1;
              height = 2;
            if (width > 0 && height > 0 && (width * height > maxWidth * maxHeight && (maxWidth = width, maxHeight = height))) {
                maxWidthInches = maxWidth;
                maxHeightInches = maxHeight;
                aspectRatio = maxWidthInches / maxHeightInches;
                minHeight = MIN_SIZE / aspectRatio;
                const {
                    newWidth,
                    newHeight
                } = calculateNewDimensions(maxWidthInches, maxHeightInches, .5, true),
                    customSizeContainer = document.querySelector('[data-option="Custom Size"]');
                if (customSizeContainer && !customSizeContainer.querySelector(".input-label")) {
                    const label = document.createElement("p");
                    label.classList.add("input-label"), customSizeContainer.prepend(label);
                }
                const inputWidth2 = document.querySelector('input[name="properties[_Custom Size_x]"]'),
                    inputHeight2 = document.querySelector('input[name="properties[_Custom Size_y]"]');
                if (inputWidth2 && inputHeight2) {
                    let addSpaceToInput2 = function(inputElement) {
                        inputElement.value += " ";
                        const event = new Event("input", {
                            bubbles: true,
                            cancelable: true
                        });
                        inputElement.dispatchEvent(event);
                    };
                    var addSpaceToInput = addSpaceToInput2;
                    inputWidth2.value = maxWidthInches;
                    inputHeight2.value = maxHeightInches;
                    addSpaceToInput2(inputWidth2);
                    addSpaceToInput2(inputHeight2);
                    updateLabels(false, false);
                    inputWidth2.addEventListener("input", function() {
                        let widthValue = parseFloat(this.value);
                      console.log(widthValue);
                        (isNaN(widthValue) || widthValue < MIN_SIZE) && (widthValue = MIN_SIZE);
                        const newDimensions = calculateNewDimensions(widthValue, parseFloat(inputHeight2.value), 0, true);
                        inputHeight2.value = clampValue( parseFloat(inputHeight2.value), minHeight).toFixed(2);
                        updateLabels(false, true);
                    });
                    inputHeight2.addEventListener("input", function() {
                        let heightValue = parseFloat(this.value);
                        (isNaN(heightValue) || heightValue < minHeight) && (heightValue = minHeight);
                        const newDimensions = calculateNewDimensions(parseFloat(inputWidth2.value), heightValue, 0, false);
                        inputWidth2.value = clampValue(parseFloat(inputWidth2.value), MIN_SIZE).toFixed(2);
                        updateLabels(false, true);
                    });
                    inputWidth2.addEventListener("input", function() {
                        this.value = this.value.replace(/[^0-9.]/g, "");
                    });
                    inputHeight2.addEventListener("input", function() {
                        this.value = this.value.replace(/[^0-9.]/g, "");
                    });
                }
                let fields = document.querySelectorAll(".cl-po--options .cl-po--option");
                for (let field of fields) field.style.display = "block";
                let priceContainer = document.querySelector(".price-container");
                priceContainer && (priceContainer.style.display = "block");
            }
            console.error("Error:", error);
            });
    
        }
        else{
        
        const img = new Image();
        img.src = e.detail.url;
        img.onload = function () {
           width = this.naturalWidth;
           height = this.naturalHeight;

          if (width * height > maxWidth * maxHeight) {
              maxWidth = width;
              maxHeight = height;
          }

          // console.log(uploadAddedCount,"========kldjsjdlfjsdjfkjdlkfjlksd")
          if (uploadAddedCount === 1) {

              // console.log("========213231232")
              const maxWidthInches = maxWidth / defaultDPI;
              const maxHeightInches = maxHeight / defaultDPI;
              aspectRatio = maxWidthInches / maxHeightInches;
  
              minHeight = MIN_SIZE / aspectRatio;
  
              const { newWidth, newHeight } = calculateNewDimensions(maxWidthInches, maxHeightInches, 0.5, true);
  
              const customSizeContainer = document.querySelector('[data-option="Custom Size"]');
              if (customSizeContainer && !customSizeContainer.querySelector('.input-label')) {
                  const label = document.createElement('p');
                  label.classList.add('input-label');
                  customSizeContainer.prepend(label);
              }
  
              let inputWidth = document.querySelector('input[name="properties\\[_Custom Size_x\\]"]');
              let inputHeight = document.querySelector('input[name="properties\\[_Custom Size_y\\]"]');
  
              if (inputWidth && inputHeight) {
                  inputWidth.value = maxWidthInches.toFixed(2);
                  inputHeight.value = maxHeightInches.toFixed(2);
  
                  function addSpaceToInput(inputElement) {
                      inputElement.value += ' ';
                      const event = new Event('input', {
                          bubbles: true,
                          cancelable: true,
                      });
                      inputElement.dispatchEvent(event);
                  }
  
                  addSpaceToInput(inputWidth);
                  addSpaceToInput(inputHeight);
                  updateLabels(true,true);
  
                  inputWidth.addEventListener('input', function () {
                      let widthValue = parseFloat(this.value);
                      if (isNaN(widthValue) || widthValue < MIN_SIZE) {
                          widthValue = MIN_SIZE;
                      }
                      const newDimensions = calculateNewDimensions(widthValue, parseFloat(inputHeight.value), 0, true);
                      inputHeight.value = clampValue(newDimensions.newHeight, minHeight).toFixed(2);
                      updateLabels(false,true);
                  });
  
                  inputHeight.addEventListener('input', function () {
                      let heightValue = parseFloat(this.value);
                      if (isNaN(heightValue) || heightValue < minHeight) {
                          heightValue = minHeight;
                      }
                      const newDimensions = calculateNewDimensions(parseFloat(inputWidth.value), heightValue, 0, false);
                      inputWidth.value = clampValue(newDimensions.newWidth, MIN_SIZE).toFixed(2);
                      updateLabels(false,true);
                  });
  
                  // Restrict input to accept only numbers or floating-point numbers
                  inputWidth.addEventListener('input', function () {
                      this.value = this.value.replace(/[^0-9.]/g, '');
                  });
  
                  inputHeight.addEventListener('input', function () {
                      this.value = this.value.replace(/[^0-9.]/g, '');
                  });
              }
  
              let fields = document.querySelectorAll('.cl-po--options .cl-po--option');
              for (let field of fields) {
                  field.style.display = 'block';
              }
              let priceContainer = document.querySelector('.price-container');
              if (priceContainer) {
                  priceContainer.style.display = 'block';
              }

            // console.log("=======this is in the 2222")
          }
        };
        
      }
  
          
      
    
    

    // =============== Add plus minus buttons ===================== //
    setTimeout(() => {
        inputGroups = document.querySelectorAll('.cl-po--input-group');
        inputGroups.forEach(inputGroup => {
            const inputElements = inputGroup.querySelectorAll('input.cl-po--input');
            inputElements.forEach(inputElement => {
                const existingMinusButton = inputGroup.querySelector('.cl-po--btn-minus');
                const existingPlusButton = inputGroup.querySelector('.cl-po--btn-plus');

                if (!existingMinusButton && !existingPlusButton) {
                    const minusButton = document.createElement('button');
                    minusButton.innerHTML = '-';
                    minusButton.classList.add('cl-po--btn', 'cl-po--btn-minus');

                    const plusButton = document.createElement('button');
                    plusButton.innerHTML = '+';
                    plusButton.classList.add('cl-po--btn', 'cl-po--btn-plus');

                    inputGroup.insertBefore(minusButton, inputElement);
                    inputGroup.appendChild(plusButton);

                    minusButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        let value = parseFloat(inputElement.value);
                        if (!isNaN(value)) {
                            const widthInput = document.querySelector('input[name="properties\\[_Custom Size_x\\]"]');
                            const heightInput = document.querySelector('input[name="properties\\[_Custom Size_y\\]"]');
                            if (widthInput && heightInput) {
                                let newDimensions;
                                if (inputElement === widthInput) {
                                    newDimensions = calculateNewDimensions(value, parseFloat(heightInput.value), -0.5, true);
                                } else {
                                    newDimensions = calculateNewDimensions(parseFloat(widthInput.value), value, -0.5, false);
                                }
                                widthInput.value = clampValue(newDimensions.newWidth, MIN_SIZE).toFixed(2);
                                heightInput.value = clampValue(newDimensions.newHeight, minHeight).toFixed(2);
                                updateLabels(false,true);
                                triggerInputEvent(widthInput);
                                triggerInputEvent(heightInput);
                            } else {
                                console.error('Width or height input not found');
                            }
                        }
                    });

                    plusButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        let value = parseFloat(inputElement.value);
                        if (!isNaN(value)) {
                            const widthInput = document.querySelector('input[name="properties\\[_Custom Size_x\\]"]');
                            const heightInput = document.querySelector('input[name="properties\\[_Custom Size_y\\]"]');
                            if (widthInput && heightInput) {
                                let newDimensions;
                                if (inputElement === widthInput) {
                                    newDimensions = calculateNewDimensions(value, parseFloat(heightInput.value), 0.5, true);
                                } else {
                                    newDimensions = calculateNewDimensions(parseFloat(widthInput.value), value, 0.5, false);
                                }
                                widthInput.value = clampValue(newDimensions.newWidth, MIN_SIZE).toFixed(2);
                                heightInput.value = clampValue(newDimensions.newHeight, minHeight).toFixed(2);
                                updateLabels(false,true);
                                triggerInputEvent(widthInput);
                                triggerInputEvent(heightInput);
                            } else {
                                console.error('Width or height input not found');
                            }
                        }
                    });
                }
            });
        });
    }, 100);
    // =============== Add plus minus buttons ===================== //

    // }
        
})
// Add event listener for the 'upload:removed' event
window.addEventListener('upload:removed', function (e) {
    maxWidth = 0;
    maxHeight = 0;
    uploadAddedCount = 0;
    area = 0;

    let alloptions = document?.querySelectorAll(".cl-po--option");
    if(alloptions){
      for(let i of alloptions){
        i.removeAttribute("style");
      }
    }
     
     let priceContainer = document.querySelector('.price-container');
     if (priceContainer) {
        priceContainer.style.display = 'none';
     }
  
     var addToCartButtonT = document.querySelector('.quantity-submit-row__submit');
     if (addToCartButtonT) {
        addToCartButtonT.setAttribute("disabled", '');
     }
});