import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.createReactComponent', async (resource) => {
        // resource contém informações sobre o que foi clicado
        if (!(resource instanceof vscode.Uri)) {
            vscode.window.showErrorMessage('Invalid resource for creating React component.');
            return;
        }

        const rawComponentName = await vscode.window.showInputBox({ prompt: 'Enter the component name' });

        if (!rawComponentName) {
            vscode.window.showErrorMessage('Component name cannot be empty');
            return;
        }

        // Transform to PascalCase
        const pascalCaseComponentName = rawComponentName.replace(/(\b\w)/g, firstLetter => firstLetter.toUpperCase());

        // Replace spaces with ""
        const componentName = pascalCaseComponentName.replace(/\s+/g, '');

        const componentContent = `export const ${componentName}: React.FC = () => {\n\treturn (\n\t\t<>\n\n\t\t</>\n\t);\n};`;

        try {
            const currentDirectory = resource.fsPath;
            const componentPath = path.join(currentDirectory, `${componentName}.tsx`);

            if (fs.existsSync(componentPath)) {
                vscode.window.showErrorMessage(`File ${componentName}.tsx already exists`);
                return;
            }

            fs.writeFileSync(componentPath, componentContent);
            vscode.window.showInformationMessage(`Component ${componentName}.tsx created successfully`);
        } catch (error: any) {
            vscode.window.showErrorMessage(`Error creating component: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}
