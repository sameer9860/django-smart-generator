"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode2 = __toESM(require("vscode"));

// src/commands/createProject.ts
var vscode = __toESM(require("vscode"));

// src/wizard/multiStepInput.ts
var import_vscode = require("vscode");
var MultiStepInput = class _MultiStepInput {
  static async run(start) {
    const input = new _MultiStepInput();
    return input.stepThrough(start);
  }
  current;
  steps = [];
  async stepThrough(start) {
    let step = start;
    while (step) {
      this.steps.push(step);
      if (this.current) {
        this.current.enabled = false;
        this.current.busy = true;
      }
      try {
        step = await step(this);
      } catch (err) {
        if (err === 0 /* back */) {
          this.steps.pop();
          step = this.steps.pop();
        } else if (err === 2 /* resume */) {
          step = this.steps.pop();
        } else if (err === 1 /* cancel */) {
          step = void 0;
        } else {
          throw err;
        }
      }
    }
    if (this.current) {
      this.current.dispose();
    }
  }
  async showInputBox({ title, step, totalSteps, value, prompt, validate, buttons, ignoreFocusOut }) {
    const disposables = [];
    try {
      return await new Promise((resolve, reject) => {
        const input = import_vscode.window.createInputBox();
        input.title = title;
        input.step = step;
        input.totalSteps = totalSteps;
        input.value = value || "";
        input.prompt = prompt;
        input.ignoreFocusOut = ignoreFocusOut || true;
        input.buttons = [
          ...this.steps.length > 1 ? [import_vscode.QuickInputButtons.Back] : [],
          ...buttons || []
        ];
        disposables.push(
          input.onDidTriggerButton((button) => {
            if (button === import_vscode.QuickInputButtons.Back) {
              reject(0 /* back */);
            } else {
              resolve(button);
            }
          }),
          input.onDidAccept(async () => {
            const value2 = input.value;
            input.enabled = false;
            input.busy = true;
            if (!await validate(value2)) {
              resolve(value2);
            }
            input.enabled = true;
            input.busy = false;
          }),
          input.onDidHide(() => {
            reject(1 /* cancel */);
          })
        );
        if (this.current) {
          this.current.dispose();
        }
        this.current = input;
        this.current.show();
      });
    } finally {
      disposables.forEach((d) => d.dispose());
    }
  }
  async showQuickPick({ title, step, totalSteps, items, activeItem, placeholder, buttons, ignoreFocusOut }) {
    const disposables = [];
    try {
      return await new Promise((resolve, reject) => {
        const input = import_vscode.window.createQuickPick();
        input.title = title;
        input.step = step;
        input.totalSteps = totalSteps;
        input.placeholder = placeholder;
        input.items = items;
        if (activeItem) {
          input.activeItems = [activeItem];
        }
        input.buttons = [
          ...this.steps.length > 1 ? [import_vscode.QuickInputButtons.Back] : [],
          ...buttons || []
        ];
        input.ignoreFocusOut = ignoreFocusOut || true;
        disposables.push(
          input.onDidTriggerButton((button) => {
            if (button === import_vscode.QuickInputButtons.Back) {
              reject(0 /* back */);
            } else {
              resolve(button);
            }
          }),
          input.onDidAccept(() => {
            resolve(input.selectedItems[0]);
          }),
          input.onDidHide(() => {
            reject(1 /* cancel */);
          })
        );
        if (this.current) {
          this.current.dispose();
        }
        this.current = input;
        this.current.show();
      });
    } finally {
      disposables.forEach((d) => d.dispose());
    }
  }
};

// src/wizard/projectWizard.ts
async function showProjectWizard() {
  const title = "Create Smart Django Project";
  async function collectInputs() {
    const state = {};
    await MultiStepInput.run((input) => inputProjectName(input, state));
    return state;
  }
  const totalSteps = 4;
  async function inputProjectName(input, state) {
    state.projectName = await input.showInputBox({
      title,
      step: 1,
      totalSteps,
      value: state.projectName || "",
      prompt: "Enter the Django project name",
      validate: async (value) => {
        if (!value || value.trim().length === 0) {
          return "Project name is required";
        }
        if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
          return "Project name must be a valid Python identifier (start with a letter, then letters, numbers, or underscores)";
        }
        return void 0;
      }
    });
    return (input2) => inputAppName(input2, state);
  }
  async function inputAppName(input, state) {
    state.appName = await input.showInputBox({
      title,
      step: 2,
      totalSteps,
      value: state.appName || "base",
      prompt: "Enter the initial app name",
      validate: async (value) => {
        if (!value || value.trim().length === 0) {
          return "App name is required";
        }
        if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
          return "App name must be a valid Python identifier";
        }
        return void 0;
      }
    });
    return (input2) => inputEnvName(input2, state);
  }
  async function inputEnvName(input, state) {
    state.envName = await input.showInputBox({
      title,
      step: 3,
      totalSteps,
      value: state.envName || "venv",
      prompt: "Enter the virtual environment name",
      validate: async (value) => {
        if (!value || value.trim().length === 0) {
          return "Environment name is required";
        }
        return void 0;
      }
    });
    return (input2) => inputCreateEnv(input2, state);
  }
  async function inputCreateEnv(input, state) {
    const items = [
      { label: "Yes", description: "Generate .env and .env.example files" },
      { label: "No", description: "Do not generate environment files" }
    ];
    const selected = await input.showQuickPick({
      title,
      step: 4,
      totalSteps,
      placeholder: "Generate .env files?",
      items,
      activeItem: items[0]
    });
    state.createEnvFiles = selected.label === "Yes";
  }
  try {
    const state = await collectInputs();
    if (state.projectName) {
      return {
        projectName: state.projectName,
        appName: state.appName,
        envName: state.envName,
        createEnvFiles: state.createEnvFiles
      };
    }
  } catch (err) {
  }
  return void 0;
}

// src/commands/createProject.ts
async function createProject() {
  const config = await showProjectWizard();
  if (config) {
    vscode.window.showInformationMessage(
      `Django Project: ${config.projectName} | App: ${config.appName} | Env: ${config.envName} | .env: ${config.createEnvFiles}`
    );
  } else {
    vscode.window.showWarningMessage("Django project creation cancelled.");
  }
}

// src/extension.ts
function activate(context) {
  console.log('Congratulations, your extension "django-smart-generator" is now active!');
  const disposable = vscode2.commands.registerCommand("djangoSmart.createProject", createProject);
  context.subscriptions.push(disposable);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
