const movementAnimation = (elements, boxSize) => {
    const renderElements = elements => {
        elements.forEach(element => {
            element.elem.style.width = element.w + "px";
            element.elem.style.height = element.w + "px";
            element.elem.style.left = element.x + "px";
            element.elem.style.top = element.y + "px";
        });
    };

    const elementsCollision = elements => {
        elements.forEach((element, index) => {
            const counter = index + 1;

            if (!elements[counter]) return;

            const nextElements = elements.slice(counter);

            // условие соприкосновения шаров друг с другом
            nextElements.forEach(nextElement => {
                if (
                    element.x < nextElement.x + nextElement.w &&
                    element.y < nextElement.y + nextElement.w &&
                    element.x + element.w > nextElement.x &&
                    element.y + element.w > nextElement.y
                ) {
                    element.directions.y = -element.directions.y;
                    element.directions.x = -element.directions.x;
                    nextElement.directions.y = -nextElement.directions.y;
                    nextElement.directions.x = -nextElement.directions.x;
                }
            });
        })
    };

    const boxCollision = (elements, boxSize) => {
        const {boxWidth, boxHeight} = boxSize;

        elements.forEach(element => {
            element.x += element.directions.x;
            element.y += element.directions.y;

            // соприкосновение с "полом" и "потолком" холста
            if (element.y < 0 || element.y + element.w > boxHeight) {
                element.directions.y = -element.directions.y;
            }
            // соприкосновение с левой и правой "стенкой" холста
            if (element.x < 0 || element.x + element.w > boxWidth) {
                element.directions.x = -element.directions.x;
            }
        });
    };

    const updateAnimation = () => {
        renderElements(elements);
        elementsCollision(elements);
        boxCollision(elements, boxSize);
        window.requestAnimationFrame(updateAnimation);
    };

    updateAnimation();
};

const randomizer = (min, max) => Math.random() * (max - min) + min;

const createElementObject = (x, y, w, elem, speed) => ({
    directions: {
        x: randomizer(-speed, speed),
        y: randomizer(-speed, speed)
    },
    x, y, w, elem, speed
});

const stopElementAnimation = elements => {
    elements.forEach(element => {
        element.elem.addEventListener("mouseover", () => {
            element.directions.x = 0;
            element.directions.y = 0;
        });

        element.elem.addEventListener("mouseout", () => {
            element.directions.x = randomizer(-element.speed, element.speed);
            element.directions.y = randomizer(-element.speed, element.speed);
        });
    })
};

const renderRandomElementsPosition = (boxElements, boxSize) => {
    const {boxWidth, boxHeight} = boxSize;
    const elementsAttribute = [];
    let isCollision = false;

    boxElements.forEach(element => {
        const w = +element.style.width.replace("px", "");
        const y = randomizer(0, boxHeight - w);
        const x = randomizer(0, boxWidth - w);
        elementsAttribute.push({x, y, w});
    });

    elementsAttribute.forEach((attribute, index) => {
        const counter = index + 1;

        if (!elementsAttribute[counter]) return;

        const nextAttributes = elementsAttribute.slice(counter);

        nextAttributes.forEach(nextAttribute => {
            if (
                attribute.x < nextAttribute.x + nextAttribute.w &&
                attribute.y < nextAttribute.y + nextAttribute.w &&
                attribute.x + attribute.w > nextAttribute.x &&
                attribute.y + attribute.w > nextAttribute.y
            ) {
                isCollision = true;
            }
        });
    });

    return {elementsAttribute, isCollision};
};

const main = boxSize => {
    const boxElements = document.querySelectorAll(".box__element");
    const maxSpeed = 0.5;
    const elementsArray = [];
    let renderResult;

    do {
        renderResult = renderRandomElementsPosition(boxElements, boxSize);
    } while (renderResult.isCollision);

    boxElements.forEach((elem, index) => {
        const {elementsAttribute} = renderResult;

        elementsArray.push(createElementObject(
            elementsAttribute[index].x,
            elementsAttribute[index].y,
            elementsAttribute[index].w,
            elem,
            maxSpeed
        ));
    });

    return elementsArray;
};

const generateElements = (elementsAttribute, box) => {
    elementsAttribute.forEach((attribute, index) => {
        const count = index + 1;
        const counter = count < 10 ? "0" + count: count;
        const element = document.createElement("div");
        const title = document.createElement("span");
        const description = document.createElement("span");
        title.textContent = "sdg " + counter;
        description.textContent = attribute.description;
        element.classList.add("box__element");
        element.style.width = attribute.w + "px";
        element.style.height = attribute.w + "px";
        element.appendChild(title);
        element.appendChild(description);
        box.appendChild(element);
    })
};

try {
    const box = document.getElementById("box");
    const rectBox = box.getBoundingClientRect();
    const boxSize = {boxWidth: rectBox.width, boxHeight: rectBox.height};

    const elementsAttribute = [
        {w: 60, description: "no poverty"},
        {w: 80, description: "no poverty"},
        {w: 80, description: "no poverty"},
        {w: 60, description: "no poverty"},
        {w: 80, description: "no poverty"},
        {w: 80, description: "no poverty"},
        {w: 80, description: "no poverty"},
        {w: 60, description: "no poverty"},
        {w: 80, description: "no poverty"},
        {w: 60, description: "no poverty"},
        {w: 60, description: "no poverty"},
        {w: 80, description: "no poverty"},
        {w: 60, description: "no poverty"},
        {w: 60, description: "no poverty"},
        {w: 80, description: "no poverty"},
        {w: 80, description: "no poverty"},
        {w: 80, description: "no poverty"},
    ];

    if (window.innerWidth <= 768) {
        elementsAttribute.forEach(attribute => {
            attribute.w -= 20;
        });
    }

    generateElements(elementsAttribute, box);

    const elementsArray = main(boxSize);

    stopElementAnimation(elementsArray);

    movementAnimation(elementsArray, boxSize);
} catch (e) {
    console.log(e);
}