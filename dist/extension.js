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
var vscode3 = __toESM(require("vscode"));

// src/commands/createProject.ts
var vscode2 = __toESM(require("vscode"));

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

// src/services/envService.ts
var path = __toESM(require("path"));

// src/utils/terminal.ts
var cp = __toESM(require("child_process"));
var vscode = __toESM(require("vscode"));
var TerminalUtil = class {
  static outputChannel = vscode.window.createOutputChannel("Django Generator");
  /**
   * Executes a shell command in the specified directory.
   */
  static exec(command, cwd) {
    this.outputChannel.appendLine(`[Running]: ${command}`);
    return new Promise((resolve, reject) => {
      cp.exec(command, { cwd }, (error, stdout, stderr) => {
        if (stdout) {
          this.outputChannel.append(stdout);
        }
        if (stderr) {
          this.outputChannel.append(stderr);
        }
        if (error) {
          this.outputChannel.appendLine(`[Error]: ${error.message}`);
          reject({ error, stdout, stderr });
        } else {
          this.outputChannel.appendLine(`[Success]: Command completed successfully.`);
          resolve({ stdout, stderr });
        }
      });
    });
  }
  /**
   * Shows the output channel to the user.
   */
  static showOutput() {
    this.outputChannel.show();
  }
};

// src/services/envService.ts
var EnvService = class {
  /**
   * Creates a virtual environment in the specified directory.
   */
  static async createVenv(cwd, envName) {
    try {
      await TerminalUtil.exec(`python3 -m venv ${envName}`, cwd);
    } catch (err) {
      await TerminalUtil.exec(`python -m venv ${envName}`, cwd);
    }
  }
  /**
   * Gets the activation command for the virtual environment based on OS.
   */
  static getActivationCommand(envName) {
    const isWindows = process.platform === "win32";
    if (isWindows) {
      return path.join(envName, "Scripts", "activate");
    } else {
      return `source ${path.join(envName, "bin", "activate")}`;
    }
  }
  /**
   * Gets the python path inside the virtual environment.
   */
  static getVenvPythonPath(envName) {
    const isWindows = process.platform === "win32";
    if (isWindows) {
      return path.join(envName, "Scripts", "python.exe");
    } else {
      return path.join(envName, "bin", "python");
    }
  }
  /**
   * Gets the pip path inside the virtual environment.
   */
  static getVenvPipPath(envName) {
    const isWindows = process.platform === "win32";
    if (isWindows) {
      return path.join(envName, "Scripts", "pip.exe");
    } else {
      return path.join(envName, "bin", "pip");
    }
  }
};

// src/services/templateService.ts
var path3 = __toESM(require("path"));
var fs2 = __toESM(require("fs"));

// src/utils/fileWriter.ts
var fs = __toESM(require("fs"));
var path2 = __toESM(require("path"));
var FileWriter = class {
  /**
   * Writes content to a file, creating directories if they don't exist.
   */
  static async writeFile(filePath, content) {
    const dir = path2.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, "utf8", (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  /**
   * Checks if a file exists.
   */
  static exists(filePath) {
    return fs.existsSync(filePath);
  }
};

// src/services/templateService.ts
var TemplateService = class {
  /**
   * Writes a template file to the workspace.
   */
  static async writeTemplate(cwd, fileName, content) {
    const filePath = path3.join(cwd, fileName);
    await FileWriter.writeFile(filePath, content);
  }
  /**
   * Loads a template from the extension's resources.
   */
  static async getTemplateContent(templateName) {
    const templatePath = path3.join(__dirname, "..", "templates", templateName);
    try {
      if (fs2.existsSync(templatePath)) {
        return fs2.readFileSync(templatePath, "utf8");
      }
      console.error(`Template not found: ${templatePath}`);
      return "";
    } catch (err) {
      console.error(`Error reading template ${templateName}:`, err);
      return "";
    }
  }
};

// src/services/gitignoreService.ts
var GitignoreService = class {
  /**
   * Writes a standard Django .gitignore to the workspace.
   */
  static async writeGitignore(cwd) {
    const content = await TemplateService.getTemplateContent("gitignore.txt");
    if (content) {
      await TemplateService.writeTemplate(cwd, ".gitignore", content);
    }
  }
};

// src/utils/secretKey.ts
var crypto = __toESM(require("crypto"));
var SecretKeyGenerator = class {
  /**
   * Generates a 50-character random string for use as a Django secret key.
   */
  static generate() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)";
    const charsLength = chars.length;
    let secret = "";
    for (let i = 0; i < 50; i++) {
      const randomIndex = crypto.randomInt(0, charsLength);
      secret += chars[randomIndex];
    }
    return secret;
  }
};

