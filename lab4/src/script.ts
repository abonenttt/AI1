type StyleMap = Record<string, string>;

interface AppState {
    currentStyle: string;
    styles: StyleMap;
}

const state: AppState = {
    currentStyle: "light",
    styles: {
        light: "s1.css",
        dark: "s2.css",
        blue: "s3.css",
    },
};


function applyStyle(styleName: string): void {
    const oldLink = document.getElementById("active-style");
    if (oldLink) {
        oldLink.remove();
    }

    const link = document.createElement("link");
    link.id = "active-style";
    link.rel = "stylesheet";
    link.href = state.styles[styleName];

    document.head.appendChild(link);
    state.currentStyle = styleName;
}


function renderStyleLinks(): void {
    const container = document.getElementById("style-switcher");
    if (!container) return;

    container.innerHTML = "";

    Object.keys(state.styles).forEach((style) => {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = style;
        a.style.marginRight = "10px";

        a.addEventListener("click", (e) => {
            e.preventDefault();
            applyStyle(style);
        });

        container.appendChild(a);
    });
}


function init(): void {
    applyStyle(state.currentStyle);
    renderStyleLinks();
}

document.addEventListener("DOMContentLoaded", init);
