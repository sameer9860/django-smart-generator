import { QuickPickItem } from 'vscode';
import { MultiStepInput } from './multiStepInput';
import { ProjectConfig } from '../types/projectConfig';

export async function showProjectWizard(): Promise<ProjectConfig | undefined> {
    const title = 'Create Smart Django Project';

    interface State {
        title: string;
        step: number;
        totalSteps: number;
        projectName: string;
        appName: string;
        envName: string;
        createEnvFiles: boolean;
    }

    async function collectInputs() {
        const state = {} as Partial<State>;
        await MultiStepInput.run(input => inputProjectName(input, state));
        return state as State;
    }

    const totalSteps = 4;

    async function inputProjectName(input: MultiStepInput, state: Partial<State>) {
        state.projectName = await input.showInputBox({
            title,
            step: 1,
            totalSteps,
            value: state.projectName || '',
            prompt: 'Enter the Django project name',
            validate: async (value: string) => {
                if (!value || value.trim().length === 0) {
                    return 'Project name is required';
                }
                if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
                    return 'Project name must be a valid Python identifier (start with a letter, then letters, numbers, or underscores)';
                }
                return undefined;
            }
        });
        return (input: MultiStepInput) => inputAppName(input, state);
    }

    async function inputAppName(input: MultiStepInput, state: Partial<State>) {
        state.appName = await input.showInputBox({
            title,
            step: 2,
            totalSteps,
            value: state.appName || 'base',
            prompt: 'Enter the initial app name',
            validate: async (value: string) => {
                if (!value || value.trim().length === 0) {
                    return 'App name is required';
                }
                if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
                    return 'App name must be a valid Python identifier';
                }
                return undefined;
            }
        });
        return (input: MultiStepInput) => inputEnvName(input, state);
    }

    async function inputEnvName(input: MultiStepInput, state: Partial<State>) {
        state.envName = await input.showInputBox({
            title,
            step: 3,
            totalSteps,
            value: state.envName || 'venv',
            prompt: 'Enter the virtual environment name',
            validate: async (value: string) => {
                if (!value || value.trim().length === 0) {
                    return 'Environment name is required';
                }
                return undefined;
            }
        });
        return (input: MultiStepInput) => inputCreateEnv(input, state);
    }

    async function inputCreateEnv(input: MultiStepInput, state: Partial<State>) {
        const items: QuickPickItem[] = [
            { label: 'Yes', description: 'Generate .env and .env.example files' },
            { label: 'No', description: 'Do not generate environment files' }
        ];
        const selected = await input.showQuickPick({
            title,
            step: 4,
            totalSteps,
            placeholder: 'Generate .env files?',
            items,
            activeItem: items[0]
        });
        state.createEnvFiles = selected.label === 'Yes';
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
        // User cancelled or back'd out
    }

    return undefined;
}
