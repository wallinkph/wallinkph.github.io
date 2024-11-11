export function removeBorderOnInteract(element, elementInteract=element) {
    elementInteract.addEventListener("focus", () => element.style.border = "");
    elementInteract.addEventListener("input", () => element.style.border = "");
}

export function addErrorBorder(element, elementInteract=element) {
    element.style.border = "2px solid red";
    removeBorderOnInteract(element, elementInteract);
}


export const addError = (element, elementInteract=element) => {
    addErrorBorder(elementInteract);
}




















// DB SECTION