// src/services/djangoService.ts
var DjangoService = class {
  /**
   * Executes the main project generation flow.
   */
  static async createProject(config, cwd, progress) {
    progress.report({ message: `Creating virtual environment (${config.envName})...`, increment: 10 });
    await EnvService.createVenv(cwd, config.envName);
    const pythonPath = EnvService.getVenvPythonPath(config.envName);
    const pipPath = EnvService.getVenvPipPath(config.envName);
    progress.report({ message: "Installing Django and python-dotenv...", increment: 30 });
    await TerminalUtil.exec(`${pipPath} install django python-dotenv`, cwd);
    progress.report({ message: `Creating Django project: ${config.projectName}...`, increment: 50 });
    await TerminalUtil.exec(`${pythonPath} -m django startproject ${config.projectName} .`, cwd);
    progress.report({ message: `Creating App: ${config.appName}...`, increment: 70 });
    await TerminalUtil.exec(`${pythonPath} manage.py startapp ${config.appName}`, cwd);
    progress.report({ message: "Running initial migrations...", increment: 80 });
    await TerminalUtil.exec(`${pythonPath} manage.py migrate`, cwd);
    progress.report({ message: "Generating .gitignore...", increment: 85 });
    await GitignoreService.writeGitignore(cwd);
    if (config.createEnvFiles) {
      progress.report({ message: "Generating .env files...", increment: 90 });
      const secretKey = SecretKeyGenerator.generate();
      const envContent = await TemplateService.getTemplateContent("env.txt");
      if (envContent) {
        const finalEnv = envContent.replace("{{SECRET_KEY}}", secretKey);
        await TemplateService.writeTemplate(cwd, ".env", finalEnv);
      }
      const envExampleContent = await TemplateService.getTemplateContent("env.example.txt");
      if (envExampleContent) {
        await TemplateService.writeTemplate(cwd, ".env.example", envExampleContent);
      }
    }
    progress.report({ message: "Generating README.md...", increment: 95 });
    const readmeContent = await TemplateService.getTemplateContent("readme.md");
    if (readmeContent) {
      const activationCmd = EnvService.getActivationCommand(config.envName);
      const finalReadme = readmeContent.replace("{{PROJECT_NAME}}", config.projectName).replace("{{VENV_ACTIVATE}}", activationCmd);
      await TemplateService.writeTemplate(cwd, "README.md", finalReadme);
    }
    progress.report({ message: "Project generated successfully!", increment: 100 });
  }
};

// src/commands/createProject.ts
async function createProject() {
  const config = await showProjectWizard();
  if (config) {
    const workspaceFolders = vscode2.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode2.window.showErrorMessage("Please open a folder to generate the Django project.");
      return;
    }
    const cwd = workspaceFolders[0].uri.fsPath;
    try {
      await vscode2.window.withProgress({
        location: vscode2.ProgressLocation.Notification,
        title: "Generating Django Project",
        cancellable: false
      }, async (progress) => {
        await DjangoService.createProject(config, cwd, progress);
      });
      vscode2.window.showInformationMessage(`Successfully created Django project: ${config.projectName}`);
    } catch (error) {
      TerminalUtil.showOutput();
      vscode2.window.showErrorMessage(`Failed to create Django project. Check the output for details. Error: ${error?.message || error}`);
    }
  } else {
    vscode2.window.showWarningMessage("Django project creation cancelled.");
  }
}

// src/extension.ts
function activate(context) {
  console.log('Congratulations, your extension "django-smart-generator" is now active!');
  const disposable = vscode3.commands.registerCommand("djangoSmart.createProject", createProject);
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
