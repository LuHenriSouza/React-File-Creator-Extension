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

        const componentContent = `function ${componentName}() {\n\treturn (\n\t\t<>\n\n\t\t</>\n\t);\n}\n\nexport default ${componentName};`;

        try {
            const currentDirectory = resource.fsPath;
            const componentPath = path.join(currentDirectory, `${componentName}.jsx`);

            if (fs.existsSync(componentPath)) {
                vscode.window.showErrorMessage(`File ${componentName}.jsx already exists`);
                return;
            }

            fs.writeFileSync(componentPath, componentContent);
            vscode.window.showInformationMessage(`Component ${componentName}.jsx created successfully`);
        } catch (error: any) {
            vscode.window.showErrorMessage(`Error creating component: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}
